// 获取搜索框元素
const searchInput = document.getElementById("searchInput");

async function displayPlatforms() {
  try {
    const response = await fetch("/platforms");
    const data = await response.json();

    const platformsContainer = document.querySelector(".platforms-container");

    // 遍历排序后的平台，生成对应的 <div> 元素
    data.platforms.forEach((platform, index) => {
      // 创建平台的 <div> 元素
      const platformDiv = document.createElement("div");
      platformDiv.className = "music-platform";
      platformDiv.textContent = platform.name;
      platformDiv.id = platform.id;

      // 如果是第一个平台，添加 selected 类
      if (index === 0) {
        platformDiv.classList.add("selected");
      }

      // 添加平台 <div> 元素
      platformsContainer.appendChild(platformDiv);

      // 如果不是最后一个平台，添加一个分隔符
      if (index < data.platforms.length - 1) {
        const separator = document.createElement("p");
        separator.style.color = "#7a7a7b"; // 设置颜色
        separator.textContent = "|"; // 分隔符文本
        separator.style.userSelect = "none"; // 禁止用户选择文本
        platformsContainer.appendChild(separator);
      }
    });
    select_platform(); // 添加选择平台函数
    await home(); // 添加首页函数
  } catch (error) {
    console.error("生成平台元素时出错:", error); // 添加错误处理
  }
}

// 页面加载时显示平台
window.onload = displayPlatforms;

function select_platform() {
  // 为输入框添加 keydown 事件监听器
  searchInput.addEventListener("keydown", handleEnterKeyPress);
  // 获取所有平台元素
  const platforms = document.querySelectorAll(".music-platform");

  // 为每个平台添加点击事件监听器
  platforms.forEach((platform) => {
    platform.addEventListener("click", () => {
      // 移除所有平台的 selected 类
      platforms.forEach((p) => {
        p.classList.remove("selected");
      });

      // 为被点击的平台添加 selected 类
      platform.classList.add("selected");
      console.log("已选择平台:", platform.textContent); // 添加调试日志

      // 获取搜索框的值并执行搜索
      const query = searchInput.value.trim();
      if (query) {
        searchSongs(platform.id, query, 1);
      } else {
        home();
      }
    });
  });
}

// 监听搜索框的回车事件
function handleEnterKeyPress(event) {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    const selectedPlatform = document.querySelector(".music-platform.selected");
    if (selectedPlatform && query) {
      searchSongs(selectedPlatform.id, query, 1);
    }
  }
}

