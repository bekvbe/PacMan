import Vue from 'vue'
import Vuex from 'vuex'

import { metaMaskStore } from './stores'


Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    metaMaskStore
  }
})