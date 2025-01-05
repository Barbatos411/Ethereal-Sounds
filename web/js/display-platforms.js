async function displayPlatforms() {
    try {
        const response = await fetch('/platforms');
        const data = await response.json();

        const platformsContainer = document.querySelector('.platforms-container');

        // 按照 id 排序平台
        data.platforms.sort((a, b) => a.id - b.id);

        // 遍历排序后的平台，生成对应的 <div> 元素
        data.platforms.forEach((platform, index) => {
            // 创建平台的 <div> 元素
            const platformDiv = document.createElement('div');
            platformDiv.className = 'music-platform';
            platformDiv.textContent = platform.name;

            // 如果是第一个平台，添加 selected 类
            if (index === 0) {
                platformDiv.classList.add('selected');
            }

            // 添加平台 <div> 元素
            platformsContainer.appendChild(platformDiv);

            // 如果不是最后一个平台，添加一个分隔符
            if (index < data.platforms.length - 1) {
                const separator = document.createElement('p');
                separator.style.color = '#7a7a7b';  // 设置颜色
                separator.textContent = '|';  // 分隔符文本
                separator.style.userSelect = 'none';  // 禁止用户选择文本
                platformsContainer.appendChild(separator);
            }
        });

        console.log('平台元素生成完成'); // 添加调试日志

        // 动态导入 select-platform.js
        import('./select-platform.js')
            .then(module => {
                console.log('select-platform.js 已加载'); // 添加调试日志
            })
            .catch(error => {
                console.error('加载 select-platform.js 时出错:', error); // 添加错误处理
            });
    } catch (error) {
        console.error('生成平台元素时出错:', error); // 添加错误处理
    }
}

// 页面加载时显示平台
window.onload = displayPlatforms;
