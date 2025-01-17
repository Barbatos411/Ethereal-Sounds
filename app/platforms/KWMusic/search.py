import httpx

from app.platforms.utils import search_cookie, s_to_mmss


async def search(self, keyword: str, page: int = 1, limit: int = 30):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """
    base_url = "https://www.kuwo.cn/search/searchMusicBykeyWord"
    # 构建请求 URL
    search_url = f"{base_url}?vipver=1&client=kt&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&mobi=1&issubtitle=1&show_copyright_off=1&pn={page - 1}&rn={limit}&all={keyword}"

    # 检查是否需要更新 cookie
    if not self.cookie:
        self.cookie = await search_cookie(self.name)
        self.headers["cookie"] = self.cookie

    try:
        print(search_url)
        # 发起请求
        response = await self.client.get(search_url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常

        # 解析数据
        data = response.json()

        # 假设返回的格式符合以下结构
        songs = data.get("abslist", {})
        song_list = [
            {
                "title": song["SONGNAME"],  # 歌曲名称
                "author": song["FARTIST"],  # 歌手
                "cover": f"https://img2.kuwo.cn/star/albumcover/{song.get('web_albumpic_short')}" if song.get(
                    'web_albumpic_short') else f"https://img1.kuwo.cn/star/starheads/{song['web_artistpic_short']}",
                # 歌曲封面图片
                # 歌曲链接
                "url": f"https://www.kuwo.cn/play_detail/{song['DC_TARGETID']}",
                "album": song["ALBUM"],  # 专辑名称
                # 付费状态8为免费，1为VIP
                "fee": 1 if int(song["payInfo"]["play"]) > 1100 else 0,
                # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
                "mvid": int(song["MVFLAG"]),
                # 歌曲时长，单位ms
                "duration": s_to_mmss(int(song["DURATION"]))
            }
            for song in songs
        ]
        song_count = data.get("TOTAL", {})  # 歌曲总数
        result = {
            "song_list": song_list,
            "song_count": song_count
        }
        return result

    except httpx.RequestError as e:
        # 错误处理
        return {"error": f"请求失败: {e}"}
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
