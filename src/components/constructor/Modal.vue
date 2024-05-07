<template>
    <teleport to='body'>
        <div class="modal-wrapper" :class="{ 'd-none': !isShown }">
            <div class="modal">
                <Cross class="cross" @click="$emit('close')" />
                <slot></slot>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import Cross from '../icons/Cross.vue';
defineEmits(['close']);
defineProps({
    isShown: Boolean
});
</script>

<style lang="scss" scoped>
.modal-wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100dvh;
    padding: 100px 0;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10000;

    .modal {
        position: relative;
        background: rgba(247, 251, 255, 1);
        border-radius: 20px;
        padding: 40px;
        max-width: 900px;

        .cross {
            position: absolute;
            right: 25px;
            top: 25px;
            cursor: pointer;
        }
    }
}
</style>