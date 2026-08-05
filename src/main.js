import './assets/main.css'
import 'element-plus/dist/index.css'
import './assets/styles/element.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

// 라우터, 전역 상태 저장소(Pinia), Element Plus를 앱 전역에 주입한다
createApp(App).use(createPinia()).use(router).use(ElementPlus).mount('#app')
