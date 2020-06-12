<template>
  <div ref="storeLayout" class="sotre-layout" @scroll="onScroll($event)">
    <!-- <div> -->
    <section v-show="!showLoading">
      <header ref="headerLayout" class="header-container">
        <div ref="bar" class="header-tools">
          <section class="nav-style" @click="$router.go(-1)">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" version="1.1">
              <polyline
                points="12,18 4,9 12,0"
                style="fill:none;stroke:rgb(255,255,255);stroke-width:2"
              />
            </svg>
          </section>
        </div>
        <div class="header-content">
          <img class="header-background" :src="storeInfo.img" />
          <div class="header-img-container">
            <img class="header-img" :src="storeInfo.img" />
          </div>
          <div class="store-title">{{storeInfo.name}}</div>
          <div class="store-simple-info-layout">
            <span>{{storeInfo.grade}}</span>
            <div class="vertical-line"></div>
            <span>{{storeInfo.monthSalesVolume}}</span>
            <div class="vertical-line"></div>
            <span>{{storeInfo.deliveryTime}}</span>
          </div>
          <section class="index_activities" v-if="supports.length>0">
            <div class="index_activities_list">
              <div
                class="index_activities_item"
                v-for="storeTag in supports"
                :key="storeTag.id"
                v-show="storeTag.isShow"
              >
                <!-- v-show="index<2||item.id==isShowDetial" -->

                <!-- v-show="index>1&&item.id==isShowDetial?'index_activities_item_hide':''" -->

                <span
                  class="index_activities_item_tag"
                  :style="{
                    backgroundColor:'#'+storeTag.icon_color,
                   padding:'0.1rem'}"
                >{{storeTag.icon_name}}</span>
                <span class="index_activities_item_dsc">{{storeTag.description}}</span>
              </div>
            </div>
            <div class="activities_open" v-on:click.stop="switchActivitiesLayout()">
              <span>{{supports.length}}个活动</span>
              <img src="../../images/detail_tag.svg" />
            </div>
          </section>
        </div>
      </header>
      <section class="tab-layout" ref="tabLayout">
        <div class="tab" :class="{choose_tab:chooseTabIndex==0}" @click="changedTab(0)">
          <span>商品</span>
          <div></div>
        </div>
        <div class="tab" :class="{choose_tab:chooseTabIndex==1}" @click="changedTab(1)">
          <span>评价</span>
          <div></div>
        </div>
      </section>

      <transition-group tag="div" name="switch-tab">
        <section class="commodity-layout" key="0" v-show="chooseTabIndex==0">
          <section class="commodity-type-container" ref="wrapperMenu" id="wrapper_menu">
            <ul class="commodity-type-list">
              <li v-for="(item,index) in menuList" :key="index" @click="chooseMenu(index) ">
                <div
                  :class="{selectedCommodityTypeListItem:menuIndex==index}"
                  class="commodity-type-list-item"
                >{{ item.name }}</div>
              </li>
            </ul>
          </section>
          <section class="commodity-container" ref="menuFoodList">
            <ul class="commodity-list">
              <li tag="li" v-for="(item,index) in menuList" :key="index">
                <section>
                  <header class="commodity-type-header">
                    <strong>{{item.name}}</strong>
                    <span>{{item.description}}</span>
                  </header>
                  <div>
                    <router-link
                      tag="section"
                      :to="{path:'/food',query:{image:imgBaseUrl+commodity.image_path,commodity}}"
                      class="commodity-item"
                      v-for="commodity in item.foods"
                      :key="commodity.id"
                    >
                      <div class="commodity-image-container">
                        <p
                          class="commodity-tag"
                          :style="{backgroundColor:'#'+commodity.attributes[0].icon_color}"
                          v-if="commodity.attributes.length>=1&&commodity.attributes[0]!=null"
                        >{{commodity.attributes[0].icon_name}}</p>
                        <img class="commodity-image" :src="imgBaseUrl+commodity.image_path" />
                      </div>
                      <div class="commodity-info-container">
                        <strong>{{commodity.name}}</strong>
                        <p class="commodity_description_sale_rating">
                          <span>月售{{commodity.month_sales}}份</span>
                          <span>好评率{{commodity.satisfy_rate}}%</span>
                        </p>
                        <p v-if="commodity.activity" class="commodity-activity">
                          <span
                            :style="{color:'#'+commodity.activity.image_text_color,borderColor:'#'+commodity.activity.icon_color}"
                          >{{commodity.activity.image_text}}</span>
                        </p>
                        <div>
                          <section class="commodity_price">
                            <span>¥</span>
                            <span>{{commodity.specfoods[0].price}}</span>
                            <span v-if="commodity.specifications.length">起</span>
                          </section>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </section>
              </li>
            </ul>
          </section>
        </section>
        <store-evaluate
          key="1"
          v-if="storeDetailInfo!=null&&chooseTabIndex==1"
          :storeId="storeId"
          :storeInfo="storeDetailInfo"
        ></store-evaluate>
      </transition-group>
    </section>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>
