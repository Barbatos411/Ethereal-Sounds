import hashlib

from app.platforms.base import BasePlatform
from .audio_lyrics import audio_lyrics
from .home import home
from .search import search


class KGMusic(BasePlatform):
    name = "酷狗音乐"  # 平台名称
    id = "KGMusic"
    Referer = "https://www.kugou.com/"
    order = 3  # 顺序

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
        return await audio_lyrics(self, 'audio', audio_id)

    async def get_lrc(self, audio_id: str):
        """
        定义抽象地获取歌词方法，每个平台都必须实现
        :param audio_id: 音频链接
        :return: 歌词
        """
        return await audio_lyrics(self, 'lyrics', audio_id)

    async def home(self, page: int = 1, categories: str = "全部"):
        """
        定义抽象地获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home(self, page)

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

    @staticmethod
    def signature(params: dict):
        """
        定义酷狗的签名方法
        :param params: 签名参数
        :return: 签名值
        """
        # 固定值前后包裹
        fixed_value = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt"
        # 按字母顺序排列参数并拼接为字符串
        sorted_params = ''.join(f"{k}={v}" for k, v in sorted(params.items()))
        # 包裹固定值
        to_sign = f"{fixed_value}{sorted_params}{fixed_value}"
        # 使用 MD5 加密
        md5 = hashlib.md5()
        md5.update(to_sign.encode('utf-8'))
        signature = md5.hexdigest()
        # 构建完整 URL
        return signature
