<template>

        <div class="detail">
            <h1>详情</h1>
            <song-list :title="title" :img="img" :list="songsList"></song-list>
        </div>

</template>

<script>
import SongList from '@/components/songsList'
import { getRankInfo} from '@/api'
    export default {
        data() {
            return {
               songsList:[],
                title:"",
                img:"", 
            }
        },
        created() {
            this. getRankInfoList()
        },
        methods: {
           
             getRankInfoList(){
                let id = this.$route.params.id
                 getRankInfo(id).then(res => {
                    console.log(res)

                    this.title = res.topinfo.ListName
                    this.img = res.topinfo.pic_album
                    this.songsList = this.editSongs(res.songlist)
                    // console.log(this.bgImg)
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
                        id:list[i].data.songid,
                        // 歌曲名
                        name:list[i].data.songname,
                        // 歌手姓名
                        singer:list[i].data.singer,
                        // 专辑名
                        album:list[i].data.albumname,
                         // 专辑封面
                        img: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${
                          list[i].data.albummid
                        }.jpg?max_age=2592000`,
                        // 歌曲时长
                        interval: list[i].data.interval,
                        // 歌曲mid
                        songmid:list[i].data.songmid,
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

<style lang="less" scoped>
  
</style>
