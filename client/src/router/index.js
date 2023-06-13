import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import ArticleView from '../views/ArticleView.vue'
import AllArticlesView from '../views/AllArticlesView.vue'
import AdminView from '../views/AdminView.vue'
import CreateArticleView from '../views/CreateArticleView.vue'
import EditorView from '../views/EditorView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/article/:id',
      name: 'article',
      component: ArticleView,
      beforeEnter: async (to, from, next) => {
        const articleId = to.params.id;

        try {
          // Check if the article exists by making an API request
          const response = await fetch(`http://localhost:4000/api/posts/${articleId}`);
          if (response.ok) {
            // Article exists, proceed to the ArticleView component
            next();
          } else {
            // Article not found, redirect to the 404 page
            next({ name: 'notfound' });
          }
        } catch (error) {
          console.error(error);
          next();
        }
      }
    },
    {
      path: '/articles',
      name: 'articles',
      component: AllArticlesView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/admin/createarticle',
      name: 'createarticle',
      component: CreateArticleView
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/404',
      name: 'notfound',
      component: NotFoundView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
}) 


router.beforeEach(async (to, from, next) => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/profile', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const responseData = await response.json();

    if (response.status === 200 && responseData.message === 'Authorized') {
      // Update the authentication state in the store
      await store.dispatch('setAuth', true);

      // Store the authenticated user information in the Vuex store
      await store.dispatch('setUser', responseData.user);
      next();
    } else {
      // Update the authentication state in the store
      await store.dispatch('setAuth', false);
      next();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


export default router
