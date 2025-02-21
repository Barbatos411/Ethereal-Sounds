from bs4 import BeautifulSoup


async def home(self, page: int = 1, categories: str = "全部"):
    """
    生成主页信息
    :return: 主页
    """
    offset = (page - 1) * 35  # 计算偏移量
    url = f"https://music.163.com/discover/playlist/?order=hot&cat={categories}&limit=35&offset={offset}"

    try:
        responses = await self.client.get(url, headers=self.headers)
        responses.raise_for_status()
        data = responses.text
        soup = BeautifulSoup(data, 'html.parser')
        # 标签和分类
        categories_list = soup.find_all('dl', attrs={'class': 'f-cb'})
        categories = [
            {
                "title": category.find('dt').text,
                "children": [
                    {
                        "title": item.text,
                        "link": f"/home?platform=NetEase&categories={item.text}"
                    }
                    for item in category.find_all('a')
                ]
            }
            for category in categories_list
        ]

        tag = [{"title": "全部", "link": "/home?platform=NetEase&categories=全部"}]
        for i in categories[1]["children"][:9]:
            tag.append(i)

        # 歌单列表
        playlist_items = soup.find_all('div', attrs={'class': 'u-cover u-cover-1'})
        albums = [
            {
                "id": album.find('a', class_='msk')['href'][13:],
                "cover": album.find('img')['src'].replace('?param=140y140', '?param=512y512'),
                "title": album.find('a', class_='msk')['title'],
                "platform": self.id
            }
            for album in playlist_items
        ]
        return {"tag": tag, "categories": categories, "albums": albums}

    except Exception as e:
        return {"error": f"发生错误: {e}"}
