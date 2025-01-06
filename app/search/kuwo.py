import httpx

from app.cookie.search_cookie import search_cookie


class KuwoMusicSearch:
    name = "酷我音乐" # 平台名称
    id = 4 #顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://www.kuwo.cn/search/searchMusicBykeyWord"
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""  # 从数据库获取 cookie
        }
    
    async def search(self, keyword: str, page: int = 1, limit: int = 20):

        # 构建请求 URL
        search_url = f"{self.base_url}?vipver=1&client=kt&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&mobi=1&issubtitle=1&show_copyright_off=1&pn={page - 1}&rn={limit}&all={keyword}"

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
                    "title": song["NAME"],  # 歌曲名称
                    "author": song["FARTIST"],  # 歌手
                    "cover": f"https://img2.kuwo.cn/star/albumcover/{song.get('web_albumpic_short')}" if song.get(
                        'web_albumpic_short') else f"https://img1.kuwo.cn/star/starheads/{song['web_artistpic_short']}",
                    # 歌曲封面图片
                    "url": f"https://www.kuwo.cn/play_detail/{song['DC_TARGETID']}",  # 歌曲链接
                    "album": song["ALBUM"],  # 专辑名称
                    "fee": int(song["fpay"]),  # 付费状态8为免费，1为VIP
                    "mvid": int(song["MVFLAG"]),  # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
                    "duration": self.s_to_mmss(int(song["DURATION"]))  # 歌曲时长，单位ms
                }
                for song in songs
            ]
            songCount = data.get("TOTAL", {})  # 歌曲总数
            result = {
                "song_list": song_list,
                "songCount": songCount
            }
            return result

        except httpx.RequestError as e:
            # 错误处理
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            # 其他错误处理
            return {"error": f"发生错误: {e}"}

    @staticmethod
    def s_to_mmss(s):
        # 计算分钟和秒
        minutes = int(s // 60)
        seconds = int(s % 60)
        return f"{minutes:02}:{seconds:02}"
