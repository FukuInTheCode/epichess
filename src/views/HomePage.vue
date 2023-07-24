<template>
    <TheBoard :client="client"></TheBoard>

</template>

<script>
import TheBoard from '@/components/TheBoard.vue';
export default {

    components: {
        TheBoard,
    },

    props: {
        client: { type: Object, required: true, default: () => ({}) }
    },
}
</script>