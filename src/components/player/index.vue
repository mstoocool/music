<template>
  <div class="player" v-if="playList.length > 0">
  <!-- 播放页面全屏 -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
          <!-- 背景模糊 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="changeFull"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">
              <span v-for="item in currentSong.singer" :key="item.key">{{item.name}}</span>
          </h2>
        </div>
        <!-- 中间CD部分 -->
        <div class="middle swiper-container" >
         <div class="swiper-wrapper">
          <div class="middle-l swiper-slide"  ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdState">
                <img class="image" :src="currentSong.img">
              </div>
            </div>
            <!-- 一条歌词滚动 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyc}}</div>
            </div>
          </div>
          <!-- 歌词滚动 -->
          <scroll class="middle-r swiper-slide" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine" class="text" v-for="(item,index) in lyric.lines" :key="item.key" 
                :class="{'current':currentLineNum == index}">
                {{item.txt}}</p>
              </div>
            </div>
          </scroll>
         </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{startTime}}</span>
            <!-- 播放进度条 -->
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @changePercent="changeTime"></progress-bar>
            </div>
            <span class="time time-r">{{songTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="modeStyle"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="changeState">
              <i :class="btnState"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>


    <transition name="mini"  >
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" >
          <img width="40" height="40" :class="cdState" :src="currentSong.img">
        </div>
        <div class="text" @click="toFullScreen">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc"><span v-for="item in currentSong.singer" :key="item.key">{{item.name}}</span>
</p>
        </div>
        <div class="control">
            <i :class="miniBtn" @click="changeState"></i>
        </div>
        <div class="control" >
          <i class="icon-playlist" @click="showPlayList"></i>
        </div>
      </div>
    </transition>
    <!-- h5音乐播放器 -->
        <audio ref="audio" :src="url" @canplay='readyState' @error='readyState' @ended='ended'
        @timeupdate="timeupdata"></audio> 

    <!-- <play-list ref="playlist"></play-list>-->
  </div>
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import Scroll from'@/components/scroll'
import {getkey,getLyric} from '@/api'
import{ Base64} from 'js-base64'
import Lyric from 'lyric-parser'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
import ProgressBar from '@/components/progressBar'
import PlayList from '@/components/player/playlist'

export default {
      data() {
          return {
              url:"",
              isReady:false,
              lyric:{},
              playingLyc:"",
              currentLineNum:0,
              currentTime:0
          }
      },
      // mounted() {
      //   var banner = new Swiper(".middle",{
      //     pagination:{
      //       el:'.dot-wrapper',
      //       bulletClass:'dot',
      //       bulletActiveClass : 'active',
      //     },
      //     observer:true,
      //     observerParents:true,
      //   })
      // },
      computed:{
          ...mapGetters(['playList','currentIndex','currentSong','fullScreen','playing']),
          // 根据播放状态来判断cd封面是否旋转
          cdState(){
            return this.playing ? 'play' : 'pause'           
          },
          miniBtn(){
            return this.playing ? 'icon-play-mini' : 'icon-pause-mini'
          },
          // 根据播放状态来判断显示暂停或播放按钮图标
          btnState(){
            return this.playing ? 'icon-play' : 'icon-pause'
          },
          // 当前播放时间
          startTime(){
             let m = this.currentTime/60 | 0
            let s = this.currentTime%60 | 0
            if(s.toString().length < 2){
              s = "0" + s
            }
            return `${m}:${s}`
          },
          // 歌曲总是间
          songTime(){
            let m = this.currentSong.interval/60 | 0
            let s = this.currentSong.interval%60 | 0
            if(s.toString().length < 2){
              s = "0" + s
            }
            return `${m}:${s}`
            console.log(m,s)
          },
           // 当前以播放歌曲时间占总时间长的百分比
           percent(){
           return this.currentTime / this.currentSong.interval
          },
      },
      updated() {
           this.aaa()
          //  console.log(this.playing)
      },
      methods: {
          aaa(){
              // console.log(this.playList)
          },
          // 改变全屏
          changeFull(){
            this.changeFullScreen(false)
          },
          // 切换到全屏状态
          toFullScreen(){
            this.changeFullScreen(true)
          },
          // 改变播放状态
          changeState(){
            this.changePlaying(!this.playing)
            this.lyric.togglePlay()
          },
          // 上一首
          prev(){
            let index = this.currentIndex - 1
            if(index == -1){
              index = this.playList.length - 1
            }
            this.changeCurrentIndex(index)
            if(!this.playing){
              this.changeFull
            }
          },
          // 下一首
          next(){
            let index = this.currentIndex + 1
            if(index == this.playList.length){
              index = 0 
            }
             this.changeCurrentIndex(index)
            if(!this.playing){
              this.changeFull
            }
          },
          // 歌曲加载改变播放器的加载状态
          readyState(){
            this.isReady = true
          },
          // 播放结束
          ended(){
            this.next()
          },
          // 获取当前播放时间
          timeupdata(ev){
            this.currentTime = ev.target.currentTime
          },
          // 获取歌词
          getLyric(){
            this.lyric = {}
            getLyric(this.currentSong.id).then((res) => {
              // console.log(Base64.decode(res.lyric))
              // let lyric = new LyricParser(Base64.decode(res.lyric))
              // console.log(lyric)
              this.lyric = new Lyric(Base64.decode(res.lyric),this.handler)
              if(this.playing){
                this.lyric.play()
              }
            })
          },
          handler({lineNum,txt}){
                 console.log(lineNum,txt)
            this.currentLineNum = lineNum
            // 歌词滚动
            if(lineNum > 5){
              let lineEl = this.$refs.lyricLine[lineNum - 5]
              this.$refs.lyricList.scrollToElement(lineEl,1000)
            }else{
              this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyc = txt
          },
          changeTime(v){
            let t = this.currentSong.interval * v
            this.$refs.audio.currentTime = t
            // this.lyric.seek(t)
          },
          showPlayList(){
            this.isplayList = true
        },
          ...mapMutations(['changeFullScreen','changePlaying','changeCurrentIndex'])
      },
      watch: {
        currentSong(newValue,oldValue){
          if(!newValue){
            return
          }
          if(newValue == oldValue){
            return 
          }
          this.$nextTick(() => {
                this.getLyric()
                var banner = new Swiper(".middle",{
                    pagination:{
                      el:'.dot-wrapper',
                      bulletClass:'dot',
                      bulletActiveClass : 'active',
                    },
                    observer:true,
                    observeParents:true,
            })
          })
          getkey(newValue.songmid).then(res =>{
            console.log(res)
            this.url = `http://ws.stream.qqmusic.qq.com/${res.data.items[0].filename
            }?fromtag=0&guid=126548448&vkey=${res.data.items[0].vkey}`
            this.$nextTick(() =>{
              this.$refs.audio.play()
            })
          })
        },
        // 监听playing状态，控制h5播放器的暂停和播放
        playing(v){
          this.$nextTick(() => {
            v ? this.$refs.audio.play() : this.$refs.audio.pause()
          })
        }
      },
      components:{
          Scroll,
          ProgressBar
      }
}

</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
  .player {
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom:0;
      z-index:150;

      background: @color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px); 
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          .icon-back {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text;
        }

        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite; 
              }

              &.pause {
                animation-play-state: paused;
              }

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;

            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
             color: @color-text-l;
            }
          }
        }

        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;

            .text {
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;

              &.current {
                color: @color-text;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 67px;
        width: 100%;

        .dot-wrapper {
          text-align: center;
          font-size: 0;

          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;

            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }

        .progress-wrapper {
          display: flex; 
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;

          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;

            &.time-l {
              text-align: left;
            }

            &.time-r {
              text-align: right;
            }
          }

          .progress-bar-wrapper {
            flex: 1;
          }
        }

        .operators {
          display: flex;
          align-items: center;

          .icon {
            flex: 1;
            color: @color-theme;
            &.disable {
            color: @color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }

          .i-left {
            text-align: right;
          }

          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
          font-size: 40px;
        }
          }

          .i-right {
            text-align: left;
          }

          .icon-favorite {
            color: @color-sub-theme;

            &.normal-enter-active,
          &.normal-leave-active {
            transition: all 0.4s;
          }
          }

        }

      }

      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);

        &.normal-enter,
        &.normal-leave-to {
          opacity: 0;
          .top {transform: translate3d(0, -100px, 0)};
          .bottom {transform: translate3d(0, 100px, 0)};
        }
      }

    }

    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;

      background: @color-highlight-background;
      &.mini-enter-active,
      &.mini-leave-active {
        transition: all 0.4s;
      }

      &.mini-enter,
      &.mini-leave-to {
        opacity: 0;
      }

      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;

        img {
          border-radius: 50%;
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          margin-bottom: 2px;

          font-size: @font-size-medium;
            color: @color-text;
        }

        .desc {
       
          font-size: @font-size-small;
            color: @color-text-d;
        }
      }

      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

        .icon-play-mini,
        .icon-pause-mini,
        .icon-playlist {
          font-size: 30px;
          color: @color-theme-d;
        }

        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
    &.play {
      animation: rotate 10s linear infinite;
    }

    &.pause {
      animation-play-state: paused;
    }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
  

</style>
