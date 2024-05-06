<template>
  <v-container fluid class="px-0">
    <template v-if="templateLoading">
      <v-row>
        <v-col cols="12">
          <div
            class="d-flex justify-center align-center h-100 py-8"
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
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col cols="12" class="my-0 py-0">
          <div class="grid">
            <div class="grid__inputs">
              <h1 class="page-title mb-2">
                {{ t("document", { name: templateData?.templateName }) }}
              </h1>
              <v-form
                v-model="isBaseFormValid"
                :disabled="orderCreating"
                :key="0"
                @submit.prevent="submit"
              >
                <div class="grid__rows d-flex flex-column">
                  <template
                    v-for="field in payloadData?.fields"
                    :key="field.id"
                  >
                    <div
                      v-if="!isHiddenField(field)"
                      class="grid__item"
                      :class="{
                        'grid__item_full-width': isFullWidthField(field.source),
                      }"
                      :style="{
                        order: `${field.displayOrder}`,
                      }"
                    >
                      <label
                        v-if="!isFullWidthField(field.source)"
                        v-html="field.name"
                        class="align-self-center"
                        :for="field.fieldName"
                      />
                      <GeneratorField
                        v-model:value="field.value"
                        v-model:no-signature="noSignature"
                        :model-value="field"
                        :countries="countries"
                        :countries-loading="countriesLoading"
                        :format="DEFAULT_DATE_FORMAT"
                        :hide-random-button="hideRandomButton"
                        :template="payloadData"
                        :fields-required="fieldsRequired"
                        :signatureModal="signatureModal"
                        :photoModal="photoModal"
                        @translate="translate(field, $event)"
                        @random="randomValue(field)"
                        @fill="fillSubfields(field)"
                        @compute="computeField(field)"
                        @closeSignatureModal="signatureModal = false"
                        @closePhotoModal="photoModal = false"
                        @updatePhoto="isPhotoFilled = ($event)"
                        @updateSignature="isSignatureFilled = ($event)"
                      />
                    </div>
                  </template>
                  <div class="grid__item" style="order: 100">
                    <div />
                    <v-btn
                      type="submit"
                      color="primary"
                      class="w-100 mt-4"
                      height="40"
                      :style="{
                        fontSize: '1rem',
                      }"
                      :loading="orderCreating"
                      :disabled="!isWholeFormValid"
                      :text="$t(`create`)"
                    />
                  </div>
                  <div class="buttons_wrapper" style="order: 50;">
                    <div style="min-width: 160px; max-width: 160px;"></div>
                    <div class="buttons" v-if="hasSignature">
                      <div v-if="!isSignatureFilled" class="buttons__item buttons__item_add" @click="signatureModal = true">
                        Signature
                      </div>
                      <div v-if="isSignatureFilled" @click="signatureModal = true" class="buttons__item buttons__item_edit" :class="{ 'max-height': noSignature }">
                        Signature <Check></Check>
                      </div>
                      <div v-if="isSignatureFilled && !noSignature" @click="clearSignature" class="buttons__item buttons__item_remove">
                        Remove
                      </div>
                    </div>
                    <div class="buttons" v-if="hasPhoto">
                      <div v-if="!isPhotoFilled" class="buttons__item buttons__item_add" @click="photoModal = true">
                        Photo
                      </div>
                      <div v-if="isPhotoFilled" @click="photoModal = true" class="buttons__item buttons__item_edit">
                        Photo <Check></Check>
                      </div>
                      <div v-if="isPhotoFilled" @click="clearPhoto" class="buttons__item buttons__item_remove">
                        Remove
                      </div>
                    </div>
                  </div>
                </div>
              </v-form>
              <div v-if="generatedCode" class="my-4">
                <h3 class="mb-2">
                  {{ $t("yourCodeIs", { code: categoryName }) }}:
                </h3>
                <pre>{{ generatedCode }}</pre>
                <v-btn
                  color="primary"
                  size="small"
                  class="my-2"
                  variant="outlined"
                  rounded="lg"
                  :height="22"
                  @click="copyToClipboardHandle(generatedCode)"
                >
                  {{ $t("copyCode") }}
                </v-btn>
              </div>
            </div>
            <div
              class="grid__sample sample"
              :class="{
                'd-none': !isShowSampleBlock,
              }"
            >
              <template v-if="isShowSampleBlock">
                <div
                  class="sample__subtitle mb-1 mb-md-6 pt-3 d-flex justify-space-between"
                >
                  <div class="subtitle">
                    {{ $t("sample") }}
                  </div>
                  <v-btn
                    color="primary"
                    class="v-btn-action d-md-none"
                    variant="flat"
                    size="small"
                    @click="isSampleShown = !isSampleShown"
                  >
                    {{ isSampleShown ? $t("hide") : $t("show") }}
                  </v-btn>
                </div>
                <div class="sample__content bg-white pa-6" v-if="isShowSample">
                  <div class="sample__picture">
                    <img
                      alt="sample"
                      class="sample__img"
                      ref="sampleImg"
                      :src="sampleUrlObject"
                    />
                  </div>
                  <div class="sample__footer">
                    <h3
                      class="mt-6 mb-3 text-center"
                      v-html="templateData?.sampleTitle"
                    />
                    <div
                      class="sample__text"
                      v-html="templateData?.sampleText"
                    />
                  </div>
                </div>
                <v-dialog
                  v-model="showSampleModal"
                  close-on-content-click
                  :activator="sampleImg"
                >
                  <div class="sample__content">
                    <img
                      :src="sampleUrlObject"
                      alt="sample"
                      class="sample__img sample__img_modal mx-auto"
                    />
                  </div>
                </v-dialog>
              </template>
            </div>
          </div>
          <FillableTemplateModal
            v-model="isSubfieldsModalShown"
            :disabled="isSubfieldSaveDisabled"
            @close="isSubfieldsModalShown = false"
            @save="saveSubFields"
          >
            <template #title>
              <div class="d-flex justify-space-between align-center">
                <div class="text-medium-emphasis">
                  {{ subfield?.title }}
                </div>
                <Close @click="isSubfieldsModalShown = false" class="cursor-pointer"></Close>
              </div>
            </template>
            <div class="subfield pa-4 br-16 mb-2">
              <v-form v-model="isSubfieldsFormValid" @submit.prevent :key="1">
                <div class="subfield__form d-flex flex-column gc-1 gc-sm-4">
                  <template v-for="field in subfield?.fields" :key="field.id">
                    <div
                      v-if="field.tag !== 'HIDDEN_FOR_USER'"
                      class="subfield__item"
                      :style="{
                        order: field.displayOrder,
                      }"
                    >
                      <label
                        class="align-self-md-center"
                        v-html="field.name"
                        :for="`subfield-${field.fieldName}`"
                      />
                      <GeneratorField
                        v-model:value="field.value"
                        v-model:no-signature="noSignature"
                        :model-value="field"
                        :countries="countries"
                        :countries-loading="countriesLoading"
                        :format="DEFAULT_DATE_FORMAT"
                        :hide-random-button="hideRandomButton"
                        :template="payloadData"
                        :id="`subfield-${field.fieldName}`"
                        :disabled="subfield?.manual"
                        @translate="translate(field, $event)"
                        @random="randomValue(field)"
                        @fill="fillSubfields(field)"
                        @compute="computeField(field)"
                      />
                    </div>
                  </template>
                </div>
              </v-form>
              <template v-if="subfield?.hasManual">
                <v-form
                  v-model="isManualSubfieldsFormValid"
                  @submit.prevent
                  :key="2"
                >
                  <div class="subfield__form d-flex flex-column gc-1 gc-sm-4">
                    <div class="subfield__item" style="order: 1000">
                      <label
                        class="align-self-md-center"
                        for="subfield-manual-switch"
                        >{{ $t("manualEnter") }}</label
                      >
                      <v-switch
                        hide-details
                        id="subfield-manual-switch"
                        v-model="subfield.manual"
                        density="compact"
                        color="primary"
                      />
                    </div>
                    <div class="subfield__item" style="order: 1001">
                      <label
                        class="align-self-md-center"
                        v-html="subfield.title"
                        for="subfield-manual-value"
                      />
                      <TextFieldBase
                        v-model="subfield.manualValue"
                        id="subfield-manual-value"
                        :disabled="!subfield.manual"
                        :rules="[required]"
                      />
                    </div>
                  </div>
                </v-form>
              </template>
            </div>
          </FillableTemplateModal>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, watchEffect, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { DateTime } from "luxon";
