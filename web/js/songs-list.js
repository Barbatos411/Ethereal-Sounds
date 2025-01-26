// 获取播放列表并生成到页面
async function fetchAndRenderPlaylist() {
  try {
    // 请求后端获取播放列表数据
    const response = await fetch("/get_all_data?database=data&table=song_list");
    if (!response.ok) {
      throw new Error(`获取播放列表失败，状态码: ${response.status}`);
    }

    // 解析 JSON 数据
    const data = await response.json();
    const playlist = data.data;

    // 获取播放列表容器
    const listContainer = document.querySelector(".list-content");
    listContainer.innerHTML = ""; // 清空原有内容

    // 动态生成 HTML 并重新编号序号
    playlist.forEach((song, index) => {
      const isPlaying = song.status === "playing";
      const songElement = document.createElement("div");
      songElement.className = isPlaying
        ? "list-container list-container-playing"
        : "list-container";

      songElement.innerHTML = `
        <div class="list-container-title">
          <h4>${index + 1}</h4> <!-- 前端生成新的序号 -->
          <h4>${song.name}</h4>
        </div>
        <p>${song.singer}</p>
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="1.25rem"
          height="1.25rem"
          viewBox="0 0 24 24"
          aria-labelledby="binIconTitle"
          stroke="var(--text-primary)"
          stroke-width="1.7142857142857142"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          color="#000"
          onclick="deleteSong(${song.order})" <!-- 删除按钮调用删除函数 -->
        >
          <title id="binIconTitle">删除</title>
          <path d="M19 6L5 6M14 5L10 5M6 10L6 20C6 20.6666667 6.33333333 21 7 21 7.66666667 21 11 21 17 21 17.6666667 21 18 20.6666667 18 20 18 19.3333333 18 16 18 10"/>
        </svg>
      `;

      // 将生成的歌曲元素插入容器中
      listContainer.appendChild(songElement);
    });
  } catch (error) {
    console.error("播放列表加载失败:", error);
    alert("播放列表加载失败，请重试！");
  }
}

// 删除歌曲函数
async function deleteSong(songOrder) {
  try {
    // 调用后端接口删除对应 order 的歌曲
    const response = await fetch(
      `/del_data?database=data&table=song_list&keyword=${songOrder}&where=order`,
    );
    if (!response.ok) {
      throw new Error(`删除失败，状态码: ${response.status}`);
    }

    // 重新获取并渲染播放列表
    alert("删除成功！");
    await fetchAndRenderPlaylist();
  } catch (error) {
    console.error("删除歌曲失败:", error);
    alert("删除失败，请重试！");
  }
}

// 页面加载完成后调用 fetchAndRenderPlaylist
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderPlaylist();
});
