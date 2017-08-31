import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import letConst from '@/components/letConst'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/letConst',
      name: 'letConst',
      component: letConst
    }
  ]
})
