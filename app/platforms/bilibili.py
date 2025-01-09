import httpx

from app.cookie.search_cookie import search_cookie
from app.platforms.base import BaseSearch


class BilibiliSearch(BaseSearch):
    name = "哔哩哔哩"  # 平台名称
    id = 5  # 顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://api.bilibili.com/x/web-interface/search/type"
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""
        }

    async def search(self, keyword: str, page: int = 1, limit: int = 30):
        """实现搜索功能，支持分页"""

        search_url = f"{self.base_url}?page={page}&keyword={keyword}&search_type=video&platform=pc&page_size={limit}"

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
            results = data.get("data", {}).get("result", [])
            results_list = [
                {
                    "title": song["title"],  # 标题
                    "author": song["author"],  # 作者
                    "cover": f"https:{song['pic']}?param=224y224",  # 封面
                    "play": song["play"],  # 播放量
                    "duration": self.format_duration(song["duration"]),  # 时长
                    "url": song["arcurl"],  # 链接
                    "id": song["bvid"]
                }
                for song in results
            ]
            songCount = data.get("data", {}).get("numResults", 0)
            result = {
                "song_list": results_list,
                "songCount": songCount
            }
            return result
        except httpx.RequestError as e:
            # 错误处理
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            # 其他错误处理
            return {"error": f"发生错误: {e}"}

    async def get_audio(self, platform: str, id: str):
        bvid = id.strip('"')
        url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"

        # 检查是否需要更新 cookie
        if not self.cookie:
            self.cookie = await search_cookie(self.name)
            self.headers["cookie"] = self.cookie

        try:
            response = await self.client.get(url, headers=self.headers)
            response.raise_for_status()  # 如果请求失败则抛出异常
            data = response.json()
            audio_url = f"https://api.bilibili.com/x/player/playurl?fnval=16&bvid={bvid}&cid={data.get('data', {}).get('pages', [{}])[0].get('cid', '')}"
            try:
                response = await self.client.get(audio_url, headers=self.headers)
                response.raise_for_status()  # 如果请求失败则抛出异常
                data = response.json()
                audio_url = data.get(
                    'data', {}).get(
                    'dash', {}).get(
                    'audio', [
                        {}])[0].get(
                    'baseUrl', '')
                return {"audio_url": audio_url}
            except httpx.RequestError as e:
                return {"error": f"请求失败: {e}"}
            except Exception as e:
                return {"error": f"发生错误: {e}"}
        except httpx.RequestError as e:
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            return {"error": f"发生错误: {e}"}

    @staticmethod
    def format_duration(duration_str):
        """
        将格式为 "M:S" 的时间字符串转换为 "MM:SS" 格式。

        :param duration_str: 格式为 "M:S" 的时间字符串
        :return: 格式为 "MM:SS" 的时间字符串
        """
        try:
            # 解析字符串以获取分钟和秒
            minutes, seconds = map(int, duration_str.split(':'))

            # 格式化时间为 MM:SS 格式
            formatted_time = f"{minutes:02}:{seconds:02}"

            return formatted_time
        except ValueError:
            # 如果格式不正确，返回默认值或记录错误信息
            return "00:00"
