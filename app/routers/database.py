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


@router.post("/set_batch_data")
async def set_batch_data(
        database: str = Query(..., description="数据库"),
        table: str = Query(..., description="数据表"),
        columns: list = Query(..., description="列名列表（逗号分隔）"),
        values: list = Query(..., description="值列表（每项与列一一对应）")
):
    """
    插入或更新多列记录。

    columns 和 values 示例：
    - columns = ["id", "name", "singer", "platform", "status"]
    - values = [
        (1, "Song1", "Singer1", "Platform1", "active"),
        (2, "Song2", "Singer2", "Platform2", "inactive")
    ]
    """
    if not columns or not values:
        raise HTTPException(
            status_code=400,
            detail="`columns` 和 `values` 必须提供")

    try:
        with sqlite3.connect(f'app/data/{database}.db') as conn:
            cursor = conn.cursor()

            # 构建列名和占位符部分
            # 转换为 "id, name, singer, platform, status"
            columns_str = ", ".join(columns)
            placeholders = ", ".join(
                ["?" for _ in columns])  # 转换为 "?, ?, ?, ?, ?"

            # 生成 SQL 插入或替换命令
            query = f"INSERT OR REPLACE INTO {table} ({columns_str}) VALUES ({placeholders})"

            # 批量插入/更新
            cursor.executemany(query, values)

            conn.commit()
        return {"message": "批量插入或更新成功"}
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
