import sqlite3
from abc import ABC, abstractmethod

import httpx


class BasePlatform(ABC):
    """
    定义抽象基类，每个平台必须继承该类
    """
    name = "BasePlatform"  # 平台名称
    id = "base"  # 平台ID
    order = 0  # 平台排序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": self.get_cookie(self.name)
        }
        print(f"成功加载平台 {self.name}, 平台ID: {self.id}, 平台排序: {self.order}")

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
    def get_cookie(platform):
        try:
            # 使用 `with` 语句管理数据库连接
            with sqlite3.connect('app/data/data.db') as conn:
                cursor = conn.cursor()

                # 查询指定平台的 cookie
                cursor.execute(
                    "SELECT cookie FROM account WHERE platforms = ?", (platform,))
                result = cursor.fetchone()
                if result:
                    return result[0]
                else:
                    return None
        except sqlite3.Error as e:
            print(f"数据库操作出现错误: {e}")
            return None
