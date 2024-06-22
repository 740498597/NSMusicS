import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
app.use(VueVirtualScroller)

import {System_Configs_Read} from "@/features/system_configs/System_Configs_Read";
let system_Configs_Read = new System_Configs_Read();
import { Language } from "@/i18n/i18n";
const i18n = new Language(''+system_Configs_Read.app_Configs.value['lang']).i18n;
console.log(i18n.locale)
app.use(i18n);

app.use(router)
app.mount('#app')