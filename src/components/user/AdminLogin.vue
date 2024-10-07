<template>
    <v-card class="w-100">
        <v-card-item class="pb-0">
            <v-sheet
                color="transparent"
                class="d-flex flex-column justify-center align-center w-100 pt-5"
            >
                <v-sheet color="white" rounded="circle" elevation="0" width="100px" height="100px">
                    <NomadSvg class="text-brown-darken-1" />
                </v-sheet>
                <v-sheet
                    class="font-weight-black text-brown-darken-1 text-h4"
                    style="font-family: 'Tenor Sans'"
                    >NOMAD</v-sheet
                >
                <v-sheet
                    class="font-weight-black text-brown-darken-1 text-caption"
                    style="font-family: 'Tenor Sans'"
                    >SYSTEM MANAGEMENT</v-sheet
                >
            </v-sheet>
        </v-card-item>
        <v-card-item class="px-7 pb-7 pt-4">
            <v-sheet class="d-flex flex-column ga-3 pt-3">
                <v-text-field
                    v-model="state.email"
                    :error-messages="v$.email.$errors.map((e) => e.$message)"
                    label="E-mail"
                    variant="outlined"
                    required
                    @blur="v$.email.$touch"
                    @input="v$.email.$touch"
                    @keydown.enter.prevent="submit"
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
                    @keydown.enter.prevent="submit"
                ></v-text-field>
                <v-btn @click="submit" color="brown-lighten-1" size="large" flat>登入</v-btn>
                <v-btn @click="forgotPassword" color="brown-lighten-4" size="large" flat>忘記密碼</v-btn>
            </v-sheet>
        </v-card-item>
    </v-card>
</template>
<script setup>
import NomadSvg from "@/assets/nomad.svg?component";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useUserStore } from "../../stores/userStore";
import { useRouter, useRoute } from "vue-router";
import Swal from "@/plugins/sweetalert2";

const initialState = {
    email: null,
    password: null,
};

const state = reactive({
    ...initialState,
});

const rules = {
    email: {
        required: helpers.withMessage("請輸入Email", required),
    },
    password: {
        required: helpers.withMessage("請輸入密碼", required),
    },
};

const v$ = useVuelidate(rules, state);
const userStore = useUserStore();
const { adminLoginAuth } = userStore;
const router = useRouter();
const route = useRoute();

const submit = async () => {
    const isValid = await v$.value.$validate();

    if (!isValid) {
        return;
    }

    try {
        await adminLoginAuth({
            email: state.email,
            password: state.password,
        });
        Swal.fire({
            title: "登入成功!",
            icon: "success",
        });
        router.push(route.query.redirect || "/system/BookingManagement");
    } catch (error) {
        Swal.fire({
            title: "登入失敗，請確認email及密碼",
            icon: "error",
        });
        console.error("Login failed:", error);
    }
};

const forgotPassword = () => {
    router.push("/system/forgot-password");
};
</script>

<style scoped></style>
