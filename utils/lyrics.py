import re


def parse_lrc(original_lrc, translation_lrc=None):
    time_pattern = re.compile(r'\[(\d{2}):(\d{2}\.\d{2,3})\]')

    def parse_lines(lrc_text):
        lines = lrc_text.strip().split('\n') if lrc_text else []
        lrc_dict = {}
        for line in lines:
            matches = time_pattern.findall(line)
            lyric_text = time_pattern.sub('', line).strip()
            for match in matches:
                time = round(int(match[0]) * 60 + float(match[1]), 2)
                lrc_dict[time] = lyric_text
        return lrc_dict

    original_dict = parse_lines(original_lrc)
    translation_dict = parse_lines(translation_lrc) if translation_lrc else {}

    merged_lyrics = []
    for time, text in sorted(original_dict.items()):
        line = {"time": time, "text": text}
        translation_text = translation_dict.get(time)
        # 如果翻译存在且非空字符串，才加入 translation 字段
        if translation_text and translation_text.strip():
            line["translation"] = translation_text
        merged_lyrics.append(line)

    return merged_lyrics
