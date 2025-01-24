from app.platforms.utils import s_to_mmss


async def search(self, keyword: str, page: int = 1, limit: int = 30):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """

    base_url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
    # 构建请求负载
    payload = {
        "comm": {
            "ct": "19",
            "cv": "1859",
            "uin": "0"
        },
        "req": {
            "method": "DoSearchForQQMusicDesktop",
            "module": "music.search.SearchCgiService",
            "param": {
                "grp": 1,
                "num_per_page": limit,
                "page_num": page,
                "query": keyword,
                "search_type": 0
            }
        }
    }

    try:
        # 发送 POST 请求
        response = await self.client.post(base_url, headers=self.headers, json=payload)
        response.raise_for_status()  # 如果请求失败则抛出异常

        # 解析数据
        data = response.json()
        songs = data.get(
            "req",
            {}).get(
            "data",
            {}).get(
            "body",
            {}).get(
            "song",
            {}).get(
            "list",
            [])
        song_list = [
            {
                # 歌曲名称
                "title": song.get("title"),
                # 歌手
                "author": ", ".join(singer.get("name", "") for singer in song.get("singer", [])),
                # 歌曲封面图片
                "cover": f"https://y.gtimg.cn/music/photo_new/T002R300x300M000{song.get('album').get('mid')}.jpg?param=224y224" if song.get(
                    'album').get(
                    'mid') else f"https://y.qq.com/music/photo_new/T062R300x300M000{next((vs for vs in song.get('vs', []) if vs), '')}.jpg?param=224y224",
                # 歌曲ID 详情页https://y.qq.com/n/ryqq/songDetail/mid
                "id": song.get("mid"),
                # 歌曲链接
                "url": f"https://y.qq.com/n/ryqq/songDetail/{song.get('mid')}?songtype=[type]",
                # 专辑名称
                "album": song.get("album").get("name"),
                # 付费状态，0为免费，1为付费
                "fee": song.get("pay", {}).get("pay_play", 0),
                # 歌曲MV, 0表示无MV
                "mvid": song.get("mv", {}).get("id"),
                # 歌曲时长，单位ms
                "duration": s_to_mmss(song.get("interval", 0)),
            }
            for song in songs
        ]
        song_count = data.get(
            "req",
            {}).get(
            "data",
            {}).get(
            "meta",
            {}).get("sum")  # 歌曲总数
        result = {
            "song_list": song_list,
            "song_count": song_count
        }
        return result
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
