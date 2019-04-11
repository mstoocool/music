import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '@/views/recommend/'
import Singer from '@/views/singer/'
import Rank from '@/views/rank/'
import Search from '@/views/search/'
import RecommendDetail from '@/views/recommend/detail/'
import RankDetail from '@/views/rank/detail/'
import SingerDetail from '@/views/singer/detail/'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    //路由重定向
    {
      path:"/",
      redirect:"recommend"
    },
    {
      path:'/recommend',
      component:Recommend,
      children:[
        {
          path:'/recommend/:id',
          component:RecommendDetail
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:'/singer/:id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/rank',
      component:Rank,
      children:[
        {
          path:'/rank/:id',
          component:RankDetail
        }
      ]
    },
    {
      path:'/search',
      component:Search
    }
  ]
})
