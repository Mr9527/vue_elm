<template>
  <div class="flex_home">
    <head-top :title="address.name" login-state="msite" @titleClick="chooseCity">
      <router-link :to="'/search/geohash'" class="search" slot="nav">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none" />
          <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2" />
        </svg>
      </router-link>
    </head-top>
    <nav class="msite_nav">
      <div class="swiper-container" v-if="foodTypes.length">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide food_types_container"
            v-for="(item, index) in foodTypes"
            :key="index"
          >
            <router-link
              :to="'/fuck'"
              v-for="foodItem in item"
              :key="foodItem.id"
              class="link_to_food"
            >
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url" />
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else />
    </nav>
    <div class="store_container">
      <header class="store_header">
        <span class="store_List_header">—— 推荐商家 ——</span>
      </header>
      <store-list class="sxxxx" v-if="geohashState" :geohash="address.geohash"></store-list>
    </div>
  </div>
</template>
<script>
import { msiteAddress, cityGuess, msiteFoodTypes } from "src/service/getData";
import storeList from "src/components/common/storeList";
import { mapMutations } from "vuex";
import "src/plugins/swiper.min.js";
import "src/style/swiper.min.css";
export default {
  data() {
    return {
      geohashState: false,
      address: {
        name: "",
        geohash: ""
      },
      foodTypes: [],
      imgBaseUrl: "https://fuss10.elemecdn.com"
    };
  },
  async beforeMount() {
    let geohash = this.$route.query.geohash;
    if (!geohash) {
      this.address = await cityGuess();
    } else {
      this.address = await msiteAddress(geohash);
    }
    this.geohashState = true;
    this.SAVE_GEOHASH(geohash);
    this.LOCATION(this.address);
  },
  mounted() {
    msiteFoodTypes(this.geohash)
      .then(res => {
        let arraySourceLength = res.length;
        let tmpArray = [...res];
        let foodTypeArray = [];
        for (let i = 0, j = 0; i < arraySourceLength; i += 8, j++) {
          foodTypeArray[j] = tmpArray.splice(0, 8);
        }
        this.foodTypes = foodTypeArray;
      })
      .then(() => {
        new Swiper(".swiper-container", {
          pagination: ".swiper-pagination",
          loop: true
        });
      });
  },
  components: {
    storeList
  },
  methods: {
    ...mapMutations(["SAVE_GEOHASH", "LOCATION"]),
    chooseCity() {
      this.$router.push({ path: "/home" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.search {
  display: flex;
}
.msite_nav {
  padding-top: 0.5rem;
  background-color: #fff;
  height: 6rem;
  .swiper-container {
    @include wh(100%, auto);
    padding-bottom: 1.2rem;
  }
  .fl_back {
    @include wh(100%, 1000%);
  }
}
.food_types_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .link_to_food {
    width: 25%;
    figure {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        display: flex;
        @include wh(1.8rem, 1.8rem);
      }
      figcaption {
        text-align: center;
        @include sc(0.4rem, #666);
      }
    }
  }
}
.store_container {
  .store_header {
    .store_List_header {
      display: flex;
      justify-content: center;
      width: 100%;
      @include sc(0.8rem, #999);
      font-family: "Courier New", Courier, monospace;
    }
  }
}
.flex_home {
  display: flex;
  flex-direction: column;
}
.sxxxx {
  flex-grow: 0;
  flex-shrink: 1;
}
</style>