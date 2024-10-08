<template>
    <v-row no-gutters>
        <v-col cols="12" :md="mdAndDown ? 1 : 7" v-if="!mdAndDown">
            <v-sheet color="gray" class="h-100 position-relative">
                <video-background :src="signinVideo" class="h-100" ></video-background>
                <v-responsive :aspect-ratio="16 / 9" class="position-absolute top-0 left-0 w-100">
                    <v-sheet
                        class="w-100 h-100 d-flex flex-column justify-center align-center text-white opacity-70"
                        color="transparent"
                    >
                        <NomadSvg width="30%" />
                        <div style="font-family: 'Tenor Sans'" class="text-h3">NOMAD</div>
                    </v-sheet>
                </v-responsive>
            </v-sheet>
        </v-col>
        <v-col cols="12" md="12" lg="5">
            <v-card class="w-100" flat :rounded="false">
                <v-card-item class="px-7 pb-7 pt-4">
                    <v-sheet class="d-flex flex-column ga-3 pt-3" color="white">
                        <div
                            class="font-weight-black text-brown-darken-1 text-h5"
                            style="font-family: 'Tenor Sans'"
                        >
                            NOMAD 註冊 <span class="text-caption">FOR SYSTEM</span>
                        </div>
                        <v-divider class="border-opacity-50" color="brown-darken-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6"> </v-col>
                            <v-col cols="12" md="6"> </v-col>
                        </v-row>
                        <v-text-field
                            v-model="state.name"
                            :counter="10"
                            :error-messages="v$.name.$errors.map((e) => e.$message)"
                            label="用戶名稱"
                            variant="outlined"
                            required
                            @blur="v$.name.$touch"
                            @input="v$.name.$touch"
                        ></v-text-field>

                        <v-text-field
                            v-model="state.email"
                            :error-messages="v$.email.$errors.map((e) => e.$message)"
                            label="E-mail"
                            variant="outlined"
                            :counter="50"
                            required
                            @blur="v$.email.$touch"
                            @input="v$.email.$touch"
                        ></v-text-field>

                        <v-text-field
                            v-model="state.password"
                            :error-messages="v$.password.$errors.map((e) => e.$message)"
                            label="密碼"
                            variant="outlined"
                            type="password"
                            required
                            @blur="v$.password.$touch"
                            @input="v$.password.$touch"
                        ></v-text-field>

                        <v-text-field
                            v-model="state.confirmPassword"
                            :error-messages="v$.confirmPassword.$errors.map((e) => e.$message)"
                            label="密碼確認"
                            variant="outlined"
                            type="password"
                            required
                            @blur="v$.confirmPassword.$touch"
                            @input="v$.confirmPassword.$touch"
                        ></v-text-field>

                        <v-select
                            v-model="state.gender"
                            :error-messages="v$.gender.$errors.map((e) => e.$message)"
                            :items="items"
                            label="性別"
                            variant="outlined"
                            required
                            @blur="v$.gender.$touch"
                            @change="v$.gender.$touch"
                        ></v-select>

                        <v-date-input
                            v-model="state.birthday"
                            :error-messages="v$.birthday.$errors.map((e) => e.$message)"
                            label="請選擇出生日期"
                            variant="outlined"
                            required
                            prepend-icon=""
                            prepend-inner-icon="$calendar"
                            @blur="v$.birthday.$touch"
                            @input="v$.birthday.$touch"
                        />

                        <v-text-field
                            v-model="state.mobilePhone"
                            :counter="10"
                            :error-messages="v$.mobilePhone.$errors.map((e) => e.$message)"
                            label="手機號碼"
                            variant="outlined"
                            required
                            @blur="v$.mobilePhone.$touch"
                            @input="v$.mobilePhone.$touch"
                        ></v-text-field>

                        <v-text-field
                            v-model="state.phone"
                            :counter="10"
                            :error-messages="v$.phone.$errors.map((e) => e.$message)"
                            label="市話(選填)"
                            variant="outlined"
                            @blur="v$.phone.$touch"
                            @input="v$.phone.$touch"
                        ></v-text-field>

                        <v-text-field
                            v-model="state.address"
                            :counter="50"
                            :error-messages="v$.address.$errors.map((e) => e.$message)"
                            label="地址(選填)"
                            variant="outlined"
                            @blur="v$.address.$touch"
                            @input="v$.address.$touch"
                        ></v-text-field>

                        <v-textarea
                            clear-icon="mdi-close-circle"
                            label="個人簡介(選填)"
                            variant="outlined"
                            v-model="state.about"
                            clearable
                            :counter="150"
                            :error-messages="v$.about.$errors.map((e) => e.$message)"
                            @blur="v$.about.$touch"
                            @input="v$.about.$touch"
                        ></v-textarea>

                        <v-btn @click="submit" color="brown-lighten-1" size="large" flat>
                            註冊
                        </v-btn>
                        <v-btn @click="clear" color="brown-lighten-4" size="large" flat>
                            清除
                        </v-btn>
                    </v-sheet>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup>
