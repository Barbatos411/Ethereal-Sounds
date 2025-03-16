from utils.time import ms_to_mmss


async def album(self, album_id):
    url = f"https://music.163.com/api/album/{album_id}"
    response = await self.client.get(url, headers = self.headers)
    response.raise_for_status()
    data = response.json()
    album_list = [
        {
            # 歌曲名称
            "title": song["name"],
            # 歌曲状态，1为正常，-1未知
            "status": song["status"],
            # 歌手
            "author": ", ".join(artist["name"] for artist in song.get("artists", [])),
            # 歌曲封面图片
            "cover": song["album"].get("picUrl", "") + "?param=300y300",
            "hd_cover": song["album"].get("picUrl", ""),
            # 歌曲链接
            "url": f"https://music.163.com/song?id={song['id']}",
            # 专辑名称
            "album": song["album"]["name"],
            "album_id": song["album"]["id"],
            # 付费状态8为免费，1为VIP
            "fee": song["fee"],
            # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
            "mvid": song["mvid"],
            # 歌曲时长，单位ms
            "duration": ms_to_mmss(song["duration"]),
            # 歌曲ID
            "id": song["id"]
        }
        for song in data["album"]["songs"]
    ]
    return album_list
