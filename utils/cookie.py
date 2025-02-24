import sqlite3
import urllib.parse


def cookie_to_dict(cookie_string: str):
    """
    将 Cookie 字符串解析为 Python 字典格式。

    :param cookie_string: str, 输入的 Cookie 字符串
    :return: dict, 可通过 .get() 访问的字典
    """
    # 用分号分割多个键值对
    cookie_parts = cookie_string.split(';')

    # 存储结果的字典
    cookie_dict = {}

    for part in cookie_parts:
        # 清理多余的空格
        part = part.strip()
        # 确保键值对合法
        if '=' in part:
            key, value = part.split('=', 1)
            # 对 URL 编码的内容进行解码
            cookie_dict[key] = urllib.parse.unquote(value)

    return cookie_dict


def get_cookie(platform):
    try:
        # 使用 `with` 语句管理数据库连接
        with sqlite3.connect('data/data.db') as conn:
            cursor = conn.cursor()

            # 查询指定平台的 cookie
            cursor.execute(
                "SELECT cookie FROM account WHERE platforms = ?", (platform,))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                return None
    except sqlite3.Error as e:
        print(f"数据库操作出现错误: {e}")
        return None
