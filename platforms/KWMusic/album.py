from utils.cookie import cookie_to_dict
from utils.time import s_to_mmss


async def album(self, album_id: str):
    """
    定义抽象的获取专辑方法，每个平台都必须实现
    :param album_id: 专辑ID
    :return: 专辑信息
    """
    cookies = cookie_to_dict(self.headers["cookie"])
    secret = self.getSecret(cookies["Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324"])
    self.headers["Secret"] = secret
    url = f"https://www.kuwo.cn/api/www/album/albumInfo?albumId={album_id}&pn=1&rn=100&httpsStatus=1"
    response = await self.client.get(url, headers = self.headers)
    response.raise_for_status()
    data = response.json()
    album_list = [
        {
            # 歌曲名称
            "title": song["name"],
            # 歌手
            "author": song["artist"],
            # 歌曲封面图片
            "cover": song["pic120"],
            "hd_cover": song["albumpic"],
            # 歌曲链接
            "url": f"https://www.kuwo.cn/play_detail/{song['rid']}",
            # 专辑名称
            "album": song["album"],
            "album_id": song["albumid"],
            # 付费状态
            "fee": 1 if int(song["payInfo"]["play"]) > 1100 else 0,
            # 歌曲MV,0表示无MV
            "mvid": int(song["hasmv"]),
            # 歌曲时长，单位ms
            "duration": s_to_mmss(int(song["duration"])),
            # 歌曲ID
            "id": song['rid']
        }
        for song in data["data"]["musicList"]
    ]
    return album_list
