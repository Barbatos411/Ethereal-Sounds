class KugouMusicSearch:
    name = "酷狗音乐"  # 平台名称
    id = 3  # 顺序

    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        # 具体的搜索逻辑
        pass

    async def get_audio(self, platform: str, url: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
        :param platform: 平台名称
        :param url: 音频链接
        :return: 音频文件
        """
        pass
