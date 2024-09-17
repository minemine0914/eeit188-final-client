<template>
  <form>
    <v-text-field
      v-model="state.oldPassword"
      :error-messages="v$.oldPassword.$errors.map((e) => e.$message)"
      label="舊密碼"
      type="password"
      required
      @blur="v$.oldPassword.$touch"
      @input="v$.oldPassword.$touch"
    ></v-text-field>
    <v-text-field
      v-model="state.newPassword"
      :error-messages="v$.newPassword.$errors.map((e) => e.$message)"
      label="新密碼"
      type="password"
      required
      @blur="v$.newPassword.$touch"
      @input="v$.newPassword.$touch"
    ></v-text-field>
    <v-text-field
      v-model="state.checkNewPassword"
      :error-messages="v$.checkNewPassword.$errors.map((e) => e.$message)"
      label="再次輸入新密碼"
      type="password"
      required
      @blur="v$.checkNewPassword.$touch"
      @input="v$.checkNewPassword.$touch"
    ></v-text-field>
    <v-btn class="me-4" @click="submit"> 重設密碼 </v-btn>
  </form>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

// Custom password validation
const passwordComplexity = helpers.regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/
);

const newPassword = computed(() => state.newPassword);

const initialState = {
  oldPassword: null,
  newPassword: null,
  checkNewPassword: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  oldPassword: {
    required: helpers.withMessage("請輸入舊密碼", required),
  },
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
const { loginAuth } = userStore;
const router = useRouter();

const submit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    return;
  }
  clear();
};

function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}
</script>

<style scoped>
form {
  width: 300px;
}
</style>
