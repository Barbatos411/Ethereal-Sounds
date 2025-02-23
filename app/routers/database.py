import sqlite3
from typing import List, Literal

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from app.utils.db import get_data, get_all_data, set_data, delete_data, update_play_status

router = APIRouter()


@router.get("/get_data")
async def db_get_data(
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
        results = get_data(database, table, where, keyword, select)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_all_data")
async def db_get_all_data(
        database: str = Query("data", description="数据库"),
        table: str = Query(..., description="搜索表"),
):
    """
    获取数据表内所有数据
    """
    try:
        results = get_all_data(database, table)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/set_data")
async def db_set_data(
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
        results = set_data(database, table, where_column, keyword, set_column, value)
        return results
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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/update_play_status")
async def db_update_play_status(
        audio_number: str = Query(..., description="音频序号")
):
    try:
        results = update_play_status(audio_number)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/del_data")
async def db_delete_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="搜索表"),
        keyword: str = Query(..., description="关键词"),
        where: str = Query(..., description="查找列"),
):
    """
    删除指定数据库和表中的数据
    """
    try:
        results = delete_data(database, table, keyword, where)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
