document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('music-search-list');

    songList.addEventListener('click', (event) => {
        // 确定是哪个元素触发了事件
        const target = event.target;

        // 检查点击的目标是否是歌曲标题
        if (target.classList.contains('song-title')) {
            const songUrl = target.getAttribute('data-url');
            const platform = target.getAttribute('data-platform');

            // 发送点击事件到后端
            fetch('/api/log-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({songId: songId})
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Click logged:', data);
                })
                .catch(error => {
                    console.error('Error logging click:', error);
                });
        }
    });
});
