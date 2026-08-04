import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 라우터와 전역 상태 저장소(Pinia)를 앱 전역에 주입한다
createApp(App).use(createPinia()).use(router).mount('#app')
