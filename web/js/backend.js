async function displayPlatforms() {
    const response = await fetch('/platforms');
    const data = await response.json();

    const platformsContainer = document.getElementById('platforms-container');

    // 遍历平台名称，生成对应的 <div> 元素
    data.platforms.forEach((platform, index) => {
        // 创建平台的 <div> 元素
        const platformDiv = document.createElement('div');
        platformDiv.className = 'music-platform';
        platformDiv.textContent = platform;

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
}

// 页面加载时显示平台
window.onload = displayPlatforms;
