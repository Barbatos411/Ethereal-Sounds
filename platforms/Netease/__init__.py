from platforms.base import BasePlatform
from .album import album
from .get_audio import get_audio
from .get_lrc import get_lrc
from .home import home
from .search import search


class NetEase(BasePlatform):
    name = "网易云音乐"  # 平台名称
    id = "NetEase"
    logo = "/root/platforms/Netease/logo.png"
    Referer = "https://music.163.com/"
    order = 1  # 顺序
    cookie = "ntes_utid=tid._.iM3K0zynKEVAUhBVBEeSNw4lJFsjCioz._.0;WNMCID=qmhaqn.1740338635092.01.0;WEVNSM=1.0.0;_iuqxldmzr_=32;_ntes_nnid=d4af74f6e9fd9e29a406d1697cf957a6,1740338635000;_ntes_nuid=d4af74f6e9fd9e29a406d1697cf957a6;JSESSIONID-WYYY=AWH2lOnPbQ16ryK1XS7NXH9UFziKXndPpQXNv3kYyQWuWnjw9ZOs6%2Fa9n%5Cc8UruV9wzP%2FoCPex1hHoWqsGKtMNRQwXI7cYTffE%2Fg%2F2HNeDkXJWpxI4ct6%5CEZVCCYNPgkeGYAh%5C3rjQJ%2FZw9CYgDimtGq03POXvSelUivWHoz%2Fh64Q%5C79%3A1740340434986;NMTID=00O0DuNC3AgWDz-PkUwj4W-c2ZMtYQAAAGVNEQf1Q;sDeviceId=YD-MSmKL%2BNCVCZFVhABEBeXYh5wNA82Wjos"

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        return await search(self, keyword, page, limit)

    async def album(self, album_id: str):
        """
        定义抽象的获取专辑方法，每个平台都必须实现
        :param album_id: 专辑ID
        :return: 专辑信息
        """
        return await album(self, album_id)

    async def get_audio(self, audio_id: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
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

    async def home(self, page: int = 1, categories: str = "全部"):
        """
        定义抽象地获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home(self, page, categories)

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
        return len(cookie_str) > 1500
