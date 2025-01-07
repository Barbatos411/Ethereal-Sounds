function footer_fold() {
    // 获取.footer元素
    const footer = document.querySelector('.footer');
    const svgElement = document.querySelector('.fold svg');
    // 切换.footer元素的类
    footer.classList.toggle('footer-full-height');
    svgElement.classList.toggle('footer-button-fold');
}

function sidebar_fold() {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    const h2 = document.getElementById('title');

    // 检查sidebar是否已经折叠
    const isSidebarFolded = sidebar.classList.contains('sidebar-fold');

    if (isSidebarFolded) {
        // 恢复原始状态
        sidebar.style.width = '200px';
        main.style.width = 'calc(100% - 200px)';
        main.style.left = '200px';
        if (h2) {
            h2.style.display = 'block'; // 恢复h2显示
        }
    } else {
        // 折叠状态
        sidebar.style.width = '60px';
        main.style.width = 'calc(100% - 80px)';
        main.style.left = '80px';
        if (h2) {
            h2.style.display = 'none'; // 隐藏h2
        }
    }

    // 切换折叠类
    sidebar.classList.toggle('sidebar-fold');
    main.classList.toggle('main-full-width');
}
