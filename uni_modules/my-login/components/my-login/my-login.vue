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
  // 按需导入辅助函数
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    data() {
      return {};
    },
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo']),
    },
    methods: {
      // 调用 mapMutations 辅助方法，把 m_user 模块中的方法映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
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
        //const [err, res] = await uni.login().catch(err => err)
        const res = await uni.login()
        /*
        uni.login({
          provider: 'weixin', //使用微信登录
          success: (res) => {
            this.res = res
          },
          fail: (res) => {
            return uni.$showMsg('登录失败！')
          }
        });*/

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        // 换取 token
        /*const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        */
        const loginResulttoken =
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"

        // 2. 更新 vuex 中的 token
        //this.updateToken(loginResult.message.token)
        this.updateToken(loginResulttoken)

        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
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
