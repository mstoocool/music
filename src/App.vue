<template>
  <div id="app">
    <!--播放器头部 -->
    <music-header></music-header>
    <!--tab -->
    <tab></tab>
    <!--页面 -->
    <router-view></router-view>
    <!--音乐播放器 -->
    <player></player>
  </div>
</template>

<script>
// <!-- 引入 -->
import MusicHeader from '@/components/musicheader'
import Tab from '@/components/tabs'
import Player from '@/components/player'

export default {
  name: 'App',
  components:{
    MusicHeader,
    Tab,
    Player
  }
}
</script>

<style lang="less">
  @import '~@/common/less/index.less';
</style>
