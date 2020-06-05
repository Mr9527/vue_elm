<template>
  <div class="store_list_container">
    <!-- <pull-to-refresh :on-refresh="initital" :on-infinite="onInfinite"> -->
    <div slot="list">
      <ul class="store_list" v-if="storeList.length" type="1">
        <li @click="itemTap(item.id)" v-for="item in storeList" :key="item.id">
          <section class="store_item">
            <img class="store_item_img" :src="imgBaseUrl+item.image_path" />
            <section class="store_item_content">
              <header class="store_item_header">
                <div>
                  <span v-if="item.is_premium" class="premium">品牌</span>
                  <span class="store_item_title ellipsis">{{item.name}}</span>
                </div>

                <div>
                  <span
                    v-for="tag in item.supports"
                    :style="{
                    color:'#'+tag.icon_color,
                    borderWidth:'0.1px',
                    borderStyle:'solid',
                    borderColor:'#f1f1f1',
                    fontSize:'0.3rem',
                    paddingRight:'0.04rem',
                    paddingLeft:'0.04rem',
                    borderRadius:'0.08rem',
                    marginRight:'0.1rem'}"
                    :key="tag.id"
                  >{{ tag.icon_name }}</span>
                </div>
              </header>
              <div class="store_item_star">
                <div class="rating_container">
                  <rating-star :rating="item.rating"></rating-star>
                  <span>{{item.rating}}</span>
                  <span>月售{{item.recent_order_num}}单</span>
                </div>
                <div class="label_list">
                  <span
                    v-if="item.delivery_mode"
                    :style="{backgroundColor:'#'+item.delivery_mode.color,
                  fontSize:'0.3rem',
                  padding:'0.05rem',
                  borderRadius:'0.05rem',
                  color:'#fff'}"
                  >{{item.delivery_mode.text}}</span>
                </div>
              </div>
              <div class="store_item_delivery">
                <div>
                  <span>¥{{item.float_minimum_order_amount}}起送</span>
                  <span>|</span>
                  <span>配送¥{{item.float_delivery_fee}}</span>
                </div>
                <div>
                  <span>{{item.distance}}</span>
                  <span>|</span>
                  <span>{{item.order_lead_time}}</span>
                </div>
              </div>
              <span>
                <img class="dashedline" src="../../images/dashedline.svg" alt="dashedline" />
              </span>
              <section class="index_activities">
                <div class="index_activities_list">
                  <div
                    class="index_activities_item"
                    v-for="storeTag in item.supports"
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
                <div
                  v-if="item.supports.length>2"
                  class="activities_open"
                  v-on:click.stop="switchActivitiesLayout(item)"
                >
                  <span>{{item.supports.length}}个活动</span>
                  <img src="../../images/detail_tag.svg" />
                </div>
              </section>
            </section>
          </section>
        </li>
      </ul>
      <ul v-else class="animation_opactiy">
        <li v-for="item  in 10" :key="item" class="list_empty_li">
          <img src="../../images/shopback.svg" class="list_empty_content" />
        </li>
      </ul>
    </div>
    <!-- </pull-to-refresh> -->
    <aside class="return_top" @click="backTop" v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop" />
      </svg>
    </aside>
    <div ref="abc" style="background-color: red;"></div>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import { shopList } from "src/service/getData";
