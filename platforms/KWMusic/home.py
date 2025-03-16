from utils.cookie import cookie_to_dict


async def home(self, page: int = 1):
    """
    生成主页信息
    :return: 主页
    """
    cookies = cookie_to_dict(self.headers["cookie"])
    secret = self.getSecret(cookies["Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324"])
    self.headers["Secret"] = secret
    baseurl = f"https://www.kuwo.cn/api/www/classify/playlist/getRcmPlayList"
    url = f"{baseurl}?pn={page}&rn=35&httpsStatus=1&reqId={self.reqid()}&plat=web_www&from="
    responses = await self.client.get(url, headers = self.headers)
    responses.raise_for_status()
    data = responses.json()
    plist = data.get('data', {}).get('data', [])
    albums = [
        {
            "id": album.get("id"),
            "cover": album.get("img"),
            "title": album.get("name"),
            "platform": self.id
        }
        for album in plist
    ]
    return {"albums": albums}
