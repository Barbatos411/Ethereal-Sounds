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
