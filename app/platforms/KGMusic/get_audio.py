import requests
import time
import hashlib
from fastapi import HTTPException

def get_audio(self, encode_album_audio_id):
    """
    获取播放链接或音频流
    :param self: 平台类 (保留以兼容可能的扩展)
    :param encode_album_audio_id: 歌曲短链
    :return: Tuple[bool, str] Bool为True时返回播放链接，为False时返回错误信息
    """
    # 请求头
    headers = {
        'accept': '*/*',
        'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8,ja;q=0.7',
        'origin': 'https://www.kugou.com',
        'referer': 'https://www.kugou.com/song/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    }

    # Cookie
    cookie = {
        "kg_mid": "df8eb959431e3f2696fc23d514fd9bf4",
        "kg_dfid": "3exIvy0NDCiI1x9u9X0MmaUX",
    }

    # 构造请求参数
    params = {
        'srcappid': '2919',
        'clientver': '20000',
        'clienttime': str(round(time.time() * 1000)),
        'mid': cookie['kg_mid'],
        'uuid': cookie['kg_mid'],
        'dfid': cookie['kg_dfid'],
        'appid': '1014',
        'platid': '4',
        'encode_album_audio_id': encode_album_audio_id,
        'token': '',
        'userid': '0',
    }

    # 生成签名
    secret_key = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt'
    arr_keys = sorted(params.keys())
    str_reg_params = secret_key + ''.join([f"{key}={params[key]}" for key in arr_keys]) + secret_key
    params['signature'] = hashlib.md5(str_reg_params.encode(encoding='UTF-8')).hexdigest()

    try:
        response = requests.get('https://wwwapi.kugou.com/play/songinfo', params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        play_url = data.get('data', {}).get('play_url', None)
        if play_url:
            return True, play_url
        else:
            return False, f"播放链接不存在: {data}"

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"请求失败: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"未知错误: {str(e)}")
