<template>
	<transition name="list-fade">
		<div class="playlist"  ref="playlist" v-show="isShow">
			<div class="list-wrapper" >
				<div class="list-top">
					<div class="left-icon">
						<i class="iconfont" ></i>&emsp;
						<span></span><span style="color:#ffffff80"></span>
					</div>
					<div class="right-icon">
						<i class="iconfont icon-lvzhou_shanchu_lajitong"></i>
					</div>
				</div>
				<div class="list-main" ref="listMain">
					<ul>
						<li >
							<div class="songname"></div>
							<div class="control">
								<i class="iconfont"></i>&emsp;
								<span class="cha" >×</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="list-bottom">关闭</div>
			</div>
		</div>
	</transition>
</template>
<script>
  import Scroll from '@/components/scroll'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
	export default {
		data(){
			return {
				showFlag:true,
			}
		},
		 props:{
          isShow:{
              type:Boolean,
              default:false
          }
      },
			methods:{
			// ...mapMutations([
			// 	// 'clearList',
			// 	'setPlayingState',
			// 	'setModeState',
			// 	'setPlaylist',
			// 	'setCurrentIndex',
			// 	'removeItem',
			// 	'addItem'
			// ]),
			 hide(){
              this.$emit('changeShow',false)
		  },
		            ...mapMutations(["changeCurrentIndex"]),
		}
    }
</script>
<style scoped>
	.list-fade-enter-active, .list-fade-leave-active{
		transition: opacity 0.3s;
	}
	.list-fade-enter-active .list-wrapper, .list-fade-leave-active .list-wrapper{
		transition: all 0.3s
	}
	.list-fade-enter, .list-fade-leave-to{
		opacity: 0;
	}
	.list-fade-enter .list-wrapper, .list-fade-leave-to .list-wrapper{
		transform: translate3d(0, 100%, 0)
	}

	.playlist{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 200;
		background-color: rgba(0,0,0,.3);
	}
	.list-wrapper{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 430px;
		background-color: #444;
		color: #fff;
		font-size: 14px;
	}
	.list-top{
		display: flex;
		justify-content: space-between;
		color: #fff;
	    padding: 20px 30px 10px 20px;
	}
	.list-top i{
		font-size: 18px;
	}
	.list-top span{
		letter-spacing: 2px;
	}

	.list-main{
		height: 330px;
		overflow: scroll;
		padding: 0 30px 0 20px;
	}
	.list-main ul{
		padding-bottom: 285px;
	}
	.song{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 45px;
		color: #fff;
	}
	.song i{
		position: relative;
		top: -3px;
	}
	.song .songname{
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.song .cha{
		font-size: 25px;
	}
	.list-bottom{
		height: 50px;
		line-height: 50px;
		text-align: center;
		background-color: #222;
		font-size: 16px;
	}
	.active{
		color: #31c27c;
	}
</style>