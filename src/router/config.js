import TabsView from '@/layouts/tabs/TabsView'
//import BlankView from '@/layouts/BlankView'
//import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: '首页',
          meta: {
            icon: 'dashboard'
          },

          component: () => import('@/pages/dashboard/index')
        }
      ]
    },
  ]
}

export default options
