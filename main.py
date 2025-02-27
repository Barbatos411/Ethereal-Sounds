import logging
import sys
import threading
from time import sleep

import httpx
import pystray
import uvicorn
import webview
from PIL import Image
from pystray import MenuItem

from config import config
from log import logger  # 复用 Logger

# 让 PyWebView 也使用logger
pywebview_logger = logging.getLogger("pywebview")
pywebview_logger.handlers = logger.logger.handlers  # 复用 log.py 配置
pywebview_logger.propagate = False  # 避免日志重复

# 全局变量，用于存储窗口对象和托盘图标对象
window = None
tray_icon = None
is_window_visible = True  # 用于跟踪窗口的显示状态


def start_server():
    """启动 FastAPI 后端服务"""
    logger.info("🚀 启动后端服务...")
    HOST = config.get('HOST')
    PORT = config.get('PORT')
    uvicorn.run("backend:main", host = HOST, port = PORT, reload = False, access_log = False)


def check_backend_ready():
    """检查后端是否就绪"""
    while True:
        try:
            response = httpx.get("http://127.0.0.1:8000/status", timeout = 1)
            if response.status_code == 200:
                # 后端就绪后加载主页面
                window.load_url("http://localhost:8000")
                break
        except httpx.RequestError:
            pass
        sleep(0.25)  # 降低轮询频率


def toggle_window(icon, item):
    """显示或隐藏主窗口"""
    global is_window_visible
    if is_window_visible:
        window.hide()
        is_window_visible = False
    else:
        window.show()
        is_window_visible = True


def play_prev_song(icon, item):
    """调用前端的 playPrevSong 函数"""
    if window:
        window.evaluate_js('playPrevSong()')


def play_next_song(icon, item):
    """调用前端的 playNextSong 函数"""
    if window:
        window.evaluate_js('playNextSong()')


def toggle_play_pause(icon, item):
    """调用前端的 togglePlayPause 函数"""
    if window:
        window.evaluate_js('togglePlayPause()')


def exit_app(icon, item):
    """退出应用"""
    if window:
        window.destroy()
    if tray_icon:
        tray_icon.stop()
    sys.exit(0)


def create_system_tray():
    """创建系统托盘图标"""
    global tray_icon

    # 加载托盘图标（替换为你的图标路径）
    image = Image.open("icon.ico")  # 确保图标文件存在

    # 定义托盘菜单
    menu = (
        MenuItem('显示/隐藏窗口', toggle_window, default = True),
        MenuItem('上一首', play_prev_song),
        MenuItem('播放/暂停', toggle_play_pause),
        MenuItem('下一首', play_next_song),
        MenuItem('退出', exit_app)
    )

    # 创建系统托盘图标
    tray_icon = pystray.Icon("浮声 - Ethereal Sounds", image, "浮声 - Ethereal Sounds", menu)
    tray_icon.run()


class API:
    def hide_to_tray(self):
        """供前端调用的隐藏到系统托盘方法"""
        toggle_window(None, None)
        return "窗口已隐藏到系统托盘"


if __name__ == "__main__":
    # 启动后端服务
    server_thread = threading.Thread(target = start_server, daemon = True)
    server_thread.start()

    # 创建无边框窗口
    window = webview.create_window(
        title = '浮声 - Ethereal Sounds',
        url = 'loading.html',  # 初始加载页
        width = 1200,
        height = 800,
        frameless = True,
        easy_drag = True,
        js_api = API(),  # 暴露 API 类的实例给前端
        confirm_close = False,
    )

    # 启动后端检测线程
    check_thread = threading.Thread(target = check_backend_ready, daemon = True)
    check_thread.start()

    # 创建并运行系统托盘图标
    tray_thread = threading.Thread(target = create_system_tray, daemon = True)
    tray_thread.start()

    # 启动应用
    webview.start(
        debug = config.get('DEBUG'),  # False没有开发者工具
        http_server = False,  # 禁用内置 HTTP 服务器
        gui = 'edgechromium' if sys.platform == 'win32' else None
    )
