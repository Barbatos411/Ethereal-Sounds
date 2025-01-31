// 使用 AudioContext 接口
const AudioContext = window.AudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
let audioCtx = new AudioContext();

// 异步函数，用于添加音乐播放
async function play_music(element, action = "play") {
  // 获取元素的数据属性，歌曲ID和平台
  const audio_id = element.dataset.id;
  const platform = element.dataset.platform;
  const audio_number = element.dataset.number;

  if (action === "add") {
    await add_song_to_playlist(element); // 添加歌曲到播放列表
  } else {
    await fetch(`/update_play_status?audio_number=${audio_number}`);
  }
  await fetchAndRenderPlaylist(); // 重新获取并渲染播放列表
  const url = `/get_audio?platform=${platform}&audio_id=${audio_id}`;
  console.log(url);

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (contentType && contentType.startsWith("audio/")) {
      console.log("音频文件");
      // 直接加载音频流
      await loadAudio(response, true);
    } else {
      console.log("非音频文件");
      // 解析 JSON 数据并获取 audio_url
      const data = await response.json();
      const audio_url = data.audio_url; // 修正：正确访问 JSON 字段
      // 加载音频
      await loadAudio(audio_url, false);
    }
  } catch (error) {
    console.error("请求失败:", error);
  }
}

let currentSource = null; // 当前音频源
let currentBuffer = null; // 当前音频缓冲
let loopMode = "list"; // 默认循环模式：list（列表循环） | single（单曲循环） | random（随机播放）
// 上一首
const prev_audio = document.getElementById("prev-audio");
// 监听“上一首” 按钮
prev_audio.addEventListener("click", playPrevSong);

// 下一首
const next_audio = document.getElementById("next-audio");
// 监听“下一首” 按钮
next_audio.addEventListener("click", playNextSong);

// 暂停/播放
const play_pause = document.getElementById("play-pause");
play_pause.addEventListener("click", togglePlayPause);

// 播放图标
const play_icon = document.getElementById("play-icon");
// 暂停图标
const pause_icon = document.getElementById("pause-icon");
// 重新加载并播放音频
// 异步加载音频函数
async function loadAudio(url, stream) {
  // 停止封面旋转
  const currentSongCover = document.getElementById("current-song-cover");
  currentSongCover.classList.remove("playing");
  let response = url; // 如果是流式音频，则直接使用 response
  try {
    // 停止所有音频
    stopAllAudio();
    // 如果不是流式音频
    if (!stream) {
      // 发送请求获取音频数据
      response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);
    }

    // 将音频数据转换为 ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    currentBuffer = await audioCtx.decodeAudioData(arrayBuffer); // 缓存音频数据

    playAudio(); // 播放新的音频
  } catch (error) {
    console.error("加载音频失败:", error);
  }
}

// 停止所有播放的音频
function stopAllAudio() {
  // 如果当前音频源存在
  if (currentSource) {
    try {
      // 停止当前音频源
      currentSource.stop();
      // 断开当前音频源
      currentSource.disconnect();
    } catch (err) {
      // 如果停止音频时发生错误，打印错误信息
      console.warn("停止音频时发生错误:", err);
    }
    // 将当前音频源置为空
    currentSource = null;
  }

  // 彻底关闭音频上下文
  if (audioCtx.state !== "closed") {
    // 关闭音频上下文
    audioCtx.close().then(() => {
      // 重新创建 AudioContext，确保干净的状态
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // 打印音频上下文已重置的信息
      console.log("音频上下文已重置");
    });
  }

  // 清空缓冲区，确保播放新歌曲时不会重复播放旧歌曲
  currentBuffer = null;
}

// 重新定义播放音频
// 播放音频函数
function playAudio() {
  // 如果当前缓冲区为空，则返回
  if (!currentBuffer) return;

  // 如果音频上下文状态为暂停，则恢复播放
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // 创建一个新的音频源
  currentSource = audioCtx.createBufferSource();
  // 将当前缓冲区赋值给音频源
  currentSource.buffer = currentBuffer;
  // 将音频源连接到音频上下文的输出
  currentSource.connect(audioCtx.destination);
  // 开始播放音频
  currentSource.start();

  // 启动封面旋转动画
  const currentSongCover = document.getElementById("current-song-cover");
  currentSongCover.classList.add("playing"); // 添加动画

  // 隐藏播放按钮，显示暂停按钮
  togglePlayPauseIcon(true);

  // 当音频播放结束时，执行以下操作
  currentSource.onended = () => {
    console.log("音频播放结束");
    // 将当前音频源置为空
    currentSource = null;
    // 处理播放结束事件
    handlePlaybackEnd();

    // 移除封面旋转动画
    currentSongCover.classList.remove("playing");
  };
}
// 处理播放结束
function handlePlaybackEnd() {
  // 将当前播放源置为空
  currentSource = null;

  // 如果循环模式为单曲循环
  if (loopMode === "single") {
    // 播放音频
    playAudio(); // 单曲循环
    // 如果循环模式为随机播放
  } else if (loopMode === "random") {
    // 随机播放歌曲
    playRandomSong(); // 随机播放
    // 如果循环模式为列表循环
  } else {
    // 播放下一首歌曲
    playNextSong(); // 列表循环
  }
}

