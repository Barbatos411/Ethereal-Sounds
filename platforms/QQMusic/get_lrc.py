from utils.lyrics import parse_lrc


async def get_lrc(self, audio_id: str):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :return: 歌词
    """
    url = f"https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid={audio_id}&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1"
    response = await self.client.get(url, headers = self.headers)
    response.raise_for_status()
    data = response.json()
    lrc = data.get('lyric', "")
    trans = data.get('trans', "").replace('//', '') if data.get('trans', "") else None
    return parse_lrc(lrc, trans)
