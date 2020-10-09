// 此配置为系统默认设置，需修改的设置项，在src/config/config.js中添加修改项即可。也可直接在此文件中修改。
module.exports = {
  lang: 'CN',                           //语言，可选 CN(简体)、HK(繁体)、US(英语)，也可扩展其它语言
  theme: {                              //主题
    color: '#1890ff',                   //主题色
    mode: 'dark',                       //主题模式 可选 dark、 light 和 night
    success: '#52c41a',                 //成功色
    warning: '#faad14',                 //警告色
    error: '#f5222d',                   //错误色
  },
  layout: 'side',                       //导航布局，可选 side 和 head，分别为侧边导航和顶部导航
  fixedHeader: true,                   //固定头部状态栏，true:固定，false:不固定
  fixedSideBar: true,                   //固定侧边栏，true:固定，false:不固定
  pageWidth: 'fixed',                   //内容区域宽度，fixed:固定宽度，fluid:流式宽度
  weekMode: false,                      //色弱模式，true:开启，false:不开启
  multiPage: false,                     //多页签模式，true:开启，false:不开启
  hideSetting: true,                   //隐藏设置抽屉，true:隐藏，false:不隐藏
  systemName: '西藏一体化平台',         //系统名称
  copyright: '四川领军智能科技有限公司提供支持',     //copyright
  asyncRoutes: false,                   //异步加载路由，true:开启，false:不开启
  showPageTitle: true,                  //是否显示页面标题（PageLayout 布局中的页面标题），true:显示，false:不显示
  filterMenu: true,                    //根据权限过滤菜单，true:过滤，false:不过滤
  animate: {                            //动画设置
    disabled: false,                    //禁用动画，true:禁用，false:启用
    name: 'slide',                     //动画效果，支持的动画效果可参考 ./animate.config.js
    direction: 'left'                   //动画方向，切换页面时动画的方向，参考 ./animate.config.js
  },
  
}
