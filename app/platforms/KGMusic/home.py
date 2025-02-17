async def home(self, page: int = 1):
    """
    生成主页信息
    :return: 主页
    """
    url = f"https://m.kugou.com/plist/index&json=true&page={page}"
    try:
        responses = await self.client.get(url, headers=self.headers)
        responses.raise_for_status()
        data = responses.json()
        plist = data.get('plist', {}).get('list', {}).get('info', [])
        tag = None
        categories = None
        albums = [
            {
                "id": album.get("specialid"),
                "cover": album.get("imgurl").replace("{size}", "400"),
                "title": album.get("specialname"),
                "platform": self.id
            }
            for album in plist
        ]
        return {"tag": tag, "categories": categories, "albums": albums}
    except Exception as e:
        return {"error": f"发生错误: {e}"}
