import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'games' },
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/pages/GamesPage.vue'),
      children: [
        {
          path: ':id',
          name: 'game',
          component: () => import('@/pages/GameIdPage.vue'),
        },
      ],
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('@/pages/PlayersPage.vue'),
    },
    {
      path: '/houses',
      name: 'houses',
      component: () => import('@/pages/HousesPage.vue'),
    },
    {
      path: '/randomizer',
      name: 'randomizer',
      component: () => import('@/pages/RandomizerPage.vue'),
    },
  ],
});

export default router;
