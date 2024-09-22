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
    <v-btn class="me-4" @click="submit"> 發送重設密碼連結到您的email </v-btn>
  </form>
</template>
<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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
