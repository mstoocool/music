<template>
    <div class="singer">
        <singer-list :singers="singerList"></singer-list>
    </div>
</template>

<script>
    import {getSingerList,getSingerInfo} from '@/api/'
    import singerList from '@/components/singerList'
    import Scroll from "@/components/scroll";


    export default {
        data() {
            return {
                singerList:[]
            }
        },
        created(){
            this.getSList()
        },
        methods: {
            getSList(){
                getSingerList().then(res => {
                    console.log(res.data)
                   this.singerList = this.newSinger(res.data.list)
                })     
            },
            newSinger(list){
                let nList = {
                    hot:{
                        title:"热门",
                        list:[]
                    }
                }
                // 取前十条数据作为热门
                list.forEach((item,index) => {
                    if(index <10){
                        nList.hot.list.push({
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name,
                            img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                        })
                    }
                    // 通过性名首字母来排序
                    let key = item.Findex
                    if(!nList[key]){
                        nList[key] = {
                            title:key,
                            list:[]
                        }
                    }
                    nList[key].list.push({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                        img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })
                })
                // 把这个对象排序成有序的数组
                let hot = []
                let other = []
                for(let i in nList){
                    if(nList[i].title.match(/[a-zA-Z]/)){
                        other.push(nList[i])
                    }else if(nList[i].title == "热门"){
                        hot.push(nList[i])
                    }
                }
                other.sort((a,b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(other)
            }
            
        },
        components:{
            singerList
        }
    }
</script>

<style lang="less" scoped>
    .singer{
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 100%;
    }
</style>

