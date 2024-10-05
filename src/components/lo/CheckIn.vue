<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card color="brown-lighten-5">
                    <v-card-title class="text-h5 text-center pb-0">
                        請掃描 入住 QRCode
                    </v-card-title>
                    <!-- QRCode View -->
                    <v-card-item>
                        <v-responsive :aspect-ratio="16 / 9">
                            <v-sheet
                                class="w-100 h-100 overflow-hidden position-relative"
                                rounded="lg"
                                color="rgba(0,0,0,0)"
                                style="z-index: 100"
                            >
                                <qrcode-stream
                                    :constraints="selectedConstraints"
                                    :track="trackFunctionSelected.fn"
                                    :formats="selectedBarcodeFormats"
                                    @error="onError"
                                    @detect="onDetect"
                                    @camera-on="onCameraReady"
                                />
                            </v-sheet>
                            <v-sheet
                                class="d-flex flex-row justify-center align-center w-100 h-100 overflow-hidden position-absolute top-0 left-0"
                                rounded="lg"
                                color="grey-darken-2"
                                style="z-index: 99"
                            >
                                <div class="text-h4">掃描裝置啟動中 請稍候</div>
                            </v-sheet>
                        </v-responsive>
                    </v-card-item>
                    <!-- Scan informations -->
                    <v-card-item class="pt-0">
                        <p class="decode-result">
                            最後掃描紀錄: <b>{{ result }}</b>
                        </p>
                        <p class="error">{{ error }}</p>
                    </v-card-item>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card title="掃描設定" color="brown-lighten-5">
                    <v-card-item class="pt-0">
                        <v-sheet class="d-flex flex-row ga-1 pt-2" color="transparent">
                            <v-select
                                v-model="selectedConstraints"
                                :items="constraintOptions"
                                item-title="label"
                                item-value="constraints"
                                label="掃描裝置"
                                variant="outlined"
                            >
                            </v-select>
                            <v-select
                                v-model="trackFunctionSelected"
                                :items="trackFunctionOptions"
                                item-title="text"
                                item-value="value"
                                label="掃描樣式"
                                variant="outlined"
                            >
                            </v-select>
                            <v-select
                                v-model="selectedBarcodeFormats"
                                chips
                                label="條碼格式"
                                variant="outlined"
                                :items="barcodeFormats"
                                item-title="name"
                                multiple
                            ></v-select>
                        </v-sheet>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import api from "@/plugins/axios";
import Swal from "@/plugins/sweetalert2";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const { user, addChatRecord } = userStore;

/*** detection handling ***/

const result = ref("");
let ticket = reactive(null);

async function onDetect(detectedCodes) {
    result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue));
    if (await checkQrCode()) {
        Swal.fire({
            title: "Check in 成功!",
            icon: "success",
        });
    } else {
        Swal.fire({
            title: "無效的票券",
            icon: "error",
        });
    }
}

/*** select camera ***/

const selectedConstraints = ref({ facingMode: "environment" });
const defaultConstraintOptions = [
    { label: "rear camera", constraints: { facingMode: "environment" } },
    { label: "front camera", constraints: { facingMode: "user" } },
];
const constraintOptions = ref(defaultConstraintOptions);

async function onCameraReady() {
    // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
    // camera access permission. `QrcodeStream` internally takes care of
    // requesting the permissions. The `camera-on` event should guarantee that this
    // has happened.
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

    constraintOptions.value = [
        ...defaultConstraintOptions,
        ...videoDevices.map(({ deviceId, label }) => ({
            label: `${label} (ID: ${deviceId})`,
            constraints: { deviceId },
        })),
    ];

    error.value = "";
}

/*** track functons ***/
function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
    }
}

function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height },
        } = detectedCode;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#007bff";
        ctx.strokeRect(x, y, width, height);
    }
}

function paintCenterText(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode;

        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width);

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#35495e";
        ctx.strokeText(detectedCode.rawValue, centerX, centerY);

        ctx.fillStyle = "#5cb984";
        ctx.fillText(rawValue, centerX, centerY);
    }
}
const trackFunctionOptions = [
    { text: "nothing (default)", value: { name: "nothing", fn: function () {} } },
    { text: "outline", value: { name: "outline", fn: paintOutline } },
    { text: "centered text", value: { name: "centered", fn: paintCenterText } },
    { text: "bounding box", value: { name: "bounding", fn: paintBoundingBox } },
];
const trackFunctionSelected = ref(trackFunctionOptions[1]);

/*** barcode formats ***/
const barcodeFormats = ref([
    { name: "qr_code", selected: true },
    { name: "aztec", selected: false },
    { name: "code_128", selected: false },
    { name: "code_39", selected: false },
    { name: "code_93", selected: false },
    { name: "codabar", selected: false },
    { name: "databar", selected: false },
    { name: "databar_expanded", selected: false },
    { name: "data_matrix", selected: false },
    { name: "dx_film_edge", selected: false },
    { name: "ean_13", selected: false },
    { name: "ean_8", selected: false },
    { name: "itf", selected: false },
    { name: "maxi_code", selected: false },
    { name: "micro_qr_code", selected: false },
    { name: "pdf417", selected: false },
    { name: "rm_qr_code", selected: false },
    { name: "upc_a", selected: false },
    { name: "upc_e", selected: false },
    { name: "linear_codes", selected: false },
    { name: "matrix_codes", selected: false },
]);

const selectedBarcodeFormats = ref(["qr_code"]);

// const updateSelectedFormats = (selectedItems) => {
//     barcodeFormats.value.forEach((format) => {
//         format.selected = selectedItems.includes(format.name);
//     });
// };

/*** error handling ***/

const error = ref("");

function onError(err) {
    error.value = `[${err.name}]: `;

    if (err.name === "NotAllowedError") {
        error.value += "you need to grant camera access permission";
    } else if (err.name === "NotFoundError") {
        error.value += "no camera on this device";
    } else if (err.name === "NotSupportedError") {
        error.value += "secure context required (HTTPS, localhost)";
    } else if (err.name === "NotReadableError") {
        error.value += "is the camera already in use?";
    } else if (err.name === "OverconstrainedError") {
        error.value += "installed cameras are not suitable";
    } else if (err.name === "StreamApiNotSupportedError") {
        error.value += "Stream API is not supported in this browser";
    } else if (err.name === "InsecureContextError") {
        error.value +=
            "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
    } else {
        error.value += err.message;
    }
}

async function checkQrCode() {
    try {
        const response = await api({
            method: "get",
            url: `/ticket/${JSON.parse(result.value)[0]}`,
        });

        ticket = response.data;

        if (new Date(ticket.endedAt) < new Date() || new Date(ticket.startedAt) > new Date()) {
            return false;
        }

        await usedTicket();

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function usedTicket() {
    try {
        await api({
            method: "put",
            url: `/ticket/${JSON.parse(result.value)[0]}`,
            data: {
                used: true,
            },
        });

        await addChatRecord({
            chat: `感謝您的入住，幫我評價一下吧！<br><a href="/house/${ticket.house.id}" target="_blank">點擊這裡評價</a>`,
            senderId: ticket.house.userId,
            receiverId: user.id,
        });
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped>
.error {
    font-weight: bold;
    color: red;
}
.barcode-format-checkbox {
    margin-right: 10px;
    white-space: nowrap;
    display: inline-block;
}
</style>
