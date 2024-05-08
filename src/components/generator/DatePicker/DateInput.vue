<template>
    <input ref="inputRef" v-model="inputValue" class="date-input">
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
    currentDate: String,
});
const emit = defineEmits(['changeDate']);

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref<string>('');

watch(props, () => {
    inputValue.value = props.currentDate as string;
}, {
    deep: true
});
watch(inputValue, () => {
    emit('changeDate', inputValue.value);
});

onMounted(() => {
    inputValue.value = props.currentDate as string;

    inputRef.value.addEventListener('input', (event) => {
        inputRef.value.value = inputRef.value.value.replace(/[^/\d]/g, '');
        if (event.inputType !== 'deleteContentBackward' && event.inputType !== 'deleteContentForward') {
            if (inputRef.value?.value.length == 2) {
                inputValue.value += '/';
            }
            if (inputRef.value?.value.length == 5) {
                inputValue.value += '/';
            }
            if (inputRef.value?.value.length > 10) {
                inputValue.value = inputValue.value.slice(0, 10);
            }
        }
    });
})
</script>