<template>
    <div class="date-wrapper" ref="dateSelectWrapper">
        <div class="date-input-wrapper">
            <div class="date-input-wrapper-left">
                <CalendarIcon class="cursor-pointer" @click="show = !show"></CalendarIcon>
                <DateInput :currentDate="currentDate" @changeDate="changeDate"></DateInput>
            </div>
            <div class="date-input-wrapper-right">
                <slot></slot>
                <v-btn variant="outlined" size="small" rounded="lg" color="primary" class="v-btn--inside v-btn--primary"
                    :text="$t(`random`)" @click="$emit(`button:click`, $event)" />
            </div>
        </div>
        <div v-show="show" class="date-select-wrapper">
            <div class="date-select">
                <div class="scroll-top" @click="scrollTop(`scrollDay`)">
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.727037 6.03016C0.867683 6.17077 1.05841 6.24975 1.25729 6.24975C1.45616 6.24975 1.64689 6.17077 1.78754 6.03016L5.50004 2.31766L9.21254 6.03016C9.35399 6.16678 9.54344 6.24238 9.74009 6.24067C9.93674 6.23896 10.1248 6.16008 10.2639 6.02103C10.403 5.88197 10.4818 5.69386 10.4835 5.49721C10.4853 5.30056 10.4097 5.11111 10.273 4.96966L6.03029 0.726913C5.88964 0.58631 5.69891 0.507323 5.50004 0.507323C5.30116 0.507323 5.11043 0.58631 4.96979 0.726913L0.727037 4.96966C0.586434 5.11031 0.507447 5.30104 0.507447 5.49991C0.507447 5.69879 0.586434 5.88952 0.727037 6.03016Z"
                            fill="#929292" />
                    </svg>
                </div>
                <div class="scroll-main" ref="scrollDay" @wheel="changeActiveElement($event, `scrollDay`)"
                    @touchend="changeActiveElementMobile($event, `scrollDay`)">
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
                <div class="scroll-main" ref="scrollMonth" @wheel="changeActiveElement($event, `scrollMonth`)"
                    @touchend="changeActiveElementMobile($event, `scrollMonth`)">
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
                <div class="scroll-main" ref="scrollYear" @wheel="changeActiveElement($event, `scrollYear`)"
                    @touchend="changeActiveElementMobile($event, `scrollYear`)">
                    <div class="scroll-main-item" style="height: 38px;"></div>
                    <div v-for="i in 200" class="scroll-main-item" :key="i">
                        {{ 1900 + i }}
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
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from 'vue';
import { month } from './dataDict';
import CalendarIcon from '@/components/icons/CalendarIcon.vue';
import DateInput from './DateInput.vue';

const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['button:click', 'update:modelValue']);

let values = [1, 1, 1901];
if (props.modelValue) {
    values = props.modelValue.split('/');
}

const show = ref(false);
const dateSelectWrapper = ref(null);

const scrollDay = ref(null);
const scrollMonth = ref(null);
const scrollYear = ref(null);

