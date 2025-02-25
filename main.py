import sys
import threading

import httpx
import uvicorn
from PySide6.QtCore import QUrl, QTimer, Qt
from PySide6.QtGui import QIcon
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWidgets import QApplication, QMainWindow


def start_server():
    uvicorn.run("backend:main", host="127.0.0.1", port=8000)


class DevToolsWindow(QMainWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.dev_tools_view = QWebEngineView()
        self.setCentralWidget(self.dev_tools_view)
        self.setWindowIcon(QIcon('icon.png'))  # 设置窗口图标
        self.setWindowTitle("浮声 - 开发者工具")
        self.resize(800, 600)


class Browser(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("浮声 - Ethereal Sounds")
        self.setWindowIcon(QIcon('icon.png'))  # 设置窗口图标
        self.setGeometry(100, 100, 1200, 800)

        # 创建 QWebEngineView 实例
        self.browser = QWebEngineView()
        self.setCentralWidget(self.browser)

        # ✅ 加载“加载中”页面
        self.browser.setHtml("""
            <html>
                <head><title>加载中...</title></head>
                <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <h1>🎵 加载中，请稍候...</h1>
                </body>
            </html>
        """)

        # 启动定时器，每 1 秒检测后端状态
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.check_backend_ready)
        self.timer.start(500)  # 每秒轮询一次

        # 初始化开发者工具窗口
        self.dev_tools_window = DevToolsWindow()
        self.browser.page().setDevToolsPage(self.dev_tools_window.dev_tools_view.page())

    def check_backend_ready(self):
        try:
            response = httpx.get("http://127.0.0.1:8000/status", timeout=1)
            if response.status_code == 200:
                # ✅ 后端已就绪，加载实际页面
                self.timer.stop()
                self.browser.load(QUrl("http://127.0.0.1:8000"))
        except httpx.RequestError:
            pass  # 后端尚未启动，继续轮询

    def keyPressEvent(self, event):
        # 按下 F12 打开/关闭开发者工具
        if event.key() == Qt.Key_F12:
            if self.dev_tools_window.isVisible():
                self.dev_tools_window.hide()
            else:
                self.dev_tools_window.show()
        super().keyPressEvent(event)


if __name__ == "__main__":
    # ✅ 以守护线程启动后端
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # 启动 PySide6 界面
    app = QApplication(sys.argv)
    window = Browser()
    window.show()
    sys.exit(app.exec())
