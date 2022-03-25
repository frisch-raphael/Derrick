import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'engagements',
    component: () => import('src/pages/RessourceTables/EngagementTable.vue')
    // children: [{ path: '', component: () => import('pages/ReportsTable.vue') }],
  },
  {
    path: '/engagement/:parentEngagementId/contacts',
    name: 'contacts',
    props: true,
    component: () => import('src/pages/RessourceTables/ContactTable.vue')
    // children: [{ path: '', component: () => import('pages/ReportsTable.vue') }],
  },
  {
    path: '/template_findings',
    name: 'template_findings',
    component: () => import('src/pages/RessourceTables/TemplateFindingTable.vue')
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
