// 从数据库获取主题数据
fetch(
  "/get_data?database=data&table=settings&where=project&select=value&keyword=主题"
)
  .then((response) => response.json()) // 将响应转换为JSON
  .then((data) => {
    const themeFile = document.createElement("link");
    themeFile.rel = "stylesheet";
    themeFile.id = "theme-link";
    if (data.value === "白") {
      // 修正比较操作符
      themeFile.href = "css/theme-bright.css";
    } else {
      themeFile.href = "css/theme-dark.css";
    }
    document.head.appendChild(themeFile); // 将link元素添加到head中
  })
  .catch((error) => console.error("Error fetching theme data:", error)); // 处理错误

document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById("theme");

  themeToggleBtn.addEventListener("click", function () {
    const themeLink = document.getElementById("theme-link");
    if (themeLink.href.includes("theme-bright.css")) {
      fetch(
        "/set_data?database=data&table=settings&where_column=project&set_column=value&keyword=主题&value=黑"
      )
        .then(() => {
          // 添加 then 处理 fetch 请求
          themeLink.href = "css/theme-dark.css";
        })
        .catch((error) => console.error("Error updating theme:", error)); // 处理 fetch 错误
    } else {
      fetch(
        "/set_data?database=data&table=settings&where_column=project&set_column=value&keyword=主题&value=白"
      )
        .then(() => {
          // 添加 then 处理 fetch 请求
          themeLink.href = "css/theme-bright.css";
        })
        .catch((error) => console.error("Error updating theme:", error)); // 处理 fetch 错误
    }
  });
});
