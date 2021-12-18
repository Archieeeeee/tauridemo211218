import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            }
        }
    },
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    preview: {
        port: 3000,
        host: '0.0.0.0'
    }
})
