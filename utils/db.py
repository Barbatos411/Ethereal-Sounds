import sqlite3


def create_sqlite_db():
    """
    创建数据库
    """

    # 创建数据库文件
    with sqlite3.connect('data/data.db') as conn:
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


def get_data(database, table, where, keyword, select):
    """
    获取指定数据库和表中的数据
    :param database: 数据库名称
    :param table: 表名称
    :param where: 查找列
    :param keyword: 条件值
    :param select: 返回值
    """
    with sqlite3.connect(f'data/{database}.db') as conn:
        cursor = conn.cursor()
        # 使用参数化查询防止SQL注入
        query = f"SELECT {select} FROM {table} WHERE {where} = ?"
        cursor.execute(query, (keyword,))
        result = cursor.fetchone()

    if result:
        return {"value": result[0]}
    else:
        return {"error": "未找到匹配的记录"}


def get_all_data(database: str, table: str):
    """
    param database: 数据库名称
    param table: 表名称
    return: 所有数据
    获取数据表内所有数据
    """
    with sqlite3.connect(f'data/{database}.db') as conn:
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


def set_data(database: str, table: str, where_column: str, keyword: str,
             set_column: str, value: str):
    """
    更新数据表中单个记录的指定列
    """
    with sqlite3.connect(f'data/{database}.db') as conn:
        cursor = conn.cursor()
        # 使用参数化查询防止SQL注入
        query = f"INSERT OR REPLACE INTO {table} ({where_column}, {set_column}) VALUES (?, ?);"
        cursor.execute(query, (keyword, value))
        conn.commit()
    return {"message": "单个记录更新成功"}


def update_data(
        database: str, table: str, where_column: str, keyword: str,
        set_column: str, value: str
) -> dict:
    """
    仅执行UPDATE操作，若记录不存在则抛出异常
    """
    with sqlite3.connect(f"data/{database}.db") as conn:
        cursor = conn.cursor()

        # 预检记录是否存在
        cursor.execute(
            f"SELECT 1 FROM {table} WHERE {where_column} = ?", (keyword,)
        )
        if not cursor.fetchone():
            raise ValueError(f"未找到 {where_column}={keyword} 的记录")

        # 执行更新操作
        query = f"""
            UPDATE {table}
            SET {set_column} = ?
            WHERE {where_column} = ?
        """
        cursor.execute(query, (value, keyword))

        if cursor.rowcount == 0:
            raise RuntimeError("更新失败，未影响任何记录")

        conn.commit()
    return {"message": "更新成功", "affected_rows": cursor.rowcount}


def delete_data(database: str, table: str, keyword: str, where: str):
    """
    param database: 数据库名称
    param table: 表名称
    param keyword: 条件值
    param where: 查找列
    删除指定数据库和表中的数据
    """
    with sqlite3.connect(f'data/{database}.db') as conn:
        cursor = conn.cursor()
        # 使用参数化查询防止SQL注入
        query = f"DELETE FROM {table} WHERE {where} = ?"
        cursor.execute(query, (keyword,))
        conn.commit()  # 提交事务以保存更改

    return {"message": "记录已删除"}


def update_play_status(index: str):
    with sqlite3.connect(f'data/data.db') as conn:
        cursor = conn.cursor()
        # 清除 status 列内容
        cursor.execute("UPDATE song_list SET status = NULL")
        cursor.execute(f"UPDATE song_list SET status = 'playing' WHERE id = {index}")
        conn.commit()
    return {"message": "播放状态更新成功"}


def delete_all_data(database: str, table: str):
    """
    删除指定数据库和表中的所有数据并重置自增主键
    :param database: 数据库名称
    :param table: 表名称
    """
    with sqlite3.connect(f'data/{database}.db') as conn:
        cursor = conn.cursor()
        # 删除表内所有数据
        query = f"DELETE FROM {table}"
        cursor.execute(query)
        # 重置自增主键
        cursor.execute(f"DELETE FROM sqlite_sequence WHERE name = '{table}'")
        conn.commit()  # 提交事务以保存更改

    return {"message": "所有记录已删除且自增主键已重置"}
