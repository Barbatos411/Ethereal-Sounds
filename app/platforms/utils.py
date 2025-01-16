import sqlite3
import urllib.parse


def ms_to_mmss(ms):
    # 计算总秒数
    total_seconds = ms / 1000
    # 计算分钟和秒
    minutes = int(total_seconds // 60)
    seconds = int(total_seconds % 60)
    return f"{minutes:02}:{seconds:02}"


def s_to_mmss(s):
    # 计算分钟和秒
    minutes = int(s // 60)
    seconds = int(s % 60)
    return f"{minutes:02}:{seconds:02}"


def format_duration(duration_str):
    """
    将格式为 "M:S" 的时间字符串转换为 "MM:SS" 格式。

    :param duration_str: 格式为 "M:S" 的时间字符串
    :return: 格式为 "MM:SS" 的时间字符串
    """
    try:
        # 解析字符串以获取分钟和秒
        minutes, seconds = map(int, duration_str.split(':'))

        # 格式化时间为 MM:SS 格式
        formatted_time = f"{minutes:02}:{seconds:02}"

        return formatted_time
    except ValueError:
        # 如果格式不正确，返回默认值或记录错误信息
        return "00:00"


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


async def search_cookie(platform):
    try:
        # 使用 `with` 语句管理数据库连接
        with sqlite3.connect('app/data/data.db') as conn:
            cursor = conn.cursor()

            # 查询指定平台的 cookie
            cursor.execute("SELECT cookie FROM account WHERE platforms = ?", (platform,))
            result = cursor.fetchone()
            if result:
                print(f"查询到 {platform}")
                return result[0]
            else:
                return None
    except sqlite3.Error as e:
        print(f"数据库操作出现错误: {e}")
        return None
