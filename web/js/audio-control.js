// 使用 AudioContext 接口
const AudioContext = window.AudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
const audioCtx = new AudioContext();

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
    await fetchAndRenderPlaylist();
  }

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
      await loadAudio(url);
    } else {
      console.log("非音频文件");
      // 解析 JSON 数据并获取 audio_url
      const data = await response.json();
      const audio_url = data.audio_url; // 修正：正确访问 JSON 字段
      // 加载音频
      await loadAudio(audio_url);
    }
  } catch (error) {
    console.error("请求失败:", error);
  }
}

let currentSource = null; // 用于存储当前播放的音频源
let isPlaying = false; // 标记当前是否在播放状态
// 上一首
const prev_audio = document.getElementById("prev-audio");
// 下一首
const next_audio = document.getElementById("next-audio");
// 暂停/播放
const play_pause = document.getElementById("play-pause");
// 播放图标
const play_icon = document.getElementById("play-icon");
// 暂停图标
const pause_icon = document.getElementById("pause-icon");

async function loadAudio(url) {
  try {
    // 如果当前有音频正在播放，则停止并断开它
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    }
    isPlaying = true; // 标记为正在播放
    play_icon.style.display = "none"; // 隐藏播放图标
    pause_icon.style.display = "block"; // 显示暂停图标
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();

    // 解码音频文件
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // 播放音频
    currentSource = audioCtx.createBufferSource();
    currentSource.buffer = audioBuffer;
    currentSource.connect(audioCtx.destination);
    currentSource.start();

    console.log("音频开始播放");

    // 监听音频播放结束
    currentSource.onended = () => {
      console.log("音频播放结束");
      currentSource = null; // 清空当前音频源
    };
  } catch (error) {
    console.error("加载音频失败:", error);
  }
}

// 绑定事件监听器
play_pause.addEventListener("click", async () => {
  try {
    if (currentSource) {
      if (isPlaying) {
        // 暂停音频上下文
        await audioCtx.suspend();
        play_icon.style.display = "block"; // 显示播放图标
        pause_icon.style.display = "none"; // 隐藏暂停图标
      } else {
        // 恢复音频上下文
        await audioCtx.resume();
        play_icon.style.display = "none"; // 隐藏播放图标
        pause_icon.style.display = "block"; // 显示暂停图标
      }
      isPlaying = !isPlaying; // 切换播放状态
    } else {
      await fetchAndRenderPlaylist();
      // 获取播放列表并生成到页面
      const playing_song = document.querySelector(".list-container-playing");
      const title_text = playing_song.querySelector(
        ".list-container-title-text"
      );
      // 获取正在播放的歌曲标题元素
      await play_music(title_text, "play");
      // 播放列表中有正在播放的歌曲
    }
  } catch (error) {
    console.error("切换播放/暂停时出错:", error);
  }
});

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
    });
  } catch (error) {
    console.error("播放列表加载失败:", error);
  }
}

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
