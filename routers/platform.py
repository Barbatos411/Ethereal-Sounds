from fastapi import APIRouter, Query, HTTPException, Response

from log import logger
from platforms.platform_manager import platform_manager

router = APIRouter()


@router.get("/platforms")
async def get_platforms():
    """
    返回支持的平台名称
    :return: 平台名称列表
    """
    logger.info("调用了 /get_platforms 接口")
    platforms = platform_manager.get_all_platforms()

    platforms = [item for item in platforms if item['id'] != 'Local']
    # 根据 order 排序
    sorted_platforms = sorted(platforms, key = lambda x: x['order'])

    return {"platforms": sorted_platforms}


@router.get("/search")
async def search_song(
        keyword: str = Query(..., description = "搜索关键词"),
        platform: str = Query(..., description = "搜索平台"),
        page: int = Query(1, description = "分页")
):
    """
    根据指定平台和关键词进行歌曲搜索
    """
    logger.info(f"调用了 /search 接口, 平台: {platform}, 关键词: {keyword}, 页码: {page}")
    # 根据平台名称找到对应的平台类
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)
        results = await platform_obj.search(keyword, page)
        return {"platform": platform, "results": results}
    except ValueError as e:
        logger.error(f"搜索失败：{str(e)}")
        raise HTTPException(status_code = 400, detail = str(e))
    except Exception as e:
        logger.error(f"搜索失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/get_audio")
async def get_audio(
        platform: str = Query(..., description = "搜索平台"),
        audio_id: str = Query(..., description = "歌曲ID")
):
    """
    根据指定平台和关键词进行歌曲音频获取
    """
    logger.info(f"调用了 /get_audio 接口, 平台: {platform}, 歌曲ID: {audio_id}")

    # 根据平台名称找到对应的平台类
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)
        bool_value, content = await platform_obj.get_audio(audio_id)
        if bool_value:
            return Response(content = content,
                            media_type = "audio/mpeg",
                            headers = {
                                "Content-Disposition": "inline",
                                "Accept-Ranges": "bytes"}  # 提示浏览器为直接播放
                            )
        else:
            return {"audio_url": content}
    except Exception as e:
        logger.error(f"获取音频失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/get_lrc")
async def get_lrc(
        platform: str = Query(..., description = "搜索平台"),
        audio_id: str = Query(..., description = "歌曲ID")
):
    """
    根据指定平台和关键词进行歌曲歌词获取
    """
    logger.info(f"调用了 /get_lrc 接口, 平台: {platform}, 歌曲ID: {audio_id}")
    # 根据平台名称找到对应的平台类
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)
        results = await platform_obj.get_lrc(audio_id)
        return {"results": results}
    except Exception as e:
        logger.error(f"获取歌词失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/home")
async def home(
        platform: str = Query(..., description = "搜索平台"),
        categories: str = Query(None, description = "分类"),
        page: int = Query(1, description = "分页")
):
    """
    根据指定平台获取主页
    """
    logger.info(f"调用了 /home 接口, 平台: {platform}, 分类: {categories}, 页码: {page}")
    # 根据平台名称找到对应的平台类
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)

        # 构建 kwargs，只在 categories 被传入时才添加
        kwargs = {"page": page}
        if categories is not None:
            kwargs["categories"] = categories

        results = await platform_obj.home(**kwargs)
        return {"results": results}
    except Exception as e:
        logger.error(f"获取主页失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/login")
async def login(
        platform: str = Query(..., description = "登录平台"),
        method: str = Query(..., description = "登录方式"),
        username: str = Query(..., description = "用户名/手机号"),
        password: str = Query(..., description = "密码/验证码"),
        code: str = Query(None, description = "cookie")
):
    """
    根据指定平台和登录方式进行登录
    """
    logger.info(f"调用了 /login 接口, 平台: {platform}")
    # 根据平台名称找到对应的平台类
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)
        results = await platform_obj.login(platform, method, username, password, code)
        return {"results": results}
    except Exception as e:
        logger.error(f"登录失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))


@router.get("/album")
async def album(
        platform: str = Query(..., description = "搜索平台"),
        album_id: str = Query(..., description = "搜索关键词")
):
    """
    生成专辑页面
    """
    logger.info(f"调用了 /album 接口, 平台: {platform}, 专辑ID: {album_id}")
    try:
        platform_obj = platform_manager.get_platform_by_id(platform)
        results = await platform_obj.album(album_id)
        return {"results": results}
    except Exception as e:
        logger.error(f"获取专辑失败：{str(e)}")
        raise HTTPException(status_code = 500, detail = str(e))
