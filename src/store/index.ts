import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export interface RootState {}

export const store = new Store<RootState>({})

