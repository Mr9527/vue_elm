<template>
  <div>
    <head-top :style="{zIndex:20}" :title="headeTitle" goBack="true"></head-top>
    <type-selected
      :foodInitName="headeTitle"
      :normalCategoryId="restaurant_category_id"
      @foodType="switchFoodType"
      @sortType="sortByType"
      @activities="chooseActivities"
    ></type-selected>
    <store-list
      class="store-list-container"
      :geohash="geohash"
      :restaurantCategoryIds="restaurant_category_ids"
      :restaurantCategoryId="restaurant_category_id"
      :sortType="sortType"
      :supportIds="activities"
      :deliveryMode="deliveryMode"
    ></store-list>
  </div>
</template>
<script>
import typeSelected from "src/components/common/typeSelected";
import { mapState, mapMutations } from "vuex";
import { msiteAddress } from "src/service/getData";
import storeList from "src/components/common/storeList.vue";
export default {
  data() {
    return {
      headeTitle: "",
      geohash: "",
      restaurant_category_id: null,
      restaurant_category_ids: null,
      sortType: null,
      activities: [],
      deliveryMode: null
    };
  },
  created() {
    this.initital();
  },
  methods: {
    ...mapMutations(["LOCATION"]),
    async initital() {
      this.headeTitle = this.$route.query.title;
      this.geohash = this.$route.query.geohash;
      this.restaurant_category_id = parseInt(
        this.$route.query.restaurant_category_id
      );
      if (!this.latitude) {
        let res = await msiteAddress(this.geohash);
        this.LOCATION(res);
      }
    },
    switchFoodType(id) {
      this.restaurant_category_ids = id;
    },
    sortByType(id) {
      this.sortType = id;
    },
    chooseActivities(deliverys, activities) {
      if (deliverys[0] != null && deliverys[0].isSelect) {
        this.deliveryMode = deliverys[0].id;
      } else [(this.deliveryMode = null)];
      this.activities = [...activities];
    }
  },
  computed: {
    ...mapState(["latitude", "longitude"])
  },
  components: {
    typeSelected,
    storeList
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin.scss";
.store-list-container {
  position: relative;
  top: 4rem;
}
</style>