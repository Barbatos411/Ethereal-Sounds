from abc import ABC, abstractmethod

class BaseSearch(ABC):
    @abstractmethod
    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        pass
