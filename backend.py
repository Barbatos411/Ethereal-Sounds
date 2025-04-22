import concurrent.futures
import importlib.util
import logging
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from config import config
from log import logger
from platforms.base import BasePlatform
from platforms.platform_manager import platform_manager
from routers import database, platform
from utils.db import create_sqlite_db
from utils.make_index import make_index

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

# 配置CORS中间件
main.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],  # 允许所有源，因为loading.html是本地文件
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# 将模块化路由注册到主程序
main.include_router(platform.router, tags = ["platform"])
main.include_router(database.router, tags = ["database"])

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
main.mount("/assets", StaticFiles(directory = "./web/assets"), name = "assets")

main.mount("/root", StaticFiles(directory = "./"), name = "root")

# 初始化模板引擎
templates = Jinja2Templates(directory = "web")  # web 目录包含 html 模板文件


def check_db():
    start_time = time.time()
    db_path = Path("data/data.db")
    if not db_path.exists():
        logger.warning("数据库不存在，正在创建数据库...")
        db_path.parent.mkdir(parents = True, exist_ok = True)  # 创建 data 目录（如果不存在）
        try:
            create_sqlite_db()
            logger.info("✅ 数据库创建成功")
        except Exception as e:
            logger.error(f"❌创建数据库失败: {e}")
    logger.info(f"数据库检查耗时: {(time.time() - start_time):.2f}秒")


def load_platforms():
    start_time = time.time()
    search_dir = Path(__file__).parent / "platforms"
    loaded_platforms = set()

    # 收集所有有效平台模块名称
    modules_to_load = []
    for platform_path in search_dir.iterdir():
        if not platform_path.is_dir() or not (platform_path / "__init__.py").exists():
            continue
        platform_folder = platform_path.name
        modules_to_load.append(f"platforms.{platform_folder}")

    # 并行加载模块
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for module_name in modules_to_load:
            futures.append(executor.submit(_load_platform_module, module_name))

        for future in concurrent.futures.as_completed(futures):
            try:
                platform_instance = future.result()
                if platform_instance:
                    platform_manager.add_platform(platform_instance)
                    loaded_platforms.add(platform_instance.name)
            except Exception as e:
                logger.error(f"加载模块失败: {e}")

    if not loaded_platforms:
        logger.warning("⚠️ 未找到任何可用的音乐平台模块")

    logger.info(f"平台加载耗时: {(time.time() - start_time):.2f}秒")


def _load_platform_module(module_name):
    try:
        spec = importlib.util.find_spec(module_name)
        if not spec:
            logger.error(f"找不到模块 {module_name}")
            return None

        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # 寻找符合要求的平台类
        for attr_name in dir(module):
            obj = getattr(module, attr_name)
            if (isinstance(obj, type) and
                    issubclass(obj, BasePlatform) and
                    obj is not BasePlatform):
                return obj()

        logger.warning(f"模块 {module_name} 中未找到有效的平台类")
        return None

    except Exception as e:
        logger.error(f"加载模块 {module_name} 失败: {e}")
        return None


def make_local_index():
    path = config.get("MUSIC_DIR")
    try:
        for i in path:
            make_index(i)
        logger.info("✅ 索引文件创建/更新成功")
    except Exception as e:
        logger.error(f"❌ 索引文件创建失败: {e}")


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


# 检查数据库、加载平台、创建索引
start_time = time.time()
check_db()
load_platforms()
# make_local_index()

logger.info(f"✅ 后端服务启动完成，总耗时: {(time.time() - start_time):.2f}秒")
