import sqlite3


async def search_cookie(platform):
    conn = None
    try:
        # 连接到数据库
        conn = sqlite3.connect('app/data/data.db')
        cursor = conn.cursor()

        # 查询指定平台的 cookie
        cursor.execute("SELECT cookie FROM account WHERE 平台 = ?", (platform,))
        result = cursor.fetchone()
        if result:
            print(f"查询到 {platform}")
            return result[0]
        else:
            return None
    except sqlite3.Error as e:
        print(f"数据库操作出现错误: {e}")
        return None
    finally:
        if conn:
            conn.close()
