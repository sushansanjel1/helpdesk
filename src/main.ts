import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { supabase } from './lib/supabase.ts'
import router from './router'
import { useAuthStore } from './stores/auth.ts'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

//Get access to the auth store
const authStore = useAuthStore(pinia)

//Listen for authentication changes
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    authStore.clearProfile()
    return
  }
  if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
    //Run after the auth callback finishes
    setTimeout(() => {
      void authStore.fetchProfile()
    }, 0)
  }
})
app.mount('#app')
