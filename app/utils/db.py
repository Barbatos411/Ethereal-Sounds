import sqlite3
from typing import List, Literal

from pydantic import BaseModel


def create_sqlite_db():
    """
    创建数据库
    """

    # 创建数据库文件
    with sqlite3.connect('app/data/data.db') as conn:
        cursor = conn.cursor()
        cursor.executescript("""
            -- 播放列表
            create table song_list(
                id    INTEGER
                    primary key autoincrement,
                audio_id        TEXT not null
                    unique,
                platform  TEXT not null,
                title      TEXT not null,
                singer    TEXT,
                singer_id TEXT,
                album     TEXT,
                album_id  TEXT,
                status    TEXT,
                cover     TEXT not null,
                hd_cover TEXT not null,
                MV        TEXT,
                VIP        TEXT,
                play_count       INTEGER
            );
            -- 账号数据
            create table account(
                platforms TEXT not null
                    primary key,
                cookie    text not null
            );
            -- 配置数据
            create table settings(
                project TEXT not null
                    primary key,
                value   TEXT not null
            )
            without rowid;
        """)
        # 提交事务
        conn.commit()
    print("✅ 数据库创建成功！")


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
            return {"value": result[0]}
        else:
            return {"error": "未找到匹配的记录"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}


async def get_all_data(database: str, table: str):
    """
    param database: 数据库名称
    param table: 表名称
    return: 所有数据
    获取数据表内所有数据
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()

            # 查询表数据并防止 SQL 注入
            query = f"SELECT * FROM {table}"
            cursor.execute(query)

            # 获取所有数据
            rows = cursor.fetchall()

            # 获取表字段名
            column_names = [desc[0] for desc in cursor.description]

            # 组合字段名和数据生成 JSON
            result = [dict(zip(column_names, row)) for row in rows]

        if result:
            return {"data": result}
        else:
            return {"error": "未找到匹配的记录"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}


def set_data(database: str, table: str, where_column: str, keyword: str,
             set_column: str, value: str):
    """
    更新数据表中单个记录的指定列
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"INSERT OR REPLACE INTO {table} ({where_column}, {set_column}) VALUES (?, ?);"
            cursor.execute(query, (keyword, value))
            conn.commit()
        return {"message": "单个记录更新成功"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}


# 定义请求体模型
class PlaylistRequest(BaseModel):
    values: List[List]  # 每行数据对应的值
    action: Literal["play", "add"]  # 操作类型：play 或 add


async def update_playlist(data: PlaylistRequest):
    """
    更新播放列表（专用）。
    - `action` 为 `play` 时：
        - 清除 `status` 列所有内容
        - 然后插入或更新数据
    - `action` 为 `add` 时：
        - 仅插入或更新数据
    """
    columns = ["audio_id", "title", "singer", "singer_id", "album",
               "album_id", "platform", "status", "cover", "hd_cover", "MV", "VIP"]
    try:
        with sqlite3.connect(f'app/data/data.db') as conn:
            cursor = conn.cursor()

            if data.action == "play":
                # 清除 status 列内容
                cursor.execute("UPDATE song_list SET status = NULL")

            # 构建 SQL 插入或替换命令
            columns_str = ", ".join(columns)
            placeholders = ", ".join(["?" for _ in columns])
            query = f"INSERT OR REPLACE INTO song_list ({columns_str}) VALUES ({placeholders})"

            # 批量插入/更新
            cursor.executemany(query, data.values)
            conn.commit()

        action_result = "播放" if data.action == "play" else "添加"
        return {"message": f"{action_result}列表更新成功"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}


async def delete_data(database: str, table: str, keyword: str, where: str):
    """
    param database: 数据库名称
    param table: 表名称
    param keyword: 条件值
    param where: 查找列
    删除指定数据库和表中的数据
    """
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"DELETE FROM {table} WHERE {where} = ?"
            cursor.execute(query, (keyword,))
            conn.commit()  # 提交事务以保存更改

        return {"message": "记录已删除"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}


async def update_play_status(audio_number: str):
    try:
        with sqlite3.connect(f'app/data/data.db') as conn:
            cursor = conn.cursor()
            # 清除 status 列内容
            cursor.execute("UPDATE song_list SET status = NULL")
            cursor.execute(f"UPDATE song_list SET status = 'playing' WHERE number = {audio_number}")
            conn.commit()
        return {"message": "播放状态更新成功"}
    except sqlite3.Error as e:
        return {f"数据库操作出现错误: {e}"}