const activeDates = reactive({
    day: {
        active: null,
        shown: +values[0]
    },
    month: {
        active: null,
        shown: +values[1]
    },
    year: {
        active: null,
        shown: +values[2] - 1900
    }
});
const activeDays = computed(() => {
    const day = month[activeDates.month.shown - 1]?.days_count;
    if (activeDates.day.active > day) {
        activeDates.day.active = day;
        activeDates.day.shown = day;
    }
    return day || 31;
});
const currentDate = computed(() => {
    if (activeDates.day.active == 'first') {
        return `${activeDates.day.shown}`;
    }
    if (!activeDates.year.active && !activeDates.month.active && !activeDates.day.active) {
        emit('update:modelValue', ``);
        return ``;
    }
    if (!activeDates.year.active && !activeDates.month.active) {
        emit('update:modelValue', `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown}`}`);
        return `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown > 0 ? activeDates.day.shown : 1}`}`;
    }
    if (!activeDates.year.active) {
        emit('update:modelValue', `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown}`}/${activeDates.month.shown > 9 ? activeDates.month.shown : `0${activeDates.month.shown}`}`);
        return `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown > 0 ? activeDates.day.shown : 1}`}/${activeDates.month.shown > 9 ? activeDates.month.shown : `0${activeDates.month.shown}`}`;
    }
    if (!activeDates.month.active) {
        emit('update:modelValue', `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown}`}/00/${activeDates.year.shown + 1900}`);
        return `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown > 0 ? activeDates.day.shown : 1}`}/01/${activeDates.year.shown + 1900}`;
    }
    emit('update:modelValue', `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown > 0 ? activeDates.day.shown : 1}`}/${activeDates.month.shown > 9 ? activeDates.month.shown : `0${activeDates.month.shown}`}/${activeDates.year.shown + 1900}`);
    return `${activeDates.day.shown > 9 ? activeDates.day.shown : `0${activeDates.day.shown > 0 ? activeDates.day.shown : 1}`}/${activeDates.month.shown > 9 ? activeDates.month.shown : `0${activeDates.month.shown}`}/${activeDates.year.shown + 1900}`;
});

function changeActiveElement(event: any, on: string) {
    if (event.deltaY > 0) {
        if (on === "scrollDay") {
            activeDates.day.active < activeDays.value ? activeDates.day.active++ : null;
            activeDates.day.shown = activeDates.day.active;
        }
        if (on === "scrollMonth") {
            activeDates.month.active < 12 ? activeDates.month.active++ : null;
            if (!activeDates.month.active) {
                activeDates.month.active = 1;
            }
            activeDates.month.shown = activeDates.month.active;
        }
        if (on === "scrollYear") {
            activeDates.year.active < 200 ? activeDates.year.active++ : null;
            if (!activeDates.year.active) {
                activeDates.year.active = 1;
            }
            activeDates.year.shown = activeDates.year.active;
        }
    } else {
        if (on === "scrollDay") {
            activeDates.day.active > 1 ? activeDates.day.active-- : null;
            activeDates.day.shown = activeDates.day.active;
        }
        if (on === "scrollMonth") {
            activeDates.month.active > 1 ? activeDates.month.active-- : null;
            activeDates.month.shown = activeDates.month.active;
        }
        if (on === "scrollYear") {
            activeDates.year.active > 1 ? activeDates.year.active-- : null;
            activeDates.year.shown = activeDates.year.active;
        }
    }
    detectScroll(on);
}
function changeActiveElementMobile(event: any, on: string) {
    let act = 0;

    let int = setInterval(() => {
        const activeElement = Math.ceil(event.target.parentElement.scrollTop / 38);

        if (act !== activeElement) {
            act = activeElement;
        } else {
            if (on === "scrollDay") {
                activeDates.day.active = activeElement;
                activeDates.day.shown = activeDates.day.active;
            }
            if (on === "scrollMonth") {
                activeDates.month.active = activeElement;
                activeDates.month.shown = activeDates.month.active;
            }
            if (on === "scrollYear") {
                activeDates.year.active = activeElement;
                activeDates.year.shown = activeDates.year.active;
            }
            detectScroll(on);

            setTimeout(() => {
                detectScroll(on);
            }, 150);

            clearInterval(int);
        }
    }, 150)
}
function scrollTop(on: any) {
    if (on === "scrollDay") {
        activeDates.day.active > 1 ? activeDates.day.active-- : null;
        activeDates.day.shown = activeDates.day.active;
    }
    if (on === "scrollMonth") {
        activeDates.month.active > 1 ? activeDates.month.active-- : null;
        activeDates.month.shown = activeDates.month.active;
    }
    if (on === "scrollYear") {
        activeDates.year.active > 1 ? activeDates.year.active-- : null;
        activeDates.year.shown = activeDates.year.active;
    }
    detectScroll(on);
}
function scrollBottom(on: any) {
    if (on === "scrollDay") {
        activeDates.day.active < activeDays.value ? activeDates.day.active++ : null;
        activeDates.day.shown = activeDates.day.active;
    }
    if (on === "scrollMonth") {
        activeDates.month.active < 12 ? activeDates.month.active++ : null;
        activeDates.month.shown = activeDates.month.active;
    }
    if (on === "scrollYear") {
        activeDates.year.active < 200 ? activeDates.year.active++ : null;
        activeDates.year.shown = activeDates.year.active;
    }
    detectScroll(on);
}
function detectScroll(on: any) {
    if (on === "scrollDay" && activeDates.day.active) {
        scrollDay.value.scrollTo({
            top: (activeDates.day.shown - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
    if (on === "scrollMonth" && activeDates.month.active) {
        scrollMonth.value.scrollTo({
            top: (activeDates.month.shown - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
    if (on === "scrollYear" && activeDates.year.active) {
        scrollYear.value.scrollTo({
            top: (activeDates.year.shown - 1) * 38.05,
            left: 0,
            behavior: 'smooth'
        })
    }
}

function changeDate(date: string) {
    date = date.replace(/[^\d]/g, '');

    let days: any = date.slice(0, 2);
    let months: any = date.slice(2, 4);
    let years: any = date.slice(4, 8);

    if (days.length == 2) {
        days = +days;
        if (days > 31) {
            days = 31;
        }
        if (days < 1) {
            days = 1;
        }
        activeDates.day.active = days;
        activeDates.day.shown = days;

        detectScroll("scrollDay");
    } else if (days.length == 0) {
        activeDates.day.active = null;
    } else {
        activeDates.day.active = 'first';
        activeDates.day.shown = days;

        detectScroll("scrollDay");
    }

    if (months.length == 2) {
        months = +months;
        if (months > 12) {
            months = 12;
        }
        if (months < 0) {
            months = 0;
        }

        activeDates.day.active = +days;
        activeDates.day.shown = +days;

        activeDates.month.active = months;
        activeDates.month.shown = months;

        detectScroll("scrollMonth");
        detectScroll("scrollDay");
    } else if (months.length == 0) {
        activeDates.month.active = null;
    }

    if (years.length == 4) {
        years = +years - 1900;
        if (years < 1) {
            years = 1;
        }
        if (years > 200) {
            years = 200;
        }

        activeDates.year.active = years;
        activeDates.year.shown = years;

        detectScroll("scrollYear");
    } else if (years.length == 0) {
        activeDates.year.active = null;
    }
}

watch(show, () => {
    if (show.value) {
        const values = props.modelValue.split('/');
        activeDates.day.active = +values[0];
        activeDates.day.shown = activeDates.day.active;

        activeDates.month.active = +values[1];
        activeDates.month.shown = activeDates.month.active;

        activeDates.year.active = +values[2] - 1900;
        activeDates.year.shown = activeDates.year.active;

        setTimeout(() => {
            detectScroll("scrollDay");
            detectScroll("scrollMonth");
            detectScroll("scrollYear");
        }, 50);
    }
}, {
    deep: true,
    flush: 'post'
});
watch(props, () => {
    const values = props.modelValue.split('/');
    activeDates.day.active = +values[0];
    activeDates.day.shown = activeDates.day.active;

    activeDates.month.active = +values[1];
    activeDates.month.shown = activeDates.month.active;

    activeDates.year.active = +values[2] - 1900;
    activeDates.year.shown = activeDates.year.active;
}, {
    deep: true
});

onMounted(() => {
    document.querySelectorAll('.scroll-main').forEach((item) => {
        item.addEventListener("wheel", (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        if (!navigator.userAgentData.mobile) {
            item.addEventListener("touchmove", (e: any) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }
    });
});

document.addEventListener('click', (e: any) => {
    let el = e.target;
    const nodes = [];
    nodes.push(el);

    while (el) {
        nodes.unshift(el.parentNode);
        el = el.parentNode;
    }

    const hasWrapper = nodes.reduce((res, element) => {
        return res || element === dateSelectWrapper.value;
    }, false);

    if (!hasWrapper) {
        show.value = false;
    }
});
</script>

<style lang="scss" scoped>
.date-wrapper {
    position: relative;
    user-select: none;
}

.date-select-wrapper {
    z-index: 10000;
    border: 1px solid rgba(205, 221, 245, 1);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    position: absolute;
    top: 48px;
    left: 0px;
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

.date-input-wrapper {
    width: 100%;
    border: 1px solid rgb(205, 221, 245);
    background: white;
    border-radius: 10px;
    padding: 8px 4px 8px 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .date-input-wrapper-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    }

    .date-input-wrapper-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .date-input {
        outline: none;
        width: 70px;
    }
}

svg {
    cursor: pointer;
}
</style>