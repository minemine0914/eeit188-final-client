<template>
  <v-container v-if="isErrorGetHouseInfo">
    <!-- House not found
        <v-btn to="/house/qwe">TEST1</v-btn>
        <v-btn to="/house/asd">TEST1</v-btn>
        <v-btn to="/house/f4d671db-d560-46b6-8606-276df8f8cadc">TEST1</v-btn> -->
  </v-container>
  <v-container v-if="!isErrorGetHouseInfo">
    <!-- House heading (Name, collect and sharing) -->
    <v-row class="pa-1 mt-1">
      <v-col cols="12">
        <v-sheet height="40px">
          <v-skeleton-loader type="heading" width="30%" v-if="isLoading" />
          <div class="d-flex flex-row" v-else>
            <v-sheet
              class="flex-column flex-grow-1 text-h4"
              color="transparent"
            >
              {{ houseInfo.name }}
            </v-sheet>
            <v-sheet
              class="d-flex flex-row flex-grow-1 justify-end align-end"
              color="transparent"
            >
              <v-btn
                :disabled="isLoadingCollection"
                variant="text"
                rounded="pill"
                size="large"
                density="compact"
                class="mb-1"
                @click.stop="onClickCollect"
              >
                <template v-slot:prepend>
                  <v-icon
                    :icon="isCollected ? 'mdi-heart' : 'mdi-heart-outline'"
                    color="deep-orange-darken-3"
                  ></v-icon>
                </template>
                <span>收藏</span>
              </v-btn>
              <v-btn
                variant="text"
                rounded="pill"
                size="large"
                density="compact"
                class="mb-1"
                @click.stop="onClickShare"
              >
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-share-variant"
                    color="light-green-darken-3"
                  ></v-icon>
                </template>
                <span>分享</span>
              </v-btn>
            </v-sheet>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- Images Grid -->
    <ImageGrid />
    <!-- House details -->
    <v-row class="px-1 mt-3 mb-15" no-gutters>
      <v-col cols="12" md="12">
        <v-sheet>
          <v-skeleton-loader v-if="isLoading" type="list-item-three-line" />
          <v-row v-else class="d-flex flex-row">
            <!-- House info -->
            <v-col class="flex-grow-1" cols="12" sm="6" md="6">
              <div class="text-grey-darken-1">
                <span class="mdi mdi-map-marker mr-2"></span>
                <span class="mr-2">{{
                  `${houseInfo.city} ${houseInfo.region} ${houseInfo.address}`
                }}</span>
              </div>
              <div class="text-grey-darken-1">
                <span class="mdi mdi-sofa mr-2"></span>
                <span>共 </span>
                <span class="mr-1" v-if="houseInfo.livingDiningRoom > 0">
                  {{ `${houseInfo.livingDiningRoom} 廳` }}
                </span>
                <span class="mr-1" v-if="houseInfo.bedroom > 0">
                  {{ `${houseInfo.bedroom} 房` }}
                </span>
                <span class="mr-1" v-if="houseInfo.bathroom > 0">
                  {{ `${houseInfo.bathroom} 淋浴` }}
                </span>
                <span class="mr-1" v-if="houseInfo.restroom > 0">
                  {{ `${houseInfo.restroom} 衛生` }}
                </span>
              </div>
              <div class="text-grey-darken-1">
                <span class="mdi mdi-bed mr-2"></span>
                <span>可住 </span>
                <span class="mr-1" v-if="houseInfo.adult > 0">
                  {{ `${houseInfo.adult} 位成人 ` }}
                </span>
                <span class="mr-1" v-if="houseInfo.child > 0">
                  {{ `${houseInfo.child} 位孩童 ` }}
                </span>
              </div>
              <div class="text-grey-darken-1">
                <span class="mr-2" v-if="!houseInfo.pet">
                  <span class="mdi mdi-paw-off mr-2"></span>
                  <span>禁止寵物</span>
                </span>

                <span class="mr-2" v-if="!houseInfo.smoke">
                  <span class="mdi mdi-smoking-off mr-2"></span>
                  <span>禁止吸菸</span>
                </span>
              </div>
            </v-col>
            <!-- House price and buy button -->
            <v-col
              class="d-flex flex-column flex-grow-1 justify-top align-end"
              cols="12"
              sm="6"
              md="6"
            >
              <v-sheet color="transparent">
                <div
                  class="text-h4 font-weight-medium text-brown-darken-4 mb-2 mr-1"
                >
                  NT ${{ houseInfo.price }}
                </div>
              </v-sheet>
              <v-sheet color="transparent">
                <v-btn
                  color="brown-lighten-1"
                  min-width="130"
                  size="large"
                  text="立即預定"
                  :to="`/booking/${houseInfo.id}`"
                ></v-btn>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="100">
          <div class="text-h6 mb-3">房源設施</div>
          <v-skeleton-loader type="chip, chip, chip" v-if="isLoading" />
          <v-sheet class="d-flex flex-row flex-wrap w-100 ga-3" v-else>
            <v-sheet
              v-if="houseInfo.postulates.length === 0"
              class="w-100 text-center"
            >
              <v-alert variant="plain" color="brown">
                <v-icon icon="mdi-emoticon-cry-outline" size="x-large"></v-icon>
                <div class="mt-2">房東忘記添加設施</div>
              </v-alert>
            </v-sheet>
            <v-sheet
              v-else
              v-for="(postulaue, index) in houseInfo.postulates"
              class="d-flex flex-column justufy-center align-center px-4 py-3"
              rounded="lg"
              color="brown-lighten-5"
              :key="index"
            >
              <v-icon
                v-if="postulaue.icon"
                :icon="postulaue.icon"
                color="brown-lighten-1"
              ></v-icon>
              <v-icon
                v-else
                icon="mdi-emoticon-excited-outline"
                color="brown-lighten-1"
              ></v-icon>
              <div class="text-brown-lighten-1 text-body-2 pt-2">
                {{ postulaue.name }}
              </div>
            </v-sheet>
          </v-sheet>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="180">
          <div class="text-h6 mb-3">房源介紹</div>
          <v-skeleton-loader
            type="list-item-three-line, list-item-two-line"
            v-if="isLoading"
          />
          <div v-else>
            {{ houseInfo.information }}
          </div>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="180">
          <div class="text-h6 mb-3">地理位置</div>
          <v-skeleton-loader type="image" height="250" v-if="isLoading" />
          <v-sheet
            v-else
            class="overflow-hidden"
            rounded="lg"
            :border="true"
            :elevation="0"
          >
            <!-- Map -->
            <ol-map
              style="height: 250px; width: 100%"
              :controls="[]"
              @click="handleMapClick"
              @pointermove="handleMapPointerMove"
            >
              <ol-view
                :projection="`EPSG:4326`"
                :center="[houseInfo.longitudeY, houseInfo.latitudeX]"
                :zoom="18"
                :rotation="0"
              />
              <ol-tile-layer :cacheSize="0">
                <ol-source-osm />
              </ol-tile-layer>
              <ol-vector-layer>
                <ol-source-vector>
                  <ol-feature :properties="[]">
                    <!-- Long, Lat (經度,緯度) -->
                    <ol-geom-point
                      :coordinates="[houseInfo.longitudeY, houseInfo.latitudeX]"
                    ></ol-geom-point>
                  </ol-feature>
                  <ol-style>
                    <ol-style-icon
                      :src="pointIcon"
                      :scale="0.2"
                    ></ol-style-icon>
                  </ol-style>
                </ol-source-vector>
              </ol-vector-layer>
              <ol-overlay
                :position="[houseInfo.longitudeY, houseInfo.latitudeX]"
                :autoPan="true"
                positioning="top-center"
                :stopEvent="false"
              >
                <v-menu v-model="menu" location="center">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props"></div>
                  </template>
                  <v-card rounded="lg">
                    <v-card-item>
                      <v-icon icon="mdi-map-marker"></v-icon>
                      {{
                        `${houseInfo.country}, ${houseInfo.city} ${houseInfo.region} ${houseInfo.address}`
                      }}
                    </v-card-item>
                    <v-card-item>
                      <v-sheet>
                        <v-btn
                          prepend-icon="fa:fa-solid fa-map-location-dot"
                          @click.stop="onClickOpenGoogleMaps"
                          flat
                          variant="outlined"
                        >
                          Google Maps
                        </v-btn>
                      </v-sheet>
                    </v-card-item>
                  </v-card>
                </v-menu>
              </ol-overlay>
              <ol-zoom-control
                className="ol-custom-zoom-control"
                zoomInLabel="+"
                zoomOutLabel="-"
              ></ol-zoom-control>
              <ol-attribution-control />
              <!-- 使用 Ctrl + 滾輪 縮放 -->
              <ol-interaction-mouse-wheel-zoom
                :condition="platformModifierKeyOnly"
              />
            </ol-map>
          </v-sheet>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="100">
          <div class="text-h6 pa-0">房東資訊</div>
          <v-skeleton-loader
            type="avatar, list-item-three-line"
            v-if="isLoading"
          />
          <v-row v-else class="d-flex flex-row">
            <v-col class="flex-grow-1" cols="12" md="4">
              <v-card flat>
                <template v-slot:prepend>
                  <v-avatar size="100" class="mr-5" border>
                    <v-img :src="hostInfo.avatarBase64"></v-img>
                  </v-avatar>
                </template>
                <template v-slot:title>
                  <div>{{ hostInfo.name }}</div>
                </template>
                <template v-slot:subtitle>
                  <div>擁有 {{ houseInfo.userHouseCount }} 間房源</div>
                  <v-btn
                    v-if="jwtToken != null && houseInfo.userId != user.id"
                    variant="outlined"
                    color="brown-darken-1"
                    density="compact"
                    class="mt-1 mr-2 px-1"
                    @click="handleChatClick"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        icon="mdi-message-outline"
                        class="pl-3"
                        size="small"
                      ></v-icon>
                    </template>
                    <template v-slot:default>
                      <div class="text-caption">傳送訊息</div>
                    </template>
                  </v-btn>
                </template>
              </v-card>
            </v-col>
            <v-col class="flex-grow-1" cols="12" md="8">
              <v-card class="py-0" flat>
                <v-card-item class="py-0">{{ hostInfo.about }}</v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="100">
          <v-sheet
            class="d-flex flex-row justify-center aligh-center ga-5 mb-3"
          >
            <v-sheet
              class="flex-grow-0 d-flex flex-column justify-centr align-center px-5"
            >
              <div
                class="flex-grow-1 text-h5 d-flex align-end font-weight-bold"
              >
                評分總覽
              </div>

              <div class="flex-grow-1 d-flex align-center flex-column">
                <div class="text-h2 mt-5">
                  {{ scoreDetail.averageScore.toFixed(1) }}
                  <span class="text-h6 ml-n3">/5</span>
                </div>
                <v-rating
                  :model-value="scoreDetail.averageScore"
                  size="30"
                  color="warning"
                  half-increments
                  readonly
                ></v-rating>
                <div class="px-3">{{ scoreDetail.totalReviews }} 則評價</div>
              </div>
            </v-sheet>
            <v-sheet class="flex-grow-1">
              <v-list
                bg-color="transparent"
                class="d-flex flex-column-reverse"
                density="compact"
              >
                <v-list-item
                  v-for="(key, index) in [
                    'scoresInRange0To1',
                    'scoresInRange1To2',
                    'scoresInRange2To3',
                    'scoresInRange3To4',
                    'scoresInRange4To5',
                  ]"
                  :key="key"
                >
                  <template v-slot:prepend>
                    <span>{{ index + 1 }}</span>
                    <v-icon class="mx-2" icon="mdi-star"></v-icon>
                  </template>

                  <v-progress-linear
                    :model-value="
                      scoreDetail[key]
                        ? (scoreDetail[key] / scoreDetail.totalReviews) * 100
                        : 0
                    "
                    color="yellow-darken-3"
                    height="15"
                    rounded
                  ></v-progress-linear>

                  <template v-slot:append>
                    <div style="min-width: 35px">
                      <span class="d-flex justify-end">
                        {{ scoreDetail[key] }}
                      </span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-sheet>
        </v-sheet>
        <v-divider class="border-opacity-25 my-5"></v-divider>
        <v-sheet min-height="100" flat>
          <v-sheet class="d-flex flex-row align-top">
            <div class="flex-grow-1 text-h6 mb-3">最新評論</div>
            <div class="d-flex flex-grow-1 text-h6 mb-3 justify-end align-top">
              <v-btn
                variant="text"
                size="large"
                rounded="pill"
                density="compact"
                @click="onClickDiscuss"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-message-draw" color="brown"></v-icon>
                </template>
                <span>
                  {{
                    selfHouseDiscuss.houseId === null &&
                    selfHouseDiscuss.userId === null
                      ? "立即評價"
                      : "修改評價"
                  }}
                </span>
              </v-btn>
            </div>
          </v-sheet>
          <v-skeleton-loader
            type="avatar, list-item-three-line, avatar, list-item-three-line"
            v-if="isLoading"
          />
          <v-sheet
            v-else-if="totalDiscussCount === 0"
            class="w-100 text-center"
          >
            <v-alert variant="plain" color="brown">
              <v-icon icon="mdi-emoticon-cry-outline" size="x-large"></v-icon>
              <div class="mt-2">目前沒有任何評價</div>
            </v-alert>
          </v-sheet>
          <v-row v-else>
            <v-col
              cols="12"
              md="6"
              v-for="previewDiscuss in previewDiscussList"
            >
              <DiscussCard :discuss="previewDiscuss" />
            </v-col>
            <v-col cols="12">
              <v-sheet class="d-flex justify-center align-center">
                <v-alert
                  v-if="scoreDetail.totalReviews < 5"
                  variant="plain"
                  color="brown"
                  class="text-center"
                >
                  沒有更多評論了
                </v-alert>
                <v-btn
                  v-else
                  variant="outlined"
                  size="large"
                  color="brown"
                  @click="isMoreDiscussesDialogOpen = true"
                >
                  查看全部 {{ scoreDetail.totalReviews }} 則評價
                </v-btn>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
  <DiscussDialog />
  <ShareDialog />
  <MoreDiscussesDialog />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { storeToRefs } from "pinia";

