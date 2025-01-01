import httpx
from app.search.base import BaseSearch

class BilibiliSearch:
    name = "哔哩哔哩"
    
    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        # 具体的搜索逻辑
        pass