<template >
  <div>
    <section>
      <div class="sort_item">
        <div class="sort_item_border">
          <span :class="{category_title: currentSort == 'food'}">{{foodType.name}}</span>
          <svg
            width="10"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            class="sort_icon"
          >
            <polygon points="0,3 10,3 5,8" />
          </svg>
        </div>
        <transition>
          <section class="category_list">
            <section class="category_type_list">
              <ul>
                <li
                  class="food_type_item"
                  v-for="(item,index) in foodType.typeList"
                  :key="item.id"
                  :class="{category_active:foodType.id==item.id}"
                  @click="selectCategory(item.id,index)"
                >
                  <section class="title_label">
                    <img :src="getImgPath(item.image_url)" class="category_icon" />
                    <span>{{item.name}}</span>
                  </section>
                  <section class="count_label">
                    <span class="category_count">{{item.count}}</span>
                    <svg
                      v-if="index"
                      width="8"
                      height="8"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      class="category_arrow"
                    >
                      <path d="M0 0 L6 4 L0 8" stroke="#bbb" stroke-width="1" fill="none" />
                    </svg>
                  </section>
                </li>
              </ul>
            </section>
            <section class="category_type_detail_list">
              <ul>
                <li
                  class="food_type_detail_item"
                  v-for="(item,index) in foodType.detailByTypeList"
                  v-show="index"
                  :key="item.id"
                  :class="{category_food_active:(foodType.id==item.id)||(!foodType.id&&index)}"
                  @click="selectFood(item.id,item.name)"
                >
                  <span>{{ item.name }}</span>
                  <span>{{ item.count }}</span>
                  <div class="line"></div>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { foodCategory, foodDelivery, foodActivity } from "src/service/getData";
import storeList from "./storeList.vue";
import { getImgPath } from "src/components/common/minxin";

export default {
  data() {
    return {
      currentSort: "",
      foodType: {
        name: "",
        id: "",
        typeList: [],
        detailByTypeList: []
      },
      sortType: {
        name: "",
        sortList: []
      },
      storeType: {
        activites: [],
        selectedActivity: null,
        delivery: null
      }
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let food = this.foodType;
      food.name = this.foodInitName;
      food.id = this.normal_category_id;
      food.typeList = await foodCategory(this.latitude, this.longitude);
      food.typeList.forEach(item => {
        if (food.id == item.id) {
          food.detailByTypeList = item.sub_categories;
        }
      });
    },
    selectCategory(id, index) {
      if (index === 0) {
        this.foodType.id = null;
        this.currentSort = "";
      } else {
        this.foodType.id = id;
        this.foodType.detailByTypeList = this.foodType.typeList[
          index
        ].sub_categories;
      }
      this.$emit("selectCategory", this.foodType.id, this.foodType.name);
    },
    selectFood(id, name) {
      this.foodType.id = id;
      this.foodType.name = name;
      this.currentSort = "";
      this.$emit("selectCategory", this.foodType.id, this.foodType.name);
    }
  },
  components: {
    storeList
  },
  mixins: [getImgPath],
  props: ["latitude", "longitude", "normal_category_id", "foodInitName"]
};
</script>

<style lang="scss" scoped>
@import "src/style/mixin";
.category_list {
  display: flex;
  flex-direction: row;
}

.category_type_list,
.category_type_detail_list {
  width: 50%;
  height: 13.5rem;
  overflow-y: auto;
}
.food_type_item {
  height: 1.5rem;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem 0 0.4rem;
  // border: #333 solid 1px;
  @include sc(0.5rem, #666);
  .category_icon {
    line-height: 100%;
    @include wh(1rem, 1rem);
  }
}
.title_label {
  display: flex;
  line-height: 100%;
  align-items: center;
  span {
    margin-left: 0.2rem;
  }
}
.category_active {
  background-color: #fff;
}
.count_label {
  line-height: 100%;
}
.category_count {
  background: #ccc;
  color: #fff;
  border-radius: 10rem;
  padding: 0.06rem;
}

.food_type_detail_item {
  background-color: #fff;
  padding: 0 0.4rem 0 0.4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  // border-bottom: $line solid 1px;
  span {
    @include sc(0.5rem, #666);
  }
}
.line {
  align-self: flex-end;
  width: 100%;
  height: 1px;
  position: absolute;
  border-bottom: $line solid 1px;
}
.category_food_active {
  span:first-child {
    color: $blue;
  }
}
</style>