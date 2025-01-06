import {searchSongs} from './search-songs.js';

// 获取搜索框元素
const searchInput = document.getElementById("searchInput");

// 获取所有平台元素
const platforms = document.querySelectorAll('.music-platform');
console.log('平台元素数量:', platforms.length); // 添加调试日志

// 为每个平台添加点击事件监听器
platforms.forEach((platform) => {
    platform.addEventListener('click', () => {
        // 移除所有平台的 selected 类
        platforms.forEach((p) => {
            p.classList.remove('selected');
        });

        // 为被点击的平台添加 selected 类
        platform.classList.add('selected');
        console.log('已选择平台:', platform.textContent); // 添加调试日志

        // 获取搜索框的值并执行搜索
        const query = searchInput.value.trim();
        if (query) {
            searchSongs(platform.textContent, query, 1);
        }
    });
});

// 为输入框添加 keydown 事件监听器
searchInput.addEventListener('keydown', handleEnterKeyPress);

// 监听搜索框的回车事件
function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        const selectedPlatform = document.querySelector('.music-platform.selected');
        if (selectedPlatform && query) {
            searchSongs(selectedPlatform.textContent, query, 1);
        }
    }
}
