import httpx
from app.search.base import BaseSearch

class KuwoMusicSearch:
    name = "酷我音乐" # 平台名称
    key = "kuwo" # 平台唯一标识
    id = 4 #顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
    
    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        # 具体的搜索逻辑
        pass