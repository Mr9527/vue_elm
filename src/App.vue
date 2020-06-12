<template>
  <div>
    <keep-alive>
      <transition name="pageTransitionName" mode="out-in">
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </transition>
    </keep-alive>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <svg-icon></svg-icon>
    <foot-guide v-show="isShowTab"></foot-guide>
  </div>
</template>

<script>
import svgIcon from "./components/common/svg";
import footGuide from "src/page/home/footGuide";
export default {
  data() {
    return {
      pageTransitionName: "slide-left",
      isShowTab: true
    };
  },
  created() {
    this.$router.afterEach((to, from) => {
      this.isShowTab =
        to.name == "msite" ||
        to.name == "search" ||
        to.name == "order" ||
        to.name == "personal_center";
    });
  },
  watch: {
    $route(to, from) {
      const toIndex = parseInt(to.meta.index);
      const fromIndex = parseInt(from.meta.index);
      this.pageTransitionName =
        toIndex > fromIndex ? "slide-right" : "slide-left";
    }
  },
  components: {
    svgIcon,
    footGuide
  }
};
</script>

<style lang="scss">
@import "./style/common";
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-100% 0);
}
</style>
