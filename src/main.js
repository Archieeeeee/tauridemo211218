import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
//import { WebviewWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'



globalThis.tauriInvokeJson = function tauriInvokeJson(json) {
    if (window.__TAURI__) {
        window.__TAURI__.invoke('handle_js_json', { json: JSON.stringify(json) })
    }
}

globalThis.emitMsg = function emitMsg(json) {
    //emit('webEvent')
    emit('webEvent', JSON.stringify(json))
}

globalThis.afterMounted = function afterMounted() {
    console.log("afterMounted start");
    const unlisten = async () => {
        await listen('backendEvent', event => {
            console.log("backendEvent " + JSON.stringify(event));
            const name = event.event;
            const payload = event.payload;

            const cmd = payload.cmd;
            console.log("backendEvent cmd " + cmd);
            if (cmd == 'loadMainWeb') {
                if (payload.mainUrl) {
                    window.location.replace(payload.mainUrl);
                }
            }

        })
    }
    unlisten()
    tauriInvokeJson({ cmd: "landingCreated" })
    //emitMsg({ cmd: 'landingCreatedFromEmit'})
    console.log("afterMounted done");
}



var myApp = createApp(App)
myApp.use(ElementPlus, { locale: zhCn })
myApp = myApp.mount('#app')

