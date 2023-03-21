<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一 键 登 录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>
<script>
  // 1. 按需导入 mapMutations 辅助函数
  import {
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {

      };
    },
    methods: {
      // 1. 使用 mapMutations 辅助方法，把 m_user 模块中的 updateToken 方法映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
      // 获取微信用户的基本信息
      getUserProfile() {
        uni.getUserProfile({
          desc: '请求授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            //console.log(res)
            // 这部分是更新用户信息的
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg("已取消登录授权")
          }
        })
      },
     // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口
        // const [err, res] = await uni.login().catch(err => err)
        
        // 判断是否 uni.login() 调用失败
        // if (err || res.errMsg !== 'getUserProfile:ok') return uni.$showMsg('登录失败！')
        
        const res = await uni.login()
        
        if (res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')

        // 2. 更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
      }
    }
  }
</script>
<style lang="scss">
  .login-container {
    // 登录盒子的样式
    margin-top: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;

    // 登录按钮的样式
    .btn-login {
      width: 70%;
      border-radius: 50px;
      margin: 15px 0;
      background-color: #82AAE3;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: lightgray;
    }
  }
</style>
