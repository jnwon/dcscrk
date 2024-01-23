import { createWebHistory, createRouter } from "vue-router";

import Hello from '@/components/HelloWorld.vue'
import Scrk from '@/view/Scrk.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/dcscrk',
            name: 'Scrk',
            component: Scrk
        },
        {
            path: '/hello',
            name: 'Hello',
            component: Hello
        },
    ]
})