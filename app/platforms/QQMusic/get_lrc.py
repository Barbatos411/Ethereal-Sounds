import httpx

from app.platforms.utils import remove_metadata, merge_lyrics_and_translation


async def get_lrc(self, audio_id: str, trans: bool):
    """
    根据指定平台和关键词进行歌曲歌词获取
    :param audio_id: 歌曲ID
    :return: 歌词
    """
    # 根据平台名称找到对应的平台类
    url = f"https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid={audio_id}&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1"
    print(url)
    try:
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        lrc = data.get('lyric', "")
        if trans:
            trans = data.get('trans', "")
            return {"lyric": merge_lyrics_and_translation(lrc, trans)}
        return {"lyric": remove_metadata(lrc)}
    except httpx.RequestError as e:
        return {"error": f"请求失败: {e}"}
    except Exception as e:
        return {"error": f"发生错误: {e}"}
