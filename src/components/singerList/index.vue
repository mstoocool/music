<template>
    <scroll class="list-view" ref="listView" :listenScroll=true :probeType=3 @scroll="scroll">
        <ul>
          <li class="list-group" ref="lists" v-for="item in singers" :key="item.key">
              <h2 class="list-group-title">{{item.title}}</h2>
              <ul>
                <li class="list-group-item" v-for="item1 in item.list" :key="item1.key" @click="toDetail(item1.id)">
                    <img alt="" class="avatar" :src="item1.img">
                    <span class="name" v-text="item1.name"> </span>
                </li>
              </ul>
          </li>
        </ul>    
        <!--右侧快速定位列表-->
        <div class="list-shortcut" >
            <ul>
                <li class="item" v-for="(item,index) in cutList" :class="{'current': currentIndex == index}" :key="item.key"
                 @touchstart="onTouchStart" :data-index="index" @touchmove.stop.prevent="onTouchMove">{{item}}</li>
            </ul>
        </div>
          <div class="loading" v-show="isLoading">
            <loading></loading>
        </div>
        <router-view></router-view>
  </scroll>
</template>
<script>
    import {getSingerList,getSingerInfo} from '@/api/'
    import Scroll from '@/components/scroll'
    import Loading from '@/components/loading'
export default {
    components:{
        Scroll,
        Loading
    },
  props:{
    singers:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
       isLoading:true,
      scrollY:0,
      listHeight:[],
      currentIndex:0,
      touch:{}
    }
  },
  updated() {
    this.getLiH(),
    this.isLoading = false
  },
  computed: {
    cutList(){
      let arr = [];
      for(let a in this.singers){
        arr.push(this.singers[a].title.substring(0,1))
      }
      return arr
    }
  },
  methods: {
    onTouchStart(ev){
      // 获取当前电极的下表
      let vIndex = ev.target.attributes['data-index'].value;
      // 记录鼠标点击是的位置
      this.touch.y = ev.touches[0].pageY
      this.touch.index = vIndex
      // 调用scroll方法
      this.scrollTo(vIndex)

    },
    onTouchMove(ev){
      // 记录手指滑动的位置
      this.touch.y2 = ev.touches[0].pageY
      // 计算手指划过了几个li,并向下取整
      let a1 = (this.touch.y2 - this.touch.y) / 18 | 0
      let a2 = parseInt( this.touch.index )+ a1
      this.scrollTo()
    },
    scroll(obj){
      this.scrollY = obj.y
    },
    // 获取list中每个li的高度
    getLiH(){
      let lists = this.$refs.lists
      let h = 0;
      this.listHeight.push(0)
      for(var i=0;i<lists.length;i++){
        h += lists[i].clientHeight
        this.listHeight.push(h)
      }
    },
    scrollTo(index){
      this.scrollY = - this.listHeight[index]
      this.$refs.listView.scrollToElement(this.$refs.lists[index],0)
    },

    // 跳转页面到歌手详情
    toDetail(tid){
      // console.log("aaa")
      console.log(tid)
      this.$router.push({path:`/singer/${tid}`})
    }

  },
      // 监听scrollY,去过发生改变，我们要改变class
     watch: {
      scrollY(v){
        if(v>0){
          this.currentIndex = 0
        }for(let i=0;i<this.listHeight.length;i++){
          let h1 = this.listHeight[i]
          let h2 = this.listHeight[i+1]
          if(-v >= h1 && -v < h2){
            this.currentIndex = i
            return
          }
        }
        // 底部
        this.currentIndex = this.currentIndex.length - 1
      }
    },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.list-view{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size:@font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current{
          color: @color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
}
.loading{
      position: absolute;
      width: 100%;
      height: 100%;
      background: #222;
      left: 0;
      top:0;
    }
</style>

