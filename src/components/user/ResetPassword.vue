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
import Swal from "@/plugins/sweetalert2";

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
const { checkPassword, resetPassword } = userStore;

const submit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    return;
  }

  const checkResult = await checkPassword({
    oldPassword: state.oldPassword,
  });

  if (checkResult.data !== true) {
    Swal.fire({
      title: "您輸入的舊密碼不存在或有錯誤，請重新輸入",
      icon: "error",
    });
    return;
  }

  Swal.fire({
    title: "確認使否要修改密碼?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        resetPassword({
          newPassword: state.newPassword,
        });
        Swal.fire({
          title: "修改成功!",
          icon: "success",
        });
        clear();
      } catch (error) {
        Swal.fire({
          title: "修改失敗，請重新修改",
          icon: "error",
        });
        console.error("Registration failed:", error);
        clear();
      }
    }
  });
};

function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}
</script>

<style scoped></style>
