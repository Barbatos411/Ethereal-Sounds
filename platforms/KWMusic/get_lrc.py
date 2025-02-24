from utils.cookie import cookie_to_dict


async def get_lrc(self, audio_id: str):
    """
    定义抽象地获取歌词方法，每个平台都必须实现
    :param audio_id: 音频链接
    :return: 歌词
    """
    cookies = cookie_to_dict(self.headers["cookie"])
    secret = self.getSecret(cookies["Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324"])
    self.headers["secrt"] = secret
    reqid = self.reqid()
    self.headers["referer"] = f"https://kuwo.cn/play_detail/{audio_id}"
    url = f"https://kuwo.cn/openapi/v1/www/lyric/getlyric?musicId={audio_id}&httpsStatus=1&reqId={reqid}&plat=web_www&from="
    try:
        response = await self.client.get(url, headers=self.headers)
        response.raise_for_status()
        data = response.json()
        lrclist = data.get("data", {}).get("lrclist", [])
        # 替换字段
        for item in lrclist:
            item['text'] = item.pop('lineLyric')
        return lrclist
    except Exception as e:
        return {"error": f"发生错误: {e}"}
