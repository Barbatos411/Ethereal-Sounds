import importlib
import logging
from pathlib import Path

from fastapi import FastAPI
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

# 将模块化路由注册到主程序
main.include_router(platform.router, tags = ["platform"])
main.include_router(database.router, tags = ["database"])

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
main.mount("/assets", StaticFiles(directory = "./web/assets"), name = "assets")

# 初始化模板引擎
templates = Jinja2Templates(directory = "web")  # web 目录包含 html 模板文件


def check_db():
    db_path = Path("data/data.db")
    if not db_path.exists():
        logger.warning("数据库不存在，正在创建数据库...")
        db_path.parent.mkdir(parents = True, exist_ok = True)  # 创建 data 目录（如果不存在）
        try:
            create_sqlite_db()
            logger.info("✅ 数据库创建成功")
        except Exception as e:
            logger.error(f"❌创建数据库失败: {e}")


def load_platforms():
    search_dir = Path(__file__).parent / "platforms"
    loaded_platforms = set()
    
    for platform_path in search_dir.iterdir():
        if not platform_path.is_dir() or not (platform_path / "__init__.py").exists():
            continue
            
        platform_folder = platform_path.name
        if platform_folder in loaded_platforms:
            continue
            
        module_name = f"platforms.{platform_folder}"
        try:
            # 使用importlib.util实现按需导入
            import importlib.util
            spec = importlib.util.find_spec(module_name)
            if spec is None:
                logger.error(f"找不到模块 {platform_folder}")
                continue
                
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # 只导入平台类
            for attr_name in dir(module):
                obj = getattr(module, attr_name)
                if isinstance(obj, type) and issubclass(obj, BasePlatform) and obj is not BasePlatform:
                    platform_manager.add_platform(obj())
                    loaded_platforms.add(platform_folder)
                    logger.info(f"✅ 成功加载平台: {platform_folder}")
                    break
        except Exception as e:
            logger.error(f"加载模块 {platform_folder} 失败: {e}")
    
    if not loaded_platforms:
        logger.warning("⚠️ 未找到任何可用的音乐平台模块")


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
check_db()
load_platforms()
# make_local_index()

logger.info("✅ 后端服务已启动")
