import httpx


async def get_lrc(self, audio_id: str, trans: bool):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :param trans: 是否翻译歌词
    :return: 歌词
    """
    url = f"https://music.163.com/api/song/lyric?os=pc&id={audio_id}&lv=-1&tv=-1"
    try:
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        lrc = data.get("lrc", {}).get('lyric', "")
        if trans:
            trans = data.get("tlyric", {}).get('lyric', "")
            return {"lyric": self.merge_lyrics_and_translation(lrc, trans)}
        return {"lyric": lrc.strip()}
    except httpx.RequestError as e:
        return {"error": f"请求失败: {e}"}
    except Exception as e:
        return {"error": f"发生错误: {e}"}
