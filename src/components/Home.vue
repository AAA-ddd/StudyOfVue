<template>
  <el-container>
<!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商系统后台管理系统</span>
      </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
<!--      侧边栏-->
      <el-aside :width=" isToggle?'64px': '200px'" >
              <div class="toggleButton" @click="toggleChange">|||</div>
<!--        侧边栏菜单区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" router unique-opened :collapse="isToggle" :collapse-transition="false" :default-active="activePath">
<!--          一级菜单-->
          <el-submenu :index="items.id+''" v-for="items in menuLists" :key="items.id">
            <template slot="title">
              <i :class="iconsList[items.id]"></i>
              <span>{{items.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index="'/'+subitem.path" v-for='subitem in items.children' :key="subitem.id" @click="savePath('/'+subitem.path)" >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      中间-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    // eslint-disable-next-line no-unused-expressions,no-sequences
    this.getMenuLists()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 左侧菜单数据
      menuLists: [],
      iconsList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isToggle: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      // 编程式导航 router
      this.$router.push('/login')
    },
    async getMenuLists () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('网络不好，请重试！')
      this.menuLists = res.data
    },
    toggleChange() {
      this.isToggle = !this.isToggle
    },
    savePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container{
    height: 100%;
  }
.el-header{
  background-color: #656565;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  >div{
    display: flex;
     align-items: center;
  }
  img {
    width: 60px;
    height: 60px;
  }
  span{
    font-size: 16px;
    color: #ffffff;
    margin-left: 15px;
  }
}
.iconfont {
  margin-right: 10px;
}
.el-menu{
  border-right: none;
}
.el-aside{
    background-color: #333744;
  }
.toggleButton{
  width: 100%;
  background-color: #4a5064;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.2em;
  color: #fff;
  font-size: 16px;
}
  .el-main{
    background-color: #fdf9ee;
  }
</style>
