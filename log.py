import logging
import os
from datetime import datetime

import colorlog

from config import config

# 颜色配置
LOG_COLORS = {
    "DEBUG": "cyan",
    "INFO": "green",
    "WARNING": "yellow",
    "ERROR": "red",
    "CRITICAL": "bold_red",
}


class Logger:
    def __init__(self):
        self.log_dir = "log"  # 日志目录
        self.retention_days = config.get("LOG_RETAIN_DAYS", 7)  # 日志保留天数
        self.console_log_level = getattr(logging, config.get("LOGLEVEL", "INFO").upper(), logging.INFO)  # 终端日志等级

        os.makedirs(self.log_dir, exist_ok = True)  # 确保日志目录存在
        self.logger = self._setup_logger()

    def _setup_logger(self):
        """创建日志对象"""
        logger = logging.getLogger("MusicPlayerLogger")
        logger.setLevel(logging.DEBUG)  # 记录所有日志，终端和文件分别控制输出级别
        logger.propagate = False  # 防止重复日志

        # 统一日志格式
        log_format = "[%(asctime)s] [%(levelname)s] %(message)s"
        date_format = "%Y-%m-%d %H:%M:%S"

        # **1️⃣ 终端日志（彩色 & 受 LOG_LEVEL 影响）**
        console_handler = logging.StreamHandler()
        console_handler.setLevel(self.console_log_level)  # 终端日志级别
        console_formatter = colorlog.ColoredFormatter(
            "%(log_color)s" + log_format, log_colors = LOG_COLORS, datefmt = date_format
        )
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)

        # **2️⃣ 文件日志（始终记录所有日志）**
        log_file = os.path.join(self.log_dir, f"{datetime.now().strftime('%Y-%m-%d')}.log")
        file_handler = logging.FileHandler(log_file, encoding = "utf-8")
        file_handler.setLevel(logging.DEBUG)  # 文件记录所有级别日志
        file_formatter = logging.Formatter(log_format, datefmt = date_format)
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        return logger

    def info(self, msg):
        """打印 INFO 级别日志"""
        self.logger.info(msg)

    def warning(self, msg):
        """打印 WARNING 级别日志"""
        self.logger.warning(msg)

    def error(self, msg):
        """打印 ERROR 级别日志"""
        self.logger.error(msg)

    def debug(self, msg):
        """打印 DEBUG 级别日志"""
        self.logger.debug(msg)

    def clean_old_logs(self):
        """清理旧日志"""
        now = datetime.now()
        for file in os.listdir(self.log_dir):
            file_path = os.path.join(self.log_dir, file)
            if file.endswith(".log"):
                try:
                    file_time = datetime.strptime(file.replace(".log", ""), "%Y-%m-%d")
                    if (now - file_time).days > self.retention_days:
                        os.remove(file_path)
                        self.logger.info(f"✅ 已删除过期日志: {file_path}")
                except ValueError:
                    pass  # 处理非日期格式的文件，避免异常


# **全局 logger 实例**
logger = Logger()

# **启动时清理旧日志**
logger.clean_old_logs()
