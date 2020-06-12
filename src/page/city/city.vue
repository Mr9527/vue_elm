<template>
  <div>
    <head-top goBack="true" :title="title">
      <router-link slot="menu" class="city_siwtch" to="/home">切换城市</router-link>
    </head-top>
    <form id="search_gruop" @submit.prevent>
      <div>
        <input
          type="search"
          placeholder="输入学校,商务楼,地址"
          class="city_edit input_style"
          v-model="searchText"
        />
      </div>
      <div>
        <input
          type="submit"
          name="sumbit"
          class="city_subimt input_style"
          @click="search"
          value="搜索"
        />
      </div>
    </form>
    <ul class="choose_palce_list">
      <li
        tag="li"
        v-for="(item,index) in placelist"
        @click="nextPage(index,item.geohash)"
        :key="item.id"
      >
        <h4>{{ item.name }}</h4>
        <p class="ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <header class="history_title" v-if="placelist.length==0">搜索历史</header>
    <ul class="choose_palce_list" v-if="placelist.length==0&&historyList">
      <li
        tag="li"
        v-for="(item,index) in historyList"
        @click="nextPage(index,item.geohash)"
        :key="item.id"
      >
        <h4>{{ item.name }}</h4>
        <p class="ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <div
      v-if="placelist.length==0&&historyList.length>1"
      @click="clearHistory"
      class="clear_history"
    >清除记录</div>
  </div>
</template>
<script>
import { currentcity, searchplace } from "src/service/getData";
import { setStore, getStore, removeStore } from "src/config/mUtils";
export default {
  data() {
    return {
      title: "",
      cityid: "",
      searchText: "",
      placelist: [],
      historyList: []
    };
  },
  mounted() {
    this.cityid = this.$route.params.id;
    currentcity(this.cityid).then(res => {
      this.title = res.name;
    });
    this.initData();
  },
  methods: {
    initData() {
      let history = getStore("placeHistory");
      this.historyList = history ? JSON.parse(history) : [];
      console.log("getHistory:" + this.historyList);
    },
    async search() {
      if (!this.searchText) {
        return;
      }
      let result = await searchplace(this.cityid, this.searchText);
      console.log(result);
      this.placelist = result;
    },
    nextPage(index, geohash) {
      let place = this.placelist[index];
      if (this.historyList) {
        let isAdd = true;
        this.historyList.forEach(item => {
          if (item.geohash == geohash) {
            isAdd = false;
          }
        });
        if (isAdd) this.historyList.push(place);
      } else {
        this.historyList.push(place);
      }
      setStore("placeHistory", this.historyList);
      console.log(this.historyList);
      this.$router.push({ path: "/msite", query: { geohash } });
    },
    clearHistory() {
      removeStore("placeHistory");
      this.initData();
    }
  }
};
</script>
<style lang="scss" >
@import "../../style/mixin.scss";
.city_siwtch {
  color: #fff;
  font-size: 0.6rem;
  text-align: center;
}
#search_gruop {
  padding-left: 0.45rem;
  padding-right: 0.45rem;
  margin-top: 0.6rem;
  padding-bottom: 0.6rem;
  background-color: #fff;
  border-top: $line solid 1px;
  border-bottom: $line solid 1px;
  div {
    width: 90%;
    height: 1.75rem;
    margin: 0 auto;
    text-align: center;
    .input_style {
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      border-radius: 0.1rem;
      @include wh(100%, 1.35rem);
    }
    .city_edit {
      padding-left: 0.45rem;
      padding-right: 0.45rem;
      background: #fafafa;
      border: $line solid 1px;
    }
    .city_subimt {
      background: $blue;
      color: #fff;
    }
  }
}
.choose_palce_list {
  li {
    background-color: #fff;
    border-top: $line solid 1px;
    padding-left: 1.2rem;
    padding-bottom: 0.4rem;
    h4 {
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      font-size: 0.6rem;
    }
    p {
      font-size: 0.4rem;
    }
  }
}
.history_title {
  font-size: 0.6rem;
  text-align: center;
  margin-bottom: 0.2rem;
  border-bottom: $line solid 1px;
}
.clear_history {
  background-color: #fff;
  @include wh(100%, 2rem);
  color: #666;
  text-align: center;
  border-top: $line solid 1px;
  border-bottom: $line solid 1px;
}
</style>