import VideoBackground from "vue-responsive-video-background-player";
import signinVideo from "@/assets/video01.mp4";
import signinImage from "@/assets/banner01.webp";
import NomadSvg from "@/assets/nomad.svg?component";
import { useDisplay } from "vuetify";
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
    email,
    required,
    integer,
    minLength,
    maxLength,
    helpers,
    sameAs,
    maxValue,
} from "@vuelidate/validators";
import { VDateInput } from "vuetify/labs/VDateInput";
import { useRouter } from "vue-router";
import Swal from "@/plugins/sweetalert2";
const { mdAndDown } = useDisplay();
const router = useRouter();

// Custom password validation
const passwordComplexity = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/);

const initialState = {
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
    birthday: null,
    gender: null,
    phone: null,
    mobilePhone: null,
    address: null,
    about: null,
};

const state = reactive({
    ...initialState,
});

// Create a computed property for the password
const password = computed(() => state.password);

const items = ["暫不提供", "男性", "女性", "其他"];

const rules = {
    name: {
        required: helpers.withMessage("請輸入用戶名稱", required),
        maxLength: helpers.withMessage("用戶名稱不能超過10個字元", maxLength(10)),
    },
    email: {
        required: helpers.withMessage("請輸入Email", required),
        email: helpers.withMessage("請輸入有效的Email地址", email),
        maxLength: helpers.withMessage("Email不能超過50個字元", maxLength(50)),
    },
    password: {
        required: helpers.withMessage("請輸入密碼", required),
        passwordComplexity: helpers.withMessage(
            "密碼必須包含8到16位英文大小寫、數字及特殊符號",
            passwordComplexity
        ),
    },
    confirmPassword: {
        required: helpers.withMessage("請再次輸入密碼", required),
        sameAsPassword: helpers.withMessage("密碼不一致", sameAs(password)),
    },
    gender: {
        required: helpers.withMessage("請選擇性別", required),
    },
    birthday: {
        required: helpers.withMessage("請選擇出生日期", required),
        maxValue: helpers.withMessage("請選擇合理的出生日期", maxValue(new Date())),
    },
    phone: {
        integer: helpers.withMessage("市話必須為數字", integer),
        maxLength: helpers.withMessage("市話不能超過10個字元", maxLength(10)),
    },
    mobilePhone: {
        required: helpers.withMessage("請輸入手機號碼", required),
        integer: helpers.withMessage("手機號碼必須為數字", integer),
        minLength: helpers.withMessage("手機號碼必須為10位數", minLength(10)),
        maxLength: helpers.withMessage("手機號碼必須為10位數", maxLength(10)),
    },
    address: {
        maxLength: helpers.withMessage("地址不能超過30個字元", maxLength(30)),
    },
    about: {
        maxLength: helpers.withMessage("個人簡介不能超過150個字元", maxLength(150)),
    },
};

const v$ = useVuelidate(rules, state);

import { useUserStore } from "../../stores/userStore";
const userStore = useUserStore();
const { register } = userStore;

const submit = async () => {
    const isValid = await v$.value.$validate();

    if (!isValid) {
        return;
    }

    try {
        await register({
            name: state.name,
            role: "admin",
            email: state.email,
            password: state.password,
            birthday: state.birthday,
            gender: state.gender,
            phone: state.phone,
            mobilePhone: state.mobilePhone,
            address: state.address,
            about: state.about,
        });
        Swal.fire({
            title: "註冊成功！ 請登入",
            icon: "success",
        });
        router.push("/system/login");
    } catch (error) {
        Swal.fire({
            title: "此email已經註冊過，請使用其他email，或直接登入",
            icon: "warning",
        });
        console.error(error);
    }
};

function clear() {
    v$.value.$reset();

    for (const [key, value] of Object.entries(initialState)) {
        state[key] = value;
    }
}
</script>

<style scoped></style>