// 切换循环模式
// 定义一个函数toggleLoopMode，用于切换循环模式
function toggleLoopMode() {
  // 定义一个数组modes，包含三种循环模式
  const modes = ["list", "single", "random"];
  // 获取当前循环模式在数组中的索引
  const index = modes.indexOf(loopMode);
  // 将当前循环模式切换到下一个模式
  loopMode = modes[(index + 1) % modes.length];
  // 在控制台输出当前循环模式
  console.log("当前循环模式:", loopMode);
}

// 播放上一首
function playPrevSong() {
  // 获取当前播放的歌曲的前一个兄弟元素
  let prevSong = document.querySelector(
    ".list-container-playing"
  )?.previousElementSibling;

  // 如果没有前一个兄弟元素，则说明当前是列表的第一首
  if (!prevSong) {
    // 获取最后一首歌并播放
    const lastSong = document.querySelector(".list-container:last-child");
    prevSong = lastSong; // 强制切换为最后一首
  }

  // 如果存在歌曲元素
  if (prevSong) {
    const title = prevSong.querySelector(".list-container-title-text");
    // 停止封面旋转
    const currentSongCover = document.getElementById("current-song-cover");
    currentSongCover.classList.remove("playing");
    play_music(title, "play"); // 播放上一首歌曲
  }
}

// 播放下一首
function playNextSong() {
  // 获取当前播放的歌曲的下一个兄弟元素
  let nextSong = document.querySelector(
    ".list-container-playing"
  )?.nextElementSibling;

  // 如果没有下一个兄弟元素，则说明当前是列表的最后一首
  if (!nextSong) {
    // 获取第一首歌并播放
    const firstSong = document.querySelector(".list-container:first-child");
    nextSong = firstSong; // 强制切换为第一首
  }

  // 如果存在歌曲元素
  if (nextSong) {
    const title = nextSong.querySelector(".list-container-title-text");
    // 停止封面旋转
    const currentSongCover = document.getElementById("current-song-cover");
    currentSongCover.classList.remove("playing");
    play_music(title, "play"); // 播放下一首歌曲
  }
}

// 随机播放
// 定义一个函数，用于播放随机歌曲
function playRandomSong() {
  // 获取所有歌曲的元素
  const songs = document.querySelectorAll(".list-container-title-text");
  // 如果有歌曲
  if (songs.length > 0) {
    // 生成一个随机索引
    const randomIndex = Math.floor(Math.random() * songs.length);
    // 播放随机歌曲
    play_music(songs[randomIndex], "play");
  }
}

// 播放/暂停音乐及封面旋转控制
async function togglePlayPause() {
  try {
    const currentSongCover = document.getElementById("current-song-cover");

    if (currentSource) {
      if (audioCtx.state === "running") {
        // 暂停音频
        await audioCtx.suspend();
        // 切换图标
        togglePlayPauseIcon(false);
        // 停止封面旋转
        currentSongCover.classList.remove("playing");
      } else {
        // 恢复播放音频
        await audioCtx.resume();
        // 切换图标
        togglePlayPauseIcon(true);
        // 启动封面旋转
        currentSongCover.classList.add("playing");
      }
    } else {
      // 播放列表中是否有正在播放的歌曲
      await fetchAndRenderPlaylist();
      const playing_song = document.querySelector(".list-container-playing");
      if (playing_song) {
        const title_text = playing_song.querySelector(
          ".list-container-title-text"
        );
        await play_music(title_text, "play");
      }
    }
  } catch (error) {
    console.error("切换播放/暂停时出错:", error);
  }
}

