<template>
         <div class="detail">
            <h1>详情</h1>
            <song-list :title="title" :img="img" :list="songsList"></song-list>
        </div>
</template>

<script>
import SongList from '@/components/songsList'
import { getSingerInfo } from '@/api'
    export default {
         data() {
            return {
               songsList:[],
                title:"",
                img:"", 
            }
        },
          created() {
            this. getSingerInfoList()
        },
        methods: {
            getSingerInfoList(){
                let id = this.$route.params.id
                getSingerInfo(id).then(res => {
                    console.log(res)
                    this.title = res.data.singer_name
                    this.songsList = this.editSongs(res.data.list)
                    this.img = `//y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000`
                })
            },
                 // 对数据进行处理
            editSongs(list){
                let nList = [];
                console.log(list)
                for(var i=0; i<list.length; i++){
                    let item = {
                        // 不全
                        // 歌曲ID
                        id:list[i].musicData.songid,
                        // 歌曲名
                        name:list[i].musicData.songname,
                        // 歌手姓名
                        singer:list[i].musicData.singer,
                        // 专辑名
                        album:list[i].musicData.albumname,
                         // 专辑封面
                        img: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${
                          list[i].musicData.albummid
                        }.jpg?max_age=2592000`,
                          // 歌曲mid
                         songmid:list[i].musicData.songmid,
                          // 歌曲时长
                        interval: list[i].musicData.interval,
                    }
                    nList.push(item)
                }
                // console.log(nList)
                return nList
            }
        },
        components:{
            SongList
        }
    }
</script>

<style>
    .singerDetail{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 99;
        background-color: black;
    }
</style>