<template>
  <div class="DocsGen__photo" :style="{ width: propsWH.W ? +propsWH.W + 50 + 'px' : '' }">
    <div class="subtitle mb-5 d-flex align-center">
      {{ $t("photo") }}
    </div>
    <div class="DocsGen__photo-box">
      <label for="upload-input" id="initial-upload" class="upload-btn mb-4">
        <span class="">{{ $t("labels.file") }}</span>
        <span></span>
      </label>
      <div class="main-container-ww" style="position: relative; width: fit-content">
        <div class="main-container" :style="{
          '--width': propsWH.W + 'px',
          '--height': propsWH.H + 'px',
          width: propsWH.W ? propsWH.W + 'px' : '',
          height: propsWH.H ? propsWH.H + 'px' : '',
        }">
          <div class="drag-area" />
        </div>
        <img src="@assets/constructor/img/Ellipse6.png" alt="" style="
            position: absolute;
            z-index: 2;
            top: 4px;
            left: 0;
            width: 100%;
            height: 85%;
            pointer-events: none;
          " />
      </div>

      <v-btn v-if="!hideRandomBtn" color="primary" variant="outlined" class="w-100 mt-4" rounded="lg" @click="() => {
          dialog = true;
        }
        ">{{ $t("randomPhoto") }}
      </v-btn>
      <input id="myInput" type="text" style="visibility: hidden; height: 1px" />
    </div>
  </div>

  <div class="DocsGen__photo-changes hide">
    <div class="subtitle mb-5 hideOnMd">{{ $t("changes") }}</div>
    <div class="DocsGen__photo-box">
      <div class="DocsGen__photo-head hideOnMd">
        <div class="DocsGen__photo-changes-zoom" id="cropper-zoom-in-btn">
          <BtnRedactor :nofill="true">
            <template #icon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="#188BF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21.0004 21.0004L16.6504 16.6504" stroke="#188BF1" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M11 8V14" stroke="#188BF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 11H14" stroke="#188BF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </BtnRedactor>
        </div>
        <div class="DocsGen__photo-changes-zoom" id="cropper-zoom-out-btn">
          <BtnRedactor :nofill="true">
            <template #icon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="#188BF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21.0004 21.0004L16.6504 16.6504" stroke="#188BF1" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M8 11H14" stroke="#188BF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </BtnRedactor>
        </div>
      </div>
      <div class="DocsGen__photo-contrast">
        <h3 class="mb-2 mb-md-4">{{ activeSlider }}</h3>

        <div class="filters-controls mb-4">
          <div class="filters-left-col">
            <div v-show="activeSlider === 'Brightness'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon" style="--textValue: &quot;123&quot;"></div>
                <input type="range" value="100" data-startValue="100" min="0" max="200" class="custom-range"
                  id="brightness" />
              </div>
            </div>
            <div v-show="activeSlider === 'Contrast'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon"></div>
                <input type="range" value="100" data-startValue="100" min="0" max="200" class="custom-range"
                  id="contrast" />
              </div>
            </div>
            <div v-show="activeSlider === 'Saturation'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon"></div>
                <input type="range" value="100" data-startValue="100" min="0" max="200" class="custom-range"
                  id="saturation" />
              </div>
            </div>
            <div v-show="activeSlider === 'Inversion'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon"></div>
                <input type="range" value="0" data-startValue="0" min="0" max="100" class="custom-range"
                  id="inversion" />
              </div>
            </div>
            <div v-show="activeSlider === 'Blur'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon"></div>
                <input type="range" value="0" data-startValue="0" min="0" max="20" class="custom-range" id="blur" />
              </div>
            </div>
            <div v-show="activeSlider === 'Hue'" class="filter-range-slider">
              <div class="myRange">
                <div class="myRange-fon"></div>
                <input type="range" value="0" data-startValue="0" min="0" max="360" class="custom-range" id="hue" />
              </div>
            </div>
          </div>

          <div class="filter-btns mt-3 mt-md-4">
            <BtnRedactor type="stroke" @click="activeSlider = 'Brightness'"
              :class="{ active: activeSlider === 'Brightness' }">
              <template #icon>
                <BrightIcons />
              </template>
            </BtnRedactor>
            <BtnRedactor type="stroke" @click="activeSlider = 'Contrast'"
              :class="{ active: activeSlider === 'Contrast' }">
              <template #icon>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.0001 0C5.38311 0 0 5.38311 0 12C0 18.6171 5.38311 24.0001 12 24.0001C18.6171 24.0001 24 18.6171 24 12C24 5.38311 18.6171 0 12.0001 0ZM1.35835 12C1.35835 6.1323 6.1323 1.35835 12.0001 1.35835V22.6417C6.13224 22.6416 1.35835 17.8678 1.35835 12Z"
                    fill="white" />
                </svg>
              </template>
            </BtnRedactor>
            <BtnRedactor @click="activeSlider = 'Saturation'" :class="{ active: activeSlider === 'Saturation' }">
              <template #icon>
                <svg width="19" height="19" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.7812 11C21.7812 16.7876 17.1969 21.5239 11.4688 21.7704V0.229492C17.1969 0.476055 21.7812 5.2123 21.7812 11ZM2.13031 4.87855V17.1214C2.54051 17.7137 3.00843 18.2639 3.52719 18.7639V3.23605C3.00843 3.73605 2.54051 4.28624 2.13031 4.87855ZM1.19281 15.4756V6.52434C0.5675 7.8884 0.21875 9.40387 0.21875 11C0.21875 12.5961 0.5675 14.1115 1.19281 15.4756ZM4.46469 19.5687C4.90531 19.9053 5.37219 20.2095 5.86203 20.4762V1.52371C5.37369 1.78996 4.90653 2.09335 4.46469 2.43121V19.5687ZM9.13391 21.619C9.5959 21.6998 10.0627 21.7504 10.5312 21.7704V0.229492C10.0627 0.249532 9.5959 0.300108 9.13391 0.380898V21.619ZM6.79953 20.929C7.25047 21.1207 7.71688 21.2815 8.19641 21.4109V0.589024C7.72021 0.717191 7.25347 0.878202 6.79953 1.0709V20.929Z"
                    fill="#188BF1" />
                </svg>
              </template>
            </BtnRedactor>
            <BtnRedactor @click="activeSlider = 'Inversion'" :class="{ active: activeSlider === 'Inversion' }">
              <template #icon>
                <svg width="20" height="22" viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5 0C12.9823 0 12.5625 0.41975 12.5625 0.9375V5.3125C12.5625 5.83025 12.9823 6.25 13.5 6.25C14.0177 6.25 14.4375 5.83025 14.4375 5.3125V0.9375C14.4375 0.41975 14.0177 0 13.5 0ZM13.5 8.5625C12.9823 8.5625 12.5625 8.98225 12.5625 9.5V13.875C12.5625 14.3927 12.9823 14.8125 13.5 14.8125C14.0177 14.8125 14.4375 14.3927 14.4375 13.875V9.5C14.4375 8.98225 14.0177 8.5625 13.5 8.5625ZM13.5 17.1875C12.9823 17.1875 12.5625 17.6073 12.5625 18.125V22.5C12.5625 23.0177 12.9823 23.4375 13.5 23.4375C14.0177 23.4375 14.4375 23.0177 14.4375 22.5V18.125C14.4375 17.6073 14.0177 17.1875 13.5 17.1875ZM13.5 25.75C12.9823 25.75 12.5625 26.1698 12.5625 26.6875V31.0625C12.5625 31.5802 12.9823 32 13.5 32C14.0177 32 14.4375 31.5802 14.4375 31.0625V26.6875C14.4375 26.1698 14.0177 25.75 13.5 25.75ZM8.71262 6.46894L1.21263 4.16631C1.07243 4.12326 0.924088 4.1137 0.779526 4.13841C0.634965 4.16311 0.498216 4.22139 0.380273 4.30855C0.26233 4.39572 0.166484 4.50934 0.100439 4.64029C0.0343936 4.77123 -7.95296e-06 4.91584 1.37909e-09 5.0625V26.9375C1.82483e-06 27.0842 0.0344104 27.2288 0.10046 27.3597C0.166509 27.4906 0.262357 27.6042 0.380299 27.6914C0.49824 27.7786 0.634985 27.8368 0.779542 27.8615C0.924099 27.8862 1.07243 27.8767 1.21263 27.8336L8.71262 25.531C8.90439 25.4721 9.07221 25.3533 9.19144 25.192C9.31066 25.0307 9.375 24.8354 9.375 24.6348V7.36513C9.375 6.95338 9.10625 6.58981 8.71262 6.46894ZM26.6197 4.30856C26.5018 4.2214 26.365 4.16313 26.2205 4.13842C26.0759 4.11372 25.9276 4.12327 25.7874 4.16631L18.2874 6.46894C18.0956 6.52779 17.9278 6.64661 17.8086 6.80792C17.6893 6.96923 17.625 7.16454 17.625 7.36513V24.6349C17.625 25.0466 17.8937 25.4102 18.2874 25.5311L25.7874 27.8337C25.9276 27.8767 26.0759 27.8863 26.2205 27.8616C26.365 27.8369 26.5018 27.7786 26.6197 27.6914C26.7376 27.6042 26.8335 27.4906 26.8995 27.3597C26.9656 27.2288 27 27.0842 27 26.9375V5.0625C27 4.76506 26.8589 4.48531 26.6197 4.30856Z"
                    fill="#188BF1" />
                </svg>
              </template>
            </BtnRedactor>
            <BtnRedactor @click="activeSlider = 'Blur'" :class="{ active: activeSlider === 'Blur' }">
              <template #icon>
                <svg width="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>water</title>
                  <path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
                </svg>
              </template>
            </BtnRedactor>
            <div class="filters-apply-reset">
              <BtnRedactor type="text" id="reset-filters">
                <template #icon>Reset</template>
              </BtnRedactor>
            </div>
          </div>
        </div>
        <h3 class="mt-6">Rotate</h3>
        <div class="rotation-controls" @click.prevent></div>
        <v-btn color="primary" class="w-100 mt-8" id="apply-filters" :text="$t(`apply`)" @click.prevent />
      </div>
    </div>
  </div>
  <div class="control-panel-container"></div>

  <input type="file" id="upload-input" accept="image/jpeg, image/png, image/jpg" hidden />

  <div class="tool-container">
    <div class="placeholder-button"></div>
    <div class="crop-controls"></div>
    <div class="paint-controls hide" style="display: none !important"></div>
  </div>

  <v-dialog v-model="dialog" width="auto">
    <div class="modelPhotos">
      <h2 class="mb-3">{{ $t(titles[step]) }}</h2>
      <template v-if="!loading">
        <div class="modelPhotos-sex" v-if="step === 0 && sex === null">
          <div :class="{ active: sex === `M` }" @click="
            sex = `M`;
          step = 1;
          ">
            {{ $t("male") }}
          </div>
          <div :class="{ active: sex === `M` }" @click="
            sex = `F`;
          step = 1;
          ">
            {{ $t("female") }}
          </div>
        </div>
        <div v-if="step === 1" class="">
          <v-text-field v-model="age" :placeholder="$t(`age`)" />
          <v-btn color="primary" @click="step = 2">{{ $t("apply") }}</v-btn>
        </div>
        <div v-if="step === 2" class="modelPhotos-photos">
          <div v-for="item in types" class="modelPhotos-item" @click="choiceType(item)">
            <img :src="item.image" alt="" style="pointer-events: none" />
          </div>
        </div>
        <div v-if="step === 3">
          <div class="modelPhotos-photos">
            <div v-for="item in randomPhotos" class="modelPhotos-item" @click="selectImg(item.id)"
              style="cursor: pointer; position: relative">
              <img alt="Photo" style="pointer-events: none" :src="item.img"
                :style="loadingImage ? 'opacity: 0.6' : 'opacity: 1'" />
              <img src="@assets/img/whatermark.png" alt="" style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 1;
                  opacity: 0.7;
                  pointer-events: none;
                " />
            </div>
          </div>
          <v-btn color="primary" @click="getPhotos">{{ $t("refresh") }}</v-btn>
        </div>
      </template>
      <div v-else class="d-flex justify-center">
        <loader />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { gsap } from "gsap";