// User pinia
import { useUserStore } from "../../stores/userStore";
const userStore = useUserStore();
const { jwtToken, user } = storeToRefs(userStore);

// Components
import ImageGrid from "@/components/home/ImageGrid.vue";
import ShareDialog from "@/components/home/ShareDialog.vue";
import DiscussDialog from "@/components/home/DiscussDialog.vue";
import MoreDiscussesDialog from "@/components/home/MoreDiscussesDialog.vue";
import DiscussCard from "../../components/home/DiscussCard.vue";
// Assets
import pointIcon from "@/assets/point01.svg";
// Openlayers
import { platformModifierKeyOnly } from "ol/events/condition";
// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const {
  houseInfo,
  hostInfo,
  scoreDetail,
  previewDiscussList,
  selfHouseDiscuss,
  totalDiscussCount,
  isErrorGetHouseInfo,
  isLoading,
  isLoadingCollection,
  isCollected,
  isShareDialogOpen,
  isDiscussDialogOpen,
  isMoreDiscussesDialogOpen,
} = storeToRefs(houseDetailStore);

const menu = ref(false);

// Functions
function onClickCollect() {
  if (isCollected.value) {
    houseDetailStore.removeHouseToCollection();
  } else {
    houseDetailStore.addHouseToCollection();
  }
}
function onClickShare() {
  if (!isShareDialogOpen.value) {
    isShareDialogOpen.value = true;
  }
}
function onClickDiscuss() {
  if (!isDiscussDialogOpen.value) {
    isDiscussDialogOpen.value = true;
  }
}
// Map event
function handleMapClick(e) {
  let map = e.map;
  let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => {
    return feature;
  });
  if (feature) {
    let geometry = feature.getGeometry();
    console.log(
      geometry.getCoordinates(),
      geometry.getType(),
      feature.getProperties()
    );
    menu.value = true;
    // popupPosition.value = geometry.getCoordinates();
    // selectedPointProps.name = feature.get("name");
    // selectedPointProps.price = feature.get("price");
    // popoverShow.value = true;
    // isShowInfoCard.value = true;
  } else {
    console.log("No feature found!");
    // popoverShow.value = false;
  }
}
function handleMapPointerMove(e) {
  const pixel = e.map.getEventPixel(e.originalEvent);
  const hit = e.map.hasFeatureAtPixel(pixel);
  e.map.getTarget().style.cursor = hit ? "pointer" : "";
}

