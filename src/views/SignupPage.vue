<template>
    <TheSignupForm :client="this.client"/>

</template>

<script>

import TheSignupForm from '@/components/TheSignupForm.vue';

export default {

    props: {
        client: {type: Object, required: true}
    },

    components: {
    TheSignupForm,
}
}

</script>