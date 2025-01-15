import hashlib
import time
import urllib.parse

import httpx

from app.platforms.utils import search_cookie, s_to_mmss, cookie_to_dict


async def search(self, keyword: str, page: int = 1, limit: int = 1):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """

    # 检查是否需要更新 cookie
    if not self.cookie:
        self.cookie = await search_cookie(self.name)
        self.headers["cookie"] = self.cookie

    # 将 Cookie 字符串解析为 Python 字典格式。以便于解析 cookie
    cookies = cookie_to_dict(self.headers["cookie"])

    # 构建请求 URL
    search_url = build_kugou_search_url(cookies, keyword, page, limit)

    # 发送 GET 请求并获取响应
    try:
        response = await self.client.get(search_url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常
        data = response.json()
        # 提取搜索结果
        songs = data.get("data", {}).get("lists", [])
        song_list = [
            {
                # 歌曲名称
                "title": song.get("SongName"),
                # 歌手
                "author": song.get("SingerName"),
                # 歌曲封面图片
                "cover": song.get("Image").replace("{size}", "100"),
                # 歌曲链接
                "url": f"https://www.kugou.com/song/#hash={song.get('FileHash')}&album_id={song.get('AlbumID')}",
                # 专辑名称
                "album": song.get("AlbumName"),
                # 付费状态8为免费，1为VIP
                # "fee": song.get("PayType"),
                # 歌曲MV,0表示无MV
                # "mvid": song.get("mvdata")[0].get("id") if song.get("mvdata") else 0,
                # 歌曲时长，单位ms
                "duration": s_to_mmss(
                    song.get("HQDuration") if int(song.get("HQDuration")) == 0 else song.get("Duration")),
            }
            for song in songs
        ]
        song_count = data.get("data", {}).get("total", 0)  # 歌曲总数
        result = {
            "song_list": song_list,
            "song_count": song_count
        }
        return result
    except httpx.HTTPError as e:
        # 处理请求失败的情况
        return {"error": f"请求失败: {e}"}


def build_kugou_search_url(cookies: dict, keyword: str, page: int, pagesize: int):
    """根据 cookie 和关键字签名并生成搜索地址"""
    # 当前时间戳（毫秒级）
    clienttime = int(time.time() * 1000)

    base_url = "https://complexsearch.kugou.com/v2/search/song"

    # 参数参数
    params = {
        "appid": cookies.get("a_id") if cookies.get("a_id") else "1014",
        "bitrate": "0",
        "clienttime": clienttime,
        "clientver": "1000",
        "dfid": cookies.get("kg_dfid"),
        "filter": "10",
        "inputtype": "0",
        "iscorrection": "1",
        "isfuzzy": "0",
        "keyword": keyword,
        "mid": cookies.get("kg_mid"),
        "page": page,
        "pagesize": pagesize,
        "platform": "WebFilter",
        "privilege_filter": "0",
        "srcappid": "2919",
        "token": cookies.get("t") if cookies.get("t") else "0",  # 对应 token
        "userid": cookies.get("KugooID") if cookies.get("KugooID") else "0",
        "uuid": cookies.get("ku_mid"),  # 通常与 mid 相同
    }

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
    return f"{base_url}?{urllib.parse.urlencode(params)}&signature={signature}"