import { DateTime } from "luxon";
import {
  animateElTopBottom,
  animateElLeftRight,
  animateElZoom,
  animateElRotation,
  animateElFade,
} from "@assets/constructor/js/animations.js";
import { DEFAULT_DATE_FORMAT } from "@/types";
import ImageEditor from "@assets/constructor/js/imageEditor.js";
import BtnRedactor from "@components/constructor/BtnRedactor.vue";
import BrightIcons from "@components/icons/Brightness.vue";
import Loader from "@components/constructor/Loader.vue";
import img1 from "@assets/constructor/img/types/AfricanAmerican.jpg";
import img2 from "@assets/constructor/img/types/Caucasian.jpg";
import img3 from "@assets/constructor/img/types/CentralAsian.jpg";
import img4 from "@assets/constructor/img/types/European.jpg";
import img5 from "@assets/constructor/img/types/IndianAmerican.jpg";
import img6 from "@assets/constructor/img/types/SouthAsian.jpg";
import { axiosInstance } from "@/bootstrap";

const SOURCE_USER_PHOTO = 2;
const SOURCE_RANDOMPHOTO = 4;
const SOURCE_USER_GENDERSELECTOR = 10;

export default {
  name: "ConstructorComp",
  components: { Loader, BrightIcons, BtnRedactor },
  watch: {
    dialog(value) {
      if (value === false) {
        this.step = 0;
        this.sex = null;
        this.type = null;
        this.race = null;
        this.loadingImage = false;
        this.age = null;
      } else {
        const gender = this.gender;

        if (gender === undefined) {
          return;
        }

        this.sex = gender;
        this.step = 1;
      }
    },
    sex(value) {
      if (value === null) {
        return;
      }

      const gender = this.gender;

      if (gender === null) {
        this.setGender(value);
      }
    },
    step(value) {
      if (value !== 1) {
        return;
      }

      const doiUser = this.doiUser;
      const dobUser = this.dobUser;

      if (!(doiUser && dobUser)) {
        return;
      }

      const doi = DateTime.fromFormat(doiUser, DEFAULT_DATE_FORMAT);
      const dob = DateTime.fromFormat(dobUser, DEFAULT_DATE_FORMAT);
      const age = doi.diff(dob, "years").years.toFixed(0);

      if (!age) {
        return;
      }

      this.age = age;
      this.step = 2;
    },
  },
  props: ["hideRandomBtn", "field", "template"],
  computed: {
    propsWH() {
      const tag = this.field.tag;

      if (
        typeof tag === "string" &&
        (tag.includes("en=") ||
          tag.includes("id=") ||
          tag.includes("W=") ||
          tag.includes("H="))
      ) {
        const paramsString = tag.split("(")[1].split(")")[0];
        const params = new URLSearchParams(paramsString);
        const W = params.get("W") || "";
        const H = params.get("H") || "";
        const posY = params.get("posY") || "";

        return { W, H, posY, windowW: window.innerWidth };
      } else {
        return { W: "", H: "", posY: "", windowW: window.innerWidth };
      }
    },
    gender() {
      return this.getFieldValue((e) => e.source === SOURCE_USER_GENDERSELECTOR);
    },
    doiUser() {
      return this.getFieldValue((e) => e.tag === "DOI_USER");
    },
    dobUser() {
      return this.getFieldValue((e) => e.tag === "DOB_USER");
    },
    types() {
      return this.species[this.sex];
    },
  },
  data() {
    return {
      activeSlider: "Brightness",
      dialog: false,
      type: null,
      step: 0,
      age: null,
      sex: null,
      titles: ["chooseGender", "age", "chooseType", "choosePhoto"],
      race: null,
      species: {
        M: [
          {
            image: img4,
            name: "European",
            id: 0,
          },
          {
            image: img3,
            name: "Central Asian",
            id: 1,
          },
          {
            image: img6,
            name: "South Asian",
            id: 2,
          },
          {
            image: img2,
            name: "Caucasian",
            id: 3,
          },
          {
            image: img1,
            name: "African American",
            id: 4,
          },
          {
            image: img5,
            name: "Indian American",
            id: 5,
          },
        ],
        F: [
          {
            image: img4,
            name: "European",
            id: 0,
          },
          {
            image: img3,
            name: "Central Asian",
            id: 1,
          },
          {
            image: img6,
            name: "South Asian",
            id: 2,
          },
          {
            image: img2,
            name: "Caucasian",
            id: 3,
          },
          {
            image: img1,
            name: "African American",
            id: 4,
          },
          {
            image: img5,
            name: "Indian American",
            id: 5,
          },
        ],
      },
      randomPhotos: [],
      loading: false,
      loadingImage: false,
    };
  },
  methods: {
    storeImageFile(file) {
      const randomPhotoField = this.getField(
        (e) => e.source === SOURCE_RANDOMPHOTO,
      );
      const userPhotoField = this.getField(
        (e) => e.source === SOURCE_USER_PHOTO,
      );

      if (!(randomPhotoField || userPhotoField)) {
        return;
      }

      if (typeof randomPhotoField?.value === "number") {
        randomPhotoField.value = file;

        return;
      }

      let value = null;
      const field = randomPhotoField ?? userPhotoField;

      if (file) {
        value = new File([file], "photo.png", {
          type: "image/png",
        });
      }

      field.file = value;
      this.fileImg = value;
    },
    getField(find) {
      if (!Array.isArray(this.template?.fields)) {
        return;
      }

      return this.template.fields.find(find);
    },
    setFieldValue(find, value) {
      const field = this.getField(find);

      if (!field) {
        return;
      }

      field.value = value;
    },
    getFieldValue(find) {
      const field = this.getField(find);

      if (!field) {
        return;
      }

      return field.value;
    },
    setGender(value) {
      this.setFieldValue((e) => e.source === SOURCE_USER_GENDERSELECTOR, value);
    },
    choiceType(type) {
      this.step = 3;
      this.race = type.id;
      this.getPhotos();
    },
    getPhotos() {
      this.loading = true;

      axiosInstance
        .get(
          `/autodata/photos?age=${this.age}&gender=${this.sex}&race=${this.race}&count=6`,
        )
        .then(async (res) => {
          if (res.data?.photoIds) {
            const arr = [];
            for (let i = 0; i < res.data?.photoIds.length; i++) {
              await axiosInstance
                .get("/autodata/photo?id=" + res.data?.photoIds[i], {
                  responseType: "blob",
                })
                .then((response) => {
                  arr.push({
                    img: URL.createObjectURL(response.data),
                    id: res.data.photoIds[i],
                  });
                })
                .catch((error) => {
                  console.error("Ошибка при загрузке картинки:", error);
                });
            }
            this.randomPhotos = arr;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    selectImg(id) {
      if (id && !this.loadingImage) {
        this.loadingImage = true;
        const myInput = document.querySelector("#myInput");
        myInput.value = id;
        const event = new Event("input", { bubbles: true });
        myInput.dispatchEvent(event);
      } else {
        console.error("IMG is required", id);
      }
    },
  },
  mounted() {
    const _t = this;
    const myRange = document.querySelectorAll(".myRange");
    const storeImageFileCb = this.storeImageFile;

    myRange.forEach((item) => {
      const range = item.querySelector("input");
      const rangeFon = item.querySelector(".myRange-fon");
      range.addEventListener("input", () => {
        setWidth(range.value, range.max, rangeFon);
      });
      setWidth(range.value, range.max, rangeFon);
    });

    function setWidth(value, max, el) {
      const percent = (value / max) * 97;
      const width = `calc(${percent}% - 0px)`; // Вычисляем ширину с учетом ползунка
      el.style.width = width;
      el.style.setProperty("--textValue", `'${value}'`);
    }

    const resetFilters = document.querySelector("#reset-filters");
    const applyFilters = document.querySelector("#apply-filters");

    // resetFilters.addEventListener('click', function (){
    //   const myRange = document.querySelectorAll('.myRange')
    //   myRange.forEach(item => {
    //     const range = item.querySelector('input')
    //     const rangeFon = item.querySelector('.myRange-fon')
    //     setWidth(range.getAttribute('data-startValue'), range.max, rangeFon)
    //     range.value = range.getAttribute('data-startValue')
    //   })
    // })
    function resetRangeFilters() {
      const myRange = document.querySelectorAll(".myRange");
      myRange.forEach((item) => {
        const range = item.querySelector("input");
        const rangeFon = item.querySelector(".myRange-fon");
        setWidth(range.getAttribute("data-startValue"), range.max, rangeFon);
        range.value = range.getAttribute("data-startValue");
      });
    }

    resetFilters.addEventListener("click", resetRangeFilters);
    applyFilters.addEventListener("click", resetRangeFilters);

    /**
     * If mobile - true, else - false
     * @type {boolean}
     */
    const isMobile = window.matchMedia("(pointer:coarse)").matches;

    // DOM elements
    const cpContainer = document.querySelector(".control-panel-container");
    const mainContainer = document.querySelector(".main-container");
    const toolContainer = document.querySelector(".tool-container");

    /**
     * Array of DOM elements that will hold ImageEditor components
     * @type {Array}
     */
    const DOMContainers = [cpContainer, mainContainer, toolContainer];

    /**
     * Array of DOM elements that will hold ImageEditors tools panels
     * @type {Array}
     */
    const toolContainers = [
      toolContainer.querySelector(".crop-controls"),
      toolContainer.querySelector(".paint-controls"),
      toolContainer.querySelector(".filters-controls"),
      toolContainer.querySelector(".rotation-controls"),
    ];

    // Upload input element
    const uploadInput = document.querySelector("#upload-input");
    const initUploadLabel = document.querySelector("#initial-upload");

    // Drag'n'Drop input element
    const dragArea = document.querySelector(".drag-area");

    // Init
    /**
     * Current ImageEditor object
     * @type {Object}
     */
    let currentEditor;

    /**
     * Current mode
     * @type {string}
     */
    let currentMode;

    // Event listeners

    // Button upload
    uploadInput.addEventListener("change", (e) => {
      if (e.target.files.length !== 1) return;
      if (!e.target.files[0].type.startsWith("image/")) return;

      uploadFile(e.target.files[0]);
    });

    // Drag'n'Drop upload
    ["dragenter", "dragover", "dragleave", "drop"].forEach((e) => {
      dragArea.addEventListener(e, preventDefaults);
    });

    // Highlight/unhighlight area
    ["dragenter", "dragover"].forEach((e) => {
      dragArea.addEventListener(e, () => {
        dragArea.classList.add("active");
      });
    });

    dragArea.addEventListener("dragleave", () => {
      dragArea.classList.remove("active");
    });

    dragArea.addEventListener("drop", (e) => {
      let dt = e.dataTransfer;
      let file = dt.files[0];

      if (!file.type.startsWith("image/")) return;

      uploadFile(file);
    });

    // Functions

    /**
     * @property {Function} uploadFile - upload file, init new ImageEditor, initially activate crop-mode, add events on ImageEditor DOM elements
     * @param {Object} file - file object from input
     * @returns {void}
     */
    const myInput = document.querySelector("#myInput");

    myInput.addEventListener("input", (e) => {
      axiosInstance
        .get("/autodata/photo?id=" + e.target.value, { responseType: "blob" })
        .then((response) => {
          const blob = response.data;
          uploadFile(blob);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке картинки:", error);
        })
        .finally(() => {
          _t.dialog = false;
        });
    });

    function uploadFile(file) {
      // Initially delete upload button
      if (document.querySelector(".placeholder-button")) {
        document.querySelector(".placeholder-button").remove();
      }

      mainContainer.innerHTML = "";
      cpContainer.innerHTML = "";

      // Remove old event listener for keyboard shortcuts
      document.removeEventListener("keydown", keyboardShortcuts);

      // const ordersStore = useOrdersStore();
      currentEditor = new ImageEditor(
        DOMContainers,
        file,
        isMobile,
        storeImageFileCb,
        _t.propsWH.W,
        _t.propsWH.H,
      );

      initEvents();
      activateMode("crop", true);
    }

    /**
     * @property {Function} initEvents - Adds events on DOM elements of ImageEditor
     * @returns {void}
     */
    function initEvents() {
      // Tools
      const aspectRatioBtns = currentEditor.cropperControlsContainer
        .querySelector(".aspect-ratio-buttons")
        .querySelectorAll("button");
      const rotateReflectBtns = currentEditor.cropperControlsContainer
        .querySelector(".rotation-buttons")
        .querySelectorAll("button");

      const paintingBrush = currentEditor.brushModeBtn;
      const eraserBrush = currentEditor.eraserModeBtn;
      const blurBrush = currentEditor.blurModeBtn;
      // Mode switching events
      currentEditor.cropModeBtn.addEventListener("click", () => {
        activateMode("crop");
        removeToolActiveStates(aspectRatioBtns);
      });

      currentEditor.paintModeBtn.addEventListener("click", () => {
        activateMode("paint");
        removeToolActiveStates(aspectRatioBtns);
      });

      currentEditor.filtersModeBtn.addEventListener("click", () => {
        activateMode("filters");
        removeToolActiveStates(aspectRatioBtns);
      });

      currentEditor.rotationModeBtn.addEventListener("click", () => {
        activateMode("rotation");
        removeToolActiveStates(aspectRatioBtns);
      });

      currentEditor.applyPaintingCanvasBtn.addEventListener("click", () => {
        activateMode("crop");
      });

      // Undo behaviour
      currentEditor.cropperUndoBtn.addEventListener("click", () => {
        removeToolActiveStates(aspectRatioBtns);
      });

      // Crop tools events
      aspectRatioBtns.forEach((button) => {
        button.addEventListener("click", (e) => {
          const currentBtn = e.currentTarget;

          removeToolActiveStates(aspectRatioBtns);
          if (currentBtn.id === "cropper-aspect-free-btn") {
            if (!currentEditor.cropper.cropped) {
              currentBtn.classList.toggle("active");
            }
          } else {
            currentBtn.classList.add("active");
          }
        });
      });

      // Apply crop
      currentEditor.cropperBtnApply.addEventListener("click", () => {
        removeToolActiveStates(aspectRatioBtns);
      });

      // Rotation/reflection buttons behaviour
      rotateReflectBtns.forEach((button) => {
        button.addEventListener("click", () => {
          removeToolActiveStates(aspectRatioBtns);
        });
      });

      // Keyboard brush events
      document.addEventListener("keydown", keyboardShortcuts);

      // Eraser tool
      eraserBrush.addEventListener("click", () => {
        eraserBrush.classList.add("active");
        paintingBrush.classList.remove("active");
        blurBrush.classList.remove("active");
      });

      // Blur tool
      blurBrush.addEventListener("click", () => {
        eraserBrush.classList.remove("active");
        paintingBrush.classList.remove("active");
        blurBrush.classList.add("active");
      });

      paintingBrush.addEventListener("click", () => {
        setPaintBrush();
      });

      addMicroAnimations();
    }

    /**
     *
     * @property {Function} activateMode - Activate mode. Initially - crop mode.
     * @param {string} mode - new mode of ImageEditor
     * @param {boolean} newFile - if it is first initialization
     * @returns {void}
     */
    function activateMode(mode, newFile) {
      if (newFile) {
        currentEditor.cropModeBtn.classList.add("active");
      }

      if (currentMode === mode) return;

      if (currentMode === "paint" && currentEditor.paintingCanvas) {
        currentEditor.cropper.enable();

        if (currentEditor.blurCanvas) {
          currentEditor.clearBlurCanvas();
        }

        currentEditor.paintingCanvas.remove();
        currentEditor.paintingCanvas = undefined;
        currentEditor.setZoombuttonsState("both-active");
        currentEditor.setUndoBtn(false);

        if (!isMobile) {
          currentEditor.initBrushCursor(undefined, false);
        }
      }

      if (currentMode === "filters") {
        currentEditor.resetFilters();
      }

      if (currentMode === "rotation") {
        currentEditor.resetRotation();
      }

      // Set current mode to new
      currentMode = mode;

      // Activate proper panel in DOM
      // toolContainers.forEach((container) => {
      //   container.classList.add("hide");
      // });
      // document.querySelector(`.${mode}-controls`).classList.remove("hide");

      // Update icons in cp
      currentEditor.cpContainer
        .querySelectorAll(".cp-toolbox button")
        .forEach((button) => {
          button.classList.remove("active");
          if (button.id === `${mode}-mode`) {
            button.classList.add("active");
          }
        });

      if (mode === "paint") {
        currentEditor.cropper.clear();
        currentEditor.cropper.disable();
        currentEditor.createPaintingCanvas();
        currentEditor.setZoombuttonsState("paint");
        currentEditor.setUndoBtn(true);

        setPaintBrush();
      }
    }

    /**
     *
     * @property {Function} activateMode - Prevents default for some events
     * @param {DragEvent} e - event object that cames from drag and drop events
     * @returns {void}
     */
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    /**
     *
     * @property {Function} removeToolActiveStates - remove class 'active' from all provided elements
     * @param {HTMLCollection} elements
     * @returns {void}
     */
    function removeToolActiveStates(elements) {
      elements.forEach((btn) => btn.classList.remove("active"));
    }

    /**
     *
     * @property {Function} setPaintBrush - Highlight DOM elements of paint mode
     * @returns {void}
     */
    function setPaintBrush() {
      currentEditor.brushModeBtn.classList.add("active");
      currentEditor.eraserModeBtn.classList.remove("active");
      currentEditor.blurModeBtn.classList.remove("active");
    }

    /**
     *
     * @property {Function} addBasicMicroAnimation - Adds basic (with 2 states and one callback invocation) microanimation to element.
     * @param {HTMLElement} element - element that will recieve 2 event listeners
     * @param {Function} callback - callback that will be added to invoke whet events from listeners fires
     * @param {string} innerElementSelector - inner element (element to animate) selector
     * @param {number} val1 - initial value for gsap
     * @param {number} val2 - value animate to for gsap
     * @param {string} setOrigin - optional string that set element styles before animation
     * @returns {void}
     */
    function addBasicMicroAnimation(
      element,
      callback,
      innerElementSelector,
      val1,
      val2,
      setOrigin,
    ) {
      element.addEventListener("mouseenter", function () {
        const innerElement = element.querySelector(innerElementSelector);
        if (setOrigin) {
          gsap.set(innerElement, {
            transformOrigin: setOrigin,
          });
        }
        callback(innerElement, val1, val2);
      });

      element.addEventListener("mouseleave", function () {
        const innerElement = element.querySelector(innerElementSelector);
        callback(innerElement, val2, val1);
      });
    }

    // Animation funcions

    /**
     *
     * @property {Function} addMicroAnimations - add all micro animations to ImageEditor buttons/labels and elements
     * @returns {void}
     */
    function addMicroAnimations() {
      // Formats Btn
      addBasicMicroAnimation(
        currentEditor.imageFormatBtn,
        animateElZoom,
        "svg",
        1,
        1.3,
      );

      // Download Btn
      addBasicMicroAnimation(
        currentEditor.cropperDownloadBtn,
        animateElTopBottom,
        "#arrow",
        0,
        2,
      );

      // Upload Btn
      addBasicMicroAnimation(
        currentEditor.uploadNewImgBtn,
        animateElTopBottom,
        "#arrow",
        0,
        -5,
      );

      // Undo Btn
      currentEditor.cropperUndoBtn.addEventListener("mouseenter", function () {
        animateElRotation(this.querySelector("svg"), 0, -30, 0.6);
      });

      currentEditor.cropperUndoBtn.addEventListener("click", function () {
        animateElRotation(this.querySelector("svg"), -30, 0, 0.6);
      });

      currentEditor.cropperUndoBtn.addEventListener("mouseleave", function () {
        animateElRotation(this.querySelector("svg"), -30, 0, 0.6);
      });

      // Zoom out Btn
      addBasicMicroAnimation(
        currentEditor.cropperZoomOutBtn,
        animateElZoom,
        "svg",
        1,
        0.8,
      );

      // Zoom in Btn
      addBasicMicroAnimation(
        currentEditor.cropperZoomInBtn,
        animateElZoom,
        "svg",
        1,
        1.2,
      );

      // Rotation Mode btn
      currentEditor.rotationModeBtn.addEventListener("mouseenter", function () {
        gsap.set(this.querySelector("#arrow"), { transformOrigin: "center" });
        animateElLeftRight(this.querySelector("#left-half"), 0, -2);
        animateElLeftRight(this.querySelector("#right-half"), 0, 2);
        animateElRotation(this.querySelector("#arrow"), 0, 10);
      });

      currentEditor.rotationModeBtn.addEventListener("mouseleave", function () {
        animateElLeftRight(this.querySelector("#left-half"), -2, 0);
        animateElLeftRight(this.querySelector("#right-half"), 2, 0);
        animateElRotation(this.querySelector("#arrow"), 10, 0);
      });

      // Filters Mode btn
      currentEditor.filtersModeBtn.addEventListener("mouseenter", function () {
        animateElLeftRight(this.querySelector("#top_control"), 0, -5);
        animateElLeftRight(this.querySelector("#middle_control"), 0, 3);
        animateElLeftRight(this.querySelector("#bottom_control"), 0, -2);
      });

      currentEditor.filtersModeBtn.addEventListener("mouseleave", function () {
        animateElLeftRight(this.querySelector("#top_control"), -5, 0);
        animateElLeftRight(this.querySelector("#middle_control"), 3, 0);
        animateElLeftRight(this.querySelector("#bottom_control"), -2, 0);
      });

      // Painting Mode btn
      currentEditor.paintModeBtn.addEventListener("mouseenter", function () {
        gsap.set(this.querySelector("#paint_brush"), {
          transformOrigin: "right right",
        });
        animateElRotation(this.querySelector("#paint_brush"), 0, 10);
      });

      currentEditor.paintModeBtn.addEventListener("mouseleave", function () {
        animateElRotation(this.querySelector("#paint_brush"), 10, 0);
      });

      // Crop Mode btn
      currentEditor.cropModeBtn.addEventListener("mouseenter", function () {
        gsap.set(this.querySelector("#crop_grid"), {
          transformOrigin: "center center",
        });
        gsap.set(this.querySelector("#outer"), {
          transformOrigin: "center center",
        });

        animateElZoom(this.querySelector("#crop_grid"), 1, 1.3);
        animateElZoom(this.querySelector("#outer"), 1, 1.25, 1, 1, 0);
      });

      currentEditor.cropModeBtn.addEventListener("mouseleave", function () {
        animateElZoom(this.querySelector("#crop_grid"), 1.3, 1);
        animateElZoom(this.querySelector("#outer"), 1.25, 1, 1, 0, 1);
      });

      // Crop aspect ratio btns

      // Square
      addBasicMicroAnimation(
        currentEditor.cropperBtnAspectSquare,
        animateElZoom,
        "#grid",
        1,
        1.2,
        "center center",
      );

      // 3:4
      addBasicMicroAnimation(
        currentEditor.cropperBtnAspect34,
        animateElZoom,
        "#grid",
        1,
        1.2,
        "center center",
      );

      // 4:3
      addBasicMicroAnimation(
        currentEditor.cropperBtnAspect43,
        animateElZoom,
        "#grid",
        1,
        1.2,
        "center center",
      );

      // 16:9
      addBasicMicroAnimation(
        currentEditor.cropperBtnAspect169,
        animateElZoom,
        "#grid",
        1,
        1.2,
        "center center",
      );

      // 9:16
      addBasicMicroAnimation(
        currentEditor.cropperBtnAspect916,
        animateElZoom,
        "#grid",
        1,
        1.2,
        "center center",
      );

      // Free
      currentEditor.cropperBtnAspectFree.addEventListener(
        "mouseenter",
        function () {
          gsap.set(this.querySelector("#grid"), {
            transformOrigin: "center center",
          });
          animateElZoom(this.querySelector("#grid"), 1, 1.2);
          animateElTopBottom(this.querySelector("#arrow_up"), 0, -5);
          animateElTopBottom(this.querySelector("#arrow_down"), 0, 5);
          animateElLeftRight(this.querySelector("#arrow_right"), 0, 5);
          animateElLeftRight(this.querySelector("#arrow_left"), 0, -5);
        },
      );

      currentEditor.cropperBtnAspectFree.addEventListener(
        "mouseleave",
        function () {
          animateElZoom(this.querySelector("#grid"), 1.2, 1);
          animateElTopBottom(this.querySelector("#arrow_up"), -5, 0);
          animateElTopBottom(this.querySelector("#arrow_down"), 5, 0);
          animateElLeftRight(this.querySelector("#arrow_right"), 5, 0);
          animateElLeftRight(this.querySelector("#arrow_left"), -5, 0);
        },
      );

      // Rotations/Reflections btns

      // 90deg
      currentEditor.cropperBtnRotateRight.addEventListener(
        "mouseenter",
        function () {
          gsap.set(this.querySelector("#main"), {
            transformOrigin: "center center",
          });
          animateElRotation(this.querySelector("#main"), 0, 90);
          animateElTopBottom(this.querySelector("#main"), 0, 10);
          animateElFade(this.querySelector("#top"), 1, 0);
        },
      );

      currentEditor.cropperBtnRotateRight.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("#main"), 90, 0);
          animateElTopBottom(this.querySelector("#main"), 10, 0);
          animateElFade(this.querySelector("#top"), 0, 1);
        },
      );

      // -90deg
      currentEditor.cropperBtnRotateLeft.addEventListener(
        "mouseenter",
        function () {
          gsap.set(this.querySelector("#main"), {
            transformOrigin: "center center",
          });
          animateElRotation(this.querySelector("#main"), 0, -90);
          animateElTopBottom(this.querySelector("#main"), 0, 10);
          animateElFade(this.querySelector("#top"), 1, 0);
        },
      );

      currentEditor.cropperBtnRotateLeft.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("#main"), -90, 0);
          animateElTopBottom(this.querySelector("#main"), 10, 0);
          animateElFade(this.querySelector("#top"), 0, 1);
        },
      );

      // Reflect X
      currentEditor.cropperBtnReflectX.addEventListener(
        "mouseenter",
        function () {
          gsap.set(this.querySelector("svg"), {
            transformOrigin: "center center",
          });
          animateElRotation(this.querySelector("svg"), 0, 180, 0.9);
        },
      );

      currentEditor.cropperBtnReflectX.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("svg"), 180, 0, 0.9);
        },
      );

      // Reflect Y
      currentEditor.cropperBtnReflectY.addEventListener(
        "mouseenter",
        function () {
          gsap.set(this.querySelector("svg"), {
            transformOrigin: "center center",
          });
          animateElRotation(this.querySelector("svg"), 0, 180, 0.9);
        },
      );

      currentEditor.cropperBtnReflectY.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("svg"), 180, 0, 0.9);
        },
      );

      // Apply crop btn
      addBasicMicroAnimation(
        currentEditor.cropperBtnApply,
        animateElZoom,
        "svg",
        1,
        0.8,
      );

      // Painting tools

      // Brush
      addBasicMicroAnimation(
        currentEditor.brushModeBtn,
        animateElRotation,
        "#pencil_el",
        0,
        -6,
        "top right",
      );

      // Eraser
      currentEditor.eraserModeBtn.addEventListener("mouseenter", function () {
        gsap.set(this.querySelector("#eraser_el"), {
          transformOrigin: "top right",
        });
        animateElTopBottom(this.querySelector("#eraser_el"), 0, 3);
        animateElLeftRight(this.querySelector("#eraser_el"), 0, -5);
      });

      currentEditor.eraserModeBtn.addEventListener("mouseleave", function () {
        animateElTopBottom(this.querySelector("#eraser_el"), 3, 0);
        animateElLeftRight(this.querySelector("#eraser_el"), -5, 0);
      });

      // Blur tool
      currentEditor.blurModeBtn.addEventListener("mouseenter", function () {
        gsap.set(this.querySelector("#blur_el"), {
          transformOrigin: "top right",
        });
        animateElTopBottom(this.querySelector("#blur_el"), 0, 3);
        animateElLeftRight(this.querySelector("#blur_el"), 0, -5);
      });

      currentEditor.blurModeBtn.addEventListener("mouseleave", function () {
        animateElTopBottom(this.querySelector("#blur_el"), 3, 0);
        animateElLeftRight(this.querySelector("#blur_el"), -5, 0);
      });

      // Apply paint
      addBasicMicroAnimation(
        currentEditor.applyPaintingCanvasBtn,
        animateElZoom,
        "svg",
        1,
        0.8,
      );

      // Clear painting canvas
      currentEditor.clearPaintingCanvasBtn.addEventListener(
        "mouseenter",
        function () {
          animateElRotation(this.querySelector("svg"), 0, -30, 0.6);
        },
      );

      currentEditor.clearPaintingCanvasBtn.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("svg"), -30, 0, 0.6);
        },
      );

      // Apply filters
      addBasicMicroAnimation(
        currentEditor.applyFiltersBtn,
        animateElZoom,
        "svg",
        1,
        0.8,
      );

      // Reset filters btn
      currentEditor.resetFiltersBtn.addEventListener("mouseenter", function () {
        animateElRotation(this.querySelector("svg"), 0, -30, 0.6);
      });

      currentEditor.resetFiltersBtn.addEventListener("mouseleave", function () {
        animateElRotation(this.querySelector("svg"), -30, 0, 0.6);
      });

      // Apply rotation
      addBasicMicroAnimation(
        currentEditor.imageRotationSliderApply,
        animateElZoom,
        "svg",
        1,
        0.8,
      );

      // Reset filters btn
      currentEditor.imageRotationSliderReset.addEventListener(
        "mouseenter",
        function () {
          animateElRotation(this.querySelector("svg"), 0, -30, 0.6);
        },
      );

      currentEditor.imageRotationSliderReset.addEventListener(
        "mouseleave",
        function () {
          animateElRotation(this.querySelector("svg"), -30, 0, 0.6);
        },
      );
    }

    /**
     * @property {Function} keyboardShortcuts - increase/decrease paint brush size by pressing '[' ']' buttons on keyboard
     * @param {KeyboardEvent} e - event object, that comes from listener that fires on keyboard input
     * @returns {void}
     */
    function keyboardShortcuts(e) {
      if (currentEditor.paintingCanvas) {
        if (e.keyCode == 219) {
          currentEditor.changeBrushSize("decrease");
        } else if (e.keyCode == 221) {
          currentEditor.changeBrushSize("increase");
        }

        if (currentEditor.brushCursor) {
          currentEditor.brushCursor.style.width = `${currentEditor.brushSize * 2}px`;
          currentEditor.brushCursor.style.height = `${currentEditor.brushSize * 2}px`;
        }
      }
    }

    // Placeholder btn
    addBasicMicroAnimation(
      initUploadLabel,
      animateElTopBottom,
      "#arrow",
      0,
      -10,
    );

    initUploadLabel.addEventListener("click", function () {
      animateElTopBottom(this.querySelector("#arrow"), -10, -125);
    });
  },
};
</script>

