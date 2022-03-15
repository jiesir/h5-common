<template>
  <div class="DM0002">
    <div
      v-for="(item,key) in list"
      :key="key"
      @click="onClick(item.id)"
      :class="selects(item.id)"
    >{{item.name}}</div>
    <img alt="Vue logo" src="@assets/logo.png" @click="back" />
  </div>
</template>

<script>
import { back, params } from "@api";
export default {
  data() {
    return {
      list: [
        { name: "zhangsan", id: 1 },
        { name: "lisi", id: 2 },
        { name: "wangwu", id: 3 }
      ],
      selecteds: ""
    };
  },
  created() {
    this.selecteds = this.list[0].id;
    console.warn(this);
  },
  mounted() {
    console.warn("params:", params(this));
  },
  methods: {
    back() {
      back();
    },
    onClick(id) {
      this.selecteds = id;
      console.warn(id);
    },
    selects(id) {
      if (id == this.selecteds) {
        return "divs";
      }
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>