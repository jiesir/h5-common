/**
 * 路由配置
 * @type { *[] }
 */
const routes = [
    {
        path: '/',
        redirect: '/DM0001',
        component: () => import('@/pages/DM/DM0001'),
    }, {
        path: '/DM0001',
        name: 'DM0001',
        component: () => import('@/pages/DM/DM0001'),
        meta: { title: '首页', keepAlive: true }
    },
    {
        path: '/DM0002',
        name: 'DM0002',
        component: () => import('@/pages/DM/DM0002'),
        meta: { title: '首页', keepAlive: true }
    }
];

export default routes;