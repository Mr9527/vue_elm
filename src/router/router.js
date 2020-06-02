import App from "../App";

const home = (r) =>
  require.ensure([], () => r(require("../page/home/home")), "home");

// const city = (resolve) => {
//   import('../page/city/city').then((module => {
//     resolve(module)
//   }))
// }
const miste = (r) =>
  require.ensure([], () => r(require("../page/home/miste")), "miste");

const city = (r) =>
  require.ensure([], () => r(require("../page/city/city")), "city");

const login = (r) =>
  require.ensure([], () => r(require("../page/account/login")), "login");
const personal_center = (r) =>
  require.ensure([], () => r(require("../page/account/personal_center")), "personal_center");
const reset_password = (r) =>
  require.ensure([], () => r(require("../page/account/reset_password")), "reset_password");
const food = (r) =>
  require.ensure([], () => r(require("../page/store/food")), "food");
const store = (r) =>
  require.ensure([], () => r(require("../page/store/store")), "store");
const storeListPage = (r) =>
  require.ensure([], () => r(require("../page/store/storeListPage")), "storeListPage");



export default [{
  path: "/",
  component: App, //顶层路由，对应index.html
  children: [
    //二级路由。对应App.vue
    //地址为空时跳转home页面
    {
      path: "",
      redirect: "/home",
    },
    //首页城市列表页
    {
      path: "/home",
      component: home,
    }, {
      path: "/city/:id",
      component: city
    }, {
      path: "/personal_center",
      component: personal_center
    }, {
      path: "/login",
      component: login
    }, {
      path: "/reset_password",
      component: reset_password
    }, {
      path: "/miste",
      component: miste,
      meta: {
        keepAlive: true
      }
    }, {
      path: "/store",
      component: store,
    }, {
      path: "/food",
      component: food,
    }, {
      path: '/storeListPage',
      component: storeListPage
    }
  ],
}, ];
