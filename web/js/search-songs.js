export async function searchSongs(platform, keyword, page) {
    console.log('搜索平台:', platform);
    console.log('搜索歌曲:', keyword);
    console.log('搜索页码:', page);
    let data = []; // 初始化 data 变量

    // 使用模板字符串动态生成请求 URL
    const url = `/search?platform=${encodeURIComponent(platform)}&keyword=${encodeURIComponent(keyword)}&page=${page}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json(); // 移除 const 关键字
        console.log('搜索结果:', data);

        // 确保 data.results.song_list 存在并且包含数据
        if (data.results && data.results.song_list && data.results.song_list.length > 0) {
            const list = document.querySelector('.music-search-list');
            if (list) {
                // 清空之前的搜索结果
                list.innerHTML = '';

                const song_title = document.createElement('h3');
                song_title.innerHTML = `
                    <h3 style="color: var(--text-primary); margin: 0; user-select: none">搜索 ${keyword} 结果共 ${data.results.songCount} 首</h3>
                `;
                list.appendChild(song_title);
                // 遍历搜索结果并创建歌曲项
                data.results.song_list.forEach(song => {
                    const songItem = document.createElement('div');
                    songItem.className = 'music-container';
                    songItem.innerHTML = `
                        <div class="music-container-left">
                            <img class="music-cover" src="${song.cover}" alt="cover">
                            <div class="music-name">
                                <h3 style="color: var(--text-primary); margin: 0">${song.title}</h3>
                                <p style="margin: 0">${song.author}</p>
                            </div>
                            <div class="song-tags">
                                ${song.fee === 1 ? '<div class="tag-vip">VIP</div>' : ''}
                                ${song.mvid !== 0 ? '<div class="tag-mv">MV</div>' : ''}
                            </div>
                        </div>
                        ${song.album !== undefined ? `<div class="music-container-center">${song.album}</div>` : ''}
                        <div class="music-container-right">
                            <div class="add-playlist" style="display: flex; align-items: center">
                                <!-- 添加播放列表按钮或其他内容 -->
                            </div>
                            <div class="url" style="display: flex; align-items: center; margin: 10px">
                                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="3vh" height="3vh" viewBox="0 0 24 24" aria-labelledby="linkIconTitle" stroke="var(--text-primary)" stroke-width="1.7142857142857142" stroke-linecap="round" stroke-linejoin="round" fill="none" color="none">
                                    <title id="linkIconTitle">链接</title>
                                    <path d="M10.5,15.5 C10.5,14.1666667 10.5,13.5 10.5,13.5 C10.5,10.7385763 8.26142375,8.5 5.5,8.5 C2.73857625,8.5 0.5,10.7385763 0.5,13.5 C0.5,13.5 0.5,14.1666667 0.5,15.5" transform="rotate(-90 5.5 12)"/>
                                    <path d="M8,12 L16,12"/>
                                    <path d="M23.5,15.5 C23.5,14.1666667 23.5,13.5 23.5,13.5 C23.5,10.7385763 21.2614237,8.5 18.5,8.5 C15.7385763,8.5 13.5,10.7385763 13.5,13.5 C13.5,13.5 13.5,14.1666667 13.5,15.5" transform="rotate(90 18.5 12)"/>
                                </svg>
                            </div>
                            <div style="display: flex; align-items: center; margin: 10px">${song.duration}</div>
                        </div>
                    `;
                    list.appendChild(songItem);
                });
            } else {
                console.error('未找到 .music-search-list 元素');
            }
        } else {
            console.error('搜索结果为空或格式不正确');
        }
    } catch (error) {
        console.error('搜索失败:', error);
    }
}