import {
  ordersService,
  templatesService,
  autodataService,
  countriesService,
  translationService,
  generateService,
  addressService,
} from "@/bootstrap";
import {
  type AutodataName,
  type TemplateShort,
  type UserFieldShort,
  type City,
  type Country,
  type AddressBody,
  isTemplateShortBody,
  isAutodataNameBody,
  isAutodataDateBody,
  isAutodataPriceBody,
  isAutodataTextBody,
  isAutodataCityBody,
  isCountryResponseBody,
  isTranslatedBody,
  isGenerateCodeBody,
  isCreateOrderBody,
  isAddressBody,
  DocType,
} from "@services/types";
import {
  parseFieldParams,
  copyToClipboard,
  parseTag,
  date,
  range,
  populateAddressFormat,
} from "@/utils";
import type {
  AutodataCityParams,
  AutodataNameParams,
  Gender,
  GetAddressParams,
} from "@infra/types";
import { Source } from "@dict/sources";
import { Category, type SelectItem } from "@/types";
import { DEFAULT_DATE_FORMAT } from "@/types";
import { Categories } from "@/dict";
import { required } from "@utils/rules";
import GeneratorField from "@components/generator/GeneratorField.vue";
import FillableTemplateModal from "@components/generator/FillableTemplateModal.vue";
import TextFieldBase from "@components/generator/TextFieldBase.vue";
import Check from "../icons/Check.vue";
import Close from '../icons/Cross.vue';

