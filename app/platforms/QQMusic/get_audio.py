from app.platforms.utils import cookie_to_dict


async def get_audio(self, audio_id):
    """
    实现获取音频功能
    :param self: 平台类
    :param audio_id: 音频id
    :return: 音频文件/链接，歌词
    """
    base_url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
    cookies = cookie_to_dict(self.headers['cookie'])
    # 请求参数
    data = {
        "req_0": {
            "module": "vkey.GetVkeyServer",
            "method": "CgiGetVkey",
            "param": {
                "filename": [f"M500{audio_id * 2}.mp3"],
                "guid": "10000",
                "songmid": [f"{audio_id}"],
                "songtype": [0],
                "uin": f"{cookies.get('uin')[1:]}" if cookies.get('uin') else "0",
                "loginflag": 1,
                "platform": "20"
            }
        },
        "loginUin": "0" if not cookies.get('uin') else cookies.get('uin'),
        "comm": {
            "uin": f"{cookies.get('uin')[1:]}" if cookies.get('uin') else "0",
            "format": "json",
            "ct": 24,
            "cv": 0
        }
    }

    try:
        # 发送 POST 请求
        response = await self.client.post(base_url, headers=self.headers, json=data)
        response.raise_for_status()  # 如果请求失败则抛出异常
        # 解析数据
        data = response.json()
        audio_url = f"https://ws.stream.qqmusic.qq.com/{data.get('req_0', {}).get('data', {}).get('midurlinfo', [{}])[0].get('purl')}"
        # 返回音频文件/链接
        print(audio_url)
        return False, audio_url
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
