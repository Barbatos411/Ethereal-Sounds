from app.utils.cookie import cookie_to_dict


async def get_audio(self, audio_id):
    """
    实现获取音频功能
    :param self: 平台类s
    :param audio_id: 音频id
    :return: 音频文件/链接，歌词
    """
    cookies = cookie_to_dict(self.headers["cookie"])
    secret = self.getSecret(cookies["Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324"])
    self.headers["Secret"] = secret
    base_url = "https://www.kuwo.cn/api/v1/www/music/playUrl"
    # 生成 reqId
    reqid = self.reqid()
    # 构建请求 URL
    url = f"{base_url}?mid={audio_id}&type=music&httpsStatus=1&reqId={reqid}&plat=web_www&from="

    try:
        # 发送 GET 请求
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常
        # 解析数据
        data = response.json()
        audio_url = data.get('data', {}).get('url')

        # 使用 stream 方法获取音频流
        async with self.client.stream("GET", audio_url, headers=self.headers) as audio:
            audio.raise_for_status()  # 如果请求失败则抛出异常

            # 读取流式响应的内容
            audio_content = await audio.aread()

            # 返回音频内容和 MIME 类型
            return True, audio_content
    except Exception as e:
        # 其他错误处理
        return {"error": f"发生错误: {e}"}
