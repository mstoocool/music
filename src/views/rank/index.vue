<template><div class="ranks">
  <scroll class="rank" :listenScroll="true" :probeType="3">
      
    <ul>
      <li class="item" v-for="item in rankList" :key="item.key" @click="toDetail(item.id)">
        <div class="icon">
          <img :src="item.picUrl">
        </div>
        <div class="text">
          <li v-for="(item1,index) in item.songList" :key="item1.key">
            <p
              class="songname"
            >{{index+1}}&nbsp;&nbsp;{{item1.songname}}&nbsp;&nbsp;-&nbsp;-&nbsp;&nbsp;{{item1.singername}}</p>
          </li>
        </div>
      </li>
    </ul>
      
  </scroll>
  <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from "@/api/"
import {getRankInfo} from "@/api/"
import Scroll from "@/components/scroll";
export default {
  data() {
    return {
      rankList: [],
        songList:[],
    };
  },
  created() {
    this.getCdInfoList();
  },
  components: {
    Scroll
  },
  methods: {
    getCdInfoList() {
      getRankList().then(res => {
        console.log(res);
        this.rankList = res.data.topList;
        console.log(this.rankList);
      });
    },
    // 跳转页面
    toDetail(tid){
        this.$router.push({path:`/rank/${tid}`})
    }
  },
};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.rank { position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.ranks {
  position: relative;
  width: 100%;
  height: 100%;
 
  .item {
    display: flex;
    box-sizing: border-box;
    padding: 0 20px 20px 20px;
    height: 100px;
    //  padding-bottom: 30px;
    .icon {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      padding-right: 20px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      overflow: hidden;
      font-size: @font-size-medium;
      font-size: 12px;
      margin-left: 20px;
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>

