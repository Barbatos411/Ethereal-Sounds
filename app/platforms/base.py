from abc import ABC, abstractmethod

import httpx

from app.utils.cookie import get_cookie
from app.utils.db import set_data


class BasePlatform(ABC):
    """
    定义抽象基类，每个平台必须继承该类
    """
    name = "BasePlatform"  # 平台名称
    id = "base"  # 平台ID
    Referer = "https://www.example.com/"  # 平台Referer
    order = 0  # 平台优先级
    cookie = ""  # 平台cookie

    def __init__(self):
        # 先尝试获取 cookie
        cookie = get_cookie(self.id)

        if not cookie:
            # 如果数据库中没有 cookie，使用 self.cookie 并写入数据库
            cookie = self.cookie
            set_data("data", "account", "platforms", self.id, "cookie", cookie)  # 将 self.cookie 写入数据库

        self.client = httpx.AsyncClient()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": get_cookie(self.id) or self.cookie,
            "referer": self.Referer,
        }
        print(f"成功加载平台 {self.name}, 平台ID: {self.id}, 优先级: {self.order}")

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
    async def login(self, platform: str, method: str, username: str, password: str, code: str):
        """
        定义抽象的登录方法，每个平台都必须实现
        登录方式有：账号密码登录、手机号验证码登录、cookie登录，（后续可能会增加其他登录方式：二维码）
        :param platform: 平台ID
        :param method: 登录方式
        :param username: 用户名/手机号
        :param password: 密码/验证码
        :param code: cookie
        :return: 登录状态
        """
        pass
