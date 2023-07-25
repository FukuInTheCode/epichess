<template>
    <TheLoginForm :client="this.client"/>

</template>

<script>

import TheLoginForm from '@/components/TheLoginForm.vue';


export default {
    props: {
        client: { type: Object, required: true, default: () => ({}) }
    },

    components: {
    TheLoginForm,
    },

    mounted() {
        this.$route.socket = this.client.socket;
    },

}

</script>