 <template>
  <div class="rating_container">
    <div class="rating_gray">
      <img style="display: block;" src="../../images/rating_grey.svg" />
    </div>
    <div :style="{width:rating*2/4+'rem'}" class="rating_actived">
      <img style="display: block;" src="../../images/rating_actived.svg" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  props: ["rating"]
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.rating_container {
  position: relative;
  display: flex;
  align-items: center;
  vertical-align: middle;
  overflow: hidden;
  margin-right: 0.2rem;
  height: 10px;
}
.rating_gray {
  height: fit-content;
}
.rating_actived {
  height: fit-content;
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
}
</style>