// 添加歌曲到播放列表的函数
async function add_song_to_playlist(element, action = "play") {
  try {
    // 获取歌曲信息
    const audio_id = element.dataset.id;
    const platform = element.dataset.platform;
    const title = element.textContent || element.innerText;
    const singer = element.dataset.singer;
    const cover = element.dataset.cover;
    const status = action === "play" ? "playing" : "";

    // 构造请求体数据
    const requestData = {
      action, // 播放模式: "play" 或 "add"
      values: [
        [audio_id, title, singer, platform, status, cover], // 单行插入数据
      ],
    };

    // 发起 POST 请求
    const response = await fetch("/update_playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData), // 转换为 JSON 字符串
    });

    // 处理响应
    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }

    const result = await response.json();
    console.log("操作成功:", result);
  } catch (error) {
    console.error("操作失败:", error);
  }
}

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
          <h4 class="list-container-title-number">${index + 1}</h4>
          <h4 class="list-container-title-text" data-id=${song.id} data-platform=${song.platform} data-number=${song.number} data-cover=${song.cover} onclick=play_music(this,"play")>${song.name}</h4>
        </div>
        <p class="list-container-singer">${song.singer}</p>

        <svg
          style="width=10%"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="1.25rem"
          height="1.25rem"
          viewBox="0 0 24 24"
          aria-labelledby="binIconTitle"
          stroke="#f50100"
          stroke-width="1.7142857142857142"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          color="#000"
          onclick="deleteSong(${song.number})" <!-- 删除按钮调用删除函数 -->
        >
          <title id="binIconTitle">删除</title>
          <path d="M19 6L5 6M14 5L10 5M6 10L6 20C6 20.6666667 6.33333333 21 7 21 7.66666667 21 11 21 17 21 17.6666667 21 18 20.6666667 18 20 18 19.3333333 18 16 18 10"/>
        </svg>
      `;

      // 将生成的歌曲元素插入容器中
      listContainer.appendChild(songElement);
      updateCovers(); // 更新封面
      updateSongTitle(); // 更新歌曲标题
    });
  } catch (error) {
    console.error("播放列表加载失败:", error);
  }
}

fetchAndRenderPlaylist(); // 页面加载时获取并渲染播放列表

// 删除歌曲函数
async function deleteSong(songOrder) {
  try {
    // 调用后端接口删除对应 order 的歌曲
    const response = await fetch(
      `/del_data?database=data&table=song_list&keyword=${songOrder}&where=number`
    );
    if (!response.ok) {
      throw new Error(`删除失败，状态码: ${response.status}`);
    }

    // 重新获取并渲染播放列表
    await fetchAndRenderPlaylist();
  } catch (error) {
    console.error("删除歌曲失败:", error);
  }
}

// 更新封面
function updateCovers() {
  // 获取当前播放的歌曲和周围的歌曲
  const playingSong = document.querySelector(".list-container-playing");
  if (!playingSong) return; // 确保有正在播放的歌曲

  let prevSong = playingSong.previousElementSibling;
  if (!prevSong) {
    prevSong = document.querySelector(".list-container:last-child"); // 获取最后一首歌
  }

  let nextSong = playingSong.nextElementSibling;
  if (!nextSong) {
    nextSong = document.querySelector(".list-container:first-child"); // 获取第一首歌
  }

  // 获取封面 URL
  const lastCover = prevSong
    ? prevSong.querySelector(".list-container-title-text").dataset.cover
    : "";
  const currentCover = playingSong
    ? playingSong.querySelector(".list-container-title-text").dataset.cover
    : "";
  const nextCover = nextSong
    ? nextSong.querySelector(".list-container-title-text").dataset.cover
    : "";

  const last_song_cover = document.getElementById("last-song-cover");
  const current_song_cover = document.getElementById("current-song-cover");
  const next_song_cover = document.getElementById("next-song-cover");

  const timestamp = new Date().getTime(); // 生成唯一时间戳

  // 更新封面，确保绕过缓存
  if (last_song_cover)
    last_song_cover.src = lastCover ? `${lastCover}?t=${timestamp}` : "";
  if (current_song_cover)
    current_song_cover.src = currentCover
      ? `${currentCover}?t=${timestamp}`
      : "";
  if (next_song_cover)
    next_song_cover.src = nextCover ? `${nextCover}?t=${timestamp}` : "";

  // 更新详情页背景
  changeFooterBackground(currentCover);

  // 处理随机模式的透明度
  if (loopMode === "random") {
    last_song_cover.style.opacity = 0;
    next_song_cover.style.opacity = 0;
  } else {
    last_song_cover.style.removeProperty("opacity");
    next_song_cover.style.removeProperty("opacity");
  }
}


function updateSongTitle() {
  // 获取当前播放的歌曲
  const playingSong = document.querySelector(".list-container-playing");
  if (!playingSong) return; // 确保有正在播放的歌曲

  // 获取歌曲名称和歌手
  const Title = playingSong.querySelector(
    ".list-container-title-text"
  ).innerText;
  const Singer = playingSong.querySelector(".list-container-singer").innerText;

  // 获取 song-title 和 song-singer 元素
  const songTitle = document.getElementById("song-title");
  const songSinger = document.getElementById("song-singer");

  // 更新 DOM 元素中的内容
  songTitle.innerText = Title || "未知歌曲"; // 如果标题为空，默认显示“未知歌曲”
  songSinger.innerText = Singer || "未知歌手"; // 如果歌手为空，默认显示“未知歌手”
}

// 切换播放/暂停图标显示]
function togglePlayPauseIcon(isPlaying) {
  // 获取播放图标和暂停图标
  const play_icon = document.getElementById("play-icon");
  const pause_icon = document.getElementById("pause-icon");

  // 如果正在播放
  if (isPlaying) {
    // 隐藏播放图标
    play_icon.style.display = "none";
    // 显示暂停图标
    pause_icon.style.display = "block";
  } else {
    // 显示播放图标
    play_icon.style.display = "block";
    // 隐藏暂停图标
    pause_icon.style.display = "none";
  }
}

function changeFooterBackground(newBgUrl) {
  const footer = document.querySelector(".footer");

  // 更新 CSS 变量
  document.documentElement.style.setProperty("--footer-bg", `url(${newBgUrl})`);

  // 触发渐变动画
  footer.classList.add("fade-in");

  // 等动画结束后，移除 fade-in，避免下次切换时重复动画
  setTimeout(() => {
    footer.classList.remove("fade-in");
  }, 1000);
}
