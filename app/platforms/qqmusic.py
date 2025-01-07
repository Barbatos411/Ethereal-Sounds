import json

import httpx

from app.cookie.search_cookie import search_cookie
from app.platforms.base import BaseSearch


class QQMusicSearch(BaseSearch):
    name = "QQ音乐"  # 平台名称
    id = 2  # 顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
        self.cookie = None  # 初始化为 None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": ""  # 从数据库获取 cookie
        }

    async def search(self, keyword: str, page: int = 1, limit: int = 20):
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

        # 检查是否需要更新 cookie
        if not self.cookie:
            self.cookie = await search_cookie(self.name)
            self.headers["cookie"] = self.cookie

        try:
            # 发送 POST 请求
            response = await self.client.post(self.base_url, headers=self.headers, data=json.dumps(payload))
            response.raise_for_status()  # 如果请求失败则抛出异常

            # 解析数据
            data = response.json()

            # 假设返回的格式符合以下结构
            songs = data.get("req", {}).get("data", {}).get("body", {}).get("song", {}).get("list", [])
            song_list = [
                {
                    "title": song.get("title"),  # 歌曲名称
                    "author": ", ".join(singer.get("name", "") for singer in song.get("singer", [])),  # 歌手,  # 歌手
                    "cover": f"https://y.gtimg.cn/music/photo_new/T002R300x300M000{song.get('album').get('mid')}.jpg?param=224y224" if song.get(
                        'album').get(
                        'mid') else f"https://y.qq.com/music/photo_new/T062R300x300M000{next((vs for vs in song.get('vs', []) if vs), '')}.jpg?param=224y224",
                    # 歌曲封面图片，可能需要进一步处理
                    "url": f"https://y.qq.com/n/ryqq/songDetail/{song.get('mid')}?songtype=[type]",  # 歌曲链接
                    "album": song.get("album").get("name"),  # 专辑名称
                    "fee": song.get("pay", {}).get("pay_play", 0),  # 付费状态，0为免费，1为付费
                    "mvid": song.get("mv", {}).get("id"),  # 歌曲MV, 0表示无MV
                    "duration": self.s_to_mmss(song.get("interval", 0))  # 歌曲时长，单位ms
                }
                for song in songs
            ]
            songCount = data.get("result", {}).get("req", {}).get("data", {}).get("meta", {}).get("sum")  # 歌曲总数
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

    async def get_audio(self, platform: str, id: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
        :param platform: 平台名称
        :param id: 音频链接
        :return: 音频文件
        """
        pass


    @staticmethod
    def s_to_mmss(s):
        # 计算分钟和秒
        minutes = int(s // 60)
        seconds = int(s % 60)
        return f"{minutes:02}:{seconds:02}"
