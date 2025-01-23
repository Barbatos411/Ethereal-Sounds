import time

from app.platforms.base import BasePlatform
from .get_audio import get_audio
from .home import home
from .search import search


class KWMusic(BasePlatform):
    name = "酷我音乐"  # 平台名称
    id = "KWMusic"
    order = 4  # 顺序

    def __init__(self):
        super().__init__()
        self.headers["Referer"] = "https://www.kuwo.cn/"

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
        :return: 歌词
        :param trans: 是否翻译
        """
        pass

    async def home(self):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        return await home()

    @staticmethod
    def reqid(e=None, t=None, n=None):
        i = (t and n) or 0
        h, d = 0, 0
        b = t or [0] * 16
        f = None
        v = None

        if f is None or v is None:
            m = {
                0: 43, 1: 64, 2: 160, 3: 14, 4: 221, 5: 55,
                6: 249, 7: 97, 8: 86, 9: 170, 10: 120, 11: 218,
                12: 66, 13: 188, 14: 238, 15: 102
            }
            if f is None:
                f = [1 | m[0], m[1], m[2], m[3], m[4], m[5]]
            if v is None:
                v = 16383 & ((m[6] << 8) | m[7])

        y = int(time.time() * 1000)  # 获取当前时间戳（毫秒）
        w = h + 1
        dt = y - d + (w - h) / 1e4

        if dt < 0 and v is not None:
            v = (v + 1) & 16383
        if (dt < 0 or y > d) and v is not None:
            w = 0

        if w >= 1e4:
            raise ValueError("uuid.v1(): Can't create more than 10M uuids/sec")

        d = y
        h = w
        o = v

        y += int(12219292800000)  # 转换时间戳
        A = (int(1e4 * (268435455 & y)) + w) % 4294967296
        b[i] = (A >> 24) & 255
        b[i + 1] = (A >> 16) & 255
        b[i + 2] = (A >> 8) & 255
        b[i + 3] = A & 255

        x = ((y // 4294967296) * 1e4) & 268435455
        b[i + 4] = (x >> 8) & 255
        b[i + 5] = x & 255
        b[i + 6] = ((x >> 24) & 15) | 16
        b[i + 7] = (x >> 16) & 255
        b[i + 8] = (v >> 8) | 128
        b[i + 9] = v & 255

        for T in range(6):
            b[i + 10 + T] = f[T]

        def format_uuid(e, t=0):
            n = [(i + 256).to_bytes(1, byteorder="big").hex() for i in range(256)]
            r = []
            r.extend(n[e[t:t + 4]])
            r.append("-")
            r.extend(n[e[t + 4:t + 6]])
            r.append("-")
            r.extend(n[e[t + 6:t + 8]])
            r.append("-")
            r.extend(n[e[t + 8:t + 10]])
            r.append("-")
            r.extend(n[e[t + 10:t + 16]])
            return "".join(r)

        return t or format_uuid(b)
