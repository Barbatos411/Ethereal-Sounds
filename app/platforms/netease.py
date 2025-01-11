import httpx

from app.cookie.search_cookie import search_cookie
from app.platforms.base import BaseSearch


class NeteaseSearch(BaseSearch):
    name = "网易云音乐"  # 平台名称
    id = 1  # 顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://music.163.com/api/search/pc"
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""  # 从数据库获取 cookie
        }

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        offset = (page - 1) * limit  # 计算偏移量

        # 构建请求 URL
        search_url = f"{self.base_url}?s={keyword}&offset={offset}&limit={limit}&type=1"

        # 检查是否需要更新 cookie
        if not self.cookie:
            self.cookie = await search_cookie(self.name)
            self.headers["cookie"] = self.cookie

        try:
            # 发起请求
            response = await self.client.get(search_url, headers=self.headers)
            response.raise_for_status()  # 如果请求失败则抛出异常

            # 解析数据
            data = response.json()

            # 假设返回的格式符合以下结构
            songs = data.get("result", {}).get("songs", [])
            song_list = [
                {
                    "title": song["name"],
                    # 歌曲名称
                    "status": song["status"],
                    # 歌曲状态，1为正常，-1未知
                    "author": ", ".join(artist["name"] for artist in song.get("artists", [])),
                    # 歌手
                    "cover": song["album"].get("picUrl", "") + "?param=300y300",
                    # 歌曲封面图片
                    "url": f"https://music.163.com/song?id={song['id']}",
                    # 歌曲链接
                    "album": song["album"]["name"],
                    # 专辑名称
                    "fee": song["fee"],
                    # 付费状态8为免费，1为VIP
                    "mvid": song["mvid"],
                    # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
                    "duration": self.ms_to_mmss(song["duration"]),
                    # 歌曲时长，单位ms
                    "id": song["id"]
                    # 歌曲ID
                }
                for song in songs
            ]
            song_count = data.get("result", {}).get("songCount", 0)  # 歌曲总数
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

    async def get_audio(self, platform: str, audio_id: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
        :param platform: 平台名称
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        audio_id = audio_id.strip('"')
        url = f'https://music.163.com/song/media/outer/url?id={audio_id}'

        # 检查是否需要更新 cookie
        if not self.cookie:
            self.cookie = await search_cookie(self.name)
            self.headers["cookie"] = self.cookie

        try:
            response = await self.client.get(url, headers=self.headers, follow_redirects=True)
            if response.status_code == 200:
                # 获取最终的重定向 URL
                audio_url = str(response.url)
                # TODO : 返回网歌词
                return {"final_audio_url": audio_url}
            else:
                return {"error": f"请求失败，状态码: {response.status_code}"}

        except httpx.RequestError as e:
            # 错误处理
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            # 其他错误处理
            return {"error": f"发生错误: {e}"}

    async def Home(self):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        # TODO : 首页数据
        pass

    @staticmethod
    def ms_to_mmss(ms):
        # 计算总秒数
        total_seconds = ms / 1000
        # 计算分钟和秒
        minutes = int(total_seconds // 60)
        seconds = int(total_seconds % 60)
        return f"{minutes:02}:{seconds:02}"
