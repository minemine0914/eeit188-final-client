<template>
  <form>
    <v-text-field
      v-model="state.name"
      :counter="10"
      :error-messages="v$.name.$errors.map((e) => e.$message)"
      label="用戶名稱"
      required
      @blur="v$.name.$touch"
      @input="v$.name.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      label="E-mail"
      :counter="50"
      required
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>

    <v-select
      v-model="state.gender"
      :error-messages="v$.gender.$errors.map((e) => e.$message)"
      :items="items"
      label="性別"
      required
      @blur="v$.gender.$touch"
      @change="v$.gender.$touch"
    ></v-select>

    <v-date-input
      v-model="state.birthday"
      :error-messages="v$.birthday.$errors.map((e) => e.$message)"
      label="請選擇出生日期"
      max-width="368"
      required
      @blur="v$.birthday.$touch"
      @input="v$.birthday.$touch"
    />

    <v-text-field
      v-model="state.mobilePhone"
      :counter="10"
      :error-messages="v$.mobilePhone.$errors.map((e) => e.$message)"
      label="手機號碼"
      required
      @blur="v$.mobilePhone.$touch"
      @input="v$.mobilePhone.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.phone"
      :counter="10"
      :error-messages="v$.phone.$errors.map((e) => e.$message)"
      label="市話(選填)"
      @blur="v$.phone.$touch"
      @input="v$.phone.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.address"
      :counter="50"
      :error-messages="v$.address.$errors.map((e) => e.$message)"
      label="地址(選填)"
      @blur="v$.address.$touch"
      @input="v$.address.$touch"
    ></v-text-field>

    <v-textarea
      clear-icon="mdi-close-circle"
      label="個人簡介(選填)"
      v-model="state.about"
      clearable
      :counter="150"
      :error-messages="v$.about.$errors.map((e) => e.$message)"
      @blur="v$.about.$touch"
      @input="v$.about.$touch"
    ></v-textarea>

    <v-btn id="submit" class="me-4" @click="submit"> 修改 </v-btn>
  </form>
</template>
<script setup>
import { reactive, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  required,
  integer,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import { VDateInput } from "vuetify/labs/VDateInput";
import { useUserStore } from "@/stores/userStore";
const emit = defineEmits(["userDetailChanged"]);

const userStore = useUserStore();
const { findUserById, updateUser, user } = userStore;

onMounted(async () => {
  if (user) {
    Object.assign(state, {
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      phone: user.phone,
      mobilePhone: user.mobilePhone,
      address: user.address,
      about: user.about,
    });
  }
});

// Custom password validation
const passwordComplexity = helpers.regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/
);

const initialState = {
  name: null,
  email: null,
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
  gender: {
    required: helpers.withMessage("請選擇性別", required),
  },
  birthday: {
    required: helpers.withMessage("請選擇出生日期", required),
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

const submit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    return;
  }
  try {
    await updateUser({
      name: state.name,
      email: state.email,
      birthday: state.birthday,
      gender: state.gender,
      phone: state.phone,
      mobilePhone: state.mobilePhone,
      address: state.address,
      about: state.about,
    });
    await findUserById();
    emit("userDetailChanged");
    alert("修改成功！");
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>

<style scoped></style>
