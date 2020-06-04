<template >
  <div class="type_choose_container">
    <section class="filter_tab_list">
      <div
        v-for="(item,index) in filterList"
        :key="index"
        class="filter_tab"
        :class="{choose_type:currentSort == item}"
        @click="chooseType(item)"
      >
        <div class="filter_tab_border">
          <span
            :class="{choose_title: currentSort == item}"
          >{{index==0&& currentSort != item&&foodType.name?foodType.name:item}}</span>
          <svg
            width="10"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            class="filter_tab_icon"
          >
            <polygon points="0,3 10,3 5,8" />
          </svg>
        </div>
      </div>
    </section>
    <transition-group tag="section" name="showlist">
      <section class="pop_layout" v-show="currentSort==filterList[0]" key="0">
        <section class="category_type_list">
          <ul>
            <li
              class="food_type_item"
              v-for="(item,index) in foodType.typeList"
              :key="item.id"
              :class="{category_active:foodType.groupId==item.id}"
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
              v-for="(item,index) in foodType.detailByTypeList"
              v-show="index"
              :key="item.id"
              :style="{backgroundColor:'#fff'}"
              :class="{category_food_active:(foodType.childId==item.id)||(!foodType.childId&&index==0)}"
              @click="selectFood(item.id,item.name)"
            >
              <div class="food_type_detail_item">
                <span>{{ item.name }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="line"></div>
            </li>
          </ul>
        </section>
      </section>
      <section class="pop_layout" v-show="currentSort==filterList[1]" key="1">
        <ul class="sort_list">
          <li
            v-for="item  in sortType.list"
            :key="item.id"
            @click="selectSort(item.id)"
            :class="{choose_type:item.id==sortType.id}"
          >
            <div class="sort_item">
              <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="item.icon" />
              </svg>
              <span class="choose_title">{{item.name}}</span>
              <div class="flex-space"></div>
              <svg class="sort_selected_icon" v-if="item.id==sortType.id">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected" />
              </svg>
            </div>
            <div class="divider"></div>
          </li>
        </ul>
      </section>
      <section class="pop_layout" v-show="currentSort==filterList[2]" key="2">
        <div class="store_filter_container">
          <div>配送方式</div>
          <ul class="flow_list deliverys_layout">
            <li
              v-for="(item,index) in storeType.tmpDeliverys"
              :key="item.id"
              class="flow_box"
              @click="selectDelivery(item,index)"
            >
              <svg class="selected_icon">
                <use
                  xmlink="http://www.w3.org/1999/xlink"
                  :xlink:href="item.isSelect?'#selected':'#fengniao'"
                />
              </svg>
              <span class="activity_name">{{ item.text }}</span>
            </li>
          </ul>
          <div>商家属性(可以多选)</div>
          <ul class="flow_list">
            <li
              v-for="(item,index) in storeType.tmpActivites"
              :key="item.id"
              class="flow_box"
              @click="selectStoreActivity(item,index)"
            >
              <svg v-show="item.isSelect" class="selected_icon">
                <use xmlink="http://www.w3.org/1999/xlink" xlink:href="#selected" />
              </svg>
              <span
                :style="{
                    color:'#'+item.icon_color,
                    borderWidth:'0.1px',
                    borderStyle:'solid',
                    borderColor:'#'+item.icon_color,
                    fontSize:'0.5rem',
                    paddingRight:'0.04rem',
                    paddingLeft:'0.04rem',
                    borderRadius:'0.08rem',
                    marginRight:'0.2rem'}"
                class="activity_icon"
                v-show="!item.isSelect"
              >{{item.icon_name}}</span>
              <span class="activity_name choose_title">{{ item.name }}</span>
            </li>
          </ul>
          <div class="store_filter_buttons">
            <div class="clear_store_flag" @click="clearStoreFlag()">清空</div>
            <div class="config_store_choose" @click="sureStoreFilter()">
              <span>确定{{storeTypeCount}}</span>
            </div>
          </div>
        </div>
      </section>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { foodCategory, foodDelivery, foodActivity } from "src/service/getData";
import { getImgPath } from "src/components/common/minxin";

