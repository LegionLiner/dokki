<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("hello", { name: userStore.email }) }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="index">
          <div
            class="index__hints item"
            @mouseover="hovered = true"
            @mouseout="hovered = false"
          >
            <div class="item__header d-flex justify-space-between">
              <h3 class="subheader">{{ $t(`helpfulInformation`) }}</h3>
              <div class="item__link d-flex gc-2 align-center">
                <Link
                  class="d-block custom-link"
                  :to="{ name: `support` }"
                  :style="{
                    color: `rgb(187, 198, 219)`,
                  }"
                >
                  {{ $t(`all`) }}
                </Link>
                <RightArrow
                  :style="{
                    fill: `rgb(187, 198, 219)`,
                  }"
                />
              </div>
            </div>
            <div class="item__hints h-100">
              <div
                v-if="loading"
                class="d-flex justify-center align-center h-100 bg-white py-8"
                :style="{
                  borderRadius: `16px`,
                }"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  class="mx-auto"
                  :size="64"
                />
              </div>
              <template v-else-if="question">
                <div class="hint d-flex flex-column h-100">
                  <div class="hint__head">
                    <transition name="fade" mode="out-in">
                      <span v-html="question.name" :key="questionIndex" />
                    </transition>
                  </div>
                  <div class="hint__content flex-grow-1">
                    <transition name="fade" mode="out-in">
                      <div
                        v-html="question.answer"
                        class="hint__text"
                        :key="questionIndex"
                      />
                    </transition>
                  </div>
                  <div
                    class="hint__actions actions d-flex flex-column flex-md-row flex-wrap ga-2 justify-space-between mb-3 my-sm-3"
                  >
                    <div class="d-flex flex-wrap ga-2 align-center">
                      <Link
                        class="d-block custom-link"
                        :to="{ name: `support` }"
                      >
                        {{ $t(`learnMore`) }}
                      </Link>
                      <RightArrow />
                    </div>
                    <div class="d-flex ga-2 flex-wrap">
                      <v-btn
                        link
                        v-show="!isQuestionFirst"
                        variant="outlined"
                        color="primary"
                        class="v-btn-action"
                        size="x-small"
                        @click="showPrevQuestion"
                        :text="$t(`prevQuestion`)"
                      />
                      <v-btn
                        link
                        v-show="!isQuestionLast"
                        variant="outlined"
                        color="primary"
                        class="v-btn-action"
                        size="x-small"
                        @click="showNextQuestion"
                        :text="$t(`nextQuestion`)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="index__balance item">
            <h3 class="subheader">{{ $t(`yourBalance`) }}</h3>
            <div class="item__balance d-flex align-center w-100">
              {{ $t(`nOfCr`, { num: userStore.balance }) }}
            </div>
          </div>
          <div class="index__orders item">
            <h3 class="subheader">{{ $t(`countOfOrders`) }}</h3>
            <div class="item__orders d-flex align-center w-100">
              {{ userStore.ordersCount }}
            </div>
          </div>
          <div class="index__steps item">
            <h3 class="subheader">{{ $t(`stepByStep`) }}</h3>
            <div class="item__steps">
              <swiper
                :slidesPerView="slidesDisplay"
                :space-between="8"
                :freeMode="true"
              >
                <swiper-slide
                  v-for="(step, index) in steps"
                  class="last-order-slide"
                  :key="index"
                >
                  <div class="last-order-item">
                    <div class="last-order-head mb-1">
                      <div class="last-order-item-id">
                        {{ $t("stepIs", { step: index + 1 }) }}
                      </div>
                    </div>
                    <h4 v-html="step.title" />
                    <p class="last-orders-txt" v-html="step.text" />
                    <Link :to="step.to" class="mt-3 d-block custom-link">
                      {{ step.link }}
                    </Link>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch, onBeforeUnmount } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { Swiper, SwiperSlide } from "swiper/vue";
import { faqService } from "@/bootstrap";
import { parseByLang, random } from "@/utils";
import useUserStore from "@stores/user";
import { isFaqResponseBody, type FaqItem } from "@services/types";
import Link from "@components/Link.vue";
import RightArrow from "@components/icons/RightArrow.vue";
import "swiper/css";

interface Step {
  title: string;
  text: string;
  link: string;
  to: LocationAsRelativeRaw;
}

type ShortFaqItem = Omit<FaqItem, "children">;

const toast = useToast();
const display = useDisplay();
const { t, locale } = useI18n();
const userStore = useUserStore();
const faqData = ref<FaqItem[]>([]);
const loading = ref<boolean>(false);
const hovered = ref<boolean>(false);
let intervalId: number;
const faqItems = computed<ShortFaqItem[]>(() => flatItems(faqData.value));
const questionIndex = ref<number>();
const isQuestionLast = computed<boolean>(() =>
  questionIndex.value === undefined
    ? false
    : questionIndex.value + 1 === faqItems.value.length,
);
const isQuestionFirst = computed<boolean>(() => questionIndex.value === 0);
const question = computed<ShortFaqItem | undefined>(() =>
  questionIndex.value === undefined
    ? undefined
    : faqItems.value[questionIndex.value],
);
const slidesDisplay = computed<number | "auto">(() =>
  display.width.value >= 1280 ? 5 : "auto",
);
const steps = computed<Step[]>(() => [
  {
    title: t("steps.0.title"),
    text: t("steps.0.text"),
    link: t("steps.0.link"),
    to: { name: "docs" },
  },
  {
    title: t("steps.1.title"),
    text: t("steps.1.text"),
    link: t("steps.1.link"),
    to: { name: "docs" },
  },
  {
    title: t("steps.2.title"),
    text: t("steps.2.text"),
    link: t("steps.2.link"),
    to: { name: "orders" },
  },
  {
    title: t("steps.3.title"),
    text: t("steps.3.text"),
    link: t("steps.3.link"),
    to: { name: "docs" },
  },
  {
    title: t("steps.4.title"),
    text: t("steps.4.text"),
    link: t("steps.4.link"),
    to: { name: "balance" },
  },
]);

