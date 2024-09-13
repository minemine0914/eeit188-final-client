<template>
  <div class="container">
    <v-card
      class="title"
      color="blue-grey-darken-4"
      title="聊天室"
      width="500"
    ></v-card>
    <v-card
      class="mx-auto"
      color="blue-grey-lighten-4"
      id="chat-box"
      width="500"
    >
      <div
        v-for="chat in chatRecord.chatRecords"
        :key="chat.id"
        class="chat-box-inner"
      >
        <v-card v-if="chat.senderId === me.id" class="chat" id="me">
          <v-card-text class="bg-surface-light pt-4" width="300">
            {{ chat.chat }}
          </v-card-text>
          <div class="member">
            <v-avatar class="avatar" color="surface-variant" size="50">
              <v-img :src="me?.avatarBase64" cover></v-img>
            </v-avatar>
            {{ me.name }}
            <v-btn color="red-darken-4">收回</v-btn>
          </div>
        </v-card>
        <v-card v-if="chat.senderId === other.id" class="chat" id="other">
          <div class="member">
            <v-avatar class="avatar" color="surface-variant" size="50">
              <v-img :src="other?.avatarBase64" cover></v-img>
            </v-avatar>
            {{ other.name }}
            <v-btn color="red-darken-4">收回</v-btn>
          </div>
          <v-card-text class="bg-surface-light pt-4" width="300">
            {{ chat.chat }}
          </v-card-text>
        </v-card>
      </div>
    </v-card>
    <form id="input">
      <v-text-field
        v-model="state.message"
        required
        @blur="v$.message.$touch"
        @input="v$.message.$touch"
        width="300"
      ></v-text-field>
      <v-btn id="submit-btn" class="me-4" @click="submit"> 送出 </v-btn>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "@/stores/userStore";
import api from "@/plugins/axios";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const userStore = useUserStore();
const { getChatRecord, findUserById, decodeToken } = userStore;

const userInfo = ref(null);
const me = ref(null);
const other = ref(null);
const chatRecord = ref([]);

const initialState = {
  message: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  message: {
    required: helpers.withMessage("", required),
  },
};

onMounted(async () => {
  userInfo.value = decodeToken();
  chatRecord.value = await getChatRecord(userInfo.value.id);
  me.value = await findUserById();
  other.value = await getOther();
});

async function getOther() {
  try {
    const otherId = checkOther();
    const response = await api({
      method: "get",
      url: `/user/${otherId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function checkOther() {
  if (chatRecord.value.chatRecords[0].senderId === me.value.id) {
    return chatRecord.value.chatRecords[0].receiverId;
  }

  return chatRecord.value.chatRecords[0].senderId;
}

async function submit() {}

const v$ = useVuelidate(rules, state);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
}

.avatar {
  margin: 10px;
}

#chat-box {
  max-height: 500px;
  overflow-y: auto;
}

.chat {
  width: 70%;
  display: flex;
  margin: 30px;
}

.member {
  display: flex;
  flex-direction: column;
  text-align: center;
}

#me {
  float: right;
}

#other {
  float: left;
}

#input {
  margin-top: 30px;
  display: flex;
}

#submit-btn {
  margin-left: 10px;
  height: 55px;
}
</style>
