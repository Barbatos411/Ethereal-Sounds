import importlib
import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from app.platform_manager import platform_manager
from app.platforms.base import BasePlatform
from app.routers import database, platform

app = FastAPI()

# 将模块化路由注册到主程序
app.include_router(platform.router, tags=["platform"])
app.include_router(database.router, tags=["database"])

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
app.mount("/css", StaticFiles(directory="web/css"), name="css")
app.mount("/js", StaticFiles(directory="web/js"), name="js")
app.mount("/res", StaticFiles(directory="web/res"), name="res")

# 初始化模板引擎
templates = Jinja2Templates(directory="web")  # web 目录包含 html 模板文件


def load_platforms():
    search_dir = os.path.join(os.path.dirname(__file__), 'platforms')

    for root, dirs, files in os.walk(search_dir):
        if '__init__.py' in files:
            platform_folder = os.path.basename(root)
            module_name = f"app.platforms.{platform_folder}"

            try:
                module = importlib.import_module(module_name)
                for attr_name in dir(module):
                    obj = getattr(module, attr_name)
                    if isinstance(obj, type) and issubclass(obj, BasePlatform) and obj is not BasePlatform:
                        platform_manager.add_platform(obj())  # 加载到管理器
            except Exception as e:
                print(f"加载模块 {platform_folder} 失败: {e}")


load_platforms()


# 定义主页路由
@app.get("/")
async def read_item(request: Request):
    # 你可以从数据库查询数据或者传递静态数据
    example_data = {"message": "Welcome to the music player"}
    return templates.TemplateResponse(
        "index.html", {"request": request, "data": example_data})