async function searchSongs(platform, keyword, page) {
  // 隐藏首页
  const platform_home = document.querySelector(".platforms-home");
  platform_home.style.display = "none"; // 隐藏首页
  const list = document.querySelector(".music-search-list");
  list.style.display = "flex"; // 显示搜索结果
  // 打印搜索信息
  console.log("搜索平台:", platform);
  console.log("搜索歌曲:", keyword);
  console.log("搜索页码:", page);
  let data = []; // 初始化 data 变量

  // 使用模板字符串动态生成请求 URL
  const url = `/search?platform=${encodeURIComponent(platform)}&keyword=${encodeURIComponent(keyword)}&page=${page}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    data = await response.json(); // 移除 const 关键字
    console.log("搜索结果:", data);

    // 确保 data.results.song_list 存在并且包含数据
    if (
      data.results &&
      data.results.song_list &&
      data.results.song_list.length > 0
    ) {
      if (list) {
        // 清空之前的搜索结果
        list.innerHTML = "";

        const song_title = document.createElement("h3");
        song_title.innerHTML = `
                    <h3 style="color: var(--text-primary); margin: 0; user-select: none";width:auto>搜索 ${keyword} 结果共 ${data.results.song_count} 首</h3>
                `;
        list.appendChild(song_title);
        // 遍历搜索结果并创建歌曲项
        data.results.song_list.forEach((song) => {
          const songItem = document.createElement("div");
          songItem.className = "music-container";
          songItem.innerHTML = `
                        <div class="music-container-left">
                            <img class="music-cover" src="${song.cover}" alt="cover">
                            <div class="music-name">
                                <h3 class="song-title" onclick=play_music(this,"add") style="color: var(--text-primary); margin: 0" data-audio_id=${song.id} data-platform=${encodeURIComponent(platform)} data-singer='${song.author}' data-cover=${song.cover} data-album='${song.album}'>${song.title}</h3>
                                <p class="music-singer">${song.author}</p>
                            </div>
                            <div class="song-tags">
                                ${song.fee === 1 ? '<div class="tag-vip">VIP</div>' : ""}
                                ${song.mvid && song.mvid !== 0 ? '<div class="tag-mv">MV</div>' : ""}
                            </div>
                        </div>
                        ${song.album !== undefined ? `<div class="music-container-center">${song.album}</div>` : ""}
                        <div class="music-container-right">
                            <div class="button" style="margin:0 1rem">
                              <a href=${song.url} target="_blank" rel="noopener noreferrer">
                                  <svg style="    margin-top: 0.4rem; rotate: -45deg;" role="img" xmlns="http://www.w3.org/2000/svg" width="3vh" height="3vh" viewBox="0 0 24 24" aria-labelledby="linkIconTitle" stroke="var(--text-primary)" stroke-width="1.7142857142857142" stroke-linecap="round" stroke-linejoin="round" fill="none" color="none">
                                      <title id="linkIconTitle">链接</title>
                                      <path d="M10.5,15.5 C10.5,14.1666667 10.5,13.5 10.5,13.5 C10.5,10.7385763 8.26142375,8.5 5.5,8.5 C2.73857625,8.5 0.5,10.7385763 0.5,13.5 C0.5,13.5 0.5,14.1666667 0.5,15.5" transform="rotate(-90 5.5 12)"/>
                                      <path d="M8,12 L16,12"/>
                                      <path d="M23.5,15.5 C23.5,14.1666667 23.5,13.5 23.5,13.5 C23.5,10.7385763 21.2614237,8.5 18.5,8.5 C15.7385763,8.5 13.5,10.7385763 13.5,13.5 C13.5,13.5 13.5,14.1666667 13.5,15.5" transform="rotate(90 18.5 12)"/>
                                  </svg>
                              </a>
                            </div>
                            <div class="button" style="margin:0 1rem" onclick='add_song_to_playlist(this,"add")' data-audio_id=${song.id} data-platform=${encodeURIComponent(platform)} data-singer='${song.author}' data-cover=${song.cover} data-album='${song.album}'>
                                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="3vh" height="3vh" viewBox="0 0 24 24" aria-labelledby="plusIconTitle" stroke="var(--text-primary)" stroke-width="1.7142857142857142" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000"> <title id="plusIconTitle">${song.title}</title> <path d="M20 12L4 12M12 4L12 20"/></svg>
                            </div>
                            <div style="display: flex; align-items: center; margin:0 1rem">${song.duration}</div>
                        </div>
                    `;
          list.appendChild(songItem);
        });
        const pageContainer = document.createElement("div");
        pageContainer.className = "pagination-container";
        pageContainer.innerHTML = `
                <div id="prevPage"">上一页</div>
                <span id="currentPage" style="color: var(--text-primary); font-weight: 600; margin: 10px"></span>
                <span style="color: var(--text-primary); font-weight: 600; margin: 10px;">/</span>
                <span id="totalPages" style="color: var(--text-primary); font-weight: 600; margin: 10px;"></span>
                <div id="nextPage"">下一页</div>
                `;
        list.appendChild(pageContainer);
        const totalPages = Math.ceil(data.results.song_count / 30);
        updatePagination(page, totalPages);
        add_page_control();
      } else {
        console.error("未找到 .music-search-list 元素");
      }
    } else {
      console.error("搜索结果为空或格式不正确");
    }
  } catch (error) {
    console.error("搜索失败:", error);
  }
}

// 更新页码显示
function updatePagination(current, total) {
  const currentPage = document.getElementById("currentPage");
  const totalPages = document.getElementById("totalPages");
  currentPage.textContent = current;
  totalPages.textContent = total;
}

function add_page_control() {
  // 获取页码显示和翻页按钮
  const currentPage = document.getElementById("currentPage");
  const totalPages = document.getElementById("totalPages");
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");

  const query = searchInput.value.trim();
  const selectedPlatform = document.querySelector(".music-platform.selected");
  // 添加翻页按钮的点击事件监听器
  prevPage.addEventListener("click", () => {
    const current = parseInt(currentPage.textContent);
    y;
    if (current > 1) {
      searchSongs(selectedPlatform.id, query, current - 1);
    }
  });

  nextPage.addEventListener("click", () => {
    const current = parseInt(currentPage.textContent);
    if (current < totalPages.textContent) {
      searchSongs(selectedPlatform.id, query, current + 1);
    }
  });
}

let playlistpage = 1; // 初始化 page 变量
let playlisturl = ""; // 初始化 playlisturl 变量
let isLoading = false; // 初始化 isLoading 变量
let lastSelectedPlatformId = null; // 存储上一次选中的平台

// 异步函数，用于生成首页歌单类型
async function home(url = undefined) {
  displayhome(); // 隐藏搜索结果
  // 生成首页歌单类型
  const selectedPlatform = document.querySelector(".music-platform.selected");
  const platform_home_tags = document.querySelector(".platforms-home-tags");
  const platforms_home_list = document.querySelector(".platforms-home-list");

  if (playlisturl !== url) {
    platforms_home_list.innerHTML = "";
    playlistpage = 1;
  }
  playlisturl =
    url || `/home?platform=${encodeURIComponent(selectedPlatform.id)}`;

  try {
    // 发送请求获取歌单数据
    const response = await fetch(`${playlisturl}&page=${playlistpage}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // 生成标题
    if (lastSelectedPlatformId !== selectedPlatform.id) {
      lastSelectedPlatformId = selectedPlatform.id;
      playlistpage = 1;
      console.log("platform changed");
      platform_home_tags.innerHTML = "";
      if (data.results.tag !== undefined) {
        lastSelectedPlatformId = selectedPlatform.id;
        data.results.tag.forEach((tag) => {
          // 生成歌单类型
          const tagItem = document.createElement("div");
          tagItem.className = "playlist-tag";
          tagItem.textContent = tag.title;
          tagItem.dataset.link = tag.link;
          document.querySelector(".platforms-home-tags").appendChild(tagItem);
        });
      }
    }

    data.results.albums.forEach((album) => {
      // 生成歌单列表
      const albumItem = document.createElement("li");
      albumItem.dataset.id = album.id;
      albumItem.innerHTML = `
                <img src="${album.cover}" alt="${album.title}" style="width: 100%; height: auto;">
                ${album.title}
              `;
      document.querySelector(".platforms-home-list").appendChild(albumItem);
    });
  } catch (error) {
    console.error("获取首页数据失败:", error);
  }
  isLoading = false; // 重置 isLoading 变量
}

async function displayhome() {
  const platform_home = document.querySelector(".platforms-home");
  platform_home.style.display = "flex"; // 显示首页
  const list = document.querySelector(".music-search-list");
  list.style.display = "none"; // 隐藏搜索结果
  const searchInput = document.getElementById("searchInput");
  searchInput.value = ""; // 清空搜索框
}

const container = document.querySelector(".platforms-home");
// 核心滚动监听函数
container.addEventListener("scroll", () => {
  const scrollTop = container.scrollTop; // 容器顶部到滚动条的距离
  const scrollHeight = container.scrollHeight; // 容器内容的总高度
  const clientHeight = container.clientHeight; // 容器可见区域的高度
  // 如果滚动到了容器底部的 80%，并且没有正在加载数据
  if (!isLoading && scrollTop + clientHeight >= scrollHeight - 250) {
    console.log("滚动到底部了");
    isLoading = true;
    playlistpage = playlistpage + 1; // 页码加一
    home(playlisturl);
  }
});
