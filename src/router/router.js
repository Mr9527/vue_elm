import App from "../App";

const home = (r) =>
  require.ensure([], () => r(require("../page/home/home")), "home");

// const city = (resolve) => {
//   import('../page/city/city').then((module => {
//     resolve(module)
//   }))
// }
const msite = (r) =>
  require.ensure([], () => r(require("../page/home/msite")), "msite");

const search = (r) =>
  require.ensure([], () => r(require("../page/search/searchPage")), "search");

const order = (r) =>
  require.ensure([], () => r(require("../page/order/orderPage")), "search");

const city = (r) =>
  require.ensure([], () => r(require("../page/city/city")), "city");

const login = (r) =>
  require.ensure([], () => r(require("../page/account/login")), "login");
const personal_center = (r) =>
  require.ensure(
    [],
    () => r(require("../page/account/personal_center")),
    "personal_center"
  );
const reset_password = (r) =>
  require.ensure(
    [],
    () => r(require("../page/account/reset_password")),
    "reset_password"
  );
const food = (r) =>
  require.ensure([], () => r(require("../page/store/food/food")), "food");
const foodDetail = (r) =>
  require.ensure(
    [],
    () => r(require("../page/store/foodDetail")),
    "foodDetail"
  );
const store = (r) =>
  require.ensure([], () => r(require("../page/store/store")), "store");
const storeListPage = (r) =>
  require.ensure(
    [],
    () => r(require("../page/store/storeListPage")),
    "storeListPage"
  );

export default [
  {
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
      },
      {
        path: "/city/:id",
        component: city,
      },
      {
        path: "/login",
        component: login,
      },
      {
        path: "/reset_password",
        component: reset_password,
      },
      {
        name: "msite",
        path: "/msite",
        component: msite,
        meta: {
          keepAlive: true,
          index: 0,
        },
      },
      {
        name: "personal_center",
        path: "/personal_center",
        component: personal_center,
        meta: {
          keepAlive: true,
          index: 3,
        },
      },
      {
        name: "search",
        path: "/search:geohash",
        component: search,
        meta: {
          keepAlive: true,
          index: 1,
        },
      },
      {
        name: "order",
        path: "/order",
        component: order,
        meta: {
          keepAlive: true,
          index: 2,
        },
      },
      {
        path: "/store",
        component: store,
        meta: {
          keepAlive: true,
        },
        children: [
          {
            path: "food",
            component: food,
            props: true,
          },
          {
            path: "foodDetail",
            component: foodDetail,
            props: {
              default: true,
              sidebar: false,
            },
          },
        ],
      },
      {
        path: "/storeListPage",
        component: storeListPage,
      },
    ],
  },
];
