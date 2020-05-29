<template>
  <div id="root">
    <head-top goBack="true" title="密码登录"></head-top>
    <form class="loginForm">
      <section class="input_container">
        <input class="input_layout" placeholder="账号" type="text" v-model="account" />
      </section>
      <section class="input_container">
        <input
          v-if="showPassword"
          class="input_layout"
          type="text"
          placeholder="密码"
          v-model="password"
        />
        <input v-else class="input_layout" type="password" placeholder="密码" v-model="password" />
        <div
          class="paswword_switch"
          :class="{switch_background:showPassword}"
          @click="changedPasswordShowType"
        >
          <div class="circle_button" :class="{trans_to_right:showPassword}"></div>
        </div>
      </section>
      <section class="input_container">
        <input class="input_layout" type="text" placeholder="验证码" v-model="authCode" />
        <img class="auth_img" :src="codeImage" />
        <div v-show="codeImage" class="switch_code" @click="swithCode">
          <span>看不清</span>
          <span>换一张</span>
        </div>
      </section>
    </form>
    <section class="prompt_layout">
      <p>温馨提示:未注册过的账户,登陆时将自动注册</p>
      <p>注册过的用户可凭账户登陆</p>
    </section>
    <div class="login_button" @click="authPasswordLogin">
      <span>登陆</span>
    </div>
    <alert-tip v-if="showHide" :alertText="alertText" @closeTip="closeTip"></alert-tip>
    <router-link class="reset_pwd" to="/reset_password">重置密码?</router-link>
  </div>
</template>
<script>
import headTop from "../../components/common/head";
import alertTip from "../../components/common/alertTip";
import { mapState, mapMutations } from "vuex";
import { getcaptchas, accountLogin } from "../../service/getData";

export default {
  data() {
    return {
      account: "",
      password: "",
      authCode: "",
      codeImage: "",
      alertText: "",
      showHide: false,
      showPassword: false,
      userInfo: null
    };
  },
  components: {
    headTop,
    alertTip
  },
  methods: {
    ...mapMutations(["RECORD_USERINFO"]),
    async swithCode() {
      let res = await getcaptchas();
      this.codeImage = res.code;
    },
    changedPasswordShowType() {
      this.showPassword = !this.showPassword;
    },
    async authPasswordLogin() {
      if (!this.account) {
        this.alertConfig("请输入账户");
        return;
      }
      if (!this.password) {
        this.alertConfig("请输入密码");
        return;
      }
      if (!this.authCode) {
        this.alertConfig("短信验证码不正确");
        return;
      }
      this.userInfo = await accountLogin(
        this.account,
        this.password,
        this.authCode
      );

      if (!this.userInfo.user_id) {
        this.alertConfig(this.userInfo.message);
        this.swithCode();
      } else {
        this.RECORD_USERINFO(this.userInfo);
        this.$router.go(-1);
      }
    },
    alertConfig(text) {
      this.alertText = text;
      this.showHide = true;
    },
    closeTip() {
      this.showHide = false;
    }
  },
  created() {
    this.swithCode();
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
#root {
  .loginForm {
    margin-top: 0.6rem;
    background-color: #fff;
    .input_container {
      padding-left: 0.45rem;
      border-bottom: $bc solid 1px;
      @include wh(100%, 1.75rem);
      display: flex;
      align-content: center;
      justify-content: flex-start;
      input,
      p,
      span {
        @include font(0.8rem, 0.8rem);
        font-family: Arial, Helvetica, sans-serif;
      }
      input {
        flex-grow: 1;
      }
      ::placeholder {
        color: grey;
      }
      .switch_code {
        margin-right: 0.45rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        span:nth-of-type(1) {
          @include sc(0.66rem, #666);
        }
        span:nth-of-type(2) {
          @include sc(0.66rem, $blue);
        }
      }
    }
  }
  .paswword_switch {
    margin-top: 0.25rem;
    margin-right: 0.45rem;
    background-color: #ccc;
    @include wh(2.4rem, 1.2rem);
    border: 1px;
    border-radius: 1rem;
    .circle_button {
      @include wh(1.2rem, 1.2rem);
      box-shadow: 0 0.026666rem,
        0.053333rem 0 rgba($color: #666666, $alpha: 0.1);
      background-color: #f1f1f1;
      border-radius: 50%;
      transition: all 0.3s;
      position: absolute;
      z-index: 1;
    }
    .trans_to_right {
      transform: translateX(1.2rem);
    }
  }
  .switch_background {
    background-color: $blue;
  }
}
.login_button {
  @include cl;
  margin-top: 2rem;
  width: 320px;
  position: relative;
  display: inline-block;
  background-color: $blue;
  text-align: center;
  line-height: 1.95rem;
  z-index: 1;
  border-radius: 0.6rem;
  transition: all 0.5s;
  cursor: pointer;
  overflow: hidden;
}
.login_button:after {
  content: "";
  background: #0277bd;
  display: block;
  position: absolute;
  padding-top: 200%;
  padding-left: 200%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
  border-radius: 50%;
  transition: all 1s;
}

.login_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s;
}
.login_button span {
  cursor: pointer;
  color: #fff;
  display: inline-block;
  position: relative;
  transition: 0.5s;
  font-size: 1rem;
  font-family: "Courier New", Courier, monospace;
}

.login_button span:after {
  content: "»";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}
.login_button:hover span {
  padding-right: 25px;
}
.login_button:hover span:after {
  opacity: 1;
  right: 0;
}

.prompt_layout p {
  margin-left: 0.45rem;
  margin-top: 0.45rem;
  @include sc(0.5rem, red);
}

.reset_pwd {
  float: right;
  margin-top: 1rem;
  margin-right: 1.2rem;
  @include sc(0.6rem, #3b95e9);
}
</style>