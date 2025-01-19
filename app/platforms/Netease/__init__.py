from app.platforms.base import BasePlatform
from .get_audio import get_audio
from .get_lrc import get_lrc
from .home import home
from .search import search


class NetEase(BasePlatform):
    name = "网易云音乐"  # 平台名称
    id = "NetEase"
    order = 1  # 顺序

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
        定义抽象的获取音频方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        return await get_audio(self, audio_id)

    async def get_lrc(self, audio_id: str, trans: bool):
        """
        定义抽象地获取歌词方法，每个平台都必须实现
        :param audio_id: 音频链接
        :param trans: 是否翻译歌词
        :return: 歌词
        """
        return await get_lrc(self, audio_id, trans)

    async def home(self):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home()
