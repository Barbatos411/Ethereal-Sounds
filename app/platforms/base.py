import sqlite3
from abc import ABC, abstractmethod

import httpx


class BasePlatform(ABC):
    def __init__(self):
        self.client = httpx.AsyncClient()
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""
        }

    @abstractmethod
    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        pass

    @abstractmethod
    async def get_audio(self, audio_id: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        pass

    @abstractmethod
    async def home(self):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        pass

    @staticmethod
    def ms_to_mmss(ms):
        # 计算总秒数
        total_seconds = ms / 1000
        # 计算分钟和秒
        minutes = int(total_seconds // 60)
        seconds = int(total_seconds % 60)
        return f"{minutes:02}:{seconds:02}"

    @staticmethod
    def s_to_mmss(s):
        # 计算分钟和秒
        minutes = int(s // 60)
        seconds = int(s % 60)
        return f"{minutes:02}:{seconds:02}"

    @staticmethod
    def format_duration(duration_str):
        """
        将格式为 "M:S" 的时间字符串转换为 "MM:SS" 格式。

        :param duration_str: 格式为 "M:S" 的时间字符串
        :return: 格式为 "MM:SS" 的时间字符串
        """
        try:
            # 解析字符串以获取分钟和秒
            minutes, seconds = map(int, duration_str.split(':'))

            # 格式化时间为 MM:SS 格式
            formatted_time = f"{minutes:02}:{seconds:02}"

            return formatted_time
        except ValueError:
            # 如果格式不正确，返回默认值或记录错误信息
            return "00:00"

    @staticmethod
    async def search_cookie(platform):
        try:
            # 使用 `with` 语句管理数据库连接
            with sqlite3.connect('app/data/data.db') as conn:
                cursor = conn.cursor()

                # 查询指定平台的 cookie
                cursor.execute("SELECT cookie FROM account WHERE 平台 = ?", (platform,))
                result = cursor.fetchone()
                if result:
                    print(f"查询到 {platform}")
                    return result[0]
                else:
                    return None
        except sqlite3.Error as e:
            print(f"数据库操作出现错误: {e}")
            return None
