import { createApp } from 'vue'
import App from './App.vue'
import i18n from './presentation/i18n'
import { useToast } from './presentation/composables/use-toast'
import router from './presentation/router'
import './assets/main.css'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.config.errorHandler = (error) => {
  console.error(error)
  useToast().addToast({
    message: i18n.global.t('toast.error'),
    type: 'error',
  })
}
app.mount('#app')