<script>
import loading from "src/components/common/loading";
import {
  msiteAddress,
  shopDetails,
  foodMenu,
  getRatingList,
  ratingScores,
  ratingTags
} from "src/service/getData";
import { mapState, mapMutations } from "vuex";
import { imgBaseUrl } from "src/config/env";
import BScroll from "better-scroll";
import { animate } from "src/config/mUtils";
import storeEvaluate from "src/page/store/storeEvaluate";

export default {
  data() {
    return {
      imgBaseUrl: imgBaseUrl,
      geohash: "",
      storeId: null,
      showLoading: true,
      chooseTabIndex: 0,
      storeInfo: {
        img: "",
        name: "正新鸡排（雅园新城店）",
        grade: "评价4.5",
        monthSalesVolume: "月售4444",
        deliveryTime: "蜂鸟快递约40分钟"
      },
      supports: [],
      storeDetailInfo: null,
      menuList: null,
      foodScroll: null, //食品列表scroll
      shopListTop: [], //商品列表的高度集合
      menuIndex: 0,
      menuIndexChange: true
    };
  },
  created() {
    this.geohash = this.$route.query.geohash;
    this.storeId = this.$route.query.id;
  },
  mounted() {
    console.log("初始化");
    this.initial();
  },
  methods: {
    ...mapMutations(["LOCATION"]),
    async initial() {
      if (!this.latitude) {
        let res = await msiteAddress(this.geohash);
        this.LOCATION(res);
      }

      this.storeDetailInfo = await shopDetails(
        this.storeId,
        this.latitude,
        this.longitude
      );
      // 装配商家信息
      this.storeInfo = {
        img: imgBaseUrl + this.storeDetailInfo.image_path,
        name: this.storeDetailInfo.name,
        grade: "评价" + this.storeDetailInfo.rating,
        monthSalesVolume: "月售" + this.storeDetailInfo.recent_order_num,
        deliveryTime:
          this.storeDetailInfo.delivery_mode.text +
          "约" +
          this.storeDetailInfo.float_minimum_order_amount +
          "分钟"
      };
      // 装配活动信息
      let supports = [...this.storeDetailInfo.supports];
      supports.forEach((item, index) => {
        item.isShow = index <= 0;
      });
      this.supports = supports;

      //获取商铺食品列表
      this.menuList = await foodMenu(this.storeId);

      this.showLoading = false;
    },
    onScroll(event) {
      let storeLayout = this.$refs.storeLayout;
      let tabLayout = this.$refs.tabLayout;
      let toolbar = this.$refs.bar;
      var scrollTop = storeLayout.scrollTop;
      if (scrollTop >= toolbar.offsetTop + tabLayout.offsetTop) {
        tabLayout.style.position = "fixed";
        tabLayout.style.top = "2rem";
      } else {
        tabLayout.style.position = "relative";
        tabLayout.style.top = 0;
      }
    },
    changedTab(index) {
      this.chooseTabIndex = index;
    },
    switchActivitiesLayout() {
      this.supports.forEach((item, index) => {
        if (index >= 1) {
          item.isShow = !item.isShow;
        }
      });
      this.supports = [...this.supports];
    },
    getFoodListHeight() {
      const listContainer = this.$refs.menuFoodList;
      if (listContainer) {
        let li = listContainer.children[0];

        const listArr = Array.from(li.children);
        console.log(li);
        listArr.forEach((item, index) => {
          let itemSection = item.children[0].children[0];
          this.shopListTop[index] = itemSection;
        });
      }
    },
    //点击左侧食品列表标题，相应列表移动到最顶层
    chooseMenu(index) {
      this.menuIndex = index;
      //menuIndexChange解决运动时listenScroll依然监听的bug
      this.menuIndexChange = false;
      let scrollHeight =
        this.shopListTop[index].offsetTop +
        this.$refs.headerLayout.offsetHeight -
        this.$refs.bar.offsetHeight;
      console.log("current scrollHeight:" + this.$refs.storeLayout.scrollTop);
      console.log(" scrollHeight:" + scrollHeight);
      animate(
        this.$refs.storeLayout,
        { scrollTop: scrollHeight },
        400,
        "ease-out"
      );
      // animate(
      //   document.documentElement,
      //   { scrollTop: scrollHeight },
      //   400,
      //   "ease-out"
      // );
    }
  },
  watch: {
    //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
    showLoading: function(value) {
      if (!value) {
        this.$nextTick(() => {
          this.getFoodListHeight();
        });
      }
    }
  },
  computed: {
    ...mapState(["latitude", "longitude", "cartList"])
  },
  components: {
    loading,
    storeEvaluate
  }
};
</script>

