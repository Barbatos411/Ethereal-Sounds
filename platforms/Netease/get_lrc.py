from utils.lyrics import parse_lrc


async def get_lrc(self, audio_id: str):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :return: 歌词
    """
    url = f"https://music.163.com/api/song/lyric?os=pc&id={audio_id}&lv=-1&tv=-1"
    response = await self.client.get(url, headers = self.headers)
    response.raise_for_status()
    data = response.json()
    lrc = data.get("lrc", {}).get('lyric', "")
    trans = data.get("tlyric", {}).get('lyric', "") if data.get("tlyric", {}).get('lyric', "") else None
    return parse_lrc(lrc, trans)