<style lang="scss">
@import "@assets/constructor/css/vars.scss";

.modelPhotos-sex {
  display: flex;
  grid-gap: 8px;

  &>div {
    width: 100%;
    max-width: 112px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    border-radius: 8px;
    height: 44px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid rgba(125, 130, 147, 0.2);
    transition: 0.3s;

    &:hover {
      border: 1px solid rgba(125, 130, 147, 0.6);
    }

    &.active {
      border: 1px solid $primary;
      color: $primary;
    }
  }
}

.modelPhotos-photos {
  display: grid;
  align-items: flex-end;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 8px;
  margin: 20px 0;

  @media (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    }
  }
}

.modelPhotos {
  background: #fff;
  width: 90vw;
  max-width: 1000px;
  border-radius: 8px;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 560px) {
    width: 85vw;
  }

  .v-img {}

  &-item {
    cursor: pointer;
    border-radius: 8px;
  }
}

.upload-btn {
  width: 100%;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;


  &>span:nth-child(1) {
    background: $primary;
    height: 28px;
    width: 72px;
    text-align: center;
    display: inline-flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    font-weight: 500;
    font-size: 13px;
    line-height: 12px;
  }

  &>span:nth-child(2) {
    background: $blue2;
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    height: 28px;
    padding-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.filter-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: rgba(24, 139, 241, 1);
}

.myRange {
  position: relative;
  overflow: hidden;
  height: 64px;
  border-radius: 20px;

  @media (max-width: $md) {
    height: 32px;
  }

  &-fon {
    background: $primary;
    height: 100%;
    width: 64px;
    pointer-events: none;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;

    &:before {
      content: var(--textValue);
      font-size: 14px;
      color: #fff;
      z-index: 2;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;

      @media (max-width: $md) {
        font-size: 12px;
      }
    }

    &:after {
      content: "";
      width: 6px;
      height: 6px;
      pointer-events: none;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
    }
  }
}

.custom-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 64px;
  background: $blue;
  outline: none;
  border-radius: 10px;
  transition: opacity 0.2s;

  @media (max-width: $md) {
    height: 32px;
  }
}