export default {
  data() {
    return {
      filterList: ["分类", "排序", "筛选"],
      currentSort: "",
      foodType: {
        name: "",
        groupId: "",
        childId: "",
        typeList: [],
        detailByTypeList: []
      },
      sortType: {
        id: 0,
        list: [
          { name: "智能排序", id: 0, icon: "#default" },
          { name: "距离最近", id: 5, icon: "#distance" },
          { name: "销量最高", id: 6, icon: "#hot" },
          { name: "起送价最低", id: 1, icon: "#price" },
          { name: "配送速度最快", id: 2, icon: "#speed" },
          { name: "评分最高", id: 3, icon: "#rating" }
        ]
      },
      storeType: {
        activites: [],
        tmpActivites: [],
        deliverys: [],
        tmpDeliverys: []
      }
    };
  },
  computed: {
    storeTypeCount: function() {
      let count = 0;
      this.storeType.tmpDeliverys.forEach(item => {
        if (item.isSelect) count++;
      });
      this.storeType.tmpActivites.forEach(item => {
        if (item.isSelect) count++;
      });
      return count == 0 ? "" : " (" + count + ")";
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let food = this.foodType;
      food.name = this.foodInitName;
      food.groupId = this.normal_category_id;
      food.typeList = await foodCategory(this.latitude, this.longitude);
      food.typeList.forEach(item => {
        if (food.groupId == item.id) {
          food.detailByTypeList = item.sub_categories;
        }
      });
      let deliveryResult = await foodDelivery(this.latitude, this.longitude);
      let activitesResult = await foodActivity(this.latitude, this.longitude);
      deliveryResult.forEach(item => {
        item.isSelect = false;
      });
      activitesResult.forEach(item => {
        item.isSelect = false;
      });
      this.storeType.deliverys = deliveryResult;
      this.storeType.tmpDeliverys = deliveryResult;
      this.storeType.activites = activitesResult;
      this.storeType.tmpActivites = activitesResult;
    },
    selectCategory(id, index) {
      if (index === 0) {
        this.foodType.groupId = null;
        this.currentSort = "";
        this.foodType.name = "";
      } else {
        this.foodType.groupId = id;
        this.foodType.detailByTypeList = this.foodType.typeList[
          index
        ].sub_categories;
      }
      // this.$emit("selectCategory", this.foodType.groupId, this.foodType.name);
    },
    selectFood(id, name) {
      this.foodType.childId = id;
      this.foodType.name = name;
      this.currentSort = "";
      this.$emit("foodType", id);
    },
    selectSort(id) {
      this.sortType.id = id;
      this.currentSort = "";
      this.$emit("sortType", id);
    },
    chooseType(type) {
      if (this.currentSort == type) {
        this.currentSort = "";
      } else {
        this.currentSort = type;
      }
    },
    selectStoreActivity(item, index) {
      this.storeType.tmpActivites[index].isSelect = !item.isSelect;
    },
    selectDelivery(item, index) {
      this.storeType.tmpDeliverys[index].isSelect = !item.isSelect;
    },
    clearStoreFlag() {
      this.storeType.deliverys.forEach((item, index) => {
        item.isSelect = false;
        this.storeType.tmpDeliverys[index].isSelect = false;
      });
      this.storeType.activites.forEach((item, index) => {
        item.isSelect = false;
        this.storeType.tmpActivites[index].isSelect = false;
      });
    },
    sureStoreFilter() {
      this.storeType.activites.forEach((item, index) => {
        item.isSelect = this.storeType.tmpActivites[index].isSelect;
      });
      this.$emit("activities", this.storeType.activites);

      this.storeType.deliverys.forEach((item, index) => {
        item.isSelect = this.storeType.tmpDeliverys[index].isSelect;
      });
      this.$emit("deliverys", this.storeType.deliverys);
      this.currentSort = "";
    }
  },
  mixins: [getImgPath],
  props: ["latitude", "longitude", "normalCategoryId", "foodInitName"]
};
</script>

<style lang="scss" scoped>
@import "src/style/mixin";
.type_choose_container {
  background-color: #fff;
  border-bottom: 0.025rem solid #f1f1f1;
  position: fixed;
  top: 1.95rem;
  right: 0;
  width: 100%;
  display: flex;
  z-index: 15;
  box-sizing: border-box;
  .filter_tab_list {
    z-index: 14;
    position: absolute;
    display: flex;
    width: 100%;
    height: 1.95rem;
    flex-direction: row;
  }
  .filter_tab {
    height: 1.95rem;
    background-color: #fff;
    z-index: 14;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .filter_tab_icon {
    margin-left: 0.2rem;
    transition: all 0.3s;
    fill: #666;
  }
}
.filter_tab_border {
  width: 100%;
  height: 100%;
  border-right: $line solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.1rem;
  @include sc(0.5rem, #666);
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
  .title_label {
    display: flex;
    line-height: 100%;
    align-items: center;
    span {
      margin-left: 0.2rem;
    }
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
.pop_layout {
  z-index: 10;
  display: flex;
  flex-direction: row;
  width: 100%;
  position: absolute;
  top: 1.95rem;
  background-color: #fff;
  border-top: 0.025rem solid $bc;
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
  margin-left: 0.4rem;
  border-bottom: $line solid 1px;
}
.showlist-enter-active,
.showlist-leave-active {
  transition: all 0.3s;
  transform: translateY(0);
}
.showlist-enter,
.showlist-leave-active {
  opacity: 0;
  transform: translateY(-100%);
}

.category_food_active {
  span:first-child {
    color: $blue;
  }
}

.choose_type {
  .filter_tab_icon {
    transform: rotate(180deg);
    fill: $blue;
  }
  .choose_title {
    color: $blue;
  }
}
.sort_list {
  width: 100%;
  .sort_item {
    height: 2.2rem;
    display: flex;
    align-items: center;
    span {
      font-size: 0.8rem;
    }
    svg:nth-of-type(1) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
    svg {
      @include wh(1rem, 1rem);
    }
    .sort_selected_icon {
      margin-right: 0.4rem;
    }
  }
}
.divider {
  margin-left: 2rem;
  height: 1px;
  width: 100%;
  border-bottom: $line solid 1px;
}
.flex-space {
  flex-shrink: 0;
  flex-grow: 1;
}
.flow_list {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding-bottom: 0.4rem;
  justify-content: space-around;
}
.flow_box {
  padding-left: 0.4rem;
  margin-top: 0.4rem;
  width: 30%;
  height: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: $line solid 1px;

  .activity_name {
    @include sc(0.5rem, #666);
  }
  .selected_icon {
    margin-right: 0.2rem;
    @include wh(0.8rem, 1rem);
  }
}
.store_filter_buttons {
  padding: 0.2rem;
  height: 2rem;
  background: #f1f1f1;
  display: flex;
  justify-content: space-between;
  .clear_store_flag {
    background: #fff;
    color: #333;
    flex-grow: 1;
    text-align: center;
    margin-right: 0.2rem;
    border-radius: 0.2rem;
    flex-basis: 0%;
  }
  .config_store_choose {
    margin-left: 0.2rem;
    border-radius: 0.2rem;
    text-align: center;
    flex-grow: 1;
    background: #56d175;
    flex-basis: 0%;
    span {
      color: #fff;
    }
  }
}
.deliverys_layout {
  justify-content: start;
  padding-left: 0.4rem;
}
</style>