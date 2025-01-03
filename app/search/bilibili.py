import httpx

from app.search.base import BaseSearch


class BilibiliSearch(BaseSearch):
    name = "哔哩哔哩"  # 平台名称
    key = "bilibili"  # 平台唯一标识
    id = 5  # 顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://api.bilibili.com/x/web-interface/search/type"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": "buvid3=F7BD9F6C-084D-67E3-C764-A4518D755F3F18009infoc; b_nut=1735842818; b_lsid=4F2FC21F_194284B699B; _uuid=8DDEEA5C-B998-9434-BEF4-F2C815C39610F18468infoc; buvid_fp=db9dcd5032549f68a8cc0e7b1c0728d8"

        }

    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        """实现搜索功能，支持分页"""

        search_url = f"{self.base_url}?page={page}&keyword={keyword}&search_type=video&platform=pc"

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
                    "cover": f"http:{song['pic']}",  # 封面
                    "play": song["play"],  # 播放量
                    "duration": song["duration"],  # 时长
                    "url": song["arcurl"],  # 链接
                }
                for song in results
            ]
            return results_list
        except httpx.RequestError as e:
            # 错误处理
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            # 其他错误处理
            return {"error": f"发生错误: {e}"}
