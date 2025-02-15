// 使用 AudioContext 接口
const AudioContext = window.AudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
let audioCtx = new AudioContext();
let gainNode = audioCtx.createGain(); // 控制音量
// 存储歌词
let lyrics = [];

// 异步函数，用于添加音乐播放
async function play_music(element, action = "play") {
  // 每次调用播放函数时先更新播放请求标识
  currentPlayId++;
  const myPlayId = currentPlayId;

  // 获取音频信息等
  const audio_id = element.dataset.id;
  const platform = element.dataset.platform;
  const audio_number = element.dataset.number;

  if (action === "add") {
    await add_song_to_playlist(element);
  } else {
    await fetch(`/update_play_status?audio_number=${audio_number}`);
  }

  await fetchAndRenderPlaylist();

  // 加载歌词并同步
  lyrics = await loadLyrics(platform, audio_id);
  displayLyrics(lyrics);
  startLyricSync();

  const url = `/get_audio?platform=${platform}&audio_id=${audio_id}`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (contentType && contentType.startsWith("audio/")) {
      console.log("音频文件");
      await loadAudio(response, true, myPlayId);
    } else {
      console.log("非音频文件");
      const data = await response.json();
      const audio_url = data.audio_url;
      await loadAudio(audio_url, false, myPlayId);
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

// 进度条和音量条
const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

let audioBuffer = null;
// 记录是否正在播放
let isPlaying = false;
// 记录播放开始的时间
let startTime = 0;

// 用于标识最新的播放请求
let currentPlayId = 0;

// 重新加载并播放音频
// 异步加载音频函数
async function loadAudio(urlOrResponse, stream, myPlayId) {
  // 停止当前音频，确保旧的音频源 onended 被清除
  stopAllAudio();
  // 停止封面旋转
  const currentSongCover = document.getElementById("current-song-cover");
  currentSongCover.classList.remove("playing");

  try {
    let response = urlOrResponse;
    if (!stream) {
      response = await fetch(urlOrResponse);
      if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);
    }

    // 将音频数据转换为 ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    currentBuffer = await audioCtx.decodeAudioData(arrayBuffer); // 缓存音频数据

    progressBar.max = currentBuffer.duration; // 设定进度条最大值

    // 在异步操作结束前检查标识
    if (myPlayId !== currentPlayId) {
      console.log("播放请求已被更新，放弃本次播放");
      return;
    }

    playAudio(myPlayId); // 播放新的音频
  } catch (error) {
    console.error("加载音频失败:", error);
  }
}

// 停止所有播放的音频
function stopAllAudio() {
  if (currentSource) {
    // 清除旧 onended 事件，防止触发下一首逻辑
    currentSource.onended = null;
    try {
      currentSource.stop();
    } catch (err) {
      console.warn("停止音频时发生错误:", err);
    }
    try {
      currentSource.disconnect();
    } catch (err) {
      // 某些情况下可能已经断开
    }
    currentSource = null;
  }
  // 可根据需要决定是否清空 currentBuffer（通常不清空，方便跳转）
}

// 重新定义播放音频
// 播放音频函数
async function playAudio(myPlayId) {
  // 如果当前缓冲区为空，则返回
  if (!currentBuffer) return;

  // 检查标识，若不匹配则直接返回
  if (myPlayId !== currentPlayId) {
    console.log("播放请求已被更新，停止播放");
    return;
  }

  // 如果音频上下文状态为暂停，则恢复播放
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  if (!audioCtx || audioCtx.state === "closed") {
    console.log("创建新的 AudioContext");
    gainNode = audioCtx.createGain();
  }

  // 记录播放开始的时间
  startTime = audioCtx.currentTime;

  // 创建一个新的音频源
  currentSource = audioCtx.createBufferSource();
  // 将当前缓冲区赋值给音频源
  currentSource.buffer = currentBuffer;
  // 将音频源连接到音频上下文的输出
  currentSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  // 开始播放音频
  currentSource.start();

  // 隐藏播放按钮，显示暂停按钮
  togglePlayPauseIcon(true);

  // 更新进度条
  updateProgress();

  // 启动封面旋转动画
  const currentSongCover = document.getElementById("current-song-cover");
  currentSongCover.classList.add("playing"); // 添加动画

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
    playAudio(currentPlayId);
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
  const loop_list = document.getElementById("loop-list");
  const loop_single = document.getElementById("loop-single");
  const loop_random = document.getElementById("loop-random");
  // 先隐藏所有图标
  loop_list.style.display = "none";
  loop_single.style.display = "none";
  loop_random.style.display = "none";

  // 根据当前模式显示对应的图标
  if (loopMode === "list") {
    loop_list.style.display = "block";
  } else if (loopMode === "single") {
    loop_single.style.display = "block";
  } else if (loopMode === "random") {
    loop_random.style.display = "block";
  }
  updateCovers();
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
    if (currentSource) {
      currentSource.onended = null;
    }
    // 清除当前音频，更新全局播放标识
    stopAllAudio();
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
    if (currentSource) {
      currentSource.onended = null;
    }
    // 清除当前音频，更新全局播放标识
    stopAllAudio();
    // 停止封面旋转
    const currentSongCover = document.getElementById("current-song-cover");
    currentSongCover.classList.remove("playing");

    play_music(title, "play"); // 播放下一首歌曲
  }
}

