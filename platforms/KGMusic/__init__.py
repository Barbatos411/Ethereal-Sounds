import hashlib

from platforms.base import BasePlatform
from .audio_lyrics import audio_lyrics
from .home import home
from .search import search


class KGMusic(BasePlatform):
    name = "酷狗音乐"  # 平台名称
    id = "KGMusic"
    logo = "https://www.kugou.com/yy/static/images/play/logo.png"
    Referer = "https://www.kugou.com/"
    order = 3  # 顺序
    cookie = "kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e;ACK_SERVER_10017=%7B%22list%22%3A%5B%5B%22bjverifycode.service.kugou.com%22%5D%5D%7D;ACK_SERVER_10015=%7B%22list%22%3A%5B%5B%22bjlogin-user.kugou.com%22%5D%5D%7D;ACK_SERVER_10016=%7B%22list%22%3A%5B%5B%22bjreg-user.kugou.com%22%5D%5D%7D;Hm_lpvt_aedee6983d4cfc62f509129360d6bb3d=1740338699;Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1740338691;kg_dfid=4XRjc3111RYo2SvRcV2b0pTv;kg_mid=7fca03a811a8dc8909d7625845118434"

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
        pass

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