import { imgBaseUrl } from "src/config/env";
import { showBack, animate } from "src/config/mUtils";
import ratingStar from "src/components/common/ratingStar";
import loading from "src/components/common/loading";
import { loadMore } from "src/components/common/minxin";
import PullToRefresh from "src/components/common/PullToRefresh";
export default {
  data() {
    return {
      imgBaseUrl,
      offset: 0,
      storeList: [],
      showBackStatus: false,
      showLoading: true,
      touchend: false,
      repeatReuqest: false
    };
  },
  props: {
    geohash: String,
    restaurantCategoryId: {
      type: Number,
      required: false
    },
    restaurantCategoryIds: {
      type: Number,
      required: false
    },
    sortType: {
      type: Number,
      required: false
    },
    deliveryMode: {
      type: Number,
      required: false
    },
    supportIds: {
      type: Array,
      required: false
    }
  },
  computed: {
    ...mapState(["latitude", "longitude"])
  },
  mounted() {
    this.initital();
  },
  methods: {
    async initital(done = () => {}) {
      showBack(status => {
        this.showBackStatus = status;
      });

      let res = await this.loadPage({
        restaurant_category_id: this.restaurantCategoryId
      });
      this.storeList = res;
      this.hideLoading();
      done();
    },
    async loadPage({
      restaurant_category_id = "",
      restaurant_category_ids = ""
    }) {
      let res = await shopList(
        this.latitude,
        this.longitude,
        this.offset,
        restaurant_category_id,
        restaurant_category_ids,
        this.sortType,
        this.deliveryMode,
        this.supportIds
      );
      for (var i = 0; i < res.length; i++) {
        res[i].supports.forEach((item, index) => {
          item.isShow = index < 2;
        });
      }
      if (res.length < 20) {
        this.touchend = true;
      }
      return res;
    },
    switchActivitiesLayout(list) {
      list.supports.forEach((item, index) => {
        if (index > 1) {
          item.isShow = !item.isShow;
        }
      });
    },
    backTop() {
      animate(document.body, { scrollTop: "0" }, 400, "ease-out");
      animate(document.documentElement, { scrollTop: "0" }, 400, "ease-out");
    },
    itemTap(id) {
      this.$router.push({
        path: "/store",
        query: { geohash: this.geohash, id: id }
      });
    },
    hideLoading() {
      this.showLoading = false;
    },
    async onInfinite(done) {
      if (this.touchend) {
        return;
      }
      if (this.repeatReuqest) {
        return;
      }
      this.repeatReuqest = true;
      this.offset += 20;
      let res = await this.loadPage();
      this.storeList = this.storeList.concat(res);
      done();
      this.hideLoading();
      this.repeatReuqest = false;
    },
    async changedListSource() {
      this.showLoading = true;
      let res = await this.loadPage({
        restaurant_category_ids: this.restaurantCategoryIds
      });
      this.storeList = [...res];
      this.hideLoading();
    }
  },
  components: {
    loading,
    ratingStar,
    PullToRefresh
  },
  watch: {
    restaurantCategoryIds: function(value) {
      this.changedListSource();
    },
    supportIds: function(value) {
      this.changedListSource();
    },
    sortType: function(value) {
      this.changedListSource();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin.scss";
.store_item {
  display: flex;
  justify-content: flex-start;
  padding: 0.6rem 0.4rem 0.6rem 0.4rem;
  background-color: #fff;
  border-bottom: $line solid 1px;
  overflow: hidden;
  //   @include wh(100%, 100%);
  .store_item_img {
    @include wh(2.8rem, 2.8rem);
  }

  .store_item_content {
    flex: 1;
    width: 0;
    padding-left: 0.4rem;
    flex-direction: column;
  }
}
.store_item_header {
  margin-top: -0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .store_item_title {
    font-size: 0.5rem;
    vertical-align: middle;
  }
  .premium {
    vertical-align: middle;
    background-color: #ffd930;
    font-size: 0.3rem;
    color: #ff6000;
    padding: 0.1rem;
  }
}
.store_item_delivery {
  display: flex;
  justify-content: space-between;
  @include sc(0.4rem, #666);
}
.store_item_star {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  .rating_container {
    flex-grow: 0;
    display: flex;
    align-items: center;
    span {
      @include sc(0.4rem, #999);
      margin-right: 0.2rem;
    }
  }
}
.label_list {
  display: flex;
  align-items: center;
}
.dashedline {
  flex-grow: 0;
  flex-shrink: 1;
  width: 100%;
}
.index_activities {
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
.return_top {
  position: fixed;
  right: 1rem;
  bottom: 6rem;
}
.back_top_svg {
  @include wh(2rem, 2rem);
}
.store_list_container {
  flex-grow: 0;
  flex-shrink: 1;
}
.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s;
}
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>