interface Props {
  templateId: string;
  orderId?: string;
  category: Category;
}

interface SubField {
  title: string;
  origin: UserFieldShort;
  fields: UserFieldShort[];
  hasManual: boolean;
  manual: boolean;
  manualValue: string | null;
}

const { t } = useI18n();
const toast = useToast();
const display = useDisplay();
const router = useRouter();
const props = defineProps<Props>();

const signatureModal = ref<boolean>(false);
const photoModal = ref<boolean>(false);
const isSignatureFilled = ref<boolean>(false);
const isPhotoFilled = ref<boolean>(false);
const hasSignature = computed<boolean>(
  () => {
    let has = false;
    payloadData.value?.fields.forEach((el: any) => {
    if (el.source === Source.USER_SIGNATURE) {
      has =  true;
    }
  });
  return has;
  }
)
const hasPhoto = computed<boolean>(
  () => {
    let has = false;
    payloadData.value?.fields.forEach((el: any) => {
    if (el.source === 4) {
      has =  true;
    }
  });
  return has;
  }
)


const isSubfieldsModalShown = ref<boolean>(false);
const isSubfieldsFormValid = ref<boolean>();
const isManualSubfieldsFormValid = ref<boolean>();
const isBaseFormValid = ref<boolean>();
const isSampleShown = ref<boolean>(false);
const isShowSample = computed<boolean>(
  () => display.mdAndUp.value || isSampleShown.value,
);
const categoryName = ref<string>(
  Categories?.find(({ id }) => id === props.category)?.name ?? "",
);
const subfield = ref<SubField>();
const sampleUrlObject = ref<string>();
const templateLoading = ref<boolean>(false);
const templateData = ref<TemplateShort>();
const orderCreating = ref<boolean>(false);
const showSampleModal = ref<boolean>(false);
const noSignature = ref<boolean>(false);
const sampleImg = ref();
const payloadData = ref<TemplateShort>();
const generatedCode = ref<string>();
const countriesLoading = ref<boolean>(false);
const countriesData = ref<Country[]>([]);
const countries = computed<SelectItem<string>[]>(() =>
  countriesData.value.map(({ id, name: title }) => ({
    title,
    value: `${id}`,
  })),
);
const fieldsRequired = computed<boolean | undefined>(() => {
  if (!templateData.value) {
    return;
  }

  return templateData.value.docType !== DocType.Bill;
});

const hideRandomButton = computed<boolean | undefined>(() => {
  if (!payloadData.value?.fields) {
    return;
  }

  return !payloadData.value.fields.some(
    ({ source }) => source === Source.RANDOMPHOTO,
  );
});

