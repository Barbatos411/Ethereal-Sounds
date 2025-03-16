async def get_audio(self, audio_id: str):
    """
    实现获取音频功能
    :param self: 平台类
    :param audio_id: 音频链接
    :return: Bool, audio/text Bool为True时返回音频，为False时返回音频地址
    """
    audio_id = audio_id.strip('"')
    url = f'https://music.163.com/song/media/outer/url?id={audio_id}'

    response = await self.client.get(url, headers = self.headers, follow_redirects = True)
    if response.status_code == 200:
        # 获取最终的重定向 URL
        audio_url = str(response.url)
        return False, audio_url
    else:
        return {"error": f"请求失败，状态码: {response.status_code}"}
