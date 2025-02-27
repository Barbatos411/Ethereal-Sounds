import importlib
import logging
import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from log import logger
from platforms.base import BasePlatform
from platforms.platform_manager import platform_manager
from routers import database, platform
from utils.db import create_sqlite_db

# 获取 FastAPI / Uvicorn 相关日志
uvicorn_access = logging.getLogger("uvicorn.access")  # 访问日志
uvicorn_error = logging.getLogger("uvicorn.error")  # 服务器错误日志

# **1️⃣ 隐藏访问日志**
uvicorn_access.setLevel(logging.CRITICAL + 1)  # 让访问日志不输出

# **2️⃣ 服务器错误日志仍然显示**
uvicorn_error.setLevel(logging.INFO)  # 只记录重要信息，不显示 DEBUG 日志

uvicorn_error.handlers = logger.logger.handlers  # 复用你的日志配置
uvicorn_error.propagate = False  # 避免重复日志

main = FastAPI()

# 将模块化路由注册到主程序
main.include_router(platform.router, tags = ["platform"])
main.include_router(database.router, tags = ["database"])

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
main.mount("/css", StaticFiles(directory = "./web/css"), name = "css")
main.mount("/js", StaticFiles(directory = "./web/js"), name = "js")
main.mount("/res", StaticFiles(directory = "./web/res"), name = "res")

# 初始化模板引擎
templates = Jinja2Templates(directory = "web")  # web 目录包含 html 模板文件

if not os.path.exists('data/data.db'):
    print('数据库不存在，正在创建数据库...')
    os.makedirs('data', exist_ok = True)
    create_sqlite_db()


def load_platforms():
    search_dir = os.path.join(os.path.dirname(__file__), 'platforms')

    for root, dirs, files in os.walk(search_dir):
        if '__init__.py' in files:
            platform_folder = os.path.basename(root)
            module_name = f"platforms.{platform_folder}"

            try:
                module = importlib.import_module(module_name)
                for attr_name in dir(module):
                    obj = getattr(module, attr_name)
                    if isinstance(obj, type) and issubclass(obj, BasePlatform) and obj is not BasePlatform:
                        platform_manager.add_platform(obj())  # 加载到管理器
            except Exception as e:
                logger.error(f"加载模块 {platform_folder} 失败: {e}")


load_platforms()


# 定义主页路由
@main.get("/")
async def read_item(request: Request):
    # 你可以从数据库查询数据或者传递静态数据
    example_data = {"message": "Welcome to the music player"}
    return templates.TemplateResponse(
        "index.html", {"request": request, "data": example_data})


@main.get("/status")
async def status():
    return {"status": "ok"}


logger.info("✅ 后端服务已启动")
