<template>
  <div class="form">
    <h1>
      {{ $t("createTemplate") }}
    </h1>
    <TemplateForm
      :item="item"
      :show-category="true"
      @submit="createTemplate"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { templatesService } from "@/bootstrap";
import type { NewTemplate } from "@/types";
import type { TemplateFilePayload, TemplatePayload } from "@infra/types";
import TemplateForm from "@components/template/TemplateForm.vue";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const loading = ref<boolean>(false);
const item = ref<NewTemplate>({
  id: 0,
  name: "",
  createDate: "",
  isPublic: false,
  creatorName: "",
  category: undefined,
  docType: undefined,
  subType: null,
  countryId: undefined,
  country: "",
  price: undefined,
  sampleText: null,
  sampleTitle: null,
  userFields: [],
  files: [],
  parentTemplateId: -1,
});

const createTemplate = async (
  template: TemplatePayload,
  files: TemplateFilePayload[],
) => {
  loading.value = true;

  const response = await templatesService.create(template, files);
  const { meta } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  toast.success(t("templateCreated"));
  router.push({ name: "admin.templates.list" });
};
</script>

<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

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

.v-input--density-compact {
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
    margin-left: 10px;
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