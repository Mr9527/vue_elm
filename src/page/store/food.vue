<template>
  <div>
    <img :src="image" />
  </div>
</template>
<script>
import head from "src/components/common/head";
import { getImgPath } from "src/components/common/minxin";
export default {
  props: ["image", "commodity"]
};
</script>

<style lang="scss">
</style>