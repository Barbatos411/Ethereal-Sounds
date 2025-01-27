const prev_audio = document.getElementById("prev-audio");
const next_audio = document.getElementById("next-audio");
const play_pause = document.getElementById("play-pause");

// 使用 AudioContext 接口
const AudioContext = window.AudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
const audioCtx = new AudioContext();

// 异步函数，用于添加音乐播放
async function add_play_music(element) {
  // 获取元素的数据属性，歌曲ID和平台
  const audio_id = element.dataset.id;
  const platform = element.dataset.platform;

  await add_song_to_playlist(element); // 添加歌曲到播放列表

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

async function loadAudio(url) {
  try {
    // 如果当前有音频正在播放，则停止并断开它
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    }

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
