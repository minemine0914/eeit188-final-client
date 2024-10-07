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
                    >RESET PASSWORD</v-sheet
                >
            </v-sheet>
        </v-card-item>
        <v-card-item class="px-7 pb-7 pt-4">
            <v-sheet class="d-flex flex-column ga-3 pt-3">
                <v-text-field
                    v-model="state.newPassword"
                    :error-messages="v$.newPassword.$errors.map((e) => e.$message)"
                    label="新密碼"
                    variant="outlined"
                    type="password"
                    required
                    @blur="v$.newPassword.$touch"
                    @input="v$.newPassword.$touch"
                ></v-text-field>
                <v-text-field
                    v-model="state.checkNewPassword"
                    :error-messages="v$.checkNewPassword.$errors.map((e) => e.$message)"
                    label="再次輸入新密碼"
                    variant="outlined"
                    type="password"
                    required
                    @blur="v$.checkNewPassword.$touch"
                    @input="v$.checkNewPassword.$touch"
                    @keydown.enter.prevent="submit"
                ></v-text-field>
                <v-btn @click="submit" color="brown-lighten-4" size="large" flat>重設密碼</v-btn>
            </v-sheet>
        </v-card-item>
    </v-card>
</template>

<script setup>
import NomadSvg from "@/assets/nomad.svg?component";
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { useUserStore } from "../../stores/userStore";
import Swal from "@/plugins/sweetalert2";

// Custom password validation
const passwordComplexity = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/);

const newPassword = computed(() => state.newPassword);

const initialState = {
    newPassword: null,
    checkNewPassword: null,
};

const state = reactive({
    ...initialState,
});

const rules = {
    newPassword: {
        required: helpers.withMessage("請輸入新密碼", required),
        passwordComplexity: helpers.withMessage(
            "密碼必須包含8到16位英文大小寫、數字及特殊符號",
            passwordComplexity
        ),
    },
    checkNewPassword: {
        required: helpers.withMessage("請再次輸入新密碼", required),
        sameAsPassword: helpers.withMessage("密碼不一致", sameAs(newPassword)),
    },
};

const v$ = useVuelidate(rules, state);
const userStore = useUserStore();
const { resetPasswordFromEmailLink, adminRemovePasswordResetToken } = userStore;

const submit = async () => {
    const isValid = await v$.value.$validate();

    if (!isValid) {
        return;
    }

    try {
        await resetPasswordFromEmailLink({
            newPassword: state.newPassword,
        });

        Swal.fire({
            title: "密碼修改成功！請登入",
            icon: "success",
        });

        adminRemovePasswordResetToken();
        clear();
    } catch (error) {
        Swal.fire({
            title: "密碼修改失敗，請重新嘗試",
            icon: "error",
        });
        console.log(error);
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
