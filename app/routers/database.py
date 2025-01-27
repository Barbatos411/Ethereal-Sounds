import sqlite3
from typing import List, Literal

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

router = APIRouter()


@router.get("/get_data")
async def get_data(
        database: str = Query("data", description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        select: str = Query(..., description="返回列"),
        where: str = Query(..., description="查找列"),
):
    """
    根据指定数据库和表进行数据查询
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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_all_data")
async def get_all_data(
        database: str = Query("data", description="数据库"),
        table: str = Query(..., description="搜索表"),
):
    """
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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/set_data")
async def set_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="数据表"),
        where_column: str = Query(..., description="查找列"),
        keyword: str = Query(..., description="关键词"),
        set_column: str = Query(..., description="更新列"),
        value: str = Query(..., description="更新值")
):
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
        raise HTTPException(status_code=500, detail=str(e))


# 定义请求体模型
class PlaylistRequest(BaseModel):
    values: List[List]  # 每行数据对应的值
    action: Literal["play", "add"]  # 操作类型：play 或 add


@router.post("/update_playlist")
async def update_playlist(data: PlaylistRequest):
    """
    更新播放列表（专用）。
    - `action` 为 `play` 时：
        - 清除 `status` 列所有内容
        - 然后插入或更新数据
    - `action` 为 `add` 时：
        - 仅插入或更新数据
    """
    columns = ["id", "name", "singer", "platform", "status", "cover"]
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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/del_data")
async def delete_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        where: str = Query(..., description="查找列"),
):
    """
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
        raise HTTPException(status_code=500, detail=str(e))
