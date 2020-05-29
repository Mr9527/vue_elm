<template>
  <div id="root">
    <head-top goBack="true" title="重置密码"></head-top>
    <form class="loginForm">
      <section class="input_container">
        <input class="input_layout" placeholder="账号" type="text" v-model="account" />
      </section>
      <section class="input_container">
        <input class="input_layout" type="password" placeholder="旧密码" v-model="oldPassword" />
      </section>
      <section class="input_container">
        <input class="input_layout" type="password" placeholder="请输入新密码" v-model="newPassword" />
      </section>
      <section class="input_container">
        <input class="input_layout" type="password" placeholder="请确认密码" v-model="sureNewPassword" />
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
    <div class="login_button" @click="changedPassword">
      <span>确认修改</span>
    </div>
    <alert-tip v-if="showHide" :alertText="alertText" @closeTip="closeTip"></alert-tip>
  </div>
</template>
<script>
import headTop from "../../components/common/head";
import alertTip from "../../components/common/alertTip";
import { mapState, mapMutations } from "vuex";
import { getcaptchas, changePassword } from "../../service/getData";

export default {
  data() {
    return {
      account: "",
      oldPassword: "",
      newPassword: "",
      sureNewPassword: "",
      authCode: "",
      codeImage: "",
      alertText: "",
      success: false,
      showHide: false,
      showPassword: false
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
    async changedPassword() {
      if (!this.account) {
        this.alertConfig("请输入账户");
        return;
      }
      if (!this.oldPassword) {
        this.alertConfig("请旧输入密码");
        return;
      }
      if (!this.newPassword) {
        this.alertConfig("请输入新密码");
        return;
      }
      if (!this.sureNewPassword) {
        this.alertConfig("请确认新密码");
        return;
      }
      if (this.newPassword != this.sureNewPassword) {
        this.alertConfig("新密码两次输入不一致,请重新输入");
        return;
      }
      if (!this.authCode) {
        this.alertConfig("请输入验证码");
        return;
      }
      let result = await changePassword(
        this.account,
        this.oldPassword,
        this.newPassword,
        this.sureNewPassword,
        this.authCode
      );

      if (result.message) {
        this.alertConfig(result.message);
        this.swithCode();
      } else {
        this.success = true;
        this.alertConfig("修改密码成功");
      }
    },
    alertConfig(text) {
      this.alertText = text;
      this.showHide = true;
    },
    closeTip() {
      this.showHide = false;
      if (this.success) {
        this.$router.go(-1);
      }
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
        font-family: "Courier New", Courier, monospace;
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
</style>