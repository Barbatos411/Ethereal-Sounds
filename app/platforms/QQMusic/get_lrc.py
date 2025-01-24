async def get_lrc(self, audio_id: str, trans: bool):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :param trans: 是否翻译歌词
    :return: 歌词
    """
    url = f"https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid={audio_id}&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1"
    try:
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        lrc = data.get('lyric', "")
        if trans:
            trans = data.get('trans', "")
            return {"lyric": self.merge_lyrics_and_translation(lrc, trans)}
        return {"lyric": lrc.strip()}
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
