<template>
    <v-container fluid class="px-0">
        <v-row>
            <v-col cols="12" class="my-0 py-0 px-6">
                <h1 class="page-title">
                    {{ $t("links.subscription") }}
                </h1>
            </v-col>
        </v-row>
        <v-row>
            <div class="main-container-subscription">
                <div v-if="mySubscriptions.length || router.currentRoute.value.meta.hasSubscription" class="my-subscription-wrapper">
                    <div class="my-subscription-header">
                        <div>
                            {{ $t("table.name") }}
                        </div>
                        <div>
                            {{ $t("table.type") }}
                        </div>
                        <div>
                            {{ $t("table.start") }}
                        </div>
                        <div>
                            {{ $t("table.end") }}
                        </div>
                    </div>
                    <div v-for="subscription in mySubscriptions" class="my-subscription">
                        <div>
                            {{ subscription.name }}
                        </div>
                        <div>
                            {{ types[subscription.subscriptionType] }}
                        </div>
                        <div>
                            {{ subscription.startDate }}
                        </div>
                        <div>
                            {{ subscription.endDate }}
                        </div>
                    </div>
                </div>
                <div v-else-if="!router.currentRoute.value.meta.hasSubscription" class="no-subscription-wrapper">
                    {{ $t("noSubscriptions") }}
                </div>
                <div class="buy-subscription-wrapper">
                    <h2>{{ $t("buySubscription") }}</h2>
                    <div class="buy-subscription">
                        <div class="row">
                            <div class="title">
                                {{ $t("table.name") }}
                            </div>
                            <div class="value">
                                <v-select hide-details clearable v-model="selectedSubscription" variant="outlined"
                                    density="compact" class="v-select-white" :label="$t(`selectDocumentType`)"
                                    :items="subItems" />
                            </div>
                        </div>
                        <div class="row cost">
                            <div class="title">
                                <span>{{ $t('CostPerDay') }}</span>
                                <span>{{ $t('CostPerMonth') }}</span>
                            </div>
                            <div class="value">
                                <span>{{ cost.day }}</span>
                                <span>{{ cost.month }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="title">
                                {{ $t("period") }}
                            </div>
                            <div class="value">
                                <v-select hide-details clearable v-model="selectedPeriod" variant="outlined"
                                    density="compact" class="v-select-white" :label="$t(`selectPeriod`)"
                                    :items="periods" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="title">
                                {{ $t("table.count") }}
                            </div>
                            <div class="value">
                                <v-text-field v-model="count" hide-details density="compact" variant="outlined"
                                    :placeholder="$t(`table.count`)" />
                            </div>
                        </div>
                        <div class="row button">
                            <button @click="buySubscription" :class="{ 'active': isValid }">
                                {{ $t("buy") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount } from "vue";
import { subscriptionService } from "@/bootstrap";
import { useRouter } from "vue-router";

interface Subscription {
    name: string;
    costPerDay: number;
    costPerMonth: number;
    id: number;
    dateCreated: string;
    dateModified: string;
    subscriptionType: number;
}
interface MySubscription {
    name: string;
    startDate: string;
    endDate: string;
    subscriptionType: number;
}

const router = useRouter();

const allSubscriptions = ref<Subscription[]>([]);
const mySubscriptions = ref<MySubscription[]>([]);

const types = ref({
    1: "MRZ Generation",
    2: "PN Generation",
    3: "MRZ Generation, PN Generation",
})
const periods = ref([
    {
        title: "Day",
        value: 1,
    },
    {
        title: "Month",
        value: 2,
    },
]);
const subItems = computed(() => {
    return allSubscriptions.value.map((item) => {
        return {
            title: types.value[item.subscriptionType],
            value: item.id,
        }
    });
});
const cost = computed(() => {
    return {
        day: allSubscriptions.value.find((item) => item.id === selectedSubscription.value)?.costPerDay,
        month: allSubscriptions.value.find((item) => item.id === selectedSubscription.value)?.costPerMonth,
    };
});
const isValid = computed(() => {
    return selectedSubscription.value && selectedPeriod.value && count.value;
})
const count = ref(null);

const selectedPeriod = ref(null);
const selectedSubscription = ref(null);

async function getAll() {
    const response = await subscriptionService.getSubscriptions();

    if (response.meta.success) {
        allSubscriptions.value = response.data.subscriptionSettings;
    } else {
        console.log(response.meta.message);
        return;
    }
}
async function getMy() {
    const response = await subscriptionService.getSubscription();

    if (response.meta.success) {
        mySubscriptions.value = response.data.subscriptions;
    } else {
        console.log(response.meta.message);
        return;
    }
}
async function buySubscription() {
    if (!isValid.value) return;

    const response = await subscriptionService.buySubscription({
        subscriptions: [
            {
                id: selectedSubscription.value,
                period: selectedPeriod.value,
                count: count.value,
            }
        ]
    });
    if (response.meta.success) {
        await getMy();
        mySubscriptions.value.forEach((item) => {
            item.startDate = item.startDate.slice(0, 10).replace(/-/g, '/');
            item.endDate = item.endDate.slice(0, 10).replace(/-/g, '/');
        })
    }
}

onBeforeMount(async () => {
    await getAll();
    await getMy();
    mySubscriptions.value.forEach((item) => {
        item.startDate = item.startDate.slice(0, 10).replace(/-/g, '/');
        item.endDate = item.endDate.slice(0, 10).replace(/-/g, '/');
    });
});
</script>

<style lang="scss">
.main-container-subscription {
    width: 800px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .my-subscription-wrapper {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 200px;

        .my-subscription-header {
            font-weight: 500;
        }

        .my-subscription-header,
        .my-subscription {
            background: white;
            padding: 16px 24px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            div:not(:first-child) {
                text-align: center;
                width: 25%;
            }
        }
    }

    .buy-subscription-wrapper {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;


        .buy-subscription {
            background: white;
            padding: 24px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 24px;

            .row {
                display: flex;
                gap: 24px;

                .title {
                    width: 100px;
                    display: flex;
                    align-items: center;
                }

                .value {
                    width: 100%;
                }

                &.cost {

                    .title,
                    .value {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 14px;
                    }
                }
            }
        }
    }
    .no-subscription-wrapper {
        padding: 16px 24px;
    }

    button {
        border-radius: 10px;
        padding: 12px 44px;
        font-weight: 500;
        color: white;
        background: rgba(156, 205, 249, 1);
        cursor: default;

        &.active {
            background: rgba(24, 139, 241, 1);
            cursor: pointer;
        }
    }

    h2 {
        margin-bottom: 20px !important;
    }
}

.v-input--density-compact:not(.v-input--error) {
    .v-field__outline {
        --v-border-color: rgba(205, 221, 245, 1);
        --v-field-border-opacity: 1;

        * {
            border-color: rgba(205, 221, 245, 1);

            *::after,
            *::before {
                border-color: rgba(205, 221, 245, 1);
            }
        }

        &__notch::after {
            border-color: rgba(205, 221, 245, 1) !important;
        }

        &__notch::before {
            border-color: rgba(205, 221, 245, 1) !important;
        }

        &__start,
        &__end {
            border-color: rgba(205, 221, 245, 1) !important;
        }
    }

    .v-field__input {
        border-radius: 10px;
        background: white !important;
    }
}

.v-input--density-compact.v-autocomplete--active-menu {
    .v-field__outline {
        --v-border-color: rgba(155, 171, 200, 1);
        --v-field-border-opacity: 1;

        * {
            border-color: rgba(155, 171, 200, 1);

            *::after,
            *::before {
                border-color: rgba(155, 171, 200, 1);
            }
        }

        &__notch::after {
            border-color: rgba(155, 171, 200, 1);
        }

        &__notch::before {
            border-color: rgba(155, 171, 200, 1);
        }
    }

    .v-field__input {
        border-radius: 10px;
        background: white !important;
    }
}

i.mdi-chevron-down::before {
    content: "\F0140";
    color: rgba(155, 171, 200, 1);
}

i::before {
    color: rgba(155, 171, 200, 1);
}
</style>