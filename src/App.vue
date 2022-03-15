<template>
  <div id="app">
    <page-ainimate></page-ainimate>
  </div>
</template>
<script>
import pageAinimate from "@/components/page-ainimate";
export default {
  name: "App",
  components: {
    pageAinimate
  }
};
</script>
<style lang="less">
body {
  margin: 0 !important;
  -webkit-text-size-adjust: 100% !important;
}
</style>
