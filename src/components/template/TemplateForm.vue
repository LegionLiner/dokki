<template>
  <v-form v-model="isFormValid" @submit.prevent="saveTemplate">
    <div class="d-flex flex-column gr-4">
      <div class="fields">
        <label for="title">
          {{ $t("labels.title") }}
        </label>
        <v-text-field
          v-model="docForm.name"
          density="compact"
          hide-details
          id="title"
          bg-color="#fff"
          :placeholder="$t(`labels.title`)"
        />
        <LabelCheckboxPair className="checkbox">
          <template #label>
            <label for="public">
              {{ $t("labels.public") }}
            </label>
          </template>
          <v-checkbox
            v-model="docForm.isPublic"
            hide-details
            density="compact"
            id="public"
          />
        </LabelCheckboxPair>

        <template v-if="showCategory">
          <label for="category">
            {{ $t("labels.category") }}
          </label>
          <v-select
            hide-details
            clearable
            v-model="docForm.category"
            variant="outlined"
            density="compact"
            id="category"
            bg-color="#fff"
            :label="$t(`selectDocumentType`)"
            :items="categories"
          />
        </template>
        <FormDoc
          v-if="isDocOrParentTemplate"
          v-model:doc-type="docForm.docType"
          v-model:countryId="docForm.countryId"
          v-model:price="docForm.price"
          v-model:sample-title="docForm.sampleTitle"
          v-model:sample-text="docForm.sampleText"
          v-model:new-project-files="files.project"
          v-model:new-example-image-files="files.image"
          v-model:new-input-files="files.input"
          v-model:new-excel-file-batch="files.excel"
          :project-files="projectFiles"
          :example-image-files="exampleImageFiles"
          :input-files="inputFiles"
          :excel-files-batch="excelFilesBatch"
          :countries="countries"
          :loading="countriesLoading"
        />
        <FormMRZ
          v-else-if="docForm.category === Category.MRZ"
          v-model:sub-type="docForm.subType"
          v-model:countryId="docForm.countryId"
          v-model:price="docForm.price"
          :disabled="userFieldsTableLoading"
          :countries="countries"
          :loading="countriesLoading"
        />
        <FormAAMVA
          v-else-if="docForm.category === Category.AAMVA"
          v-model:countryId="docForm.countryId"
          v-model:price="docForm.price"
          :countries="countries"
          :loading="countriesLoading"
        />
        <FormPN
          v-else-if="docForm.category === Category.PN"
          v-model:sub-type="docForm.subType"
          v-model:countryId="docForm.countryId"
          v-model:price="docForm.price"
          :countries="countries"
          :loading="countriesLoading"
        />
        <label for="parentTemplate">{{ $t("labels.parentTemplate") }}</label>
        <v-select
          v-model="docForm.parentTemplateId"
          hide-details
          clearable
          variant="outlined"
          density="compact"
          id="parentTemplate"
          bg-color="#fff"
          :label="$t(`selectParentTemplate`)"
          :items="parentTemplates"
        />
        <label for="batchUserFieldFile">{{
          $t("labels.batchUserFieldFile")
        }}</label>
        <v-file-input
          clearable
          hide-details
          density="compact"
          id="batchUserFieldFile"
          bg-color="#fff"
          prepend-icon=""
          :multiple="false"
          :label="$t(`labels.file`)"
          :placeholder="$t(`labels.batchUserFieldFile`)"
          :loading="userFieldsTableLoading"
          @update:model-value="uploadCustomUserFieldsFile"
        />
      </div>
      <div class="d-flex flex-wrap gc-6 gr-3">
        <v-btn
          variant="flat"
          color="primary"
          :disabled="editFieldDialogShown || userFieldsTableLoading"
          @click="addNewField"
          >{{ $t("addUserField") }}</v-btn
        >
        <v-btn
          variant="text"
          color="red"
          :disabled="
            editFieldDialogShown ||
            userFieldsTableLoading ||
            !docForm?.userFields?.length
          "
          @click="removeUserFields"
          >{{ $t("removeUserFields") }}</v-btn
        >
      </div>
      <div class="user-fields">
        <h3>{{ $t("userProvidedFields") }}</h3>
        <div class="mt-6">
          <UserFieldsTable
            v-if="lgAndUp"
            :items="paginatedUserFields"
            :headers="headers"
            :loading="userFieldsTableLoading"
            @delete="deleteUserField"
            @edit="editUserField"
            @duplicate="duplicateUserField"
          />
          <FlexibleTable
            v-else
            :headers="headers"
            :items="paginatedUserFields"
            :loading="userFieldsTableLoading"
            @delete="deleteUserField"
            @edit="editUserField"
            @duplicate="duplicateUserField"
          />
          <pagination
            v-if="userFieldsPages > 1"
            v-model="userFieldsPage"
            density="compact"
            size="large"
            class="mt-2"
            :length="userFieldsPages"
            :disabled="userFieldsTableLoading"
            @update:model-value="userFieldsPage = $event"
          />
        </div>
      </div>
      <v-btn
        type="submit"
        class="w-100 my-4"
        color="primary"
        :disabled="editFieldDialogShown || userFieldsTableLoading"
        :loading="loading"
      >
        {{ $t("saveTemplate") }}
      </v-btn>
      <v-dialog
        v-model="editFieldDialogShown"
        :style="{ maxWidth: `800px`, width: `auto` }"
      >
        <v-card>
          <v-card-title primary-title class="d-flex justify-space-between align-center">
            {{
              editFieldMode === "edit"
                ? $t("editUserProvidedFields")
                : $t("newUserProvidedFields")
            }}
            <Cross @click="editFieldDialogShown = false" class="cursor-pointer"></Cross>
          </v-card-title>
          <v-card-text>
            <v-form v-model="fieldFormIsValid" validate-on="blur">
              <UserFieldForm
                v-model:item="editField"
                v-model:loading="itemLoading"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end action-buttons">
            <v-btn
              class="submit"
              color="primary"
              variant="tonal"
              density="compact"
              type="submit"
              :loading="itemLoading"
              :disabled="!fieldFormIsValid"
              @click="storeUserField"
              >{{ editFieldMode === "create" ? $t("add") : $t("save") }}</v-btn
            >
            <v-btn
            class="cancel"
              color="outlined"
              variant="flat"
              @click="editFieldDialogShown = false"
              >{{ $t("cancel") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-form>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import {
  type NewTemplate,
  type SelectItem,
  DEFAULT_NEW_FILE_ID,
} from "@/types";
import FormDoc from "@components/template/form/FormDoc.vue";
import FormAAMVA from "@components/template/form/FormAAMVA.vue";
import FormMRZ from "@components/template/form/FormMRZ.vue";
import FormPN from "@components/template/form/FormPN.vue";
import UserFieldsTable from "@components/template/user_fields/UserFieldsTable.vue";
import UserFieldForm from "@components/template/user_fields/UserFieldForm.vue";
import LabelCheckboxPair from "@components/LabelCheckboxPair.vue";
import FlexibleTable from "@components/template/user_fields/UserFieldsFlexibleTable.vue";
import Pagination from "@components/Pagination.vue";
import {
  type Country,
  type Template,
  type TemplateFile,
  type UserField,
  Category,
  FileType,
  isTemplateResponseBody,
  isCountryResponseBody,
  isGeneratedFields,
  isParentTemplatesBody,
  type ParentTemplate,
} from "@services/types";
import { Categories, MRZTypes, PNTypes } from "@/dict";
import type { GetNewSampleParams, TemplateFilePayload } from "@infra/types";
import { countriesService, templatesService } from "@/bootstrap";
import Cross from "../icons/Cross.vue";

type CreateNewUserPayloadRequired = "id" | "displayOrder";
type CreateUserField = Pick<UserField, CreateNewUserPayloadRequired>;
type CreateUserFieldAdditional = Partial<
  Omit<UserField, CreateNewUserPayloadRequired>
>;

type EditFieldMode = "create" | "edit";

type Item = NewTemplate | Template;

interface FilesContainer {
  project: File[];
  image: File[];
  input: File[];
  excel: File[];
}

interface Props {
  item: Item;
  loading?: boolean;
  showCategory?: boolean;
}

const PER_PAGE_ITEMS = 12;

const { t } = useI18n();
const toast = useToast();
const display = useDisplay();
const props = defineProps<Props>();
const emit = defineEmits(["submit"]);
const fieldFormIsValid = ref<boolean>(false);
const lgAndUp = computed<boolean>(() => display.lgAndUp.value);
const perPage = PER_PAGE_ITEMS;
const isFormValid = ref<boolean>();
const itemLoading = ref<boolean>(false);
const userFieldsTableLoading = ref<boolean>(false);
const editFieldDialogShown = ref<boolean>(false);
const editFieldMode = ref<EditFieldMode>();
const editField = ref<UserField>();
const categories = ref<SelectItem[]>(
  Categories.map(({ id: value, name: title }) => ({ title, value })),
);
const parentTemplateLoading = ref<boolean>(false);
const parentTemplateData = ref<ParentTemplate[]>([]);
const countriesLoading = ref<boolean>(false);
const countriesData = ref<Country[]>([]);
const parentTemplates = computed<SelectItem[]>(() =>
  parentTemplateData.value.map(({ id: value, name: title }) => ({
    title,
    value,
  })),
);
const countries = computed<SelectItem[]>(() =>
  countriesData.value.map(({ id: value, name: title }) => ({
    title,
    value,
  })),
);
const docForm = reactive<Item>(props.item);
const isDocOrParentTemplate = computed<boolean | undefined>(() => {
  if (docForm?.category === undefined) {
    return;
  }

  return [Category.Doc, Category.ParentTemplate].includes(docForm.category);
});
const projectFiles = computed<TemplateFile[]>(() =>
  findFilesByType(FileType.Project),
);
const exampleImageFiles = computed<TemplateFile[]>(() =>
  findFilesByType(FileType.Image),
);
const inputFiles = computed<TemplateFile[]>(() =>
  findFilesByType(FileType.Input),
);
const excelFilesBatch = computed<TemplateFile[]>(() => findFilesByType(null));
const userFieldsPage = ref<number>(1);
const userFieldsCount = computed<number>(() => docForm.userFields.length ?? 0);
const userFieldsPages = computed<number>(() =>
  Math.ceil(userFieldsCount.value / perPage),
);
const files = ref<FilesContainer>({
  project: [],
  image: [],
  excel: [],
  input: [],
});
watch(files, () => {
 // console.log(buildFilePayload(files.value.excel, excelFilesBatch.value, FileType.Input));
  
}, {
  deep: true
})
const headers = computed(() => [
  {
    title: t("table.order"),
    key: "displayOrder",
    sortable: false,
  },
  {
    title: t("table.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("table.fieldName"),
    key: "fieldName",
    sortable: false,
  },
  {
    title: t("table.tags"),
    key: "tag",
    sortable: false,
  },
  {
    title: t("table.defaultValue"),
    key: "defaultValue",
    sortable: false,
  },
  {
    title: t("table.isFile"),
    key: "isFile",
    sortable: false,
  },
  {
    title: t("table.needReverse"),
    key: "needToReverseText",
    sortable: false,
  },
  {
    title: t("table.isHidden"),
    key: "isHidden",
    sortable: false,
  },
  {
    title: t("table.source"),
    key: "source",
    minWidth: "153px",
    sortable: false,
  },
  {
    title: t("table.actions"),
    key: "actions",
    sortable: false,
  },
]);

const paginatedUserFields = computed<UserField[]>(() => {
  if (!docForm.userFields.length) {
    return [];
  }

  const count = perPage;
  const start = (userFieldsPage.value - 1) * count;
  const end = start + count;

  return docForm.userFields
    .toSorted(({ displayOrder: a }, { displayOrder: b }) => a - b)
    .slice(start, end);
});

const deleteUserField = (id: number) => {
  docForm.userFields = docForm.userFields.filter(
    ({ id: fieldId }) => fieldId !== id,
  );
};

const editUserField = (id: number) => {
  const item = docForm.userFields.find(({ id: itemId }) => itemId === id);

  if (!item) {
    return;
  }

  editField.value = item;
  editFieldMode.value = "edit";
  editFieldDialogShown.value = true;
};

const getLastOrderId = (fields: UserField[], start: number = 0): number =>
  fields.reduce(
    (result, { displayOrder }) => Math.max(result, displayOrder),
    start,
  );
const getLastId = (fields: UserField[], start: number = 0): number =>
  fields.reduce((result, { id }) => Math.max(result, id), 0);

const duplicateUserField = (id: number) => {
  let fields: UserField[] = Array.isArray(docForm.userFields)
    ? [...docForm.userFields]
    : [];
  const lastOrder = getLastOrderId(fields);
  const lastId = getLastId(fields);
  const item = fields.find(({ id: itemId }) => itemId === id);

  if (!item) {
    return;
  }

  const cloned = { ...item };

  cloned.displayOrder = lastOrder + 1;
  cloned.id = lastId + 1;
  fields.push(cloned);
  docForm.userFields = fields;
};

const findFilesByType = (type: FileType | null): TemplateFile[] => {
  const files = docForm.files;
  const result: TemplateFile[] = [];

  for (const file of files) {
    const { fileType } = file;

    if (fileType === type) {
      result.push(file);
    }
  }

  return result;
};

const storeUserField = () => {
  const newField = editField.value;
  const mode = editFieldMode.value;
  let fields: UserField[] = Array.isArray(docForm.userFields)
    ? [...docForm.userFields]
    : [];

  if (!newField) {
    return;
  }

  if (mode === "create") {
    fields.push(newField);
  }

  if (mode === "edit") {
    const { id } = newField;
    const index = fields.findIndex(({ id: itemId }) => itemId === id);

    if (index > -1) {
      fields.splice(index, 1, newField);
    }
  }

  docForm.userFields = fields;
  editFieldDialogShown.value = false;
};

const createNewField = (
  { id, displayOrder }: CreateUserField,
  additional: CreateUserFieldAdditional = {},
): UserField =>
  Object.assign(
    {},
    {
      id,
      name: "",
      fieldName: "",
      isFile: false,
      source: 1,
      autodataTemplate: null,
      displayOrder,
      needToReverseText: false,
      defaultValue: null,
      isHidden: false,
      customListId: null,
      childTemplateId: null,
      childTemplateResultLine: null,
      tag: null,
    },
    additional,
  );

const computeNewField = (): UserField => {
  const fields: UserField[] = docForm?.userFields ?? [];
  const lastId = getLastId(fields);
  const lastOrder = getLastOrderId(fields);
  const id = lastId + 1;
  const displayOrder = lastOrder + 1;

  return createNewField({ id, displayOrder });
};

const addNewField = () => {
  editField.value = computeNewField();
  editFieldMode.value = "create";
  editFieldDialogShown.value = true;
};

const removeUserFields = () => (docForm.userFields = []);

const buildFilePayload = (
  container: File[],
  storage: TemplateFile[],
  type: FileType,
): TemplateFilePayload[] =>
  container.map<TemplateFilePayload>((file, index) => {
    const templateFile = storage[index];
    const id = templateFile?.id ?? DEFAULT_NEW_FILE_ID;

    return {
      file,
      id,
      type,
    };
  });

const saveTemplate = () => {
  const { excel, input, image, project } = files.value;
  const filesPayload: TemplateFilePayload[] = [
    ...buildFilePayload(excel, excelFilesBatch.value, FileType.Input),
    ...buildFilePayload(input, inputFiles.value, FileType.Input),
    ...buildFilePayload(image, exampleImageFiles.value, FileType.Image),
    ...buildFilePayload(project, projectFiles.value, FileType.Project),
  ];

  emit("submit", docForm, filesPayload);
};

const uploadCustomUserFieldsFile = async (files: File[]) => {
  if (!files?.length) {
    return;
  }

  userFieldsTableLoading.value = true;

  const [file] = files;
  const response = await templatesService.getFields(file);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    userFieldsTableLoading.value = false;
    toast.error(message);

    return;
  }

  if (isGeneratedFields(data)) {
    const { fields } = data;

    if (fields.length) {
      const lastId = getLastId(fields);
      const extendedFields = fields.map((field, index) => {
        field.id = lastId + index + 1;

        return field;
      });

      docForm.userFields.push(...extendedFields);
    }
  }

  userFieldsTableLoading.value = false;
};

const fetchNewSample = async (
  params: GetNewSampleParams,
): Promise<Template | undefined> => {
  const response = await templatesService.getNewSample(params);
  const { data, meta } = response;
  const { success } = meta;

  if (!success) {
    return;
  }

  if (isTemplateResponseBody(data)) {
    return data;
  }
};

const fetchCountries = async () => {
  countriesLoading.value = true;

  const response = await countriesService.get();
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    countriesLoading.value = false;
    return toast.error(message);
  }

  if (isCountryResponseBody(data)) {
    countriesData.value = data.countries;
  }

  countriesLoading.value = false;
};

const fetchParentTemplates = async () => {
  parentTemplateLoading.value = true;

  const response = await templatesService.parents();
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    parentTemplateLoading.value = false;
    return toast.error(message);
  }

  if (isParentTemplatesBody(data)) {
    parentTemplateData.value = data.templates;
  }

  parentTemplateLoading.value = false;
};

