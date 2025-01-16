import importlib
import os
import sqlite3

from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

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


# 存储加载的各平台实例
platforms = []


# 加载 /app/platforms 目录下的所有平台类
def load_platforms():
    search_dir = os.path.join(os.path.dirname(__file__), 'platforms')

    # 遍历 /app/platforms 目录下所有的子文件夹
    for platform_folder in os.listdir(search_dir):
        platform_folder_path = os.path.join(search_dir, platform_folder)

        # 确保是目录并且排除 base.py 文件和隐藏目录
        if os.path.isdir(platform_folder_path):
            init_file_path = os.path.join(platform_folder_path, '__init__.py')
            if os.path.isfile(init_file_path):
                # 动态导入该平台的 __init__.py 文件
                module_name = f"app.platforms.{platform_folder}"  # 根据目录生成模块路径
                module = importlib.import_module(module_name)
                # 尝试从 __init__.py 文件中获取平台类
                for attr_name in dir(module):
                    platform_class = getattr(module, attr_name)

                    # 确保属性是一个平台类，并且有 name 和 id 属性
                    if isinstance(platform_class, type) and hasattr(platform_class, 'name') and hasattr(platform_class,
                                                                                                        'id'):
                        platforms.append(platform_class())  # 实例化并添加到平台列表


# 加载平台
load_platforms()

# 按 id 排序平台
platforms.sort(key=lambda platform: platform.id)


@app.get("/platforms")
async def get_platforms():
    """
    返回支持的平台名称
    :return: 平台名称列表
    """
    return {"platforms": [{"id": platform.id, "name": platform.name}
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
        if p.name == platform:
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
        if p.name == platform:
            try:
                Bool, content = await p.get_audio(audio_id)
                if Bool:
                    return Response(content=content,
                                    media_type="audio/mpeg",
                                    headers={"Content-Disposition": "inline", "Accept-Ranges": "bytes"}  # 提示浏览器为直接播放
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
            return {"cookie": result[0]}
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
        raise HTTPException(status_code=400, detail="`value` 和 `value_list` 不能同时提供")
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