const isShowSampleBlock = computed<boolean>(() => {
  if (!templateData.value?.previewFileId) {
    return false;
  }

  return templateData.value.previewFileId !== -1;
});

const isSubfieldSaveDisabled = computed<boolean | undefined>(() => {
  const field = subfield.value;

  if (!field) {
    return;
  }

  if (field.manual) {
    return !isManualSubfieldsFormValid.value;
  }

  if (!field.fields.length) {
    return false;
  }

  return !isSubfieldsFormValid.value;
});

const isWholeFormValid = computed<boolean | undefined>(() => {
  if (!payloadData.value || !isBaseFormValid.value) {
    // if no payload yet
    // or base form is invalid
    // there is no need to proceed
    return isBaseFormValid.value;
  }

  const photoField = payloadData.value.fields.find(({ source }) =>
    [Source.USER_PHOTO, Source.RANDOMPHOTO].includes(source),
  );
  const signField = payloadData.value.fields.find(
    ({ source }) => source === Source.USER_SIGNATURE,
  );
  const dayMonthField = payloadData.value.fields.find(
    ({ source }) => source === Source.USER_MONTHSELECTOR,
  );
  const templateFields = payloadData.value.fields.filter(({ source }) =>
    [Source.TEMPLATE, Source.TEMPLATE_MRZ, Source.TEMPLATE_PN].includes(source),
  );

  if (photoField && !photoField.file) {
    return false;
  }

  if (signField) {
    if (!(noSignature.value || signField.file)) {
      return false;
    }
  }

  if (dayMonthField && !dayMonthField.value) {
    return false;
  }

  if (templateFields?.length) {
    const notFilled = templateFields.some(({ subFields }) => {
      if (!subFields?.length) {
        return false;
      }

      return subFields.some(({ value, tag, source }) => {
        const isTemplate = source === Source.TEMPLATE;
        const isHidden = tag === "HIDDEN_FOR_USER";

        if (isTemplate || isHidden) {
          // TEMPLATE Field admits empty value
          // so assume as acceptable
          return false;
        }

        return !value;
      });
    });
    if (notFilled) {
      return false;
    }
  }

  return true;
});

const isMRZSubfieldsFilled = (
  source: Source,
  subfields: UserFieldShort[] | null,
): boolean | undefined => {
  const isNotFit =
    source !== Source.TEMPLATE_MRZ || subfields === null || !subfields.length;

  if (isNotFit) {
    return;
  }

  return !subfields.some(({ value }) => !value);
};

const isHiddenField = (field: UserFieldShort): boolean => {
  const isHidden = field.tag === "HIDDEN_FOR_USER";

  if (isHidden) {
    return isHidden;
  }

  const isFilled = isMRZSubfieldsFilled(field.source, field.subFields);

  return isFilled ?? false;
};

const fillSubfields = (origin: UserFieldShort) => {
  if (!Array.isArray(origin.subFields)) {
    return;
  }

  const fields = structuredClone(toRaw(origin.subFields));
  const manualValue = origin.value;
  const manual = !!manualValue;
  const hasManual = origin.source === Source.TEMPLATE_PN;

  subfield.value = {
    title: origin.name,
    fields,
    origin,
    hasManual,
    manual,
    manualValue,
  };

  isSubfieldsModalShown.value = true;
};

const computeField = (target: UserFieldShort) => {
  const { tag } = target;
  const parsedTag = parseTag(tag);

  if (!(parsedTag?.dateSource && parsedTag?.dateRange)) {
    return;
  }

  const source = payloadData.value?.fields.find(
    (field) => field.fieldName === parsedTag.dateSource,
  );
  const sourceValue = source?.value;

  if (!sourceValue) {
    return;
  }

  const computedDate = range.computeRange(
    date.stringToDate(sourceValue, DEFAULT_DATE_FORMAT),
    parsedTag.dateRange,
  );

  target.value = date.formatDate(computedDate, DEFAULT_DATE_FORMAT);
};

const fetchTemplate = async (templateId: string, orderId?: string) => {
  templateLoading.value = true;

  const response = await ordersService.fromTemplate(templateId, orderId);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    templateLoading.value = false;
    toast.error(message);

    return;
  }

  if (isTemplateShortBody(data)) {
    templateData.value = data;
  }

  templateLoading.value = false;
};

