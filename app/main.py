import importlib
import os
import sqlite3

from fastapi import FastAPI, Query, HTTPException
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


# 获取平台类并注册
platforms = []


def load_platforms():
    # 获取 /app/platforms 目录下的所有 .py 文件
    search_dir = os.path.join(os.path.dirname(__file__), 'platforms')
    for filename in os.listdir(search_dir):
        if filename.endswith(
                '.py') and filename != '__init__.py' and filename != 'base.py':
            # 排除 base.py 文件
            module_name = f"app.platforms.{filename[:-3]}"  # 去掉 .py 后缀
            module = importlib.import_module(module_name)
            for attr_name in dir(module):
                platform_class = getattr(module, attr_name)
                if isinstance(platform_class, type) and hasattr(platform_class, 'name') and hasattr(platform_class,
                                                                                                    'id'):
                    platforms.append(platform_class())


# 加载平台并按 id 排序
load_platforms()  # 加载平台

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
        id: str = Query(..., description="歌曲链接")
):
    """
    根据指定平台和关键词进行歌曲搜索
    """
    # 根据平台名称找到对应的平台类
    for p in platforms:
        if p.name == platform:
            try:
                results = await p.get_audio(platform, id)
                return {"platform": platform, "results": results}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=400, detail="指定的平台不受支持")


@app.get("/data")
async def get_data(
        database: str = Query("data", description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        select: str = Query(..., description="返回列"),
        where: str = Query(..., description="查找列"),
):
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
