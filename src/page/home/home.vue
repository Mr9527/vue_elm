<template>
  <div>
    <head-top login-state="home">
      <span slot="logo" class="head_logo">ele.me</span>
    </head-top>
    <nav id="city_nav">
      <div id="city_prompt">
        <span>当前定位城市:</span>
        <span>定位不准时,请在城市列表中选择</span>
      </div>
      <router-link id="city_link" :to="'/city/'+id">
        <span>{{name}}</span>
        <svg class="arrow_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right" />
        </svg>
      </router-link>
    </nav>
    <section class="city_container hot_city">
      <h4 class="city_title">热门城市</h4>
      <ul class="city_ul clear">
        <router-link
          class="city_item"
          tag="li"
          v-for="item in hotcityList"
          :to="'/city/'+item.id"
          :key="item.id"
        >{{ item.name }}</router-link>
      </ul>
    </section>
    <section class="city_container">
      <ul v-for="(value, key, index) in  citySortList" :key="key">
        <h4 class="city_title">
          {{key}}
          <span v-if="index==0">(按字母排序)</span>
        </h4>
        <ul class="city_ul clear city_lit">
          <router-link
            class="city_item ellipsis"
            tag="li"
            v-for="item in value"
            :to="'/city/'+item.id"
            :key="item.id"
          >{{ item.name }}</router-link>
        </ul>
      </ul>
    </section>
  </div>
</template>

<script>
import { cityGuess, hotcity, groupcity } from "../../service/getData";
import headTop from "../../components/common/head";
export default {
  data() {
    return {
      name: "",
      id: "",
      hotcityList: [],
      groupCityBean: {}
    };
  },
  mounted() {
    cityGuess().then(res => {
      this.name = res.name;
      this.id = res.id;
    });
    hotcity().then(res => {
      this.hotcityList = res;
    });
    groupcity().then(res => {
      this.groupCityBean = res;
    });
  },
  components: {
    headTop
  },
  computed: {
    citySortList() {
      let obj = {};
      for (let i = 65; i <= 90; i++) {
        const index = String.fromCharCode(i);
        obj[index] = this.groupCityBean[index];
      }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.head_logo {
  margin-left: 0.4rem;
  font-weight: 400;
  @include sc(0.7rem, #fff);
}
// 定位栏
#city_nav {
  padding-top: 2.25rem;
  border-top: 1px solid $bc;
  background-color: $fc;
  #city_prompt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1.45rem;
    padding: 0 0.45rem;
    span:nth-of-type(1) {
      @include sc(0.55rem, #666);
    }
    span:nth-of-type(2) {
      font-weight: 900;
      @include sc(0.45rem, #999);
    }
  }
  #city_link {
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    margin-bottom: 0.45rem;
    @include fj;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    @include font(0.6rem, 1.75rem);
    span:nth-of-type(1) {
      color: $blue;
    }
    .arrow_right {
      @include wh(0.6rem, 0.6rem);
      fill: #999;
    }
  }
}
.city_container {
  .city_title {
    background-color: #fff;
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-left: 0.45rem;
    @include font(0.6rem, 1.75rem);
    text-indent: 0.45rem;
    // border-top: 2px solid $bc;
    // border-bottom: 1px solid $bc;
    span {
      @include sc(0.475rem, #999);
    }
  }
  .city_ul {
    li {
      float: left;
      text-align: center;
      border-bottom: 1px solid $bc;
      border-right: 1px solid $bc;
      @include wh(25%, 1.75rem);
      @include font(0.6rem, 1.75rem);
    }
    li:nth-of-type(4n) {
      border-right: none;
    }
  }
}
.city_lit {
  border-bottom: 1px solid $bc;
  margin-bottom: 0.4rem;
  background-color: #fff;
}
.hot_city {
  li {
    color: $blue;
    background-color: #fff;
  }
}
</style>