const flatItems = (items: FaqItem[]): ShortFaqItem[] => {
  const result: ShortFaqItem[] = [];
  const loc = locale.value;

  for (const item of items) {
    const { answer, id, name, children } = item;

    result.push({
      id,
      answer: parseByLang(answer, loc),
      name: parseByLang(name, loc),
    });

    if (children) {
      result.push(...flatItems(children));
    }
  }

  return result;
};

const fetchFaq = async () => {
  loading.value = true;

  const response = await faqService.get();
  const { data, meta } = response;
  const { message, success } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  if (isFaqResponseBody(data)) {
    faqData.value = data;
  }

  loading.value = false;
};

const showPrevQuestion = () => {
  const index = questionIndex.value;

  if (index === undefined) {
    return;
  }

  if (isQuestionFirst.value) {
    return;
  }

  questionIndex.value = index - 1;
};

const showNextQuestion = () => {
  const index = questionIndex.value;

  if (index === undefined) {
    return;
  }

  if (isQuestionLast.value) {
    return;
  }

  questionIndex.value = index + 1;
};

watch(faqData, (value) => {
  if (value.length) {
    questionIndex.value = 0;
  }
});

const makeStep = () => {
  if (hovered.value) {
    return;
  }

  const index = questionIndex.value;

  if (index === undefined) {
    questionIndex.value = undefined;

    return;
  }

  const min = 0;
  const max = faqItems.value.length - 1;
  let newIndex = index;

  do {
    newIndex = random(min, max);
  } while (index === newIndex);

  questionIndex.value = newIndex;
};

onBeforeMount(async () => {
  await Promise.allSettled([fetchFaq()]);
  intervalId = window.setInterval(makeStep, 10_000);
});

onBeforeUnmount(() => {
  window.clearInterval(intervalId);
});
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";
.index {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-areas:
    "hints balance"
    "hints orders"
    "steps steps";
  grid-gap: 16px;

  &__hints {
    grid-area: hints;
  }

  &__balance {
    grid-area: balance;
  }

  &__orders {
    grid-area: orders;
  }

  &__steps {
    grid-area: steps;
  }

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "balance orders"
      "hints hints"
      "steps steps";
  }
}

.item {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  &__link {
    font-size: 0.92rem;
  }

  @mixin common {
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 34px;
    padding: 48px 32px;
    height: 112px;
    border-radius: 16px;
  }

  &__balance {
    @include common;
    color: #fff;
    background: url("@assets/img/money.png"),
      linear-gradient(93.25deg, #0b73cf 23.71%, #4a0bcf 81.9%), #0b73cf;
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-size:
      auto,
      auto,
      160px 160px;
    background-position:
      bottom 40% right -10%,
      left,
      right;
  }

  &__orders {
    @include common;
    background: url("@assets/img/countList.png"), #d4f5ff;
    background-position:
      top 30% right -8%,
      left;
    background-repeat: no-repeat, no-repeat;
    color: #188bf1;
  }

  @media (max-width: 780px) {
    @mixin common {
      color: #188bf1;
      background: none;
      height: auto;
      padding: 0;
      padding-left: 4px;
      font-size: 1.83rem;
      line-height: 2.83rem;
    }

    row-gap: 6px;

    &__balance {
      @include common;
    }

    &__orders {
      @include common;
    }
  }
}

.last-orders {
  &-txt {
    b,
    i {
      display: inline-block;
    }
  }
}

.last-order-item-list {
  margin-top: 10px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 0.92rem;
    line-height: 1rem;
    margin-bottom: 11px;

    & > div:nth-child(1) {
      color: #bbc6db;
    }

    & > div:nth-child(2) {
      font-weight: 600;
      padding-left: 8px;
      margin-left: auto;
      text-align: right;
    }
  }
}

.last-order-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 19px;
  font-size: 0.92rem;

  ul,
  li {
    list-style: none;
  }

  &-id {
    font-weight: 600;
    font-size: 14px;
  }

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    &-id {
      font-weight: 500;
      font-size: 12px;
    }
  }
}

.last-order-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-order-slide {
  width: 228px;
}

.hint {
  background-color: #fff;
  border-radius: 16px;

  &__head {
    background: #188bf1;
    font-weight: 600;
    font-size: 1.08rem;
    border-radius: 16px;
    line-height: 1.17rem;
    padding: 14px 24px;
    color: #fff;
  }

  &__content {
    font-weight: 400;
    font-size: 1.08rem;
    line-height: 1.4;
    padding: 19px 28px 16px;
  }

  &__text {
    height: 131px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__actions {
    padding: 0 28px;
    font-size: 0.92rem;
  }

  @media (max-width: 500px) {
    &__head {
      padding: 10px 16px;
      border-radius: 8px;
    }

    &__content {
      padding: 12px 16px 24px;
    }

    &__actions {
      padding: 0 16px;
    }
  }

  @media #{map-get($display-breakpoints, 'xs')} {
    &__content {
      font-size: 0.92rem;
    }

    &__text {
      height: 48px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<style lang="scss">
.custom-link {
  color: #188bf1;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
