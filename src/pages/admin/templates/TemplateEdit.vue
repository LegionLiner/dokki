<template>
  <v-row v-if="fetching" justify="center">
    <v-col cols="2">
      <v-progress-circular :width="6" :size="80" color="green" indeterminate />
    </v-col>
  </v-row>
  <div class="form" v-else-if="item">
    <h1>
      {{ $t("editTemplate") }}
    </h1>
    <TemplateForm :item="item" :loading="storing" @submit="storeTemplate" />
  </div>
  <template v-else>No item</template>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { templatesService } from "@/bootstrap";
import { isTemplateResponseBody, type Template } from "@services/types";
import type { TemplateFilePayload, TemplatePayload } from "@infra/types";
import TemplateForm from "@components/template/TemplateForm.vue";

interface Props {
  id: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const backToPage = ref<string>();
const fetching = ref<boolean>(true);
const storing = ref<boolean>(false);
const item = ref<Template>();

const fetchTemplate = async () => {
  fetching.value = true;

  const response = await templatesService.get(props.id);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    fetching.value = false;

    return toast.error(message);
  }

  if (isTemplateResponseBody(data)) {
    item.value = data;
  }

  fetching.value = false;
};

const storeTemplate = async (
  template: TemplatePayload,
  files: TemplateFilePayload[],
) => {
  fetching.value = true;

  const response = await templatesService.update(template, files);
  const { meta } = response;
  const { success, message } = meta;

  if (!success) {
    fetching.value = false;

    return toast.error(message);
  }

  toast.success(t("templateUpdated"));
  router.push({
    name: "admin.templates.list",
    query: {
      page: backToPage.value,
    },
  });
};

onBeforeMount(async () => {
  Promise.allSettled([fetchTemplate()]);

  const prevPath = router.options.history.state.back;

  if (typeof prevPath === "string") {
    const url = new URL(prevPath, "http://localhost");
    const page = url.searchParams.get("page");

    if (page) {
      backToPage.value = page;
    }
  }
});
</script>

<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

.filter {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto 1fr;
  align-items: center;
  column-gap: 16px;
  row-gap: 4px;

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    grid-template-columns: auto 1fr;
  }
}

.v-table--spacing>.v-table__wrapper>table {
  border-spacing: 0 0.67rem !important;
}

.v-table .v-table__wrapper>table>thead>tr>th {
  font-weight: 700 !important;
  border-bottom: none !important;
}

.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>td,
.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th {
  border-bottom: none !important;
}

.v-table .v-data-table__tr .v-data-table__td {
  max-width: 200px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
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
.v-card {
  background: rgba(247, 251, 255, 1);
  padding: 20px 16px !important;
  border-radius: 20px !important;
  &::webkit-scrollbar {
    width: 0px;
  }
  &-title {
    margin-left: 10px;
    margin-right: 10px;
  }
  .action-buttons {
    // margin-left: 10px;
    button {
      padding: 12px 24px;
      height: auto;
    }
    .cancel {
      border: 1px solid rgba(24, 139, 241, 1);
      color: rgba(24, 139, 241, 1);
    }
  }
}
.mdi-checkbox-blank-outline::before {
  color: rgba(205, 221, 245, 1);
}
.mdi-checkbox-marked::before, .mdi-radiobox-marked::before {
  color: rgba(24, 139, 241, 1);
}
</style>
