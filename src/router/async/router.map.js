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
    name: '首页',
    component: () => import('@/pages/dashboard/index')
  },
  account: {
    path: '/account',
    name: '用户管理',
    redirect: '/user',
    component: view.page
  },
  user: {
    path: "/user",
    name: '用户列表',
    authority: '3',
    component: () => import('@/pages/user')
  },
  person: {
    path: '/person',
    name: '人员信息',
    redirect: '/personList',
    component: view.page
  },
  personList: {
    path: "/personList",
    name: '人员列表',
    authority: '6',
    component: () => import('@/pages/persons/list')
  },
  personAdd: {
    path: "/personAdd",
    name: '添加人员',
    component: () => import('@/pages/persons/add')
  },
  department: {
    path: "/department",
    name: '部门管理',
    component: () => import('@/pages/persons/add')
  },
  camera: {
    path: '/camera',
    name: '摄像机管理',
    redirect: '/cameraAdd',
    component: view.page
  },
  cameraAdd: {
    path: "/cameraAdd",
    name: '添加摄像机',
    component: () => import('@/pages/camera/cameraAdd')
  },
  cameraList: {
    path: "/cameraList",
    name: '摄像机列表',
    component: () => import('@/pages/camera/cameraList')
  },
  access: {
    path: '/access',
    name: '门禁管理',
    redirect: '/accessAdd',
    component: view.page
  },
  accessAdd: {
    path: "/accessAdd",
    name: '门禁设备',
    authority: '11',
    component: () => import('@/pages/access/accessAdd')
  },
  accessList: {
    path: "/accessList",
    name: '发卡记录',
    authority: '12',
    component: () => import('@/pages/access/accessList')
  },
  accessRecordList: {
    path: "/accessRecordList",
    name: '刷卡记录',
    authority: '40',
    component: () => import('@/pages/access/accessRecordList')
  },

  car: {
    path: '/car',
    name: '车辆道闸管理',
    redirect: '/carAdd',
    component: view.page
  },
  carAdd: {
    path: "/carAdd",
    name: '道闸管理',
    authority: '14',
    component: () => import('@/pages/car/carAdd')
  },
  carList: {
    path: "/carList",
    name: '下发列表',
    authority: '15',
    component: () => import('@/pages/car/carList')
  },
  carRecordList: {
    path: "/carRecordList",
    name: '车辆记录',
    authority: '19',
    component: () => import('@/pages/car/carRecordList')
  },
  system: {
    path: '/system',
    name: '系统管理',
    redirect: '/systemConfig',
    component: view.page
  },
  attence: {
    path: '/attence',
    name: '考勤管理',
    redirect: '/attenceConfig',
    component: view.page
  },
  attenceConfig: {
    path: "/attenceConfig",
    name: '考勤配置',
    authority: '18',
    component: () => import('@/pages/attence/config')

  },
  attenceReport: {
    path: "/attenceReport",
    name: '考勤报表',
    authority: '18',
    component: () => import('@/pages/attence/report')

  },
  systemConfig: {
    path: "/systemConfig",
    name: '系统配置',
    component: () => import('@/pages/system/systemConfig')
  },
  systemLog: {
    path: "/systemLog",
    name: '系统日志',
    authority: '18',
    component: () => import('@/pages/system/systemLog')
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

