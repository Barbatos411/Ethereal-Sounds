import sys
import threading
import time
from pathlib import Path
from shutil import copy

import keyboard
import pystray
import uvicorn
import webview
from PIL import Image
from pystray import MenuItem

from platforms.platform_manager import platform_manager


def check_config_file():
    # 配置文件路径
    CONFIG_PATH = Path("config/config.yaml")
    EXAMPLE_PATH = Path("config/default_config.yaml")

    """检测并生成配置文件"""
    if not CONFIG_PATH.exists():
        if EXAMPLE_PATH.exists():
            copy(str(EXAMPLE_PATH), str(CONFIG_PATH))
            print(f"✅ 已自动生成配置文件: {CONFIG_PATH} (从 {EXAMPLE_PATH})")
        else:
            raise RuntimeError(f"⚠️ 配置文件 {CONFIG_PATH} 和示例文件 {EXAMPLE_PATH} 都不存在！")


# 全局变量
window = None
tray_icon = None
is_window_visible = True  # 记录窗口的显示状态


def start_server(host: str, port: int):
    """启动 FastAPI 后端服务"""
    start_time = time.time()
    logger.info(f"🚀 启动后端服务中...,监听地址：{host},端口号：{port}")
    uvicorn.run("backend:main", host = host, port = port,
                reload = False, access_log = False)
    logger.info(f"后端服务启动耗时: {(time.time() - start_time):.2f}秒")


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
        window.evaluate_js("audioControl.previous()")


def play_next_song():
    """调用前端的 playNextSong 函数"""
    if window:
        window.evaluate_js("audioControl.next()")


def toggle_play_pause():
    """调用前端的 togglePlayPause 函数"""
    if window:
        window.evaluate_js("audioControl.togglePlayPause()")


def exit_app():
    """退出应用并清理资源"""
    logger.info("正在关闭应用...")
    try:
        # 清理全局快捷键
        keyboard.unhook_all()
        logger.info("✅ 已清理全局快捷键")

        # 关闭窗口
        if window:
            window.destroy()
            logger.info("✅ 已关闭主窗口")

        # 关闭系统托盘
        if tray_icon:
            tray_icon.stop()
            logger.info("✅ 已关闭系统托盘")

        logger.info("应用退出完成，感谢使用！")
        # 使用os._exit()来强制退出，避免异常输出
        import os
        os._exit(0)
    except Exception as e:
        logger.error(f"退出时发生错误: {e}")
        import os
        os._exit(1)


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
    tray_icon = pystray.Icon("浮声 - Ethereal Sounds",
                             image, "浮声 - Ethereal Sounds", menu)
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
        toggle_window()
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

    def check_cookie(self, cookie_str, platform):
        """处理接收到的 Cookie"""

        logger.info(f"接收到 Cookie: {cookie_str}")
        p = platform_manager.get_platform_by_id(platform)
        if p.check_login_success(cookie_str):
            title = "登录"
            for w in webview.windows:
                if w.title == title:
                    w.destroy()

    def login(self, platform):
        """供前端调用的登录方法"""

        # 获取平台实例
        p = platform_manager.get_platform_by_id(platform)

        try:
            login_window = webview.create_window(
                title = '登录',
                url = p.Referer,
                width = 1200,
                height = 900,
                js_api = API(),  # 暴露 API 类的实例给前
                on_top = True,
            )

            # 注入 JavaScript 定时器
            login_window.evaluate_js(f"""
                setInterval(() => {{
                    try {{
                        pywebview.api.check_cookie(document.cookie, '{platform}');
                    }} catch (e) {{
                        console.error("获取 Cookie 失败:", e);
                    }}
                }}, 500);
            """)

        except Exception as e:
            logger.error(f"登录失败：{str(e)}")


if __name__ == "__main__":
    start_time = time.time()

    # 检测并生成配置文件
    check_config_file()

    # 导入配置和日志
    from config import config
    from log import logger  # 复用 Logger

    # 启动后端服务
    host = config.get('HOST')
    port = config.get('PORT')

    server_thread = threading.Thread(
        target = start_server,
        args = (host, port),  # 通过元组传递位置参数
        daemon = True
    )
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
