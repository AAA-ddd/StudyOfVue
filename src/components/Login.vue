<template>
<div class="login_container">
  <div class="login_box">
    <!--头像区域-->
    <div class="avatar">
      <img src="../assets/logo.png" alt="">
    </div>
    <!--表单区域-->
    <el-form :model="loginForm" :rules="loginFormRules" class="login_form" ref="loginFormRef">
    <!--用户名-->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
    <!--密码-->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <!--按钮-->
      <el-form-item class="btns">
        <el-button type="primary" @click="login">提交</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('您的信息输入有误，请重新填写。')
        this.$message.success('登陆成功，恭喜您。')
        // 将登陆成功后的token，保存到客户端的sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航 router
        this.$router.push('/home')
      })
    }
  }
}
</script>v

<style scoped lang="less">
.login_container{
  height: 100%;
  background-color: #9ca8b8;
  .login_box{
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
    .avatar{
      width: 130px;
      height: 130px;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 9px #ddd;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid #eee;
          background-color: #eee;
        }
    }
}
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
