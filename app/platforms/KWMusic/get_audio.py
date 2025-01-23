import httpx


async def get_audio(self, audio_id):
    """
    实现获取音频功能
    :param self: 平台类s
    :param audio_id: 音频id
    :return: 音频文件/链接，歌词
    """
    base_url = "https://www.kuwo.cn/api/v1/www/music/playUrl"
    # 生成 reqId
    reqId = self.reqid()
    # 构建请求 URL
    url = f"{base_url}?mid={audio_id}&type=music&httpsStatus=1&reqId={reqId}&plat=web_www"
    try:
        # 发送 GET 请求
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常
        # 解析数据
        data = response.json()
        audio_url = data.get('data', {}).get('url')
        # 返回音频文件/链接
        print(audio_url)
        return False, audio_url

    except httpx.RequestError as e:
        # 错误处理
        return {"error": f"请求失败: {e}"}
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
