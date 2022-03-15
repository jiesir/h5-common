<template>
  <div class="groupPanel">
    <div class="groupPanel-title">
      <div></div>
      <div>{{ title }}</div>
      <div>{{ item }}</div>
    </div>
    <div class="groupPanel-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "group-panel",
  props: {
    title: {
      String: String,
      default: ""
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="less" scoped>
.groupPanel {
  width: 90%;
  height: auto;
  margin: 0.6rem 0 0.6rem 5%;
  border-radius: 4px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;

  &-title {
    position: relative;
    width: 90%;
    height: 2rem;
    margin: 0 5%;
    border-bottom: 1px solid #e6e6e6;
    display: inline;
    display: flex;
    align-items: center;

    > div:nth-child(1) {
      width: 0.1rem;
      height: 0.8rem;
      background-color: #e60000;
    }

    > div:nth-child(2) {
      color: #33333f;
      font-size: 0.7rem;
      font-weight: 600;
      margin-left: 0.5rem;
    }

    > div:nth-child(3) {
      color: #99999f;
      font-size: 0.65rem;
      margin-left: 0.2rem;
    }
  }

  &-box {
    position: relative;
    width: 90%;
    margin: 0 5%;
    height: auto;
  }
}
</style>