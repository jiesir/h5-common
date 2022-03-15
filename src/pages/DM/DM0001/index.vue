<template>
  <div class="DM0001">
    <div class="DM0001-title" @click="add">点我请求接口</div>
    <div class="DM0001-body" @click="jump">点我跳转页面</div>
    <div class="DM0001-bottom">我只是显示数据 => {{ app.userInfo.name }}</div>
    <div class="DM0001-btn">
      <van-button type="info" @click="change('李四')">改名字</van-button>
    </div>
  </div>
</template>

<script>
import { rpc, pushWindow } from "@api";
import { Button, Toast } from "vant";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    [Button.name]: Button,
  },
  data() {
    return {
      authCode: "",
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  created() {
    console.warn(this);
    console.warn(__APP_INFO__);
    console.warn(process.env);
  },
  methods: {
    ...mapActions({
      setUserName: "setUserName",
    }),
    add() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      rpc("MB0001", {
        userCode: "abc123",
        clientId: "2",
      }).then((res) => {
        console.warn("res:", JSON.stringify(res));
        alert(JSON.stringify(res));
      });
    },
    jump() {
      pushWindow("/DM0002", { a: 1, b: 2 });
    },
    change(name) {
      this.setUserName(name);
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>