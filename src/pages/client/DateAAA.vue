<template>
    {{ currendDate }}
    <div class="date-select-wrapper">
        <div class="date-select">
            <div class="scroll-top" @click="scrollTop(`scrollDay`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main" ref="scrollDay" @wheel="changeActiveElement($event, `scrollDay`)">
                <div class="scroll-main-item" style="height: 38px;"></div>
                <div v-for="i in activeDays" class="scroll-main-item" :key="i">
                    {{ i }}
                </div>
                <div class="scroll-main-item" style="height: 38px;"></div>
            </div>
            <div class="scroll-bottom" @click="scrollBottom(`scrollDay`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main-overlay"></div>
        </div>
        <div class="date-select">
            <div class="scroll-top" @click="scrollTop(`scrollMonth`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main" ref="scrollMonth" @wheel="changeActiveElement($event, `scrollMonth`)">
                <div class="scroll-main-item" style="height: 38px;"></div>
                <div v-for="i in month" class="scroll-main-item" :key="i.month_value">
                    {{ i.month_value }}
                </div>
                <div class="scroll-main-item" style="height: 38px;"></div>
            </div>
            <div class="scroll-bottom" @click="scrollBottom(`scrollMonth`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main-overlay"></div>
        </div>
        <div class="date-select">
            <div class="scroll-top" @click="scrollTop(`scrollYear`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main" ref="scrollYear" @wheel="changeActiveElement($event, `scrollYear`)">
                <div class="scroll-main-item" style="height: 38px;"></div>
                <div v-for="i in 100" class="scroll-main-item" :key="i">
                    {{ 1950 + i }}
                </div>
                <div class="scroll-main-item" style="height: 38px;"></div>
            </div>
            <div class="scroll-bottom" @click="scrollBottom(`scrollYear`)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                        fill="#929292" />
                </svg>
            </div>
            <div class="scroll-main-overlay"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { month } from './dataDict';

const scrollDay = ref(null);
const scrollMonth = ref(null);
const scrollYear = ref(null);

const activeElementOne = ref(1);
const activeElementTwo = ref(1);
const activeElementThree = ref(1);

const activeDays = computed(() => {
    const day = month[activeElementTwo.value - 1]?.days_count;
    if (activeElementOne.value > day) {
        activeElementOne.value = day;
    }
    return day;
});
const currendDate = computed(() => {
    return `${activeElementOne.value > 9 ? activeElementOne.value : `0${activeElementOne.value}`}/${activeElementTwo.value > 9 ? activeElementTwo.value : `0${activeElementTwo.value}`}/${activeElementThree.value + 1950}`;
})

function changeActiveElement(event: any, on: string) {
    if (event.deltaY > 0) {
        if (on === "scrollDay") {
            activeElementOne.value < activeDays.value ? activeElementOne.value++ : null;
        }
        if (on === "scrollMonth") {
            activeElementTwo.value < 12 ? activeElementTwo.value++ : null;
        }
        if (on === "scrollYear") {
            activeElementThree.value < 100 ? activeElementThree.value++ : null;
        }
    } else {
        if (on === "scrollDay") {
            activeElementOne.value > 1 ? activeElementOne.value-- : null;
        }
        if (on === "scrollMonth") {
            activeElementTwo.value > 1 ? activeElementTwo.value-- : null;
        }
        if (on === "scrollYear") {
            activeElementThree.value > 1 ? activeElementThree.value-- : null;
        }
    }
    detectScroll(on);
}
function scrollTop(on: any) {
    if (on === "scrollDay") {
        activeElementOne.value > 1 ? activeElementOne.value-- : null;
    }
    if (on === "scrollMonth") {
        activeElementTwo.value > 1 ? activeElementTwo.value-- : null;
    }
    if (on === "scrollYear") {
        activeElementThree.value > 1 ? activeElementThree.value-- : null;
    }
    detectScroll(on);
}
function scrollBottom(on: any) {
    if (on === "scrollDay") {
        activeElementOne.value < activeDays.value ? activeElementOne.value++ : null;
    }
    if (on === "scrollMonth") {
        activeElementTwo.value < 12 ? activeElementTwo.value++ : null;
    }
    if (on === "scrollYear") {
        activeElementThree.value < 100 ? activeElementThree.value++ : null;
    }
    detectScroll(on);
}
function detectScroll(on: any) {
    if (on === "scrollDay") {
        scrollDay.value.scrollTo({
            top: (activeElementOne.value - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
    if (on === "scrollMonth") {
        scrollMonth.value.scrollTo({
            top: (activeElementTwo.value - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
    if (on === "scrollYear") {
        scrollYear.value.scrollTo({
            top: (activeElementThree.value - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
}

onMounted(() => {
    document.querySelectorAll('.scroll-main').forEach((item) => {
        item.addEventListener("wheel", (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        item.addEventListener("touchmove", (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    });

    activeElementOne.value = new Date().getDate();
    activeElementTwo.value = new Date().getMonth() + 1;
    activeElementThree.value = new Date().getFullYear() - 1950;

    detectScroll("scrollDay");
    detectScroll("scrollMonth");
    detectScroll("scrollYear");
})
</script>

<style lang="scss" scoped>
.date-select-wrapper {
    border: 1px solid rgba(155, 171, 200, 1);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    position: relative;
    background: white;

    .date-select {
        width: 47px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .scroll-top,
    .scroll-bottom {
        width: 12px;
        height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .scroll-bottom {
        transform: rotate(180deg);
    }

    .scroll-main {
        position: relative;
        height: 114px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 0;
        }

        .scroll-main-item {
            padding: 12px 10px;
            font-size: 12px;
            font-weight: 400;
            line-height: 14.06px;
            text-align: center;
        }
    }

    .scroll-main-overlay {
        width: 47px;
        height: 38px;
        border-top: 1px solid rgba(205, 221, 245, 1);
        border-bottom: 1px solid rgba(205, 221, 245, 1);
        position: absolute;
        top: 66px;
        z-index: -1;
    }
}
</style>