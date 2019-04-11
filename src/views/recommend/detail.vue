<template>
  <song-list :title="title" :img="bgImg" :list="songsList"></song-list>
</template>

<script>
import SongList from "@/components/songsList";
import { getCdInfo } from "@/api";
export default {
  data() {
    return {
      songsList: [],
      title: "",
      bgImg: ""
    };
  },
  created() {
    this.getCdInfoList();
  },
  methods: {
    getCdInfoList() {
      getCdInfo().then(res => {
        console.log(res);

        this.title = res.data.cdlist[0].dissname;
        this.bgImg = res.data.cdlist[0].logo;
        this.songsList = this.editSongs(res.data.cdlist[0].songlist);
      });
    },
    // 对数据进行处理

// http://113.215.22.158/amobile.music.tc.qq.com/C400${
//               list[i].songmid
//             }.m4a?guid=5827246440&vkey=${key}&uin=0&fromtag=38
    editSongs(list) {
      let nList = [];
      for (var i = 0; i < list.length; i++) {
             let item = {
            // 不全
            // 歌曲ID
            id: list[i].songid,
            // 歌曲名
            name: list[i].songname,
            // 歌手姓名
            singer: list[i].singer,
            // 专辑名
            album: list[i].albumname,
            // 专辑封面
            img: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${
              list[i].albummid
            }.jpg?max_age=2592000`,
            // 歌曲时长
            interval: list[i].interval,
            // 歌曲mid
            songmid:list[i].songmid,
          }
        // getkey(list[i].songmid).then(res => {
        //     item.url = `http://113.215.22.158/amobile.music.tc.qq.com/C400${
        //       res.data.items[0].songmid
        //     }.m4a?guid=5827246440&vkey=${res.data.items[0].vkey}&uin=0&fromtag=38`  
        // }); 
         nList.push(item)
      }
      return nList;
    }
  },
  components: {
    SongList
  }
};
</script>

<style lang="less" scoped>
</style>
