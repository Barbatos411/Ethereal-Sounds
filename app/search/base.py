from abc import ABC, abstractmethod

class BaseSearch(ABC):
    @abstractmethod
    async def search(self, keyword: str):
        """定义抽象的搜索方法，每个平台都必须实现"""
        pass
