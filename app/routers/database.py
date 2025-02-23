import sqlite3

from fastapi import APIRouter, Query, HTTPException

from app.utils.db import get_data, get_all_data, set_data, update_playlist, delete_data, update_play_status

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
        results = await get_data(database, table, where, keyword, select)
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
        results = await get_all_data(database, table)
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
        results = await set_data(database, table, where_column, keyword, set_column, value)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update_playlist")
async def db_update_playlist(data):
    """
    更新播放列表（专用）。
    - `action` 为 `play` 时：
        - 清除 `status` 列所有内容
        - 然后插入或更新数据
    - `action` 为 `add` 时：
        - 仅插入或更新数据
    """
    try:
        results = await update_playlist(data)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/update_play_status")
async def db_update_play_status(
        audio_number: str = Query(..., description="音频序号")
):
    try:
        results = await update_play_status(audio_number)
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
        results = await delete_data(database, table, keyword, where)
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
