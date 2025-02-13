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
