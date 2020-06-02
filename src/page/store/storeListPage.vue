<template>
  <div>
    <head-top :title="headeTitle" goBack="true"></head-top>
    <type-selected
      :foodInitName="headeTitle"
      :latitude="latitude"
      :longitude="longitude"
      :normal_category_id="restaurant_category_id"
    ></type-selected>
  </div>
</template>
<script>
import typeSelected from "src/components/common/typeSelected";
import { mapState, mapMutations } from "vuex";
import { msiteAddress } from "src/service/getData";
export default {
  data() {
    return {
      headeTitle: "",
      geohash: "",
      restaurant_category_id: ""
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
      this.restaurant_category_id = this.$route.query.restaurant_category_id;
      if (!this.latiude) {
        let res = msiteAddress(this.geohash);
        this.LOCATION(res);
      }
    }
  },
  computed: {
    ...mapState(["latitude", "longitude"])
  },
  components: {
    typeSelected
  }
};
</script>

<style lang="scss" scoped>
</style>