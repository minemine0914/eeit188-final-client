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
                    >FORGOT PASSWORD</v-sheet
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
                <v-btn @click="submit" size="large" color="brown-lighten-1" flat> 重設密碼</v-btn>
                <div class="text-center mt-2">將發送連結至您註冊的信箱</div>
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
import { useRouter } from "vue-router";
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
};

const v$ = useVuelidate(rules, state);
const userStore = useUserStore();
const { forgotPassword } = userStore;
const router = useRouter();

const submit = async () => {
    if (v$.$invalid) {
        return;
    }
    try {
        await forgotPassword({
            email: state.email,
        });
        Swal.fire({
            title: "連結已寄送成功，請確認您的email，並在三分鐘內設定新密碼",
            icon: "success",
        });
    } catch (error) {
        Swal.fire({
            title: "寄送失敗，請確認email是否正確",
            icon: "error",
        });
        console.error("Login failed:", error);
    } finally {
        clear();
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