// 随机播放
function playRandomSong() {
  // 获取所有歌曲的 DOM 元素，并转换为数组
  const allSongs = Array.from(
    document.querySelectorAll(".list-container-title-text")
  );

  // 获取当前正在播放的歌曲元素（假设父容器有 .list-container-playing 类）
  const currentSong = document.querySelector(
    ".list-container-playing .list-container-title-text"
  );

  // 过滤掉当前正在播放的歌曲
  let candidateSongs = allSongs;
  if (currentSong) {
    candidateSongs = allSongs.filter((song) => song !== currentSong);
  }

  // 如果候选歌曲不为空，则随机选择一首播放，否则直接播放当前歌曲（或根据需求处理）
  if (candidateSongs.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidateSongs.length);
    play_music(candidateSongs[randomIndex], "play");
  } else if (currentSong) {
    // 如果列表中只有当前歌曲，则继续播放当前歌曲
    play_music(currentSong, "play");
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
    const singer_id = element.dataset.singer_id || "null";
    const album = element.dataset.album;
    const album_id = element.dataset.album_id || "null";
    const cover = element.dataset.cover;
    const status = action === "play" ? "playing" : "";
    // 构造请求体数据
    const requestData = {
      action, // 播放模式: "play" 或 "add"
      values: [
        [
          audio_id,
          title,
          singer,
          singer_id,
          album,
          album_id,
          platform,
          status,
          cover,
        ], // 单行插入数据
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
    if (playlist === undefined) {
      // 如果播放列表为空，则不进行任何操作
      return;
    }
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
    });
    console.log("播放列表加载成功");
    updateCovers(); // 更新封面
    updateSongTitle(); // 更新歌曲标题
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

  // 更新封面，确保绕过缓存
  if (last_song_cover) last_song_cover.src = lastCover;
  if (current_song_cover) current_song_cover.src = currentCover;
  if (next_song_cover) next_song_cover.src = nextCover;

  // 确保封面加载完成后再更新背景
  if (current_song_cover && current_song_cover.complete) {
    // 如果封面已加载完毕，立即更新背景
    changeFooterBackground();
  } else if (current_song_cover) {
    // 如果封面未加载，设置加载完成后的回调
    current_song_cover.onload = () => {
      changeFooterBackground();
    };
  }

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

  // 获取所有的 song-title 和 song-singer 元素
  const allSongTitles = document.querySelectorAll("#song-title");
  const allSongSingers = document.querySelectorAll("#song-singer");

  // 更新所有 DOM 元素中的内容
  allSongTitles.forEach((titleElement) => {
    titleElement.innerText = Title || "未知歌曲"; // 如果标题为空，默认显示“未知歌曲”
  });

  allSongSingers.forEach((singerElement) => {
    singerElement.innerText = Singer || "未知歌手"; // 如果歌手为空，默认显示“未知歌手”
  });
}

// 切换播放/暂停图标显示]
function togglePlayPauseIcon(status) {
  // 获取播放图标和暂停图标
  const play_icon = document.getElementById("play-icon");
  const pause_icon = document.getElementById("pause-icon");

  // 如果正在播放
  if (status) {
    // 隐藏播放图标
    play_icon.style.display = "none";
    // 显示暂停图标
    pause_icon.style.display = "block";
    isPlaying = true;
  } else {
    // 显示播放图标
    play_icon.style.display = "block";
    // 隐藏暂停图标
    pause_icon.style.display = "none";
    isPlaying = false;
  }
}

function changeFooterBackground() {
  const footer = document.querySelector(".footer");
  const current_song_cover = document.getElementById("current-song-cover");
  const footer_info_cover = document.getElementById("footer-info-cover");
  if (!current_song_cover || !current_song_cover.src) {
    console.warn("当前封面不存在，跳过背景更新");
    return;
  }

  // 更新封面，确保绕过缓存
  footer_info_cover.src = current_song_cover.src;

  // 直接使用当前歌曲封面作为背景
  document.documentElement.style.setProperty(
    "--footer-bg",
    `url(${current_song_cover.src})`
  );

  // 触发渐变动画
  footer.classList.add("fade-in");

  setTimeout(() => {
    footer.classList.remove("fade-in");
  }, 1000);
}

// 更新进度条
function updateProgress() {
  if (!isPlaying || !currentSource) return;

  // 计算当前播放时间（elapsedTime）
  const elapsedTime = audioCtx.currentTime - startTime;
  progressBar.value = elapsedTime;

  requestAnimationFrame(updateProgress);
}

