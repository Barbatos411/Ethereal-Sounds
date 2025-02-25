import sys
import threading

import httpx
import uvicorn
from PySide6.QtCore import QUrl, QTimer
from PySide6.QtGui import QIcon
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWidgets import QApplication, QMainWindow


def start_server():
    uvicorn.run("backend:main", host="127.0.0.1", port=8000)


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

    def check_backend_ready(self):
        try:
            response = httpx.get("http://127.0.0.1:8000/status", timeout=1)
            if response.status_code == 200:
                # ✅ 后端已就绪，加载实际页面
                self.timer.stop()
                self.browser.load(QUrl("http://127.0.0.1:8000"))
        except httpx.RequestError:
            pass  # 后端尚未启动，继续轮询


if __name__ == "__main__":
    # ✅ 以守护线程启动后端
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # 启动 PySide6 界面
    app = QApplication(sys.argv)
    window = Browser()
    window.show()
    sys.exit(app.exec())
