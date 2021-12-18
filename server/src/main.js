import { createApp, ref, reactive, toRefs, toRef  } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import { invoke } from '@tauri-apps/api/tauri'
import { WebviewWindow } from '@tauri-apps/api/window'
import { emit, listen } from '@tauri-apps/api/event'


globalThis.handleCmdFromNative = function handleCmdFromNative(cmd, dataObj) {
    if (cmd == "cmdname") {
    } else if (cmd == "sayWelcome") {
        console.log("loadPlatformCfg " + dataObj);
        alert(dataObj);
    }
}

globalThis.sendCreatedMsg = function sendCreatedMsg() {
    var msg = { "cmd": "webCreated" };
    if (window.__TAURI__) {
        tauriInvokeJson(msg);
    } 
}

globalThis.tauriInvokeJson = function tauriInvokeJson(json) {
    if (window.__TAURI__) {
        window.__TAURI__.invoke('handle_js_json', { json: JSON.stringify(json) })
    }
}

globalThis.emitMsg = function emitMsg(json) {
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
            } else {
                handleCmdFromNative(cmd, payload.obj)
            }

        })
    }
    unlisten()

    sendCreatedMsg();

    console.log("afterMounted done");
}


console.log("mount vue")
var myApp = createApp(App)
myApp.use(ElementPlus, { locale: zhCn })
myApp = myApp.mount('#app')
globalThis.myApp = myApp