/* Set the track color */
.custom-range::-webkit-slider-runnable-track {
  background: $blue;
  border-radius: 10px;
  height: 64px;

  @media (max-width: $md) {
    height: 32px;
  }
}

/* Set the thumb handle */
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 64px;
  background: $primary;
  border-radius: 0 10px 10px 0;
  opacity: 1;
  cursor: pointer;

  @media (max-width: $md) {
    height: 32px;
  }
}

/* Set the thumb color when active */
.custom-range::-webkit-slider-thumb:hover {
  //background: #555;
}

/* Set the thumb color when dragged */
.custom-range::-webkit-slider-thumb:active {
  //background: #333;
}

/* Set the thumb color when focused */
.custom-range::-webkit-slider-thumb:focus {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

#paint-mode {
  visibility: hidden;
  opacity: 0;
}

.DocsGen {
  &__photo {
    width: 288px;
    max-width: calc(100vw - 40px);

    @media (max-width: 360px) {
      width: calc(100vw - 24px);
      max-width: calc(100vw - 24px);
    }

    &-head {
      display: flex;
      justify-content: start;
      grid-gap: 8px;
      margin-bottom: 8px;
    }

    &-box {
      background: #fff;
      border-radius: 10px;
      padding: 19px;

      @media (max-width: $md) {
        padding: 0px;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    &-wrp {
      grid-gap: 16px;
      position: relative;

      @media (min-width: $md) {
        display: flex;
      }
    }
    &-contrast {
      width: -webkit-fill-available;
    }
  }
}

.cropper-container {
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  font-size: 0;
  line-height: 0;
  position: relative;
}

.cropper-container img {
  backface-visibility: hidden;
  height: 100%;
  image-orientation: 0deg;
  width: 100%;
  display: block;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
}

.cropper-canvas,
.cropper-crop-box,
.cropper-drag-box,
.cropper-modal,
.cropper-wrap-box {
  position: absolute;
  inset: 0;
}

.cropper-canvas,
.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: 0.5;
  background-color: #000;
}

.cropper-view-box {
  height: 100%;
  width: 100%;
  outline: 1px solid #3399ffbf;
  display: block;
  overflow: hidden;
}

.cropper-dashed {
  opacity: 0.5;
  border: 0 dashed #eee;
  display: block;
  position: absolute;
}

.cropper-dashed.dashed-h {
  height: 33.3333%;
  width: 100%;
  border-top-width: 1px;
  border-bottom-width: 1px;
  top: 33.3333%;
  left: 0;
}

.cropper-dashed.dashed-v {
  height: 100%;
  width: 33.3333%;
  border-left-width: 1px;
  border-right-width: 1px;
  top: 0;
  left: 33.3333%;
}

.cropper-center {
  height: 0;
  opacity: 0.75;
  width: 0;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
}

.cropper-center:after,
.cropper-center:before {
  content: " ";
  background-color: #eee;
  display: block;
  position: absolute;
}

.cropper-center:before {
  height: 1px;
  width: 6px;
  top: 0;
  left: -2px;
}

.cropper-center:after {
  height: 6px;
  width: 1px;
  top: -2px;
  left: 0;
}

.cropper-face,
.cropper-line,
.cropper-point {
  height: 100%;
  opacity: 0.1;
  width: 100%;
  display: block;
  position: absolute;
}

.cropper-face {
  background-color: #fff;
  top: 0;
  left: 0;
}

.cropper-line {
  background-color: #39f;
  pointer-events: none;
  opacity: 0;
}

.cropper-line.line-e {
  cursor: ew-resize;
  width: 4px;
  top: 0;
  right: -2px;
}

.cropper-line.line-n {
  cursor: ns-resize;
  height: 4px;
  top: -2px;
  left: 0;
}

.cropper-line.line-w {
  cursor: ew-resize;
  width: 4px;
  top: 0;
  left: -2px;
}

.cropper-line.line-s {
  cursor: ns-resize;
  height: 4px;
  bottom: -2px;
  left: 0;
}

.cropper-point {
  height: 4px;
  opacity: 0.75;
  width: 4px;
  background-color: #39f;
}

.cropper-point.point-e {
  cursor: ew-resize;
  margin-top: -2px;
  top: 50%;
  right: -2px;
}

.cropper-point.point-n {
  cursor: ns-resize;
  margin-left: -2px;
  top: -2px;
  left: 50%;
}

.cropper-point.point-w {
  cursor: ew-resize;
  margin-top: -2px;
  top: 50%;
  left: -2px;
}

.cropper-point.point-s {
  cursor: s-resize;
  margin-left: -2px;
  bottom: -2px;
  left: 50%;
}

.cropper-point.point-ne {
  cursor: nesw-resize;
  top: -2px;
  right: -2px;
}

.cropper-point.point-nw {
  cursor: nwse-resize;
  top: -2px;
  left: -2px;
}

.cropper-point.point-sw {
  cursor: nesw-resize;
  bottom: -2px;
  left: -2px;
}

.cropper-point.point-se {
  cursor: nwse-resize;
  height: 16px;
  opacity: 1;
  pointer-events: none;
  opacity: 0;
  width: 16px;
  bottom: -2px;
  right: -2px;
}

@media (min-width: 614px) {
  .cropper-point.point-se {
    height: 12px;
    width: 12px;
  }
}

@media (min-width: 794px) {
  .cropper-point.point-se {
    height: 8px;
    width: 8px;
  }
}

@media (min-width: 960px) {
  .cropper-point.point-se {
    height: 4px;
    opacity: 0.75;
    width: 4px;
  }
}

.cropper-point.point-se:before {
  content: " ";
  height: 200%;
  opacity: 0;
  width: 200%;
  background-color: #39f;
  display: block;
  position: absolute;
  bottom: -50%;
  right: -50%;
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}

.cropper-hide {
  height: 0;
  width: 0;
  display: block;
  position: absolute;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}

.control-panel-container {
  width: 100%;
  height: 43px;
  z-index: 5;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  // background: url("gray_noise.80872de1.jpg") 0 0 / 80px 80px;
  display: flex;
  overflow: hidden;

  svg,
  path {
    fill: #333 !important;
  }
}

.control-panel-container .inner-container {
  width: 960px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  display: flex;
}

.control-panel-container button,
.control-panel-container label {
  cursor: pointer;
  background: none;
  border: none;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  display: flex;
}

.control-panel-container svg {
  width: 90%;
}

.control-panel-container .active svg {
  filter: drop-shadow(0 0 6px #4090ef);
}

.control-panel-container .active svg path {
  fill: #4090ef;
  stroke: none;
}

.control-panel-container .cp-toolbox {
  flex: 4;
  justify-content: flex-start;
  margin-left: 4rem;
  display: flex;
}

.control-panel-container .cp-zoom-buttons {
  flex: 2;
  justify-content: center;
  display: flex;
}

.control-panel-container .cp-undo-container {
  flex: 1;
  justify-content: center;
  display: flex;
}

.control-panel-container .upload-download-buttons {
  flex: 3;
  justify-content: flex-end;
  margin-right: 4rem;
  display: flex;
}

@media (max-width: 614px) {

  .control-panel-container button,
  .control-panel-container label {
    padding: 0 0.25rem;
  }

  .control-panel-container svg {
    width: 75%;
  }

  .control-panel-container .cp-toolbox {
    margin-left: 1rem;
  }

  .control-panel-container .upload-download-buttons {
    margin-right: 1rem;
  }
}

@media (max-width: 454px) {

  .control-panel-container button,
  .control-panel-container label {
    padding: 0 0.1rem;
  }

  .control-panel-container svg {
    width: 70%;
  }

  .control-panel-container .cp-toolbox {
    margin-left: 0.5rem;
  }

  .control-panel-container .upload-download-buttons {
    margin-right: 0.5rem;
  }
}

#download {
  opacity: 0.5;
}

.main-container {
  width: 248px;
  height: 323px;
  color: #fff;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  //position: absolute;
  background: url("@assets/constructor/img/bgPhotoRed.png") center/cover repeat;
  overflow: hidden;

  @media (max-width: 360px) {}

  &-ww {
    @media (max-width: 360px) {
      transform: scaleX(0.8) scaleY(0.85);
      transform-origin: top center;
      overflow: hidden;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: -52px;
    }

    @media (max-width: 288px) {
      transform: scaleX(0.71) scaleY(0.78);
      overflow: hidden;
      margin-bottom: -60px;
    }
  }

  &:after {
    //content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--width);
    pointer-events: none;
    height: var(--height);
    background: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='311' height='371' viewBox='0 0 311 371' fill='none'><path d='M308.5 185.5C308.5 286.999 239.605 368.5 155.5 368.5C71.3954 368.5 2.5 286.999 2.5 185.5C2.5 84.0006 71.3954 2.5 155.5 2.5C239.605 2.5 308.5 84.0006 308.5 185.5Z' stroke='%23188BF1' stroke-width='5'/></svg>") center/ cover no-repeat;
  }
}

.main-container .drag-area {
  width: 100%;
  height: 100%;
  // background: url("placeholder_image.70f05cfa.svg") center / 40% no-repeat;
  justify-content: center;
  align-items: center;
  display: flex;
}

.main-container .drag-area.active {
  // background: url("placeholder_image_active.123899b7.svg") center / 40%
  //   no-repeat;
}

.main-container .drag-area .placeholder-text {
  text-align: center;
  font-size: 29px;
}

.main-container .image-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  margin: 0;
  position: relative;
}

