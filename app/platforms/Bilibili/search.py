from app.platforms.utils import format_duration


async def search(self, keyword: str, page: int = 1, limit: int = 30):
    """
    实现搜素功能
    :param self: 平台类
    :param keyword: 搜索的关键字
    :param page: 当前页码，默认为1
    :param limit: 每页返回的结果数，默认为10
    :return: 搜索结果
    """
    base_url = "https://api.bilibili.com/x/web-interface/search/type?&search_type=video&platform=pc"
    search_url = f"{base_url}&page={page}&keyword={keyword}&page_size={limit}"

    try:
        # 发起请求
        response = await self.client.get(search_url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常

        # 解析数据
        data = response.json()
        results = data.get("data", {}).get("result", [])
        results_list = [
            {
                "title": song["title"],
                # 标题
                "author": song["author"],
                # 作者
                "cover": f"https:{song['pic']}?param=224y224",
                # 封面
                "play": song["play"],
                # 播放量
                "duration": format_duration(song["duration"]),
                # 时长
                "url": song["arcurl"],
                # 链接
                "id": song["bvid"]
                # id
            }
            for song in results
        ]
        song_count = data.get("data", {}).get("numResults", 0)
        result = {
            "song_list": results_list,
            "song_count": song_count
        }
        return result
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
