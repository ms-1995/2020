<template>
  <div id="app" @click="pause()">
    <input v-if="!courseList.length" type="file" @change="loadFile($event)" />
    <div v-else>
      <div style="position: fixed; top: 0;left: 50%;z-index: 999;">
        <button v-if="index>0" @click.stop="prevPage()">上一页</button>
        <button v-if="courseList.length-index>1" @click.stop="nextPage()">下一页</button>
      </div>
      <!-- <h3>{{courseList[index].text}}</h3> -->
      <div
        v-if="courseList[index].source.indexOf('.mp4')>-1"
        :style="'width:'+clientWidth+'px;height:'+clientHeight+'px;background: #000'"
      >
        <video
          :src="getSourceUrl(courseList[index].source)"
          :width="clientWidth"
          :height="clientHeight"
          autoplay
          controls
          @ended="audioFinish()"
        ></video>
      </div>
      <audio
        v-if="courseList[index].source.indexOf('.mp3')>-1"
        ref="audio"
        :src="getSourceUrl(courseList[index].source)"
        autoplay
        @ended="audioFinish()"
      ></audio>
      <div
        v-if="courseList[index].imgList.length>0"
        class="image-content"
        :style="'width:'+clientWidth+'px;height:'+clientHeight+'px;'"
      >
        <div class="image-box" v-for="img in courseList[index].imgList" :key="img">
          <img :src="getSourceUrl(img)" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TTSRecorder from "./api/xf.js";

let t;

export default {
  name: "App",
  data() {
    return {
      courseList: [],
      index: 0,
      ttsRecorder: null,
      clickPause: false,
    };
  },
  mounted() {},
  methods: {
    // 读取txt文件
    loadFile(e) {
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.readAsText(file, "GB2312");
      reader.onloadend = () => {
        this.ttsRecorder = new TTSRecorder();
        let result = reader.result;
        this.courseList = this.handleText(result);
      };
    },
    // 文件内容处理
    handleText(str) {
      let textList = str.split("\n");
      return textList.reduce((arr, text) => {
        if (text.replace(/\s*/g, "") != "") {
          let subList = text.split(" ");
          let source = "";
          let imgList = [];
          let sourceText = "";
          subList.forEach((subText) => {
            if (RegExp("^@").test(subText)) {
              if (
                subText.indexOf(".mp3") > -1 ||
                subText.indexOf(".mp4") > -1
              ) {
                source = subText.slice(1);
              } else if (
                subText.indexOf(".png") > -1 ||
                subText.indexOf(".jpg") > -1 ||
                subText.indexOf(".gif") > -1
              ) {
                imgList.push(subText.slice(1));
              }
            } else if (subText != "") {
              sourceText = subText;
            }
          });
          arr.push({
            source: source,
            text: sourceText,
            imgList: imgList,
          });
        }

        return arr;
      }, []);
    },
    // 媒体文件资源转换
    getSourceUrl(name) {
      return "/3ddemo/resource/" + name;
    },
    // 前一页
    prevPage() {
      this.clickPause = false;
      this.index -= 1;
      this.readText(this.courseList[this.index].text);
    },
    // 后一页
    nextPage() {
      this.clickPause = false;
      this.index += 1;
      this.readText(this.courseList[this.index].text);
    },
    // 音频播放完成自动下一页
    audioFinish() {
      if (["init", "endPlay", "errorTTS"].indexOf(this.ttsStatus) > -1) {
        t = setTimeout(() => {
          this.nextPage();
        }, 1000);
      }
    },
    // 暂停语音
    pause() {
      if (this.$refs.audio) {
        this.$refs.audio.pause();
      }

      if (this.ttsRecorder) {
        this.clickPause = true;
        this.ttsRecorder.stop();
        clearTimeout(t);
      }
    },
    // 文字转语音
    readText(text) {
      if (text != "") {
        this.ttsRecorder.setParams({
          voiceName: "xiaoyan",
          tte: "UTF8",
          text: text,
        });
        if (
          ["init", "endPlay", "errorTTS"].indexOf(this.ttsRecorder.status) > -1
        ) {
          this.ttsRecorder.start();
        } else {
          this.ttsRecorder.stop();
        }
      }
    },
  },
  computed: {
    ttsStatus() {
      return this.ttsRecorder ? this.ttsRecorder.status : "init";
    },
    clientWidth() {
      return document.body.clientWidth;
    },
    clientHeight() {
      return document.body.clientHeight;
    },
  },
  watch: {
    ttsStatus() {
      const text = this.courseList[this.index]
        ? this.courseList[this.index].text.replace(/\s*/g, "")
        : "";
      if (this.ttsStatus === "endPlay" && !this.clickPause && text != "") {
        t = setTimeout(() => {
          this.nextPage();
        }, 3000);
      }
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgba(153, 204, 255, 1);
  background-image: url("./assets/background.png");
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
}

.image-content {
  overflow: hidden;
}

.image-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-box img {
  height: 100%;
}
</style>
