async def home(self, page: int = 1):
    """
    生成主页信息
    :return: 主页
    """
    url = f"https://www.bilibili.com/audio/music-service-c/web/menu/hit?ps=35&pn={page}"
    responses = await self.client.get(url, headers = self.headers)
    responses.raise_for_status()
    data = responses.json()
    plist = data.get('data', {}).get('data', [])
    albums = [
        {
            "id": album.get("menuId"),
            "cover": album.get("cover"),
            "title": album.get("title"),
            "platform": self.id
        }
        for album in plist
    ]
    return {"albums": albums}