const fetchCountries = async () => {
  countriesLoading.value = true;

  const response = await countriesService.get();
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    countriesLoading.value = false;
    toast.error(message);

    return;
  }

  if (isCountryResponseBody(data)) {
    countriesData.value = data.countries;
  }

  countriesLoading.value = false;
};

const fetchSampleFile = async (id: number) => {
  const response = await templatesService.getFile(Number(id));
  const { data, meta } = response;
  const { success } = meta;

  if (success) {
    sampleUrlObject.value = URL.createObjectURL(data as Blob);
  }
};

const computeSelectedMonth = (value: string): string => {
  const months = ["3", "2", "1"].reduce<Record<string, string>>(
    (result, key, index) => {
      result[key] = DateTime.local()
        .set({ day: 1 })
        .minus({ month: index })
        .toFormat(DEFAULT_DATE_FORMAT);

      return result;
    },
    {},
  );

  return months[value];
};

const prepairPayload = <T extends TemplateShort>(source: T): T => {
  const payload = structuredClone(source);

  prepairPayloadFields(payload.fields);

  return payload;
};

const prepairPayloadFields = <T extends UserFieldShort>(fields: T[]): T[] =>
  fields.map<T>((field) => {
    const { value, source } = field;
    const isMonthSelector = source === Source.USER_MONTHSELECTOR;

    if (!value) {
      return field;
    }

    if (isMonthSelector) {
      field.value = computeSelectedMonth(value);
    }

    if (field.subFields?.length) {
      prepairPayloadFields(field.subFields);
    }

    return field;
  });

const createOrder = async (payload: TemplateShort) => {
  orderCreating.value = true;

  const response = await ordersService.create(prepairPayload(toRaw(payload)));
  const { meta, data } = response;
  const { success, message, status } = meta;

  if (!success) {
    orderCreating.value = false;
    toast.error(message);

    if (status === 400) {
      resetPhotoField();
    }

    return;
  }

  if (isCreateOrderBody(data)) {
    const { isSuccess, errorText } = data;

    if (isSuccess) {
      router.push({ name: "orders" });
    } else {
      orderCreating.value = false;

      if (errorText) {
        toast.warning(errorText);
      }
    }
  }
};

const resetPhotoField = () => {
  const field = payloadData.value?.fields.find(({ source }) =>
    [Source.USER_PHOTO, Source.RANDOMPHOTO].includes(source),
  );

  if (field) {
    field.file = null;
  }
};

const generateCode = async (payload: TemplateShort) => {
  orderCreating.value = true;

  const response = await generateService.generateCode(toRaw(payload));
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    orderCreating.value = false;
    toast.error(message);

    return;
  }

  if (isGenerateCodeBody(data)) {
    generatedCode.value = `${data}`.trim();
  }

  orderCreating.value = false;
};

const submit = async () => {
  if (!payloadData.value) {
    return;
  }

  const toGenerateCode = [Category.MRZ, Category.PN].includes(props.category);

  if (toGenerateCode) {
    await generateCode(payloadData.value);

    return;
  }

  await createOrder(payloadData.value);
};

const fetchAddress = async (
  payload: GetAddressParams,
): Promise<AddressBody | undefined> => {
  if (!templateData.value) {
    return;
  }

  const response = await addressService.get(payload);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAddressBody(data)) {
    return data;
  }
};

const fetchName = async (
  params: AutodataNameParams,
): Promise<AutodataName[] | undefined> => {
  const response = await autodataService.name(params);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAutodataNameBody(data)) {
    return data.names;
  }
};

const fetchPrice = async (id: number): Promise<string | undefined> => {
  const response = await autodataService.price(id);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAutodataPriceBody(data)) {
    return data.priceString;
  }
};

const fetchText = async (id: number): Promise<string | undefined> => {
  const response = await autodataService.text(id);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAutodataTextBody(data)) {
    return data.text;
  }
};

const fetchCity = async (
  country: number,
  count: number = 1,
): Promise<City[] | undefined> => {
  const params: AutodataCityParams = {
    country,
    count,
  };
  const response = await autodataService.city(params);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAutodataCityBody(data)) {
    return data.cities;
  }
};

