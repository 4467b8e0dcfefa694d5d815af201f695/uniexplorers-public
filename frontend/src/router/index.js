import { createRouter, createWebHistory } from 'vue-router'
import ExploreCitiesPage from '../views/ExploreCitiesPage.vue'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: () => import('../views/LandingPage.vue'),
      children: [
        {
          path: 'sign-in/:pathMatch(.*)*',
          name: 'clerkSignIn',
          component: () => import('../components/forms/signInClerk.vue')
        }
      ],
      meta: {
        public: true
      }
    },

    {
      path: '/explore',
      name: 'ExplorePage',
      component: () => import('../views/ExplorePage.vue')
      // children : [
      //   {
      //     path : 'universities',
      //     name : 'exploreContent',
      //     component :() => import('../components/explorePage/exploreContent.vue')
      //   }
      // ],
    },
    {
      path: '/uni/:uniName',
      name: 'UniHomePage',
      component: () => import('../views/UniHomePage.vue')
    },
    {
      path: '/uni/:uniName/discussions',
      name: 'uniDiscussions',
      component: () => import('../views/DiscussionPage.vue'),
      sensitive: true
    },
    {
      path: '/uni/:uniName/discussions/:thread',
      name: 'uniDiscussionsThread',
      component: () => import('../views/ThreadPage.vue')
    },
    {
      path: '/profile',
      name: 'NewProfile',
      component: () => import('../views/NewProfile.vue')
    },
    {
      path: '/welcome',
      name: 'Onboarding',
      component: () => import('../views/OnboardingPage.vue')
    },
    {
      path: '/discussionpage',
      name: 'DiscussionPage',
      component: () => import('../views/DiscussionPage.vue')
    },

    {
      path: '/message',
      name: 'MessagingPage',
      component: () => import('../views/MessagingPage.vue')
    },

    // Otherwise, redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page

  const { getClerkActive } = useAuthStore()
  // if (!to.meta.public) {
  //   if (!(await getClerkActive())) {
  //     console.log('No permission.')
  //     return '/'
  //   }
  // }
})

export default router
