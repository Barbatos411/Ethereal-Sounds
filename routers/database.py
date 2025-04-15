import sqlite3
from typing import List, Literal

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from log import logger
from utils.db import get_data, get_all_data, set_data, delete_data, update_play_status, delete_all_data

router = APIRouter()


@router.get("/get_data")
async def db_get_data(
        database: str = Query("data", description = "数据库"),
        table: str = Query(..., description = "搜索表"),
        keyword: str = Query(..., description = "关键词"),
        select: str = Query(..., description = "返回列"),
        where: str = Query(..., description = "查找列"),
):
    """
    根据指定数据库和表进行数据查询
    """
    logger.info(
        f"调用了 /get_data 接口, 数据库: {database}, 表: {table}, 关键词: {keyword}, 查找列: {where}, 返回列: {select}")
    try:
        results = get_data(database, table, where, keyword, select)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /get_data 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/get_all_data")
async def db_get_all_data(
        database: str = Query("data", description = "数据库"),
        table: str = Query(..., description = "搜索表"),
):
    """
    获取数据表内所有数据
    """
    logger.info(f"调用了 /get_all_data 接口, 数据库: {database}, 表: {table}")
    try:
        results = get_all_data(database, table)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /get_all_data 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/set_data")
async def db_set_data(
        database: str = Query(..., description = "数据库"),
        table: str = Query(..., description = "数据表"),
        where_column: str = Query(..., description = "查找列"),
        keyword: str = Query(..., description = "关键词"),
        set_column: str = Query(..., description = "更新列"),
        value: str = Query(..., description = "更新值")
):
    """
    更新数据表中单个记录的指定列
    """
    logger.info(
        f"调用了 /set_data 接口, 数据库: {database}, 表: {table}, 关键词: {keyword}, 查找列: {where_column}, 更新列: {set_column}, 更新值: {value}")
    try:
        results = set_data(database, table, where_column, keyword, set_column, value)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /set_data 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


# 定义请求体模型
class PlaylistRequest(BaseModel):
    values: List[List]  # 每行数据对应的值
    action: Literal["play", "add"]  # 操作类型：play 或 add


@router.post("/update_playlist")
async def update_playlist(
        audio_id: str = Query(..., description = "歌曲ID"),
        title: str = Query(..., description = "歌名"),
        singer: str = Query(..., description = "歌手"),
        singer_id: str = Query(None, description = "歌手ID"),
        album: str = Query(None, description = "专辑"),
        album_id: str = Query(None, description = "专辑ID"),
        platform: str = Query(..., description = "平台"),
        status: str = Query(None, description = "播放或添加"),
        cover: str = Query(..., description = "封面"),
        hd_cover: str = Query(..., description = "高清封面"),
        MV: str = Query(None, description = "MV"),
        VIP: str = Query(None, description = "VIP")
):
    """
    更新播放列表（专用）。
    - `action` 为 `play` 时：
        - 清除 `status` 列所有内容
        - 然后插入或更新数据
    - `action` 为 `add` 时：
        - 仅插入或更新数据
    """
    logger.info(f"调用了 /update_playlist 接口")
    columns = ["audio_id", "title", "singer", "singer_id", "album",
               "album_id", "platform", "status", "cover", "hd_cover", "MV", "VIP"]

    try:
        with sqlite3.connect(f'data/data.db') as conn:
            cursor = conn.cursor()

            if status == "playing":
                # 清除 status 列内容
                cursor.execute("UPDATE song_list SET status = NULL")

            # 构建 SQL 插入或替换命令
            columns_str = ", ".join(columns)
            placeholders = ", ".join(["?" for _ in columns])
            query = f"INSERT OR REPLACE INTO song_list ({columns_str}) VALUES ({placeholders})"

            # 准备要插入的数据
            data = [
                audio_id, title, singer, singer_id, album, album_id, platform, status, cover, hd_cover, MV, VIP
            ]

            # 执行插入或替换操作
            cursor.execute(query, data)
            conn.commit()

        return {"message": "列表更新成功"}
    except sqlite3.Error as e:
        logger.error(f"调用 /update_playlist 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/update_play_status")
async def db_update_play_status(
        audio_number: str = Query(..., description = "音频序号")
):
    """
    更新音频的播放状态
    """
    logger.info(f"调用了 /update_play_status 接口, 音频序号: {audio_number}")
    try:
        results = update_play_status(audio_number)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /update_play_status 接口失败, 错误信息: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/del_data")
async def db_delete_data(
        database: str = Query(..., description = "数据库"),
        table: str = Query(..., description = "搜索表"),
        keyword: str = Query(..., description = "关键词"),
        where: str = Query(..., description = "查找列"),
):
    """
    删除指定数据库和表中的数据
    """
    logger.info(f"调用了 /del_data 接口, 数据库: {database}, 表: {table}, 关键词: {keyword}, 查找列: {where}")
    try:
        results = delete_data(database, table, keyword, where)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /del_data 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/del_all_data")
async def db_delete_all_data(
        database: str = Query(..., description = "数据库"),
        table: str = Query(..., description = "搜索表"),
):
    """
    删除指定数据库和表中的数据
    """
    logger.info(f"调用了 /del_all_data 接口, 数据库: {database}, 表: {table}")
    try:
        results = delete_all_data(database, table)
        return results
    except sqlite3.Error as e:
        logger.error(f"调用 /del_all_data 接口失败: {str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))
