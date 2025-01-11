class KugouMusicSearch:
    name = "酷狗音乐"  # 平台名称
    id = 3  # 顺序

    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        """
        定义抽象的搜索方法，每个平台都必须实现
        :param keyword: 搜索的关键字
        :param page: 当前页码，默认为1
        :param limit: 每页返回的结果数，默认为10
        :return: 搜索结果
        """
        # TODO : KUGOU的搜索逻辑
        pass

    async def get_audio(self, platform: str, audio_id: str):
        """
        定义抽象的获取音频方法，每个平台都必须实现
        :param platform: 平台名称
        :param audio_id: 音频链接
        :return: 音频文件/链接，歌词
        """
        # TODO : 获取歌曲的音频，歌词数据
        pass

    async def Home(self):
        """
        定义抽象的获取主页方法，每个平台都必须实现
        :return: 主页
        """
        # TODO : 首页数据
        pass