const fetchDate = async (id: number): Promise<string | undefined> => {
  const response = await autodataService.date(id);
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);

    return;
  }

  if (isAutodataDateBody(data)) {
    return data.dateString;
  }
};

const getRandomName = async (
  gender: Gender,
  country: number,
  count: number = 1,
): Promise<AutodataName[] | undefined> => {
  const params: AutodataNameParams = {
    gender,
    country,
    count,
  };

  return await fetchName(params);
};

const translateWord = async (
  value: string,
  fromLang: string,
  toLang: string,
): Promise<string | undefined> => {
  const response = await translationService.translate(value, fromLang, toLang);
  const { meta, data } = response;
  const { success } = meta;

  if (!success) {
    return;
  }

  if (isTranslatedBody(data)) {
    const {
      responseData: { translatedText },
    } = data;

    if (translatedText) {
      return translatedText.replace(/. kgm/g, "");
    }
  }
};

const randomName = async (field: UserFieldShort) => {
  if (!payloadData.value) {
    return;
  }

  const { name: fieldName, source } = field;
  const country = payloadData.value.countryId;
  const genderField = payloadData.value?.fields.find(
    ({ source }) => source === Source.USER_GENDERSELECTOR,
  );
  const genderValue = genderField?.value;

  if (!genderValue) {
    toast.warning(t("fieldHasToBeSet", { field: t("gender") }));

    return;
  }

  const gender = genderValue as Gender;
  const names = await getRandomName(gender, country);

  if (!names) {
    return;
  }

  if (!names?.length) {
    toast.warning(t("noDataGenerated", { field: fieldName }));

    return;
  }

  const [firstName] = names;
  const { name, lastName } = firstName;
  const fullname = `${name} ${lastName}`;
  const nameMap = {
    [Source.RANDOMNAME]: name,
    [Source.RANDOMLASTNAME]: lastName,
    [Source.RANDOMFULLNAME]: fullname,
  };

  field.value = nameMap[source as keyof typeof nameMap];
};

const randomDate = async (field: UserFieldShort) => {
  const { name, id } = field;
  const date = await fetchDate(id);

  if (!date) {
    toast.warning(t("noDataGenerated", { field: name }));

    return;
  }

  field.value = date;
};

const randomPrice = async (field: UserFieldShort) => {
  const { name, id } = field;
  const price = await fetchPrice(id);

  if (!price) {
    toast.warning(t("noDataGenerated", { field: name }));

    return;
  }

  field.value = price;
};

const randomText = async (field: UserFieldShort) => {
  const { name, id } = field;
  const text = await fetchText(id);

  if (!text) {
    toast.warning(t("noDataGenerated", { field: name }));

    return;
  }

  field.value = text;
};

const randomCity = async (field: UserFieldShort) => {
  if (!payloadData.value) {
    return;
  }

  const { name } = field;
  const countryId = payloadData.value.countryId;
  const cities = await fetchCity(countryId);

  if (!cities) {
    return;
  }

  if (!cities.length) {
    toast.warning(t("noDataGenerated", { field: name }));

    return;
  }

  const [firstCity] = cities;

  field.value = firstCity.name;
};

const randomAddress = async (field: UserFieldShort) => {
  if (!payloadData.value) {
    return;
  }

  const { name } = field;
  const address = await fetchAddress({
    countryId: payloadData.value.countryId,
  });

  if (!address) {
    toast.warning(t("noDataGenerated", { field: name }));

    return;
  }

  const fields = payloadData.value?.fields.filter(({ source, tag }) => {
    if (source !== Source.RANDOMADDRESS) {
      return false;
    }

    const parsed = parseTag(tag);

    if (!parsed) {
      return false;
    }

    if (!parsed?.format) {
      return false;
    }

    return true;
  });

  if (!fields?.length) {
    return;
  }

  fields.forEach(
    (field) =>
      (field.value = populateAddressFormat(
        parseTag(field.tag)!.format!,
        address,
      )),
  );
};

