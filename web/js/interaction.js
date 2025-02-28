function footer_fold() {
  // 获取.footer元素
  const footer = document.querySelector(".footer");
  const svgElement = document.querySelector(".fold svg");
  // 切换.footer元素的类
  footer.classList.toggle("footer-full-height");
  svgElement.classList.toggle("footer-button-fold");

  const footer_left = document.querySelector(".footer-left");
  footer_left.classList.toggle("footer-left-fold");
}

// 获取列表按钮元素
const list_button = document.getElementById("list-button");
// 为按钮添加点击监听器
list_button.addEventListener("click", list_fold);
// 获取灰色遮罩元素
const darkElement = document.querySelector(".dark-before");
// 为灰色遮罩元素添加点击监听器
darkElement.addEventListener("click", function () {
  if (darkElement.classList.contains("dark")) {
    list_fold();
  }
});
// 为按钮添加点击监听器
function list_fold() {
  // 获取播放列表元素
  const list = document.querySelector(".list");
  // 切换播放列表元素的类
  list.classList.toggle("list-fold");
  // 切换 body 元素的类(灰色遮罩)
  darkElement.classList.toggle("dark");
}

function sidebar_fold() {
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main");
  const h2 = document.querySelector(".title-text");

  // 检查sidebar是否已经折叠
  const isSidebarFolded = sidebar.classList.contains("sidebar-fold");

  if (isSidebarFolded) {
    // 恢复原始状态
    sidebar.style.width = "10rem";
    main.style.width = "calc(100% - 10rem)";
    main.style.left = "10rem";
    h2.style.fontSize = "1.5rem";
  } else {
    // 折叠状态
    sidebar.style.width = "4rem";
    main.style.width = "calc(100% - 4rem)";
    main.style.left = "4rem";
    h2.style.fontSize = "0.1rem";
  }

  // 切换折叠类
  sidebar.classList.toggle("sidebar-fold");
  main.classList.toggle("main-full-width");
}

// 获取容器元素
const platformsContainer = document.querySelector(".platforms-container");

// 定义变量来存储拖动状态和位置
let isDragging = false;
let startX;
let scrollLeft;

// 鼠标按下事件处理函数
platformsContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX - platformsContainer.offsetLeft;
  scrollLeft = platformsContainer.scrollLeft;
});

// 鼠标移动事件处理函数
platformsContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - platformsContainer.offsetLeft;
  const walk = (x - startX) * 1.5; // 调整滚动速度乘数
  platformsContainer.scrollLeft = scrollLeft - walk;
});

// 鼠标松开事件处理函数
platformsContainer.addEventListener("mouseup", () => {
  isDragging = false;
});

// 鼠标离开容器事件处理函数
platformsContainer.addEventListener("mouseleave", () => {
  isDragging = false;
});

// 触摸开始事件处理函数
platformsContainer.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].pageX - platformsContainer.offsetLeft;
  scrollLeft = platformsContainer.scrollLeft;
});

// 触摸移动事件处理函数
platformsContainer.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.touches[0].pageX - platformsContainer.offsetLeft;
  const walk = (x - startX) * 1.5; // 调整滚动速度乘数
  platformsContainer.scrollLeft = scrollLeft - walk;
});

// 触摸结束事件处理函数
platformsContainer.addEventListener("touchend", () => {
  isDragging = false;
});

let WindowisDragging = false;

// 定义一个函数，用于实现窗口拖拽功能
document.addEventListener("DOMContentLoaded", () => {
  // 获取拖拽区域
  const dragArea = document.getElementById("drag-area");

  // 监听鼠标按下事件
  dragArea.addEventListener("mousedown", (event) => {
    // 设置窗口正在拖拽
    WindowisDragging = true;
    // 调用pywebview的api，开始拖拽窗口
    window.pywebview.api.start_drag(event.clientX, event.clientY);
  });

  // 监听鼠标移动事件
  document.addEventListener("mousemove", (event) => {
    // 如果窗口正在拖拽
    if (WindowisDragging) {
      // 调用pywebview的api，移动窗口
      window.pywebview.api.move_window(event.screenX, event.screenY);
    }
  });

  // 监听鼠标松开事件
  document.addEventListener("mouseup", () => {
    // 设置窗口停止拖拽
    WindowisDragging = false;
  });
});

function minimizeWindow() {
  window.pywebview.api.minimize();
}

function toggle_fullscreen() {
  window.pywebview.api.toggle_fullscreen();
}
function closeWindow() {
  window.pywebview.api.hide_to_tray();
}
