import Public from '@/layout/public/Public.vue';
import Private from '@/layout/private/Private.vue';
export default [
  {
    path: '/',
    name: 'home',
    meta: {
      requiresAuth: false,
      layout: Private
    },
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/friends',
    meta: {
      requiresAuth: false,
      layout: Private
    },
    // name: 'friends',
    component: () => import('../views/Friend.vue'),
    children: [
      {
        path: '',
        meta: {
          requiresAuth: false,
          layout: Private
        },
        name: 'friendList',
        component: () => import('../views/FriendList.vue')
      },
      {
        path: 'request',
        name: 'friendRequest',
        meta: {
          requiresAuth: false,
          layout: Private
        },
        component: () => import('../views/FriendRequest.vue')
      },
      {
        path: 'sent',
        name: 'friendSent',
        meta: {
          requiresAuth: false,
          layout: Private
        },
        component: () => import('../views/FriendSent.vue')
      },
      {
        path: 'suggestion',
        name: 'friendSuggestion',
        meta: {
          requiresAuth: false,
          layout: Private
        },
        component: () => import('../views/FriendSuggestion.vue')
      }
    ]
  },
  {
    path: '/profile/:id',
    name: 'profile',
    meta: {
      requiresAuth: false,
      layout: Private
    },
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresAuth: false,
      layout: Public
    },
    component: () => import('../views/Login.vue')
  },

  { path: '/:pathMatch(.*)*',     
  meta: {
    requiresAuth: false,
    layout: Private
  }, component: () => import('../views/HomeView.vue')},
]