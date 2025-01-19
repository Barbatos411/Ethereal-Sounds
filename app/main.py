import importlib
import os
import sqlite3

from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from app.platforms.base import BasePlatform

app = FastAPI()

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
app.mount("/css", StaticFiles(directory="web/css"), name="css")
app.mount("/js", StaticFiles(directory="web/js"), name="js")
app.mount("/res", StaticFiles(directory="web/res"), name="res")

# 初始化模板引擎
templates = Jinja2Templates(directory="web")  # web 目录包含 html 模板文件


# 定义主页路由
@app.get("/")
async def read_item(request: Request):
    # 你可以从数据库查询数据或者传递静态数据
    example_data = {"message": "Welcome to the music player"}
    return templates.TemplateResponse(
        "index.html", {"request": request, "data": example_data})


platforms = []


def load_platforms():
    search_dir = os.path.join(os.path.dirname(__file__), 'platforms')
    # 存储加载的各平台实例

    # 查找所有含有 __init__.py 的目录
    for root, dirs, files in os.walk(search_dir):
        if '__init__.py' in files:
            platform_folder = os.path.basename(root)  # 目录名即平台名
            module_name = f"app.platforms.{platform_folder}"

            try:
                # 动态导入模块
                module = importlib.import_module(module_name)

                # 自动查找继承 BasePlatform 的类
                for attr_name in dir(module):
                    obj = getattr(module, attr_name)
                    if isinstance(obj, type) and issubclass(
                            obj, BasePlatform) and obj is not BasePlatform:
                        platforms.append(obj())  # 实例化平台类
            except Exception as e:
                print(f"加载模块 {platform_folder} 失败: {e}")

    # 按平台 ID 排序
    platforms.sort(key=lambda platform: platform.order)


# 调用加载函数
load_platforms()


@app.get("/platforms")
async def get_platforms():
    """
    返回支持的平台名称
    :return: 平台名称列表
    """
    return {"platforms": [{"name": platform.name, "id": platform.id, "order": platform.order}
                          for platform in platforms]}


@app.get("/search")
async def search_song(
        keyword: str = Query(..., description="搜索关键词"),
        platform: str = Query(..., description="搜索平台"),
        page: int = Query(1, description="分页")
):
    """
    根据指定平台和关键词进行歌曲搜索
    """
    # 根据平台名称找到对应的平台类
    for p in platforms:
        if p.id == platform:
            try:
                results = await p.search(keyword, page)
                return {"platform": platform, "results": results}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=400, detail="指定的平台不受支持")


@app.get("/get_audio")
async def get_audio(
        platform: str = Query(..., description="搜索平台"),
        audio_id: str = Query(..., description="歌曲ID")
):
    """
    根据指定平台和关键词进行歌曲音频获取
    """
    # 根据平台名称找到对应的平台类
    for p in platforms:
        if p.id == platform:
            try:
                bool_value, content = await p.get_audio(audio_id)
                if bool_value:
                    return Response(content=content,
                                    media_type="audio/mpeg",
                                    headers={
                                        "Content-Disposition": "inline",
                                        "Accept-Ranges": "bytes"}  # 提示浏览器为直接播放
                                    )
                else:
                    return {"audio_url": content}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=400, detail="指定的平台不受支持")


@app.get("/get_data")
async def get_data(
        database: str = Query("data", description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        select: str = Query(..., description="返回列"),
        where: str = Query(..., description="查找列"),
):
    """
    根据指定数据库和表进行数据查询
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"SELECT {select} FROM {table} WHERE {where} = ?"
            cursor.execute(query, (keyword,))
            result = cursor.fetchone()

        if result:
            return {"value": result[0]}
        else:
            return {"error": "未找到匹配的记录"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/set_data")
async def set_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="数据表"),
        where_column: str = Query(..., description="查找列"),
        keyword: str = Query(None, description="关键词"),
        set_column: str = Query(..., description="更新列"),
        value: str = Query(None, description="更新值"),
        value_list: list = Query(None, description="批量值")
):
    """
    根据指定数据库和表进行数据更新或插入
    value_list规范:
    value_list = [
        ("key1", "value1"),
        ("key2", "value2"),
    ]
    """
    # 参数验证
    if value and value_list:
        raise HTTPException(status_code=400,
                            detail="`value` 和 `value_list` 不能同时提供")
    if not value and not value_list:
        raise HTTPException(status_code=400, detail="缺少参数")
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"INSERT OR REPLACE INTO {table} ({where_column}, {set_column}) VALUES (?, ?);"
            if keyword and value:
                # 单条更新
                cursor.execute(query, (keyword, value))
                return {"message": "数据更新成功"}
            elif value_list:
                # 批量更新
                cursor.executemany(query, value_list)
                return {"message": "数据更新成功"}
            conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/del_data")
async def delete_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        where: str = Query(..., description="查找列"),
):
    """
    删除指定数据库和表中的数据
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"DELETE FROM {table} WHERE {where} = ?"
            cursor.execute(query, (keyword,))
            conn.commit()  # 提交事务以保存更改

        return {"message": "记录已删除"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
