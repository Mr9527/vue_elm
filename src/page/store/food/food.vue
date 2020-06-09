<template>
  <div class="food-container">
    <div ref="scrollHeadLayout" class="header-layout">
      <section class="nav_style" @click="$router.go(-1)">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline
            points="12,18 4,9 12,0"
            style="fill:none;stroke:rgb(255,255,255);stroke-width:2"
          />
        </svg>
      </section>
    </div>

    <img class="food-img" :src="imgBaseUrl+image" />
  </div>
</template>
<script>
import { imgBaseUrl } from "src/config/env";
import head from "src/components/common/head";
import { getImgPath } from "src/components/common/minxin";
export default {
  data() {
    return {
      name: this.$route.query.name,
      imgBaseUrl: imgBaseUrl,
      image: this.$route.query.image
    };
  }
};
</script>

<style lang="scss" scoped>
.food-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.food-img {
  margin-top: 2rem;
  height: 12rem;
  border: #f5f5f5 solid 1px;
}
.nav_style {
  padding-left: 0.2rem;
  padding-top: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  background: #ccc;
  border-radius: 1rem;
}
.header-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: #333 solid 1px;
}
</style>