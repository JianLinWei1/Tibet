// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    name: '登录',
    redirect: '/login',
    component: view.tabs
  },
  index: {
      path: '/index',
      name: 'ces',
      component: view.tabs,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: '首页',
          meta: {
            icon: 'home'
          },

          component: () => import('@/pages/dashboard/index')
        }
      ]
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  }
}
export default routerMap

