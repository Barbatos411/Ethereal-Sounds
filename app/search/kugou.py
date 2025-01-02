import httpx
from app.search.base import BaseSearch

class KugouMusicSearch:
    name = "酷狗音乐" # 平台名称
    key = "kugou" # 平台唯一标识
    id = 3 #顺序
    
    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        # 具体的搜索逻辑
        pass