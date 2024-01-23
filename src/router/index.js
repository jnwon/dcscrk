import { createWebHistory, createRouter } from "vue-router";

import Hello from '@/components/HelloWorld.vue'
import Scrk from '@/view/Scrk.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        },
        {
            path: '/dcscrk',
            name: 'Scrk',
            component: Scrk
        },
    ]
})