import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import readme from '@/components/admin/common/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
        path: '/myhouse',
        component: resolve => require(['../components/MyHouse.vue'], resolve),
        // meta: {
        //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
        // }
    },
    {
        path: '/house/:id',
        component: resolve => require(['../components/HouseDetail.vue'], resolve),
        // meta: {
        //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
        // }
    },
    {
        path: '/order',
        // meta: {
        //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
        // },
        component: resolve => require(['../components/MyOrder.vue'], resolve)
        
    },
    {
        path: '/readme',
        component: readme,
        meta: {
            requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
        },
        // beforeEnter() {

        // },
        children:[
            {
                path: '/',
                component: resolve => require(['../components/admin/page/Readme.vue'], resolve)
            },
            {
                path: '/order_manage',
                component: resolve => require(['../components/admin/page/OrderTable.vue'], resolve)
            },
            {
                path: '/house_manage',
                // meta: {
                //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                // },
                component: resolve => require(['../components/admin/page/HouseTable.vue'], resolve)

            },
            {
              path: '/forget_password',
              component: resolve => require(['../components/admin/page/ForgetPassword.vue'], resolve)
            }
        ]
    },
    // {
    //     path: '/readme',
    //     component: resolve => require(['../components/admin/page/Readme.vue'], resolve),
    //     meta: {
    //         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    //     },
    // }
  ]
})
