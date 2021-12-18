<template>

    <div>MainWeb</div>
    <h3>a welcome dialog should be popped up if no error</h3>
</template>

<style>

</style>


<script>
    import { ref, reactive, toRefs, toRef } from 'vue'
    import moment from 'moment/min/moment-with-locales'
    //import 'moment/locale/zh-cn'
    

    export default {
        props: {

        },
        setup() {
            const state = reactive({
            });
            return {
                ...toRefs(state),
            }
        },
        data() {
            return {
                message: 'main',
            }
        },
        mounted() {
            console.log("mounted from script")
            moment.locale('zh-cn');
            globalThis.afterMounted();
        },
        computed: {
        },
        methods: {
        }
    }
</script>

