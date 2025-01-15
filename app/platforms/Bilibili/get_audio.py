import httpx


async def get_audio(self, audio_id: str):
    """
    实现获取音频功能
    :param self: 平台类
    :param audio_id: 音频id
    :return: 音频文件/链接，歌词
    """
    bvid = audio_id.strip('"')
    url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"

    try:
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()  # 如果请求失败则抛出异常
        data = response.json()
        audio_url = f"https://api.bilibili.com/x/player/playurl?fnval=16&bvid={bvid}&cid={data.get('data', {}).get('pages', [{}])[0].get('cid', '')}"
        try:
            response = await self.client.get(audio_url, headers=self.headers)
            response.raise_for_status()  # 如果请求失败则抛出异常
            data = response.json()
            audio_url = data.get(
                'data', {}).get(
                'dash', {}).get(
                'audio', [
                    {}])[0].get(
                'baseUrl', '')
            return {"final_audio_url": audio_url}
        except httpx.RequestError as e:
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            return {"error": f"发生错误: {e}"}
    except httpx.RequestError as e:
        return {"error": f"请求失败: {e}"}
    except Exception as e:
        return {"error": f"发生错误: {e}"}