.main-container .image-container .image-element {
  max-height: 100%;
  margin: 0 auto;
  display: block;
}

.main-container canvas {
  cursor: none;
}

@media (max-width: 614px) {
  .main-container .drag-area {
    width: 100%;
    height: 100%;
  }

  .main-container .drag-area .placeholder-text {
    display: none;
  }
}

.tool-container {
  height: 130px;
  width: 100%;
  color: #fff;
  filter: drop-shadow(0 -3px 10px #00000026);
  z-index: 5;
  // background: url("gray_noise.80872de1.jpg") 0 0 / 80px 80px;
  border-radius: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  //position: fixed;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 0;
  overflow: hidden;
}

.tool-container .placeholder-button {
  width: 60px;
}

.tool-container .placeholder-button svg {
  cursor: pointer;
}

.tool-container .placeholder-button label {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}

.crop-controls {
  width: 960px;
  max-width: 100%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 auto;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  display: flex;
}

.crop-controls button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0 0.25rem;
}

.crop-controls svg {
  width: 90%;
  display: inline-block;
}

.crop-controls .aspect-ratio-buttons {
  flex: 6;
  justify-content: center;
  align-items: center;
  margin-left: 4rem;
  display: flex;
}

.crop-controls .aspect-ratio-buttons button.active svg {
  filter: drop-shadow(0 0 6px #4090ef);
}

.crop-controls .aspect-ratio-buttons button.active svg path {
  fill: #4090ef;
  stroke: none;
}

.crop-controls .rotation-buttons {
  flex: 4;
  justify-content: center;
  align-items: center;
  display: flex;
}

.crop-controls .apply-crop-container {
  flex: 1;
  margin-right: 4rem;
}

@media (max-width: 614px) {
  .crop-controls {
    width: 100%;
    flex-flow: column wrap;
    justify-content: center;
  }

  .crop-controls button {
    padding: 0 0.1rem;
  }

  .crop-controls svg {
    height: 51px;
    display: inline-block;
  }

  .crop-controls .aspect-ratio-buttons {
    height: 50%;
    width: 75%;
    margin-left: 0;
  }

  .crop-controls .rotation-buttons {
    height: 50%;
    width: 75%;
  }

  .crop-controls .apply-crop-container {
    width: 25%;
    justify-content: center;
    align-items: center;
    margin-right: 0;
    display: flex;
  }
}

@media (max-width: 454px) {
  .crop-controls svg {
    height: 36px;
  }

  .crop-controls .aspect-ratio-buttons {
    flex: 1;
  }

  .crop-controls .rotation-buttons {
    width: 50%;
    flex: 1;
    margin-left: -2rem;
  }

  .crop-controls .apply-crop-container {
    height: 60%;
    margin-right: 0;
    padding: 1rem 0.5rem;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .crop-controls .apply-crop-container svg {
    width: 36px;
  }
}

.paint-controls {
  width: 960px;
  max-width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  display: flex;
}

.paint-controls button {
  cursor: pointer;
  width: 60px;
  background: none;
  border: none;
  padding: 0 0.25rem;
}

.paint-controls svg {
  width: 90%;
  display: inline-block;
}

.paint-controls .painting-tools {
  flex: 8;
  justify-content: flex-start;
  align-items: center;
  margin-left: 4rem;
  display: flex;
}

.paint-controls .painting-tools button.active svg {
  filter: drop-shadow(0 0 6px #4090ef);
}

.paint-controls .painting-tools button.active svg path {
  fill: #4090ef;
}

.paint-controls .painting-tools #color-picker {
  appearance: none;
  width: 72px;
  height: 72px;
  cursor: pointer;
  background-color: #0000;
  border: none;
  margin-right: 1.5rem;
  padding: 0;
}

.paint-controls .painting-tools #color-picker::-webkit-color-swatch {
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 10px 10px #000000a8;
}

.paint-controls .painting-tools #color-picker::-moz-color-swatch {
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 10px 10px #000000a8;
}

