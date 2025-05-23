async def home(self, page: int = 1):
    """
    生成主页信息
    :return: 主页
    """
    url = f"https://m.kugou.com/plist/index&json=true&page={page}"
    responses = await self.client.get(url, headers = self.headers)
    responses.raise_for_status()
    data = responses.json()
    plist = data.get('plist', {}).get('list', {}).get('info', [])
    albums = [
        {
            "id": album.get("specialid"),
            "cover": album.get("imgurl").replace("{size}", "400"),
            "title": album.get("specialname"),
            "platform": self.id
        }
        for album in plist
    ]
    return {"albums": albums}
