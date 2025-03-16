import time

from utils.cookie import cookie_to_dict
from utils.time import s_to_mmss


async def search(self, keyword: str, page: int = 1, limit: int = 30):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """

    # 将 Cookie 字符串解析为 Python 字典格式。以便于解析 cookie
    cookies = cookie_to_dict(self.headers["cookie"])

    # 基础地址
    base_url = "https://complexsearch.kugou.com/v2/search/song"

    # 请求参数
    params = {
        "appid": cookies.get("a_id") if cookies.get("a_id") else "1014",
        "bitrate": "0",
        "clienttime": int(time.time() * 1000),
        "clientver": "1000",
        "dfid": cookies.get("kg_dfid"),
        "filter": "10",
        "inputtype": "0",
        "iscorrection": "1",
        "isfuzzy": "0",
        "keyword": keyword,
        "mid": cookies.get("kg_mid"),
        "page": page,
        "pagesize": limit,
        "platform": "WebFilter",
        "privilege_filter": "0",
        "srcappid": "2919",
        "token": cookies.get("t") if cookies.get("t") else "0",  # 对应 token
        "userid": cookies.get("KugooID") if cookies.get("KugooID") else "0",
        "uuid": cookies.get("kg_mid"),  # 通常与 mid 相同
    }

    # 插入签名值
    params["signature"] = self.signature(params)

    # 发送 GET 请求并获取响应
    try:
        response = await self.client.get(base_url, headers = self.headers, params = params)
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
                "hd_cover": song.get("Image").replace("{size}/", ""),
                # 歌曲链接
                "url": f"https://www.kugou.com/song/#hash={song.get('FileHash')}&album_id={song.get('AlbumID')}",
                # 专辑名称
                "album": song.get("AlbumName"),
                "album_id": song.get("AlbumID"),
                # 付费状态8为免费，1为VIP
                # "fee": song.get("PayType"),
                # 歌曲MV,0表示无MV
                # "mvid": song.get("mvdata")[0].get("id") if song.get("mvdata") else 0,
                # 歌曲时长，单位ms
                "duration": s_to_mmss(
                    song.get("HQDuration") if int(song.get("HQDuration")) == 0 else song.get("Duration")),
                "id": song.get("EMixSongID"),
            }
            for song in songs
        ]
        song_count = data.get("data", {}).get("total", 0)  # 歌曲总数
        result = {
            "song_list": song_list,
            "song_count": song_count
        }
        return result
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
