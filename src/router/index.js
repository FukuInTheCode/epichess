import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter(
    {
        history: createWebHistory(),

        routes: [
            {path: '/', name: 'Home', component: () => import('../views/HomePage.vue'), props: true},
            {path: '/login', name: 'Login', component: () => import('../views/LoginPage.vue'), props: true},
            {path: '/signup', name: 'Signup', component: () => import('../views/SignupPage.vue'), props: true}
        ]
    }
)

export default router 