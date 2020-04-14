import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'
import Rights from '../components/Rights'
import Roles from '../components/Roles'
import Categories from '../components/Categories'
import Params from '../components/Params'
import Goods from '../components/GoodsLists'
import Add from '../components/Add'
import Order from '../components/Order'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        }, {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/add',
          component: Add
        }, {
          path: '/orders',
          component: Order
        }
      ]
    }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示要去的路径
  // from 表示从哪里来的
  // next 表示一个函数
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