.paint-controls .painting-tools .brush-size-settings {
  justify-content: center;
  align-items: center;
  display: flex;
}

.paint-controls .painting-tools .brush-size-settings #size-brush {
  text-align: center;
  width: 2rem;
  margin: 0 0.25rem;
  font-size: 19px;
  display: block;
}

.paint-controls .painting-tools #painting-brush {
  margin-left: 1rem;
}

.paint-controls .painting-apply-container {
  flex: 2;
  justify-content: center;
  align-items: center;
  margin-right: 4rem;
  display: flex;
}

@media (max-width: 614px) {
  .paint-controls {
    width: 100%;
  }

  .paint-controls button {
    cursor: pointer;
    width: 40px;
    background: none;
    border: none;
    padding: 0 0.1rem;
  }

  .paint-controls svg {
    height: 48px;
  }

  .paint-controls .painting-tools {
    flex: 2;
    margin-left: 1rem;
  }

  .paint-controls .painting-tools #color-picker {
    width: 56px;
    height: 56px;
    margin-right: 1rem;
  }

  .paint-controls .painting-tools .brush-size-settings svg {
    width: 29px;
  }

  .paint-controls .painting-apply-container {
    flex: 1;
    justify-content: flex-end;
    margin-left: -2rem;
    margin-right: 1rem;
  }
}

