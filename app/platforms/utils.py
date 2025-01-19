import re
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


async def get_data(database, table, where, keyword, select):
    """
    获取指定数据库和表中的数据
    :param database: 数据库名称
    :param table: 表名称
    :param where: 查找列
    :param keyword: 条件值
    :param select: 返回值
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"SELECT {select} FROM {table} WHERE {where} = ?"
            cursor.execute(query, (keyword,))
            result = cursor.fetchone()

        if result:
            return result[0]
        else:
            print(f"未找到匹配的记录: {where} = {keyword}")
            return None
    except sqlite3.Error as e:
        print(f"数据库操作出现错误: {e}")
        return None


def remove_metadata(lyric):
    # 使用正则表达式去除歌词中的元数据
    lyric = re.sub(r"\[.*?\]", "", lyric).strip()  # 去除所有方括号中的内容
    return lyric


def merge_lyrics_and_translation(lyric, trans):
    # 使用正则表达式获取时间戳与歌词
    lyric_lines = re.findall(r"\[([0-9:.]+)\](.*?)\n", lyric)
    trans_lines = re.findall(r"\[([0-9:.]+)\](.*?)\n", trans)

    # 使用字典按时间戳映射每个歌词行
    lyrics_dict = {time: line for time, line in lyric_lines}
    trans_dict = {time: line for time, line in trans_lines}

    # 合并结果：每一句歌词配上一句翻译
    merged_lines = []
    for time in lyrics_dict:
        lyric_line = lyrics_dict[time]
        trans_line = trans_dict.get(time, '')
        merged_lines.append(f"{lyric_line}\n{trans_line}")

    return "\n".join(merged_lines).replace("//", "")
