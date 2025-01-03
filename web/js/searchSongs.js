export async function searchSongs(platform, keyword, page) {
    console.log('搜索平台:', platform);
    console.log('搜索歌曲:', keyword);
    console.log('搜索页码:', page);

    // 使用模板字符串动态生成请求 URL
    const url = `/search?platform=${encodeURIComponent(platform)}&keyword=${encodeURIComponent(keyword)}&page=${page}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('搜索结果:', data);
        // 在这里处理搜索结果
    } catch (error) {
        console.error('搜索失败:', error);
    }
}