@media (max-width: 454px) {
  .paint-controls {
    flex-direction: column;
    justify-content: center;
  }

  .paint-controls button {
    width: 32px;
  }

  .paint-controls svg {
    height: 40px;
  }

  .paint-controls .painting-tools {
    height: 50%;
    flex-wrap: wrap;
    flex: 1;
    justify-content: center;
    margin-left: 0;
    display: flex;
  }

  .paint-controls .painting-tools #color-picker {
    width: 3rem;
    height: 3rem;
    margin-right: 0.5rem;
  }

  .paint-controls .painting-tools .brush-size-settings {
    margin-top: 0.5rem;
  }

  .paint-controls .painting-tools .brush-size-settings #size-brush {
    width: 1.5rem;
    margin: 0 0.25rem 0.15rem;
    font-size: 13px;
  }

  .paint-controls .painting-tools .brush-size-settings svg {
    width: 20px;
  }

  .paint-controls .painting-tools #painting-brush {
    margin-left: 0.5rem;
  }

  .paint-controls .painting-apply-container {
    height: 50%;
    width: 50%;
    justify-content: space-around;
    align-items: center;
    margin-top: -1rem;
    margin-left: 0;
    margin-right: 0;
    display: flex;
  }

  .paint-controls .painting-apply-container svg {
    width: 40px;
  }
}

