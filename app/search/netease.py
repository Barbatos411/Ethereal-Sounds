import httpx
from app.search.base import BaseSearch

class NeteaseSearch(BaseSearch):
    name = "网易云音乐"  # 平台名称
    key = "netease"  # 平台唯一标识
    id = 1 #顺序

    def __init__(self):
        self.client = httpx.AsyncClient()
        self.base_url = "https://music.163.com/api/search/pc"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
            "cookie": "NMTID=00OP9sdh2aR_Wgdm0FVkQNDsQDiT0EAAAGQ4xKa6A; WEVNSM=1.0.0; WNMCID=faceav.1721796578008.01.0; ntes_kaola_ad=1; ntes_utid=tid._.obBSVWZALA5AVwAQQQeDUKhOVhiBkszt._.0; sDeviceId=YD-8814a%2B%2F43fJFEhERRQbHEa0fB0jUksmu; _ntes_nnid=968ee4c3e41127892d40e5945650d9b5,1722187713406; _ntes_nuid=968ee4c3e41127892d40e5945650d9b5; WM_TID=9jTMihep0tBARURERRPDULkbAliQgdXI; __snaker__id=VnBfBLjy0yROlwY6; nts_mail_user=gmy13120250072@163.com:-1:1; _iuqxldmzr_=32; NTES_CMT_USER_INFO=309265830%7C%E6%9C%89%E6%80%81%E5%BA%A6%E7%BD%91%E5%8F%8B0irMmC%7Chttps%3A%2F%2Fcms-bucket.nosdn.127.net%2F2018%2F08%2F13%2F078ea9f65d954410b62a52ac773875a1.jpeg%7Cfalse%7CZ215MTMxMjAyNTAwNzJAMTYzLmNvbQ%3D%3D; NTES_P_UTID=NoZ2dlDtsUqRIuzU4c6NXaF5aalveKFl|1734529837; NTES_PASSPORT=TJwY97N..OY9riZNrBSYqSf0_NOQ0mvgk9sWoUT8ZcSNO1zGOBYERDJNq1VkHnY3Nl6EDyIUXfb1.jt7PFGyTGLZykO2.GXnw19IiY4Jg4ADbAeCnbEm7ogzqi_8YoSWDdubBdbbuWoKki9uGi_DKVKPIEFm1dT_qLFcg9EPXHM.iX07xRLyMFnz.UeDpGbqU; P_INFO=gmy13120250072@163.com|1734529837|1|mail163|00&99|hen&1732245445&mail163#CN&null#10#0#0|&0|mail163&newsclient|gmy13120250072@163.com; WM_NI=Ol%2F36zColATkWkst%2BxYiARlYkf65GaqrqpyJW8hv7egFOx6R65ycjsXZX%2BPO%2B8gEEfZDBt2Lik%2FS%2Fqo0kw1N9QBlCCKfyCt02IlNxWgMfFi2r0%2FsuN%2FHcC7xNf1ro21xT0c%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eea9c76383be9aa4f14687ac8ab3d44f868a8eadd64292b8f88ef06591ebffb4cc2af0fea7c3b92a8db4e1d4b57281b1a4a2d76195b5bd95aa749bb78fb3ef53a9bafad6c66bb3aebf91fc4295e8a897b66fa59a8199b55af6ebb784e9799c8698ccd345e9e8a9a6c86e9a9c8e95b148abb5e1b4ae7badf0a598b446fb8f8e8dc24989bab7a4f73cf297a4affb5da593aaa7ec3ab2f0e194f846ed98ada4b6748ebaff93ee3af3a89cd1e237e2a3; gdxidpyhxdE=6KZw0B8M4tZuHW%2F4jgHTwolwCgZ3i60CMnW8UGHd4yTAO8HgG1vPwvQhi2ncunLqYqlkjT9ID90CRAqrc9bZBfojeSgQx4HBw4tjqXPPjiyliEaWPJxk4HelZQt0%2BMafO92AD2G3NifviXprd0aYxccrAHT0gqXainKJir61rofglCT8%3A1735818915647; JSESSIONID-WYYY=lS1H8Tmz%2B%2FZ4zn%2BIN%2B5dHWPxOo9cagvzV84HOCOJpn4BjwsYZt8Euzx33FWH%2BT8aG9JlPMerVsd%5CFZjP4KHA7hknEjAGcbQKVkzjb6N%2FPxRueetemhZ2ojdiRa1XtgQ%2Fzmm3sHfdxGTftTpOipJm0lzErmo6nX3%2B4hvhTXUJ9OF2Z%2B4f%3A1735819861676"

        }

    async def search(self, keyword: str, page: int = 1, limit: int = 20):
        """实现搜索功能，支持分页"""
        offset = (page - 1) * limit  # 计算偏移量

        search_url = f"{self.base_url}?s={keyword}&offset={offset}&limit={limit}&type=1"

        try:
            # 发起请求
            response = await self.client.get(search_url, headers=self.headers)
            response.raise_for_status()  # 如果请求失败则抛出异常

            # 解析数据
            data = response.json()

            # 假设返回的格式符合以下结构
            songs = data.get("result", {}).get("songs", [])
            songCount = data.get("result", {}).get("songCount", 0) # 歌曲总数
            song_list = [
                {
                    "name": song["name"], # 歌曲名称
                    "status": song["status"], # 歌曲状态，1为正常，-1未知
                    "artist": ", ".join(artist["name"] for artist in song.get("artists", [])), # 歌手
                    "url": f"https://music.163.com/song?id={song['id']}",  # 歌曲链接
                    "cover": song["album"].get("picUrl", ""),  # 歌曲封面图片
                    "album": song["album"]["name"],  # 专辑名称
                    "fee": song["fee"],  # 付费状态8为免费，1为VIP
                    "mvid": song["mvid"]  # 歌曲MV,0表示无MV,MV地址：https://music.163.com/#/mv?id=
                }
                for song in songs
            ]
            return songCount, song_list
        except httpx.RequestError as e:
            # 错误处理
            return {"error": f"请求失败: {e}"}
        except Exception as e:
            # 其他错误处理
            return {"error": f"发生错误: {e}"}
