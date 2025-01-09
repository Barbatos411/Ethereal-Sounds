document.addEventListener("DOMContentLoaded", () => {
  const songList = document.getElementById("music-search-list");

  songList.addEventListener("click", (event) => {
    // 确定是哪个元素触发了事件
    const target = event.target;

    // 检查点击的目标是否是歌曲标题
    if (target.classList.contains("song-title")) {
      const songUrl = target.getAttribute("data-url");
      const platform = target.getAttribute("data-platform");
    }
  });
});
