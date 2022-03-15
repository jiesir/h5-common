<template>
  <transition :name="state.pageDirection" @leave="setRouterMap">
    <keep-alive v-if="$route.meta.keepAlive===true">
      <router-view class="page"></router-view>
    </keep-alive>
    <router-view v-else class="page"></router-view>
  </transition>
</template>
<script>
let localSessionRouteChain = sessionStorage.getItem("$$routeChain") || [];

export default {
  name: "page-transition",
  data: function() {
    try {
      localSessionRouteChain =
        this.$route.path !== "/" ? JSON.parse(localSessionRouteChain) : [];
    } catch (error) {
      localSessionRouteChain = [];
    }
    return {
      state: {
        addCount: localSessionRouteChain.length,
        routerMap: {},
        pageDirection: "slide-left",
        routeChain: localSessionRouteChain
      }
    };
  },
  methods: {
    addRouteChain(route) {
      if (this.state.addCount === 0 && localSessionRouteChain.length > 0) {
        // 排除刷新的时候
        this.state.addCount = 1;
      } else {
        if (
          (this.state.addCount !== 0 &&
            this.state.routeChain[this.state.routeChain.length - 1].path !==
              route.path) ||
          this.state.addCount === 0
        ) {
          this.state.routeChain.push({
            path: route.path
          });
          sessionStorage.setItem(
            "$$routeChain",
            JSON.stringify(this.state.routeChain)
          );
          this.state.addCount++;
        }
      }
    },
    popRouteChain() {
      this.state.routeChain.pop();
      sessionStorage.setItem(
        "$$routeChain",
        JSON.stringify(this.state.routeChain)
      );
    },
    setPageDirection({ dir, to, from }) {
      this.state.pageDirection = dir;
      this.state.routerMap["to"] = to.path;
      this.state.routerMap["from"] = from.path;
    },
    setRouterMap() {
      let dir = this.state.pageDirection;
      let to = this.state.routerMap.to.replace(/\//g, "_");
      let from = this.state.routerMap.from.replace(/\//g, "_");
      try {
        if (dir === "slide-left") {
          // 进入
          this.state.routerMap[from] = document.getElementById(from).scrollTop;
        } else if (dir === "slide-right") {
          // 返回
          if (this.$route.meta.keepAlive === true) {
            document.getElementById(to).scrollTop = this.state.routerMap[to];
          }
        } else {
        }
      } catch (error) {}
    }
  },
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      // 定义一个可以记录路由路径变化的数据，这里用sessionStorage,或者在window.routeChain等变量
      let routeLength = this.state.routeChain.length;
      if (routeLength === 0 || this.state.addCount === 0) {
        this.setPageDirection({ dir: "slide-left", to, from });
        this.addRouteChain(from);
        this.addRouteChain(to);
      } else if (routeLength === 1) {
        this.setPageDirection({ dir: "slide-left", to, from });
        this.addRouteChain(to);
      } else {
        let lastBeforeRoute = this.state.routeChain[routeLength - 2];
        if (lastBeforeRoute.path === to.path && to.meta.slideLeft !== true) {
          this.popRouteChain();
          this.setPageDirection({ dir: "slide-right", to, from });
        } else {
          this.addRouteChain(to);
          this.setPageDirection({ dir: "slide-left", to, from });
        }
      }
      next();
    });
  }
};
</script>

<style lang="less">
@pageDuration: 400ms;

.animation(@a) {
  -webkit-animation: @a;
  animation: @a;
}
.translate3d(@x:0, @y:0, @z:0) {
  -webkit-transform: translate3d(@x, @y, @z);
  transform: translate3d(@x, @y, @z);
}

.page {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transform: translateZ(0);
}

// backward
.slide-left-enter,
.slide-right-leave-active {
  z-index: 1;
  .router-backward();
}

// forward
.slide-left-leave-active {
  transition: all 0.4s;
}
.slide-left-enter-active,
.slide-right-enter {
  .router-forward();
}

// router-shadow
.router-shadow() {
  position: absolute;
  right: 100%;
  top: 0;
  width: 16px;
  height: 100%;
  background: -webkit-linear-gradient(
    left,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0.01) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0.01) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
  z-index: -1;
  content: "";
  will-change: opacity;
  contain: strict;
}

// router-forward
.router-forward() {
  &:before {
    .router-shadow();
    .animation(pageFromRightToCenterShadow @pageDuration forwards);
  }
  .animation(pageFromRightToCenter @pageDuration forwards);
  &:after {
    .translate3d(0);
  }
}
// router-backward
.router-backward() {
  &:before {
    .router-shadow();
    .animation(pageFromCenterToRightShadow @pageDuration forwards);
  }
  .animation(pageFromCenterToRight @pageDuration forwards);
  &:after {
    .translate3d(100%);
  }
}
@-webkit-keyframes pageFromRightToCenter {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0, 0);
  }
}
@keyframes pageFromRightToCenter {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
@-webkit-keyframes pageFromRightToCenterShadow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes pageFromRightToCenterShadow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes pageFromCenterToRight {
  from {
    -webkit-transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(100%, 0, 0);
  }
}
@keyframes pageFromCenterToRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}
@-webkit-keyframes pageFromCenterToRightShadow {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes pageFromCenterToRightShadow {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
