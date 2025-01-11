const prev_audio = document.getElementById("prev-audio");
const next_audio = document.getElementById("next-audio");
const play_pause = document.getElementById("play-pause");

// 检查浏览器是否支持 AudioContext 接口，如果不支持，则尝试使用 webkitAudioContext 接口
const AudioContext = window.AudioContext || window.webkitAudioContext;

// 创建一个新的 AudioContext 实例，用于处理音频
const audioCtx = new AudioContext();

async function add_play_music(element) {
  const audio_id = element.dataset.id;
  const platform = element.dataset.platform;
  const url = `/get_audio?platform=${platform}&audio_id=${audio_id}`;
  console.log(url);
  console.log(audio_id);
  console.log(platform);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    data = await response.json();
    console.log(data);
    audio_url = data.results.final_audio_url;
    loadAudio(platform, audio_url);
    console.log(response);
  } catch (error) {
    console.error("请求失败:", error);
  }
}

async function loadAudio(platform, url) {
  try {
    // 获取 Cookie
    const cookieResponse = await fetch(
      `/data?database=data&table=account&keyword=${platform}&select=cookie&where=平台`,
    );
    if (!cookieResponse.ok) throw new Error("获取 Cookie 失败");

    const cookie = await cookieResponse.text(); // 假设返回值是纯文本

    // 配置 fetch 选项
    const options = {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
        cookie, // 添加从上一步获取的 cookie
      },
    };
    console.log("Fetch Headers:", options.headers);

    // 获取音频文件
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();

    //  解码音频文件
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // 播放音频
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();

    console.log("音频开始播放");

    // 监听音频播放结束
    source.onended = () => console.log("音频播放结束");
  } catch (error) {
    console.error("加载音频失败:", error);
  }
}
