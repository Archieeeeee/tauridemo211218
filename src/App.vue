<template>

    <div style="font-size: 80px; margin-top: 50px; color: #4262e3 ;">
        Loading
    </div>


</template>





<script>
    export default {
        mounted() {
            console.log("landing mounted")
            globalThis.afterMounted()
            console.log("landing mounted done")
        },
    }
</script>
