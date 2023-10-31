import App from './App'
import store from './store/index'
// #ifndef VUE3
import Vue from 'vue'
import uView from "uview-ui";
Vue.use(uView);
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
const i18n = new VueI18n({
	locale: store.getters.getCurrentLang.value,
	//messages: store.getters.getLangData
})
// i18n.setLocaleMessage(store.getters.getCurrentLang.value, store.getters.getLangData)
Vue.prototype._i18n = i18n
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
