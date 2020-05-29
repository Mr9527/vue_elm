<template>
  <header id="head_layout">
    <slot name="logo"></slot>
    <div class="nav_style" v-if="!goBack">
      <slot name="nav"></slot>
    </div>
    <section class="nav_style" v-if="goBack" @click="$router.go(-1)">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2" />
      </svg>
    </section>
    <div>
      <slot name="title"></slot>
    </div>
    <div class="title_space"></div>
    <span v-if="title" v-on:click="$emit('titleClick')" class="head_title ellipsis">{{title}}</span>
    <router-link :to="userInfo?'/personal_center':'/login'" v-if="loginState" class="login_layout">
      <svg class="user_avatar" v-if="userInfo">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user" />
      </svg>
      <span class="login_span" v-else>登录 | 注册</span>
    </router-link>
    <div class="menu">
      <slot name="menu"></slot>
    </div>
  </header>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  props: ["loginState", "title", "goBack"],
  mounted() {
    this.refreshUserInfo();
  },
  methods: {
    ...mapActions(["refreshUserInfo"])
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style lang="scss">
@import "../../style/mixin.scss";
#head_layout {
  // position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $blue;
  @include wh(100%, 2rem);
  .login_layout {
    .login_span {
      color: #fff;
      @include font(0.6rem, 1.95rem);
    }
    .user_avatar {
      fill: #fff;
      @include wh(0.8rem, 0.8rem);
    }
  }
  .nav_style {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    overflow: hidden;
  }
  .menu {
    margin-right: 0.45rem;
    display: flex;
    align-items: center;
    // justify-content: center;
  }
}
.head_title {
  text-align: center;
  position: absolute;
  max-width: 200px;
  @include cl;
  @include sc(0.8rem, #fff);
  // font-weight: bold;
  font-family: "Courier New", Courier, monospace;
}
.title_space {
  flex-grow: 1;
}
</style>
