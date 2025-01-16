const prev_audio = document.getElementById("prev-audio");
const next_audio = document.getElementById("next-audio");
const play_pause = document.getElementById("play-pause");

// 使用 AudioContext 接口
const AudioContext = window.AudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
const audioCtx = new AudioContext();

async function add_play_music(element) {
  const audio_id = element.dataset.id;
  const platform = element.dataset.platform;
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
