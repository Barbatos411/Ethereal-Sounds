import time
import math
import random

from app.platforms.base import BasePlatform
from .get_audio import get_audio
from .home import home
from .search import search


class KWMusic(BasePlatform):
    name = "酷我音乐"  # 平台名称
    id = "KWMusic"
    Referer = "https://kuwo.cn/"
    order = 4  # 顺序

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
    def reqid():
        m = {
            "0": 43,
            "1": 64,
            "2": 160,
            "3": 14,
            "4": 221,
            "5": 55,
            "6": 249,
            "7": 97,
            "8": 86,
            "9": 170,
            "10": 120,
            "11": 218,
            "12": 66,
            "13": 188,
            "14": 238,
            "15": 102
        }

        f = [1 | m["0"], m["1"], m["2"], m["3"], m["4"], m["5"]]
        v = 16383 & (m["6"] << 8 | m["7"])

        y = int(time.time() * 1000)
        w = 1
        d = 0
        h = 0

        dt = y - d + (w - h) / 1e4

        if dt < 0:
            v = (v + 1) & 16383

        if dt < 0 or y > d:
            w = 0

        if w >= 1e4:
            raise Exception("uuid.v1(): Can't create more than 10M uuids/sec")

        d = y
        h = w
        o = v

        A = (int(1e4 * (268435455 & (y + int(122192928e5)))) + w) % 4294967296
        b = [
            (A >> 24) & 255,
            (A >> 16) & 255,
            (A >> 8) & 255,
            A & 255
        ]

        # 计算 x
        x = int((y / 4294967296 * 1e4)) & 268435455
        b.extend([
            (x >> 8) & 255,
            x & 255,
            ((x >> 24) & 15) | 16,
            (x >> 16) & 255,
            (v >> 8) | 128,
            v & 255
        ])

        for t in range(6):
            b.append(f[t])

        n = [format(i + 256, 'x')[1:] for i in range(256)]
        uuid_str = ''.join([
            n[b[0]], n[b[1]], n[b[2]], n[b[3]], '-',
            n[b[4]], n[b[5]], '-',
            n[b[6]], n[b[7]], '-',
            n[b[8]], n[b[9]], '-',
            n[b[10]], n[b[11]], n[b[12]], n[b[13]], n[b[14]], n[b[15]]
        ])

        return uuid_str

    @staticmethod
    def getSecret(b):
        c = "Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324"
        d = f"_ga=GA1.2.1617862873.1703732461; _gid=GA1.2.1291582354.1703732461; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1703725476; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1703734897; _ga_ETPBRPM9ML=GS1.2.1703732461.1.1.1703734896.33.0.0; Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324={b}"
        e = d.find(c + "=")
        e += len(c) + 1
        f = d.find(";", e)
        if f == -1:
            f = len(d)
        g = d[e:f]
        h = ""
        for i in c:
            h += str(ord(i))
        i = math.floor(len(h) / 5)
        j = [i, 2 * i, 3 * i, 4 * i]
        k = ''
        for l in j:
            k += h[l]
        m = int(k)
        n = round(1e9 * random.random()) % int(1e8)
        o = math.ceil(len(c) / 2)
        p = pow(2, 31) - 1
        h += str(n)
        while len(h) > 10:
            q = int(h[:10])
            r = h[10:]
            if len(r) > 15:
                h = "59910100"
                break
            s = int(r)
            h = str(q + s)
        h = (m * int(h) + o) % p
        t = ""
        u = h
        for v in g:
            w = math.floor((u / p) * 255)
            x = ord(v) ^ w
            t += format(x, '02x')
            u = (m * u + o) % p
        y = format(n, '08x')
        t += y
        return t