.filters-controls {
  width: initial;
  max-width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex !important;
  flex-direction: column;
}

.filters-controls .filters-left-col,
.filters-controls .filters-right-col {}

.filters-controls .filters-left-col {}

@media (max-width: 614px) {
  .filters-controls {
    width: 100%;
    justify-content: center;
  }

  .filters-controls .filters-left-col {}
}

@media (max-width: 454px) {

  .filters-controls .filters-left-col,
  .filters-controls .filters-right-col {
    padding: 0.1rem;
  }

  .filters-controls .filters-left-col {
    margin-left: 0;
  }
}

.rotation-controls {
  width: 100%;
  max-width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: flex-end;
  margin: -8px auto 0;
  display: flex;
}

#apply-rotation-btn {
  height: 28px;
  width: 28px;
  flex-shrink: 0;
  display: none !important;

  svg {
    width: 28px;
    height: 28px;
  }
}

.rotation-slider-buttons {
  flex-direction: row !important;
  grid-gap: 8px;
  margin-right: 0 !important;
}

#reset-rotation-btn {
  height: 28px;
  width: 28px;
  flex-shrink: 0;

  @media (max-width: $md) {
    position: absolute;
    top: -18px;
    z-index: 5;
    width: fit-content;
    right: 0;

    &:after {
      content: "Reset rotate";
      text-decoration: underline;
      padding: 4px 0;
    }

    svg {
      display: none;
    }
  }

  svg {
    width: 28px;
    height: 28px;
  }
}

.rotation-controls {
  position: relative;
}

.rotation-controls button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0 0.25rem;
}

.rotation-controls svg {
  width: 90%;
  display: inline-block;

  path {
    fill: #188BF1;
  }
}

.rotation-controls .rotation-slider-container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  flex: 8;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0 !important;

  @media (max-width: $md) {
    margin-top: -12px !important;
  }
}

.rotation-controls .rotation-slider-container label {
  margin-bottom: 2rem;
  font-size: 19px;
}

.rotation-controls .rotation-slider-container .slider-elements {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
}

.rotation-controls .rotation-slider-container .slider-elements svg {
  width: 100%;
  opacity: 0.5;
  pointer-events: none;
  z-index: -1;
  position: absolute;
  inset: -2rem 0 0;
}

.rotation-controls .rotation-slider-container input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  background: $primary;
  border-radius: 10px;
}

.rotation-controls .rotation-slider-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

.rotation-controls .rotation-slider-container input[type="range"]:focus {
  outline: none;
}

.rotation-controls .rotation-slider-container input[type="range"]::-ms-track {
  width: 98%;
  cursor: pointer;
  color: #0000;
  background: none;
  border-color: #0000;
}

.rotation-controls .rotation-slider-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 2rem;
  width: 0.5rem;
  cursor: pointer;
  background: #4090ef;
  border-radius: 10px;
  margin-top: -1rem;

}

.rotation-controls .rotation-slider-container input[type="range"]::-moz-range-thumb {
  height: 2rem;
  width: 0.5rem;
  cursor: pointer;
  background: #4090ef;
  border: none;
  border-radius: 0;
  box-shadow:
    0 0 2px #000000e0,
    0 3px 6px #000000a8;
}

.rotation-controls .rotation-slider-container input[type="range"]::-ms-thumb {
  height: 2rem;
  width: 0.5rem;
  cursor: pointer;
  background: #4090ef;
  margin-top: -1.5rem;
  box-shadow:
    0 0 2px #000000e0,
    0 3px 6px #000000a8;
}

.rotation-controls .rotation-slider-container input[type="range"]::-webkit-slider-runnable-track {
  height: 0.35rem;
  cursor: pointer;
  background: none;
  position: relative;
}

.rotation-controls .rotation-slider-container input[type="range"]:focus::-webkit-slider-runnable-track {
  background: none;
}

.rotation-controls .rotation-slider-container input[type="range"]::-moz-range-track {
  height: 0.35rem;
  cursor: pointer;
  background: none;
  border-radius: 0.25rem;
}

.rotation-controls .rotation-slider-container input[type="range"]::-ms-track {
  height: 0.35rem;
  cursor: pointer;
  background: #fff;
  border-radius: 0.25rem;
}

.rotation-controls .rotation-slider-buttons {
  cursor: pointer;
  background: none;
  border: none;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-right: 4rem;
  padding: 0 0.5rem;
  display: flex;
}

@media (max-width: 614px) {
  .rotation-controls {
    width: 100%;
    flex-direction: column;
    justify-content: center;
  }

  .rotation-controls button {
    padding: 0 0.1rem;
  }

  .rotation-controls svg {
    width: 80%;
    display: inline-block;
  }

  .rotation-controls .rotation-slider-container {
    margin: 0;
    padding: 1rem;
  }

  .rotation-controls .rotation-slider-container label {
    margin-bottom: 2rem;
    margin-left: 0.4rem;
    font-size: 13px;
  }

  .rotation-controls .rotation-slider-buttons {
    width: 100%;
    cursor: pointer;
    background: none;
    border: none;
    flex-direction: row;
    justify-content: space-around;
    margin-right: 0;
    padding: 0 0.25rem;
    display: flex;
  }
}

@media (max-width: 454px) {
  .rotation-slider-container {
    padding: 0.25rem;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

//body {
//  width: 100vw;
//  height: 100vh;
//  background-color: #434343;
//  flex-direction: column;
//  font-family: Inter, sans-serif;
//  display: flex;
//  overflow: hidden;
//}

svg {
  overflow: visible;
}

.paint-brush-cursor {
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: difference;
  // background: url("cursor_img.cd314a1c.svg") 0 0 / 100% no-repeat;
}

.hide {
  display: none;
}

.loading-screen {
  width: 253px;
  height: calc(100% - 120px);
  z-index: 4;
  pointer-events: none;
  background-color: #434343;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  top: 93px;
  left: 17px;
}

.loading-screen.hide {
  display: none;
}

.loading-screen svg {
  width: 120px;
  height: 120px;
}

.cropper-view-box {
  outline: 2px solid #ffffffbf;
}

.cropper-dashed {
  border: 0 dashed #fff;
}

.cropper-center:before,
.cropper-center:after,
.cropper-line {
  background-color: #fff;
}

.cropper-point {
  background-color: #fff;
  box-shadow: 2px 2px 2px #00000080;
}

@media (min-width: $md) {
  .hideBeforeMd {
    display: none !important;
  }
}

@media (max-width: $md) {
  .hideOnMd {
    display: none !important;
  }
}
</style>
