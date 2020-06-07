<template>
  <div>
    <section class="evaluate_header_container">
      <section class="store_total_score">
        <span class="store_rating">{{storeInfo.rating.toFixed(1)}}</span>
        <div>
          <p class="score_title">商家评分</p>
          <rating-star :rating="storeInfo.rating"></rating-star>
        </div>
      </section>
      <div>
        <p class="score_title">味道</p>
        <p class="score_value">{{storeScores.food_score.toFixed(1)}}</p>
      </div>
      <div>
        <p class="score_title">服务</p>
        <p class="score_value">{{storeScores.service_score.toFixed(1)}}</p>
      </div>
      <div class="header_divider">
        <div></div>
      </div>
      <div>
        <p class="score_title">配送</p>
        <p class="score_value">{{storeScores.deliver_time}} 分钟</p>
      </div>
    </section>
    <div class="content_divider"></div>
    <section class="flow_tags">
      <div
        @click="chooseTag(item)"
        class="flow_tag"
        :class="{unsatisfied: item.unsatisfied,tag_selectd:(item._id==selectedTagId||item._id=='')}"
        v-for="item in evaluateTagList"
        :key="item._id"
      >{{ item.name+" "+item.count }}</div>
    </section>
    <ul>
      <li class="user_evaluate" v-for="item in evaluateList" :key="item.id">
        <header class="user_evaluate_header">
          <img class="user_avatar" :src="getImgPath(item.avatar)" />
        </header>
        <div class="user_evaluate_content">
          <div class="user_score">
            <div>
              <p>{{item.username}}</p>
              <rating-star :rating="item.rating_star.toFixed(1)"></rating-star>
            </div>
            <span>{{item.rated_at}}</span>
          </div>
          <span class="food_name_list" v-for="(food,index) in item.item_ratings" :key="food.id">
            {{
            food.food_name }}
            <span v-show="index<item.item_ratings.length-1">+</span>
          </span>
          <div class="evaluate_gallery">
            <span v-for="item in item.item_ratings" :key="item.id">
              <img :src="getImgPath(item.image_hash)" />
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getImgPath } from "src/components/common/minxin";
import ratingStar from "src/components/common/ratingStar";
import { getRatingList, ratingScores, ratingTags } from "src/service/getData";

export default {
  data() {
    return {
      evaluateList: [],
      storeScores: null,
      evaluateTagList: [],
      evaluateOffset: 0,
      selectedTagId: ""
    };
  },
  mounted() {
    this.initial();
  },
  mixins: [getImgPath],
  methods: {
    async initial() {
      this.evaluateList = await getRatingList(
        this.storeId,
        this.evaluateOffset
      );
      this.storeScores = await ratingScores(this.storeId);
      this.evaluateTagList = await ratingTags(this.storeId);
    },
    chooseTag(item) {
      this.selectedTagId = item._id;
    }
  },
  watch: {},
  components: {
    ratingStar
  },
  props: ["storeId", "storeInfo"]
};
</script>

<style lang="scss" >
@import "../../style/mixin.scss";
.evaluate_header_container {
  z-index: 2;
  height: 3.5rem;
  border-top: $line solid 1px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  & > div {
    flex-grow: 1;
  }
}
.store_rating {
  color: #f60;
  font-size: 1.4rem;
}
.score_title {
  color: #666;
  font-size: 0.5rem;
}
.score_value {
  color: #666;
  font-size: 0.6rem;
}
.header_divider {
  height: 2rem;
  width: 1px;
  display: flex;
  align-items: center;
  div {
    height: 1.2rem;
    width: 1px;
    background-color: $line;
  }
}
.store_total_score {
  width: 40%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  span:nth-of-type(1) {
    margin-right: 0.5rem;
  }
}
.content_divider {
  height: 0.5rem;
  width: 100%;
  box-shadow: 1px 1px 2px #888888;
}
.flow_tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 0 0.4rem 0.4rem 0.4rem;
}
.flow_tag {
  background-color: #ecf5fe;
  color: #666;
  margin-left: 0.4rem;
  margin-top: 0.4rem;
  padding: 0.4rem;
  font-size: 0.4rem;
  border-radius: 0.1rem;
}
.unsatisfied {
  background-color: #f5f5f5;
  color: #666;
}
.tag_selectd {
  color: #fff;
  background-color: $blue;
}
.user_avatar {
  @include wh(2rem, 2rem);
}
.evaluate_gallery {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: $line solid 1px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  span > img {
    margin-right: 0.5rem;
    @include wh(6rem, 6rem);
  }
}
.user_evaluate {
  background-color: #fff;
  display: flex;
  flex-direction: row;
}
.user_evaluate_content {
  padding-left: 0.4rem;
}
.food_name_list {
  color: $blue;
  font-size: 0.4rem;
}
.user_score {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  div > p {
    font-size: 0.6rem;
  }
  span {
    color: #666;
    font-size: 0.5rem;
    padding-right: 1rem;
  }
}
</style>