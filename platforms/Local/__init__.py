from platforms.base import BasePlatform
from .album import album
from .get_audio import get_audio
from .get_lrc import get_lrc
from .home import home


class LocalMusic(BasePlatform):
    name = "本地音乐"  # 平台名称
    id = "Local"  # 平台ID
    logo = ""
    Referer = None  # 平台Referer
    order = None  # 顺序
    cookie = None  # 平台Cookie

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        pass

    async def album(self, album_id: str):
        """
        定义抽象的获取专辑方法，每个平台都必须实现
        :param album_id: 专辑ID
        :return: 专辑信息
        """
        return await album(self, album_id)

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
        return await get_lrc(self, audio_id)

    async def home(self):
        """
        定义抽象地获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home()

    async def playlists(self):
        """
        定义抽象的获取歌单方法，每个平台都必须实现
        :return: 歌单信息
        """
        pass

    async def playlistinfo(self, playlist_id: str):
        """
        定义抽象的获取歌单方法，每个平台都必须实现
        :param playlist_id: 歌单ID
        :return: 歌单歌曲信息
        """
        pass

    def check_login_success(self, cookie_str: str) -> bool:
        """
        CK登录状态检测方法
        """
        pass
