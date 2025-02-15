from app.utils.time import ms_to_mmss


async def search(self, keyword: str, page: int = 1, limit: int = 30):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """
    offset = (page - 1) * limit  # 计算偏移量
    base_url = "https://music.163.com/api/search/pc"
    # 构建请求 URL
    search_url = f"{base_url}?s={keyword}&offset={offset}&limit={limit}&type=1"

    try:
        # 发起请求
        response = await self.client.get(search_url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常

        # 解析数据
        data = response.json()

        # 提取搜索结果
        songs = data.get("result", {}).get("songs", [])
        song_list = [
            {
                # 歌曲名称
                "title": song["name"],
                # 歌曲状态，1为正常，-1未知
                "status": song["status"],
                # 歌手
                "author": ", ".join(artist["name"] for artist in song.get("artists", [])),
                # 歌曲封面图片
                "cover": song["album"].get("picUrl", "") + "?param=300y300",
                # 歌曲链接
                "url": f"https://music.163.com/song?id={song['id']}",
                # 专辑名称
                "album": song["album"]["name"],
                # 付费状态8为免费，1为VIP
                "fee": song["fee"],
                # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
                "mvid": song["mvid"],
                # 歌曲时长，单位ms
                "duration": ms_to_mmss(song["duration"]),
                # 歌曲ID
                "id": song["id"]
            }
            for song in songs
        ]
        song_count = data.get("result", {}).get("songCount", 0)  # 歌曲总数
        result = {
            "song_list": song_list,
            "song_count": song_count
        }
        return result
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
