import sqlite3

from fastapi import APIRouter, Query, HTTPException

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
        keyword: str = Query(None, description="关键词"),
        set_column: str = Query(..., description="更新列"),
        value: str = Query(None, description="更新值"),
        value_list: list = Query(None, description="批量值")
):
    """
    根据指定数据库和表进行数据更新或插入
    value_list规范:
    value_list = [
        ("key1", "value1"),
        ("key2", "value2"),
    ]
    """
    # 参数验证
    if value and value_list:
        raise HTTPException(status_code=400,
                            detail="`value` 和 `value_list` 不能同时提供")
    if not value and not value_list:
        raise HTTPException(status_code=400, detail="缺少参数")
    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()
            # 使用参数化查询防止SQL注入
            query = f"INSERT OR REPLACE INTO {table} ({where_column}, {set_column}) VALUES (?, ?);"
            if keyword and value:
                # 单条更新
                cursor.execute(query, (keyword, value))
                return {"message": "数据更新成功"}
            elif value_list:
                # 批量更新
                cursor.executemany(query, value_list)
                return {"message": "数据更新成功"}
            conn.commit()
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
