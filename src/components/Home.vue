<template>
    <div>
      <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      // 编程式导航 router
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