// 跳转到指定时间
progressBar.addEventListener("input", () => {
  if (!currentBuffer) return;

  const newTime = parseFloat(progressBar.value);
  // 更新播放标识，防止旧 onended 的触发
  currentPlayId++;
  const myPlayId = currentPlayId;

  // 停止当前音频并清除 onended
  if (currentSource) {
    currentSource.onended = null;
    try {
      currentSource.stop();
    } catch (e) {
      console.warn("停止当前音频出错：", e);
    }
    currentSource.disconnect();
    currentSource = null;
  }

  // 创建新的 AudioBufferSourceNode
  currentSource = audioCtx.createBufferSource();
  currentSource.buffer = currentBuffer;
  currentSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // 调整 startTime 使进度条正确
  startTime = audioCtx.currentTime - newTime;

  currentSource.start(0, newTime);

  isPlaying = true;
  togglePlayPauseIcon(true);

  // 新的 onended 事件
  currentSource.onended = () => {
    console.log("音频播放结束");
    currentSource = null;
    if (myPlayId === currentPlayId) {
      handlePlaybackEnd();
    }
  };

  updateProgress();
});

// 调整音量
volumeBar.addEventListener("input", () => {
  console.log("音量调整");
  gainNode.gain.value = parseFloat(volumeBar.value);
});

// 🟢 【获取歌词】从后端获取歌词数据
async function loadLyrics(platform, audio_id) {
  try {
    const response = await fetch(
      `/get_lrc?platform=${platform}&audio_id=${audio_id}`
    );
    console.log("歌词获取成功");
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn("该歌曲无歌词");
      return [{ time: 0, text: "暂无歌词" }];
    }

    // **直接返回后端已解析好的歌词数据**
    return data.results;
  } catch (error) {
    console.error("获取歌词失败：", error);
    return [{ time: 0, text: "暂无歌词" }];
  }
}

// 🟢 【显示歌词】将歌词数据显示到页面上
function displayLyrics(lyrics) {
  console.log("传入的歌词数据：", lyrics);

  const lyricList = document.getElementById("lyric-list");
  lyricList.innerHTML = "";

  const topPlaceholder = document.createElement("li");
  topPlaceholder.classList.add("empty-placeholder");
  lyricList.appendChild(topPlaceholder);

  if (
    !lyrics.length ||
    (lyrics.length === 1 && lyrics[0].text === "暂无歌词")
  ) {
    const noLyricsLi = document.createElement("li");
    noLyricsLi.classList.add("no-lyrics");
    noLyricsLi.textContent = "暂无歌词";
    lyricList.appendChild(noLyricsLi);
  } else {
    lyrics.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", index);

      // 原歌词
      const textSpan = document.createElement("span");
      textSpan.textContent = item.text;
      li.appendChild(textSpan);

      lyricList.appendChild(li);

      // 翻译歌词另起一行
      if (item.translation) {
        const transLi = document.createElement("li");
        transLi.setAttribute("data-index", index); // 保持与原歌词相同的索引
        transLi.textContent = item.translation;
        lyricList.appendChild(transLi);
      }
    });
  }

  const bottomPlaceholder = document.createElement("li");
  bottomPlaceholder.classList.add("empty-placeholder");
  lyricList.appendChild(bottomPlaceholder);
}

// 🟢 【更新歌词高亮】
function updateActiveLyric(currentTime, lyrics) {
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time !== null && currentTime >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  document
    .querySelectorAll("#lyric-list li")
    .forEach((li) => li.classList.remove("active"));
  const activeLines = document.querySelectorAll(
    `#lyric-list li[data-index="${activeIndex}"]`
  );
  activeLines.forEach((line) => line.classList.add("active"));
  // 只要有带 active 的元素就滚动到屏幕中间
  const activeElements = document.querySelectorAll("#lyric-list li.active");
  activeElements.forEach((line) => {
    line.scrollIntoView({ behavior: "smooth", block: "center" }); // 滚动到屏幕中间
  });
}

// 🟢 【时间戳同步歌词】使用时间戳更新歌词
function startLyricSync() {
  let lastIndex = -1; // 用来存储上次高亮歌词的索引，避免重复更新

  // 使用 Web Audio API 获取当前播放的时间
  function syncLyrics() {
    const currentTime = audioCtx.currentTime - startTime;

    // 寻找当前播放时间对应的歌词
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }

    // 如果当前歌词有变化，更新高亮显示
    if (activeIndex !== lastIndex && activeIndex !== -1) {
      updateActiveLyric(currentTime, lyrics); // 更新高亮歌词
      lastIndex = activeIndex;
    }

    // 使用 requestAnimationFrame 来平滑执行同步
    requestAnimationFrame(syncLyrics);
  }

  syncLyrics(); // 启动同步
}
