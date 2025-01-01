import os
import importlib
from fastapi import FastAPI
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
    return templates.TemplateResponse("index.html", {"request": request, "data": example_data})

# 获取平台类并注册
platforms = []

def load_platforms():
    # 获取 /app/search 目录下的所有.py文件
    search_dir = os.path.join(os.path.dirname(__file__), 'search')
    for filename in os.listdir(search_dir):
        if filename.endswith('.py') and filename != '__init__.py' and filename != 'base.py':
            # 排除 base.py 文件
            module_name = f"app.search.{filename[:-3]}"  # 去掉 .py 后缀
            module = importlib.import_module(module_name)
            for attr_name in dir(module):
                platform_class = getattr(module, attr_name)
                if isinstance(platform_class, type) and hasattr(platform_class, 'name'):
                    platforms.append(platform_class())

load_platforms()  # 加载平台

@app.get("/platforms")
async def get_platforms():
    """
    返回支持的平台名称
    :return: 平台名称列表
    """
    return {"platforms": [platform.name for platform in platforms]}

@app.get("/search")
async def search(keyword: str, platform: str, page: int = 1, limit: int = 20):
    """
    搜索音乐
    :param keyword: 搜索关键词
    :param platform: 平台名称
    :param page: 页码
    :param limit: 每页数量
    :return: 搜索结果
    """
    # 根据平台名称找到对应的平台类
    for p in platforms:
        if p.name == platform:
            return p.search(keyword, page, limit)
    return {"error": "Platform not found"}