<template>
    <input ref="inputRef" v-model="inputValue" class="date-input" :placeholder="placeholder">
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
    currentDate: String,
});
const emit = defineEmits(['changeDate']);

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref<string>('');
const placeholder = computed(() => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    return `${day > 9 ? day : `0${day}`}/${month > 9 ? month : `0${month}`}/${year}`;
})


watch(props, () => {
    inputValue.value = props.currentDate as string;
}, {
    deep: true
});
watch(inputValue, () => {
    emit('changeDate', inputValue.value);
});

onMounted(() => {
    inputRef.value.addEventListener('keydown', (event) => {
        if (event.key !== 'Backspace') {
            if (inputValue.value.length == 2) {
                inputValue.value += "/";
            }
            if (inputValue.value.length == 5) {
                inputValue.value += "/";
            }
            if (inputValue.value.length >= 10) {
                inputValue.value = inputValue.value.slice(0, 9);
            }
        }
    });
})
</script>