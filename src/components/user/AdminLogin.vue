<template>
  <form>
    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      label="E-mail"
      required
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.password"
      :error-messages="v$.password.$errors.map((e) => e.$message)"
      label="密碼"
      type="password"
      required
      @blur="v$.password.$touch"
      @input="v$.password.$touch"
    ></v-text-field>
    <v-btn class="me-4" @click="forgotPassword"> 忘記密碼 </v-btn>
    <v-btn class="me-4" @click="submit"> 登入 </v-btn>
  </form>
</template>
<script setup>
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