<style lang="scss">
@import "../../style/mixin.scss";
.header-container {
  // z-index: 10;
  // width: 100%;
  // position: fixed;
  background: #fff;
}
.header-tools {
  z-index: 10;
  display: flex;
  align-items: center;
  width: 100%;
  height: 2rem;
  background: #333;
  position: fixed;
  top: 0;
  .nav-style {
    margin-left: 0.4rem;
    overflow: hidden;
  }
}
.header-content {
  z-index: 10;
  margin-top: 2rem;
  padding-bottom: 1rem;
}
.header-img-container {
  display: flex;
  width: 100%;
  justify-content: center;
}
.header-img {
  margin-top: 1rem;
  z-index: 9;
  width: 3.5rem;
  height: 3.5rem;
}
.header-background {
  z-index: 8.9;
  @include cl;
  width: 100%;
  height: 4rem;
  filter: blur(2px);
}
.store-title {
  width: 100%;
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 0.9rem;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}
.store-simple-info-layout {
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  & > span {
    @include sc(0.4rem, #666);
  }
  .vertical-line {
    margin: 0 0.2rem 0 0.2rem;
    height: 0.3rem;
    border: $line solid 1px;
  }
}
.tab-layout {
  position: relative;
  background: #fff;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 100%;
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    width: 50%;
    text-align: center;
  }
}
.choose_tab {
  & > span {
    color: $blue;
  }
  & > div {
    width: 2rem;
    height: 0.1rem;
    border-bottom: $blue solid 3px;
  }
}
.commodity-layout {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
}

.index_activities {
  padding-left: 1rem;
  display: flex;
  overflow: hidden;
}
.index_activities_list {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.index_activities_item {
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
.index_activities_item_tag {
  color: #fff;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.3rem;
  border-radius: 0.1rem;
  margin-right: 0.2rem;
}
.index_activities_item_dsc {
  color: #666;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index_activities_item_hide {
  display: none;
}
.activities_open {
  flex-shrink: 0;
  margin-top: 0.2rem;
  margin-right: 0.4rem;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  span {
    color: #999;
    font-size: 0.36667rem;
  }
  img {
    margin-left: 0.2rem;
    margin-top: 0.2rem;
    @include wh(0.3rem, 0.15rem);
    fill: #999;
  }
}
.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s;
}
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
.sotre-layout {
  overflow: auto;
  height: 100%;
  width: 100%;
  position: absolute;
}
.commodity-type-container {
  min-width: 3rem;
}
.commodity-type-list-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  background-color: #f1f1f1;
  text-align: center;
  @include sc(0.5rem, #666);
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.commodity-type-header {
  background: #ffffff;
  height: 2rem;
  display: flex;
  align-items: center;
  strong {
    font-size: 0.6rem;
  }
  span {
    font-size: 0.4rem;
    color: #999;
    margin-left: 0.4rem;
  }
}
.selectedCommodityTypeListItem {
  background-color: #ffffff;
  color: #333;
}
.commodity-container {
  flex-grow: 1;
}
.commodity-item {
  overflow: hidden;
  display: flex;
  background-color: #fff;
  margin-bottom: 0.4rem;
  border-bottom: $line solid 1px;
}
.commodity-list {
  background-color: #fff;
  padding-left: 0.4rem;
}
.commodity-image-container {
  overflow: hidden;
  position: relative;
}
.commodity-tag {
  color: #fff;
  font-size: 0.2rem;
  width: 2rem;
  height: 1.2rem;
  padding-bottom: 0.1rem;
  display: flex;
  font-size: 0.4rem;
  align-items: flex-end;
  justify-content: center;
  transform: rotate(-45deg) translate(-0.3rem, -0.7rem);
  position: absolute;
  border: none;
  border-radius: 0;
}
.commodity-image {
  @include wh(3rem, 3rem);
  border-radius: 0.1rem;
}
.commodity-info-container {
  display: flex;
  flex-direction: column;
  padding-left: 0.4rem;
  strong:nth-of-type(1) {
    font-size: 0.5rem;
  }
  .commodity_description_sale_rating {
    display: flex;
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
    span {
      @include sc(0.4rem, rgb(26, 23, 23));
    }
  }
  .commodity_price {
    span {
      color: #f60;
      font-size: 0.5rem;
      font-family: "Helvetica Neue", Tahoma, Arial;
    }
  }
  .commodity-activity {
    display: flex;
    span {
      padding: 0.05rem;
      border-style: solid;
      border-width: 1px;
      border-radius: 0.1rem;
      width: auto;
      font-size: 0.2rem;
    }
  }
}
.switch-tab-enter-active {
  transition: all 0.2s ease-in;
}
.switch-tab-leave-active {
  transition: all 0.2s ease-out;
}
.switch-tab-enter,
.switch-tab-leave-to {
  opacity: 0;
  transform: (100%);
}
</style>