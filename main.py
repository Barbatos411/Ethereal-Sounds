import logging
import sys
import threading
from time import sleep

import httpx
import keyboard  # ⬅️ 新增：用于监听全局快捷键
import pystray
import uvicorn
import webview
from PIL import Image
from pystray import MenuItem

from config import config
from log import logger  # 复用 Logger

# 让 PyWebView 也使用 logger
pywebview_logger = logging.getLogger("pywebview")
pywebview_logger.handlers = logger.logger.handlers  # 复用 log.py 配置
pywebview_logger.propagate = False  # 避免日志重复

# 全局变量
window = None
tray_icon = None
is_window_visible = True  # 记录窗口的显示状态

# 监听地址和端口
HOST = config.get('HOST')
PORT = config.get('PORT')


def start_server():
    """启动 FastAPI 后端服务"""
    logger.info(f"🚀 启动后端服务中...,监听地址：{HOST},端口号：{PORT}")
    uvicorn.run("backend:main", host = HOST, port = PORT, reload = False, access_log = False)


def check_backend_ready():
    """检查后端是否就绪"""
    while True:
        try:
            response = httpx.get(f"http://{HOST}:{PORT}/status", timeout = 1)
            if response.status_code == 200:
                window.load_url(f"http://{HOST}:{PORT}")  # 后端就绪后加载主页面
                break
        except httpx.RequestError:
            pass
        sleep(0.25)  # 降低轮询频率


def toggle_window():
    """显示或隐藏主窗口"""
    global is_window_visible
    if is_window_visible:
        window.hide()
        is_window_visible = False
    else:
        window.show()
        is_window_visible = True


def play_prev_song():
    """调用前端的 playPrevSong 函数"""
    if window:
        window.evaluate_js('playPrevSong()')


def play_next_song():
    """调用前端的 playNextSong 函数"""
    if window:
        window.evaluate_js('playNextSong()')


def toggle_play_pause():
    """调用前端的 togglePlayPause 函数"""
    if window:
        window.evaluate_js('togglePlayPause()')


def exit_app():
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
    image = Image.open("icon.ico")

    # 定义托盘菜单
    menu = (
        MenuItem('显示/隐藏窗口', toggle_window, default = True),
        MenuItem('上一首', lambda: play_prev_song()),
        MenuItem('播放/暂停', lambda: toggle_play_pause()),
        MenuItem('下一首', lambda: play_next_song()),
        MenuItem('退出', exit_app)
    )

    # 创建系统托盘图标
    tray_icon = pystray.Icon("浮声 - Ethereal Sounds", image, "浮声 - Ethereal Sounds", menu)
    tray_icon.run()


def setup_global_hotkeys():
    """注册全局快捷键"""
    keyboard.add_hotkey("ctrl+alt+space", toggle_play_pause)  # 播放/暂停
    keyboard.add_hotkey("ctrl+alt+right", play_next_song)  # 下一曲
    keyboard.add_hotkey("ctrl+alt+left", play_prev_song)  # 上一曲
    logger.info("✅ 全局快捷键已启用")


class API:
    def __init__(self):
        self.start_x = 0  # 记录鼠标按下时的窗口 X 位置
        self.start_y = 0  # 记录鼠标按下时的窗口 Y 位置
        self.is_fullscreen = False

    def start_drag(self, mouse_x, mouse_y):
        """鼠标按下时，记录窗口位置"""
        window = webview.windows[0]
        if window:
            self.start_x, self.start_y = mouse_x, mouse_y  # 记录鼠标初始位置

    def move_window(self, mouse_x, mouse_y):
        """计算鼠标偏移量，移动窗口"""
        window = webview.windows[0]
        if window and not self.is_fullscreen:
            new_x = mouse_x - self.start_x
            new_y = mouse_y - self.start_y
            window.move(new_x, new_y)  # 移动窗口

    def hide_to_tray(self):
        """供前端调用的隐藏到系统托盘方法"""
        toggle_window(None, None)
        return "窗口已隐藏到系统托盘"

    def minimize(self):
        """最小化窗口"""
        if window:
            window.minimize()

    def toggle_fullscreen(self):
        """切换全屏模式"""
        if window:
            self.is_fullscreen = not self.is_fullscreen
            window.toggle_fullscreen()


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

    # 启用全局快捷键监听
    hotkey_thread = threading.Thread(target = setup_global_hotkeys, daemon = True)
    hotkey_thread.start()

    # 启动应用
    webview.start(
        debug = config.get('DEBUG'),
        http_server = False,
        gui = 'edgechromium' if sys.platform == 'win32' else None
    )
