async def get_lrc(self, audio_id: str):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :return: 歌词
    """
    pass
