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
    <v-btn class="me-4" @click="submit"> 登入 </v-btn>
  </form>
</template>
<script setup>
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
} from "@vuelidate/validators";
import { VDateInput } from "vuetify/labs/VDateInput";

const initialState = {
  email: null,
  password: null,
};

const state = reactive({
  ...initialState,
});

// Create a computed property for the password
const password = computed(() => state.password);

const rules = {
  email: {
    required: helpers.withMessage("請輸入Email", required),
  },
  password: {
    required: helpers.withMessage("請輸入密碼", required),
  },
};

const v$ = useVuelidate(rules, state);
import { useUserViewStore } from "@/stores/userViewStore";
const userViewStore = useUserViewStore();
const { jwtToken, loginAuth } = userViewStore;

const submit = async () => {
  if (v$.$invalid) {
    return;
  }
  try {
    await loginAuth({
      email: state.email,
      password: state.password,
    });
    alert("登入成功");
  } catch (error) {
    alert("登入失敗，請確認email及密碼");
    console.error("Login failed:", error);
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
