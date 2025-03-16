from platforms.base import BasePlatform
from .album import album
from .get_audio import get_audio
from .get_lrc import get_lrc
from .home import home
from .search import search


class QQMusic(BasePlatform):
    name = "QQ音乐"  # 平台名称
    id = "QQMusic"  # 平台ID
    Referer = "https://y.qq.com/"  # 平台Referer
    order = 2  # 顺序
    cookie = "pgv_pvid=3720502878;pgv_info=ssid=s5519043906;fqm_sessionid=14f3d2ef-7356-4946-a098-bae97e2437e6;fqm_pvqid=7c94a00a-804b-4d86-bfcf-84283ef932a0;ts_last=y.qq.com/;ts_refer=music.qq.com/;ts_uid=6209002575"

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
