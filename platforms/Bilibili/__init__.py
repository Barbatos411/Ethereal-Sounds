from platforms.base import BasePlatform
from .get_audio import get_audio
from .home import home
from .search import search


class Bilibili(BasePlatform):
    name = "哔哩哔哩"  # 平台名称
    id = "Bilibili"  # 平台ID
    Referer = "https://www.bilibili.com/"  # 平台Referer
    order = 5  # 顺序
    cookie = "b_lsid=63F3DAEF_19534459AFB;enable_feed_channel=DISABLE;home_feed_column=5;buvid4=FE59B631-6C91-0AB3-2147-A2097180842828035-025022319-ki5IoBaQVaZfWd9T0hnbL9d2AfRE2c42VEpZrzI1uYM8xkDTbSovZErrWl6j6Dut;buvid3=83146565-A947-90D8-0F50-2DC6ED10322431485infoc;b_nut=1740338731;_uuid=1061783E4-1299-5B78-D101F-F971F1765DD831773infoc;bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA1OTc5MzEsImlhdCI6MTc0MDMzODY3MSwicGx0IjotMX0.5KDiNxv9lNVErYUPI247RVCpocx0Bg2s0MvYj6c19fU;bili_ticket_expires=1740597871;bmg_af_switch=1;bmg_src_def_domain=i1.hdslb.com;browser_resolution=1652-915;buvid_fp=d294dae0d3ec02cee32e4866af87cfbe;enable_web_push=DISABLE"

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
        :param trans: 是否翻译
        :return: 歌词
        """
        pass

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
