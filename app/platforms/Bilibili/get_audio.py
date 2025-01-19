import httpx
from fastapi import HTTPException


async def get_audio(self, audio_id: str):
    """
    实现获取音频功能
    :param self: 平台类
    :param audio_id: 音频id
    :return: Bool, audio/text Bool为True时返回音频，为False时返回音频地址
    """

    bvid = audio_id.strip('"')
    url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"

    try:
        # 通过bvid获取cid
        audio_info = await self.client.get(url, headers=self.headers)
        audio_info.raise_for_status()  # 如果请求失败则抛出异常
        cid = audio_info.json().get(
            'data', {}).get(
            'pages', [
                {}])[0].get(
            'cid', '')
        # 通过bvid和cid获取音频链接
        audio_url = f"https://api.bilibili.com/x/player/playurl?fnval=16&bvid={bvid}&cid={cid}"
        response = await self.client.get(audio_url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常
        data = response.json()
        audio_url = data.get(
            'data', {}).get(
            'dash', {}).get(
            'audio', [
                {}])[0].get(
            'baseUrl', '')

        # 使用 stream 方法获取音频流
        async with self.client.stream("GET", audio_url, headers=self.headers) as audio:
            audio.raise_for_status()  # 如果请求失败则抛出异常

            # 读取流式响应的内容
            audio_content = await audio.aread()

            # 返回音频内容和 MIME 类型
            return True, audio_content

    except httpx.RequestError as exc:
        # 捕获请求中的错误，例如网络问题
        raise HTTPException(
            status_code=500,
            detail=f"Error while fetching audio: {str(exc)}"
        )
