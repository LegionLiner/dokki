<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("support") }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="faq">
          <div class="faq__questions faq__item item">
            <div class="item__header">
              <h3 class="subheader">{{ $t(`questions`) }}</h3>
            </div>
            <div class="item__content item__content_white">
              <template v-if="loading">
                <div class="d-flex justify-center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    class="mx-auto"
                  />
                </div>
              </template>
              <FAQExpansion
                v-else
                v-model:selected="selectedItem"
                :model-value="faqDate"
              />
            </div>
          </div>
          <div class="faq__answers faq__item item">
            <div class="item__header">
              <h3 class="subheader">{{ $t(`answer`) }}</h3>
            </div>
            <div class="item__content item__content_white" v-html="answer" />
          </div>
          <div class="faq__telegram faq__item item">
            <div class="item__header text-center">
              <h3 class="subheader">{{ $t(`telegram`) }}</h3>
            </div>
            <div class="item__content telegram">
              <a
                href="https://t.me/kotolamp"
                target="_blank"
                class="d-flex justify-center align-center"
              >
                <img
                  src="@assets/img/telegram.png"
                  alt="Telegram"
                  class="telegram__picture"
                />
              </a>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from "vue";
import { useToast } from "vue-toastification";
import { faqService } from "@/bootstrap";
import { isFaqResponseBody, type FaqItem } from "@services/types";
import { useI18n } from "vue-i18n";
import { parseByLang } from "@/utils";
import FAQExpansion from "@components/faq/FAQExpansion.vue";

const toast = useToast();
const { locale } = useI18n();
const loading = ref<boolean>(false);
const faqDate = ref<FaqItem[]>([]);
const selectedItem = ref<FaqItem>();
const answer = computed<string>(() =>
  selectedItem.value
    ? parseByLang(selectedItem.value.answer, locale.value)
    : "",
);

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
    faqDate.value = data;
  }

  loading.value = false;
};

onBeforeMount(async () => {
  await Promise.allSettled([fetchFaq()]);
});
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";

.faq {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px;

  &__item {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    @media #{map-get($display-breakpoints, 'md-and-down')} {
      row-gap: 6px;
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 1fr;
    font-size: 0.92rem;

    &__answers {
      display: none;
    }
  }
}

.item {
  &__content {
    border-radius: 8px;
    padding: 32px 19px;

    @media #{map-get($display-breakpoints, 'md-and-down')} {
      padding: 19px;
    }

    &_white {
      background-color: #fff;
    }
  }
}

.telegram {
  &__picture {
    width: 100%;
    max-width: 280px;
    margin-top: -50px;

    @media #{map-get($display-breakpoints, 'md-and-down')} {
      margin-top: -26px;
    }
  }
}
</style>
