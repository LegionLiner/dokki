<template>
  <div class="wrapper">
    <div class="filter d-flex gc-6 align-center w-100">
      <div class="text-no-wrap">
        {{ $t("country") }}
      </div>
      <div class="w-100">
        <v-autocomplete
          hide-details
          clearable
          v-model="countryId"
          variant="outlined"
          density="compact"
          class="v-select-white"
          :loading="loadingCountries"
          :label="$t(`selectCountry`)"
          :items="countries"
        />
      </div>
    </div>
    <div class="w-100 mt-6">
      <div
        class="template"
        v-for="(group, groupIndex) in templates"
        :key="groupIndex"
      >
        <div class="template__heading pl-0">
          <div class="template__document font-weight-bold">
            <template v-if="group.name">
              {{ group.name }}
            </template>
          </div>
          <div class="template__label">
            {{ $t("price") }}
          </div>
        </div>
        <router-link
          v-for="template in group.templates"
          class="template__content"
          :to="{ ...to, params: { templateId: template.id } }"
        >
          <div class="template__name">
            {{ template.name }}
          </div>
          <div class="template__price">
            {{ template.price }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { DocTypes } from "@/dict";
import type { DocType } from "@/dict/types";
import { Category, type SelectItem } from "@/types";
import { countriesService, templatesService } from "@/bootstrap";
import {
  type Country,
  type Template,
  isCountryResponseBody,
  isTemplatesResponseBody,
} from "@services/types";

interface Props {
  modelValue: Category;
  to: LocationAsRelativeRaw;
}

interface TemplateItem {
  id: number;
  document?: string;
  name: string;
  price: number;
}

interface TemplateGroup {
  templates: TemplateItem[];
  name?: string;
}

const { t } = useI18n();
const toast = useToast();
const props = defineProps<Props>();
const countryId = ref<number>();
const loadingCountries = ref<boolean>(false);
const loadingTemplates = ref<boolean>(false);
const documentTypesData = ref<DocType[]>(DocTypes);
const templatesData = ref<Template[]>([]);
const templates = computed<TemplateGroup[]>(() =>
  Object.values(
    templatesData.value.reduce<Record<string, TemplateGroup>>(
      (result, template) => {
        const { id, name, docType, price } = template;
        const type = documentTypesData.value.find(({ id }) => id === docType);
        const group = result[docType] ?? { templates: [] };
        let document;

        if (type) {
          document = t(type.marker);
          group.name = document;
        }

        group.templates.push({
          id,
          name,
          price,
          document,
        });

        result[docType] = group;

        return result;
      },
      {},
    ),
  ),
);
const countriesData = ref<Country[]>([]);
const countries = computed<SelectItem[]>(() =>
  countriesData.value.map(({ id: value, name: title }) => ({
    title,
    value,
  })),
);

const fetchCountries = async () => {
  loadingCountries.value = true;

  const response = await countriesService.get(props.modelValue);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loadingCountries.value = false;

    return toast.error(message);
  }

  if (isCountryResponseBody(data)) {
    countriesData.value = data.countries;
  }

  loadingCountries.value = false;
};

const fetchTemplates = async (countryId: number) => {
  loadingTemplates.value = true;

  const categoryId = props.modelValue;
  const response = await templatesService.get(categoryId, countryId);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loadingTemplates.value = false;

    return toast.error(message);
  }

  if (isTemplatesResponseBody(data)) {
    const { templates } = data;

    templatesData.value = templates;
  }

  loadingTemplates.value = false;
};

watchEffect(() => {
  if (countryId.value) {
    return fetchTemplates(countryId.value);
  }

  templatesData.value = [];
});

onBeforeMount(async () => {
  await Promise.allSettled([fetchCountries()]);
});
</script>
<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

.wrapper {
  max-width: 60%;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    max-width: none;
  }

  .v-input--density-compact {
    .v-field__outline {
      --v-border-color: rgba(205, 221, 245, 1);
      --v-field-border-opacity: 1;
      * {
        border-color: rgba(205, 221, 245, 1);

        *::after, *::before {
          border-color: rgba(205, 221, 245, 1);
        }
      }
      &__notch::after {
        border-color: rgba(205, 221, 245, 1);
      }
      &__notch::before {
        border-color: rgba(205, 221, 245, 1);
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

        *::after, *::before {
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
}

.template {
  display: flex;
  flex-direction: column;

  @mixin common {
    display: grid;
    grid-template-columns: 1fr 64px;
  }

  &__heading {
    @include common;
    padding: 8px 16px;
  }

  &__content {
    @include common;
    cursor: pointer;
    padding: 12px 16px;
    color: #188bf1;
    background: #fff;
    border-radius: 8px;
    text-decoration: none;
    margin-bottom: 8px;
    transition: 0.1s;

    &:hover {
      background: #188bf1;
      color: #fff;
    }
  }

  &__document {
    font-size: 1.17rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 0.92rem;
    }
  }
}

.v-overlay-container {
  .v-overlay {
    &__content {
      border: 1px solid rgba(155, 171, 200, 1);
      border-radius: 10px;
      box-shadow: none;
    }
  }
  .v-list::-webkit-scrollbar {
    width: 12px;
  }
  
  .v-list::-webkit-scrollbar-track {
    background: white;
  }
  
  .v-list::-webkit-scrollbar-thumb {
    background-color: rgba(155, 171, 200, 1);
    border-radius: 20px;
    border: 3px solid white;
  }
}
</style>
