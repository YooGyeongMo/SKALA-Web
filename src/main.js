import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 라우터 인스턴스를 앱 전역에 주입한다
createApp(App).use(router).mount('#app')