const randomValue = async (field: UserFieldShort) => {
  const { source } = field;
  const isPrice = source === Source.RANDOMPRICE;
  const isText = source === Source.RANDOMTEXT;
  const isCity = source === Source.RANDOMCITY;
  const isAddress = source === Source.RANDOMADDRESS;
  const isNames = [
    Source.RANDOMFULLNAME,
    Source.RANDOMLASTNAME,
    Source.RANDOMNAME,
  ].includes(source);
  const isDate = [Source.RANDOMDATE, Source.RANDOMDATEWITHCALENDAR].includes(
    source,
  );

  if (field.value) {
    await translate(field, field.value);
  }

  if (!payloadData.value) {
    return;
  }

  if (isNames) {
    await randomName(field);
    await tryTranslateFromField(field);

    return;
  }

  if (isDate) {
    await randomDate(field);
    await tryTranslateFromField(field);

    return;
  }

  if (isPrice) {
    await randomPrice(field);
    await tryTranslateFromField(field);

    return;
  }

  if (isText) {
    await randomText(field);
    await tryTranslateFromField(field);

    return;
  }

  if (isCity) {
    await randomCity(field);
    await tryTranslateFromField(field);

    return;
  }

  if (isAddress) {
    await randomAddress(field);
    await tryTranslateFromField(field);
  }
};

const tryTranslateFromField = async (field: UserFieldShort) => {
  if (!field.value) {
    return;
  }

  return await translate(field, field.value);
};

const translate = async (field: UserFieldShort, value: string) => {
  if (!payloadData.value || !value) {
    return;
  }

  const { id, lang } = parseFieldParams(field.tag);
  const newLang = [];

  if (!id || !lang) {
    return;
  }

  for (const origField of payloadData.value.fields) {
    if (!origField.tag?.includes(`id=${id}`) || field.id === origField.id) {
      continue;
    }

    const parsed = parseFieldParams(origField.tag);

    if (!parsed?.lang) {
      continue;
    }

    newLang.push({
      ...parsed,
      fromLang: lang,
      field: origField,
      value,
    });
  }

  await Promise.allSettled(
    newLang.map(async ({ lang: toLang, fromLang, field, value }) => {
      if (!toLang) {
        return;
      }
      const translated = await translateWord(value, fromLang, toLang);

      if (!translated) {
        return;
      }

      field.value = translated;
    }),
  );
};

const isFullWidthField = (source: Source): boolean => {
  const photoFieldSources = [
    Source.USER_PHOTO,
    Source.RANDOMPHOTO,
    Source.USER_SIGNATURE,
  ];

  return photoFieldSources.includes(source);
};

const copyToClipboardHandle = async (value?: string) => {
  if (!value) {
    return;
  }

  await copyToClipboard(value)
    .then(() => toast.success(t("copyingToClipboardSuccessfull")))
    .catch(() => toast.error(t("copyingToClipboardFailed")));
};

const escalateFields = <T extends UserFieldShort[]>(
  subfields: T,
  payloadFields: T,
  deduction: boolean = true,
): T => {
  subfields.forEach((subField) => {
    const srcFieldName = subField.name.toLocaleLowerCase();
    const payloadField = payloadFields.find(
      ({ name: payloadFieldName }) =>
        payloadFieldName.toLocaleLowerCase() === srcFieldName,
    );

    if (!payloadField) {
      return;
    }

    if (deduction) {
      subField.value = payloadField.value;
    } else {
      payloadField.value = subField.value;
    }
  });

  return payloadFields;
};

const saveSubFields = () => {
  if (!(subfield.value?.fields && payloadData.value?.fields)) {
    return;
  }

  const src = subfield.value.fields;
  const dest = payloadData.value.fields;

  let value: string | null = null;

  escalateFields(src, dest, false);

  if (subfield.value.manual) {
    value = subfield.value.manualValue;
  }

  subfield.value.origin.value = value;
  isSubfieldsModalShown.value = false;
};

function clearSignature() {
  payloadData.value?.fields.forEach((el: any) => {
    if (el.source === Source.USER_SIGNATURE) {
      el.file = null;
    }
  });
  isSignatureFilled.value = false;
}
function clearPhoto() {
  payloadData.value?.fields.forEach((el: any) => {
    if (el.source === 4) {
      el.file = null;
    }
  });
  isPhotoFilled.value = false;
}

watch(isSubfieldsModalShown, (value) => {
  if (!value) {
    subfield.value = undefined;
  }
});

