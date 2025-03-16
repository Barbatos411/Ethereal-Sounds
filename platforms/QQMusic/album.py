async def album(self, album_id: str):
    """
    定义抽象的获取专辑方法，每个平台都必须实现
    :param album_id: 专辑ID
    :return: 专辑信息
    """
    url = f"https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg?platform=h5page&albummid={album_id}&g_tk=938407465&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1459961045571"
    response = await self.client.get(url, headers = self.headers)
    response.raise_for_status()
    data = response.json()
    album_list = [
        {
            # 歌曲名称
            "title": song.get("songname"),
            # 歌手
            "author": ", ".join(singer.get("name", "") for singer in song.get("singer", [])),
            # 歌曲封面图片
            "cover": f"https://y.gtimg.cn/music/photo_new/T002R300x300M000{song.get('albummid')}.jpg?param=224y224",
            "hd_cover": f"https://y.gtimg.cn/music/photo_new/T002R300x300M000{song.get('albummid')}.jpg",
            # 歌曲ID 详情页https://y.qq.com/n/ryqq/songDetail/mid
            "id": song.get("songmid"),
            # 歌曲链接
            "url": f"https://y.qq.com/n/ryqq/songDetail/{song.get('songmid')}?songtype=[type]",
            # 专辑名称
            "album": song.get("albumname"),
            "album_id": song.get("albummid"),
            # 付费状态，0为免费，1为付费
            "fee": song.get("pay", {}).get("pay_play", 0),
        }
        for song in data["data"]["list"]
    ]

    return album_list