async function handleChatClick() {
  try {
    await userStore
      .addChatRecord({
        chat: "請問有什麼能為您服務的地方嗎？",
        senderId: hostInfo.value.id,
        receiverId: user.value.id,
      })
      .then(() => {
        router.push("/chat");
      });
  } catch (error) {
    console.error("Error adding chat record:", error);
  }
}

function onClickOpenGoogleMaps() {
  let url = `https://www.google.com/maps/search/?api=1&query=${houseInfo.value.latitudeX}%2C${houseInfo.value.longitudeY}`;
  window.open(url, "_blank").focus();
}

watch(
  // Watch Route params houseId change
  () => route.params.houseId,
  (newId, oldId) => {
    console.log(newId, oldId);
    houseDetailStore.getHouseInfo(newId);
  }
);

onMounted(async () => {
  if (route.params.houseId) {
    // If Route params houseId found
    console.log("Found houseId in url param: " + route.params.houseId);
    await houseDetailStore.getHouseInfo(route.params.houseId);
    // when houseInfo loaded, then get something need houseId...
    await Promise.all([
      houseDetailStore.checkIsCollectedHouse(),
      houseDetailStore.checkIsDiscussHouse(),
      houseDetailStore.getHostInfo(),
      houseDetailStore.getScoreDetail(),
      houseDetailStore.getPreviewDiscussList(),
      houseDetailStore.getSelfHouseDiscuss(),
    ]);
    if (isErrorGetHouseInfo.value) {
      router.push("/");
    }
  } else {
    // If Route params houseId not found
    console.log("HouseId not found in url param!  Take you to home page!");
    isErrorGetHouseInfo.value = true;
    if (isErrorGetHouseInfo.value) {
      route.push("/");
    }
  }
});
</script>

<style scoped>
:deep(.v-skeleton-loader > *) {
  margin: 0;
}

:deep(.v-skeleton-loader .v-skeleton-loader__image) {
  display: flex;
  flex-grow: 1;
  height: 100%;
  flex-direction: column;
}
</style>
