import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'games' },
    },
    {
      children: [
        {
          component: () => import('@/pages/GameIdPage.vue'),
          name: 'game',
          path: ':id',
        },
      ],
      component: () => import('@/pages/GamesPage.vue'),
      name: 'games',
      path: '/games',
    },
    {
      component: () => import('@/pages/PlayersPage.vue'),
      name: 'players',
      path: '/players',
    },
    {
      component: () => import('@/pages/HousesPage.vue'),
      name: 'houses',
      path: '/houses',
    },
    {
      component: () => import('@/pages/RandomizerPage.vue'),
      name: 'randomizer',
      path: '/randomizer',
    },
  ],
});

export default router;