watch(templateData, (value) => {
  if (!value) {
    payloadData.value = undefined;

    return;
  }

  if (!value.fields.length) {
    // unblock save button if no fields
    // PN generator as example
    isBaseFormValid.value = true;
  }

  const payload = structuredClone(toRaw(value));

  payload.fields
    .filter(({ subFields }) => !!subFields?.length)
    .forEach(({ subFields }) => escalateFields(subFields!, payload.fields));

  payloadData.value = payload;

  const countryIndex = value.fields.findIndex(
    ({ source }) => source === Source.USER_COUNTRYSELECTOR,
  );

  if (countryIndex > -1) {
    fetchCountries();
  }
});

watch(
  () => payloadData,
  (data) => {
    if (!data.value) {
      return;
    }

    const fields = data.value.fields;

    fields
      .filter(({ subFields }) => !!subFields?.length)
      .forEach(({ subFields }) => escalateFields(subFields!, fields));
  },
  {
    deep: true,
  },
);

watchEffect(async () => {
  if (!templateData.value?.previewFileId) {
    return;
  }

  if (templateData.value.previewFileId > -1) {
    await fetchSampleFile(templateData.value.previewFileId);
  }
});

watch(() => {
  if (signatureModal.value || photoModal.value) {
    document.querySelector("html").style.overflow = "hidden";
  } else {
    document.querySelector("html").style.overflow = "auto";
  }
});

watch(noSignature, () => {
  if (noSignature.value) {
    clearSignature();
    isSignatureFilled.value = true;
  } else {
    isSignatureFilled.value = false;
  }
}, {
  deep: true
})

onBeforeMount(async () => {
  await Promise.allSettled([fetchTemplate(props.templateId, props.orderId)]);
});
</script>

<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 16px;

  &__inputs {
    order: 2;
  }

  &__sample {
    order: 3;
  }

  &__rows {
    gap: 8px;
  }

  &__item {
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-gap: 6px;

    &_full-width {
      grid-template-columns: 1fr;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 1fr;
    grid-gap: 6px;

    &__rows {
      gap: 4px;
    }

    &__item {
      grid-template-columns: 1fr;
      grid-gap: 4px;
    }

    &__sample {
      order: 1;
    }
  }
}

.sample {
  font-size: 0.92rem;

  &__content {
    border-radius: 20px;
  }
  &__subtitle {
    align-items: end;
  }

  &__img {
    display: block;
    width: 100%;
    height: auto;

    &_modal {
      height: 100%;
      object-fit: contain;

      @media (width > 700px) {
        width: auto;
      }
    }
  }
}

.subfield {

  &__form {
    row-gap: 6px;
  }

  &__item {
    display: grid;
    grid-template-columns: 160px 1fr;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      display: flex;
      flex-direction: row;
      row-gap: 4px;
    }
  }
}

.buttons_wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;

  @media (width < 700px) {
    flex-direction: column;
  }

  .buttons {
    width: 100%;
    height: 112px;
    .buttons__item {
      background: white;
      border-radius: 20px;
      font-size: 18px;
      font-weight: 600;
      line-height: 21.09px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

        &.buttons__item_add {
          color: rgba(24, 139, 241, 1);
          height: 100%;
        }
        &.buttons__item_edit {
          background: rgba(24, 139, 241, 1);
          color: white;
          height: 60%;
          margin-bottom: 1%;
          display: flex;
          gap: 10px;

          &.max-height {
            height: 100%;
          }
        }
        &.buttons__item_remove {
          background: rgba(241, 24, 24, 1);
          color: white;
          height: 36%;
        }
    }
  }
}
</style>

<style lang="scss">
.v-overlay {
  z-index: 100000 !important;
}
.text-medium-emphasis {
  color: rgb(56, 56, 56) !important;
  font-size: 18px;
  font-weight: 600;
  line-height: 21.09px;
}
.v-switch__track {
  background: rgba(205, 221, 245, 1) !important;
}
.subfield__item {
  align-items: center;
  gap: 20px;
  label {
    width: 100px !important;
  }
}
.date-picker {
  flex: 1 1 auto;
}
.mdi-checkbox-blank-outline::before {
  color: rgba(205, 221, 245, 1);
}
.mdi-checkbox-marked::before, .mdi-radiobox-marked::before {
  color: rgba(24, 139, 241, 1);
}
</style>
