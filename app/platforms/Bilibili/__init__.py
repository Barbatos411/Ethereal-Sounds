from app.platforms.base import BasePlatform
from .get_audio import get_audio
from .home import home
from .search import search


class Bilibili(BasePlatform):
    name = "哔哩哔哩"  # 平台名称
    id = "Bilibili"  # 平台ID
    order = 5  # 顺序

    def __init__(self):
        super().__init__()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "cookie": "",
            "Referer": "https://www.bilibili.com"
        }

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        return await search(self, keyword, page, limit)

    async def get_audio(self, audio_id: str):
        """
        定义抽象地获取音频方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        return await get_audio(self, audio_id)

    async def get_lrc(self, audio_id: str):
        """
        定义抽象地获取歌词方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 歌词
        """
        pass

    async def home(self):
        """
        定义抽象地获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home()
