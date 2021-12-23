import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'engagements',
    component: () => import('pages/EngagementTable.vue')
    // children: [{ path: '', component: () => import('pages/ReportsTable.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/Error404.vue'),
  // },
];

export default routes;
