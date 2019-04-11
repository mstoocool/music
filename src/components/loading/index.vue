<template>
    <div class="load">
        <img src="./loding.gif">
        <p v-text="title"></p>
    </div>
</template>

<script>
    export default {
        props:{
            title:{
                type:String,
                default:"loading..."
            }
        }
    }
</script>

<style lang="less" scoped>
@import '~@/common/less/variable.less';
    .load{
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        margin-top: -25px;
        img{
            width: 50px;
            height: 30px;  
        }
        p{
            line-height: 20px;
            font-size: @font-size-small ;
            color: @color-text-l;
        }
    }
</style>