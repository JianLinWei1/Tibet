import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'

// 异步路由配置
const routesConfig = [
  'login',
  'root',
  "index",
  "user",
  "person",
  "personList",
  "personAdd",
  "camera",
  "cameraAdd",
  "cameraList",
  "access",
  "accessAdd",
  "accessList",
  "accessRecordList",
  "car",
  "carAdd",
  "carList",
  "carRecordList",
  "attence",
  "attenceConfig",
  "attenceReport",
  "system",
  "systemConfig",
  "systemLog",

  {
    router: 'exp404',
    path: '*',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
