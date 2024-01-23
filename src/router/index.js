import { createWebHistory, createRouter } from "vue-router";

import Scrk from '@/view/Scrk.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Scrk',
            component: Scrk
        },
    ]
})