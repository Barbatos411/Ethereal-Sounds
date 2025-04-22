from abc import ABC, abstractmethod

import httpx

from log import logger
from utils.cookie import get_cookie
from utils.db import batch_set_datas


class BasePlatform(ABC):
    """
    定义抽象基类，每个平台必须继承该类
    """
    name = "BasePlatform"  # 平台名称
    id = "base"  # 平台ID
    logo = ""  # 平台logo
    Referer = "https://www.example.com/"  # 平台Referer
    order = 0  # 平台优先级
    cookie = ""  # 平台cookie

    def __init__(self):
        # 先尝试获取 cookie
        cookie = get_cookie(self.id)

        if not cookie and self.cookie:
            # 如果数据库中没有 cookie，使用 self.cookie 并写入数据库
            cookie = self.cookie
            param = {"title": self.name, "cookie": cookie, "indexNum": self.order, "logo": self.logo}
            batch_set_datas("data", "account", "ID", self.id, param)

        self.client = httpx.AsyncClient()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": get_cookie(self.id) or self.cookie,
            "referer": self.Referer,
        }
        logger.info(f"✅成功加载平台 {self.name}, 平台ID: {self.id}, 优先级: {self.order}")

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
    async def get_lrc(self, audio_id: str):
        """
        定义抽象地获取歌词方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 歌词
        """
        pass

    @abstractmethod
    async def home(self, page: int, categories: str):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        pass

    @abstractmethod
    def check_login_success(self, cookie_str: str) -> bool:
        """
        CK登录状态检测方法
        """
        pass

    @abstractmethod
    async def album(self, album_id: str):
        """
        定义抽象的获取专辑方法，每个平台都必须实现
        :param album_id: 专辑ID
        :return: 专辑歌曲信息
        """
        pass

    @abstractmethod
    async def playlists(self):
        """
        定义抽象的获取歌单方法，每个平台都必须实现
        :return: 歌单信息
        """
        pass

    @abstractmethod
    async def playlistinfo(self, playlist_id: str):
        """
        定义抽象的获取歌单方法，每个平台都必须实现
        :param playlist_id: 歌单ID
        :return: 歌单歌曲信息
        """
        pass

    async def referer(self, url: str):
        """
        发起带Referer的请求，返回响应内容和媒体类型
        :param url: 请求地址
        :return: 字典 { "content": bytes, "content_type": str }
        """
        response = await self.client.get(url, headers = self.headers)
        response.raise_for_status()  # 检查HTTP错误

        # 从响应头提取媒体类型（Content-Type）
        content_type = response.headers.get("content-type", "application/octet-stream")

        return {
            "content": response.content,  # 响应的二进制内容
            "content_type": content_type  # 媒体类型（如 image/jpeg, text/html 等）
        }
