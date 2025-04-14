import hashlib
import sqlite3
from pathlib import Path

from tinytag import TinyTag, Image

from config import config

dir_path = config.get('MUSIC_DIR')

audio_extensions = {".mp3", ".m4a", ".flac", ".wav", ".wave", ".ogg", ".wma", ".aiff"}


def make_index(path: str):
    folder_path = Path(path)
    for file_path in folder_path.rglob("*"):
        if file_path.suffix.lower() in audio_extensions:
            file_hash = get_file_hash(file_path)
            # current_files[file_path] = file_hash
            #
            # if file_path in existing_files and existing_files[file_path] == file_hash:
            #     continue  # 跳过未变更文件

            # 解析音频元数据
            audio = TinyTag.get(file_path, image = True)
            title = audio.title
            artist = audio.artist
            album = audio.album
            image: Image | None = audio.images.any
            print(image)
            if image:
                print("封面图片存在")
                with open(f"{file_path}.png", "wb") as f:
                    f.write(image.data)  # 写入封面数据
                print(f"封面已保存: {file_path}")
            else:
                print("封面图片不存在")
            print(f"标题: {title}, 歌手: {artist}, 专辑: {album}, \n 哈希值: {file_hash}")


# 计算文件哈希值（用于检测文件变更）
def get_file_hash(filepath):
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(4096):
            hasher.update(chunk)
    return hasher.hexdigest()


def create_table():
    with sqlite3.connect('data/data.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='local_audio'")
        result = cursor.fetchone()
        if result is None:
            print("表不存在")
            # 创建表
            cursor.execute("""
                    CREATE TABLE IF NOT EXISTS local_audio (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        file_path TEXT UNIQUE,
                        title TEXT,
                        artist TEXT,
                        album TEXT,
                        cover_path TEXT,
                        duration INTEGER,
                        file_hash TEXT
                    )
                """)
        # 提交事务
        conn.commit()
