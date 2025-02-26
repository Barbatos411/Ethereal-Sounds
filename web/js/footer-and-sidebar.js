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
