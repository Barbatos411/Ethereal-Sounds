import httpx
from app.search.base import BaseSearch

class BilibiliSearch:
    name = "哔哩哔哩"  # 平台名称
    key = "bilibili"  # 平台唯一标识
    id = 5 #顺序
    
    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        # 具体的搜索逻辑
        pass