watch(editFieldDialogShown, (isShown) => {
  if (!isShown) {
    editField.value = undefined;
  }
});

watch(
  () => docForm.subType,
  async (subtype) => {
    if (!docForm.category) {
      return;
    }

    if (![Category.MRZ, Category.PN].includes(docForm.category)) {
      return;
    }

    if (subtype === null) {
      docForm.userFields = [];

      return;
    }

    userFieldsTableLoading.value = true;

    const params: GetNewSampleParams = {
      category: docForm.category,
      subtype,
    };
    const newSample = await fetchNewSample(params);

    if (newSample?.userFields) {
      docForm.userFields = [...newSample.userFields];
    }

    userFieldsTableLoading.value = false;

    if (docForm.id && docForm.name) {
      return;
    }

    let storage;

    if (docForm.category === Category.MRZ) {
      storage = MRZTypes;
    }

    if (docForm.category === Category.PN) {
      storage = PNTypes;
    }

    const type = storage?.find(({ id }) => id === subtype);

    if (!type) {
      return;
    }

    docForm.name = type.name;
  },
);

watch(
  () => docForm.category,
  () => {
    docForm.subType = null;
    docForm.countryId = undefined;
    docForm.country = "";
    docForm.price = undefined;
  },
);

watch(
  () => docForm.countryId,
  (id?: number) => {
    if (id === undefined) {
      docForm.country = "";

      return;
    }

    const country = countriesData.value.find(
      ({ id: countryId }) => countryId === id,
    );

    if (!country) {
      return;
    }

    const { name } = country;

    docForm.country = name;
  },
);

onBeforeMount(async () => {
  await Promise.allSettled([fetchCountries(), fetchParentTemplates()]);
});
</script>
