import time

from app.utils.cookie import cookie_to_dict
from app.utils.lyrics import parse_lrc


async def audio_lyrics(self, method: str, audio_id: str):
    """
    实现获取音频功能
    :param self: 平台类
    :param method: 获取音频或歌词
    :param audio_id: 音频链接
    :return: Bool, audio/text Bool为True时返回音频，为False时返回音频地址
    """

    base_url = 'https://wwwapi.kugou.com/play/songinfo'

    # 将 Cookie 字符串解析为 Python 字典格式。以便于解析 cookie
    cookie = cookie_to_dict(self.headers['cookie'])

    # 构造请求参数
    params = {
        'srcappid': '2919',
        'clientver': '20000',
        'clienttime': str(round(time.time() * 1000)),
        'mid': cookie.get('kg_mid', ""),
        'uuid': cookie.get('kg_mid', ""),
        'dfid': cookie.get('kg_dfid', ""),
        'appid': '1014',
        'platid': '4',
        'encode_album_audio_id': audio_id,
        'token': cookie.get('t', "") if cookie.get(
            't') else 'dd9ed3a8e6c53cf6dc6d1607e7544dab4a31809eae1ed34e90897e14212a31aa',
        'userid': '0',
    }

    # 插入签名值
    params["signature"] = self.signature(params)

    try:
        response = await self.client.get(base_url, headers=self.headers, params=params)
        response.raise_for_status()  # 检查 HTTP 状态码
        data = response.json()

        # 解析返回数据
        play_url = data.get('data', {}).get('play_url', None)
        lrc = data.get('data', {}).get('lyrics', None)
        trans = data.get('data', {}).get('transLyrics', None)
        if method == 'audio':
            return False, play_url
        else:
            return parse_lrc(lrc, trans)
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
