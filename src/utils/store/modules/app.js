const state = {
  userInfo: { name: "张三", age: 24 }
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userInfo.name = name
  }
}
const actions = {
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  }
}

export default {
  state,
  mutations,
  actions
}
