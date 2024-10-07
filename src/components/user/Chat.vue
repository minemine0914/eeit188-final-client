<template>
  <div class="container">
    <div class="list-container">
      <v-card class="mx-auto" color="#263238" width="300">
        <v-card-title>聊天紀錄</v-card-title>
        <v-list class="chat-recored">
          <v-list-item
            :class="{ 'selected-item': selectedItemId === item.senderId }"
            v-for="item in itemSet?.items"
            :key="item.id"
            @click="handleClick(item)"
          >
            <div class="chat-recored-part">
              <div class="chat-recored-title">
                <v-avatar class="avatar" size="50">
                  <v-img
                    v-if="!item?.avatar || item?.avatar === null"
                    :src="defaultAvatar"
                    width="50px"
                    alt=""
                  ></v-img>
                  <v-img
                    v-if="item?.avatar"
                    :src="item?.avatar"
                    width="50px"
                    alt=""
                  ></v-img>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item?.title }}</v-list-item-title>
                </v-list-item-content>
              </div>
              <div class="chat-recored-text">
                <v-list-item-content class="chat-recored-content">
                  <v-list-item-content
                    id="item-subtitle-1"
                    v-html="item?.subtitle"
                  >
                  </v-list-item-content>
                </v-list-item-content>
                <v-list-item-content class="chat-recored-content">
                  <v-list-item-content id="item-subtitle-2">{{
                    formatDate(item?.createdAt)
                  }}</v-list-item-content>
                </v-list-item-content>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div class="chat-container">
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
          :key="chat?.id"
          class="chat-box-inner"
        >
          <v-card
            v-if="chat?.senderId === me?.id && chat?.receiverId === other?.id"
            class="chat"
            color="surface-variant"
            id="me"
          >
            <div class="chat-content-1">
              <v-card-text id="text" width="300" v-html="chat?.chat">
              </v-card-text>
              <v-card-text width="300">
                {{ formatDate(chat?.createdAt) }}
              </v-card-text>
            </div>
            <div class="member">
              <v-avatar class="avatar" size="50">
                <v-img
                  v-if="!chat?.senderAvatar || chat?.senderAvatar === null"
                  :src="defaultAvatar"
                  width="50px"
                  alt=""
                ></v-img>
                <v-img
                  v-if="chat?.senderAvatar"
                  :src="me?.avatarBase64"
                  cover
                ></v-img>
              </v-avatar>
              {{ me?.name }}
              <v-btn color="red-darken-4" @click="handleRetract(chat?.id)"
                >收回</v-btn
              >
            </div>
          </v-card>
          <v-card
            v-if="chat?.senderId === other?.id && chat?.receiverId === me?.id"
            class="chat"
            id="other"
          >
            <div class="member">
              <v-avatar class="avatar" color="surface-light" size="50">
                <v-img
                  v-if="!chat?.senderAvatar || chat?.senderAvatar === null"
                  :src="defaultAvatar"
                  width="50px"
                  alt=""
                ></v-img>
                <v-img
                  v-if="chat?.senderAvatar"
                  :src="other?.avatarBase64"
                  cover
                ></v-img>
              </v-avatar>
              {{ other?.name }}
              <!-- <v-btn color="red-darken-4">收回</v-btn> -->
            </div>
            <div class="chat-content-2">
              <v-card-text id="text" width="300" v-html="chat?.chat">
              </v-card-text>
              <v-card-text width="300">
                {{ formatDate(chat?.createdAt) }}
              </v-card-text>
            </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "@/plugins/sweetalert2";
import defaultAvatar from "@/assets/user.png";

const userStore = useUserStore();
const { user, getChatRecord, addChatRecord } = userStore;

const me = reactive({});
const other = reactive({});
const index = ref(0);
const itemsMap = reactive({
  map: new Map(),
});
const selectedItemId = ref(null);
const socket = ref(null);

const chatRecord = reactive({
  chatRecords: [],
});

const itemSet = reactive({
  items: [],
});

const initialState = {
  message: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  message: {
    required: required,
  },
};

onMounted(async () => {
  chatRecord.chatRecords = await getChatRecord();
  Object.assign(me, user);
  Object.assign(other, await getOther());
  getChatList();

  if (itemSet?.items.length !== 0) {
    selectedItemId.value = itemSet?.items[0]?.senderId || null;
  }

  // Connect to WebSocket
  socket.value = new WebSocket(import.meta.env.VITE_WS_URL);

  socket.value.onopen = () => {
    console.log("WebSocket connection established");

    // 註冊用戶 ID 到伺服器
    socket.value.send(
      JSON.stringify({
        type: "register",
        userId: me.id,
      })
    );
  };

  socket.value.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    handleIncomingMessage(message);
  };

  let retryCount = 0;
  const maxRetries = 5;

  socket.value.onclose = () => {
    if (retryCount < maxRetries) {
      console.log("WebSocket connection closed, attempting to reconnect...");
      setTimeout(() => {
        socket.value = new WebSocket(import.meta.env.VITE_WS_URL);
        retryCount++;
      }, 5000);
    } else {
      console.error("Max retries reached. Could not reconnect to WebSocket.");
    }
  };

  socket.value.onerror = (error) => {
    console.log("WebSocket error:", error);
  };
});

function handleIncomingMessage(message) {
  console.log("message comming");
  if (message.type === "recall") {
    removeMessageById(message.id);
  } else if (message.chat && message.chat !== "" && message.chat !== null) {
    chatRecord.chatRecords.unshift(message);
    getChatList();
  }
}

// 移除消息
function removeMessageById(messageId) {
  for (let i = 0; i < chatRecord.chatRecords.length; i++) {
    if (chatRecord.chatRecords[i].id === messageId) {
      chatRecord.chatRecords.splice(i, 1);
      break;
    }
  }
}

async function getOther() {
  try {
    const otherId = checkOther(index.value);
    const response = await api({
      method: "get",
      url: `/user/find/${otherId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function checkOther(index) {
  if (chatRecord.chatRecords[index].senderId === me.id) {
    return chatRecord.chatRecords[index].receiverId;
  }

  return chatRecord.chatRecords[index].senderId;
}

const v$ = useVuelidate(rules, state);

const submit = async () => {
  if (v$.$invalid) {
    return;
  }

  const messageData = {
    type: "private_message",
    chat: state.message,
    senderId: me.id,
    sender: me.name,
    receiverId: other.id,
    senderAvatar: me.avatarBase64,
    createdAt: new Date(),
  };

  // Send message through WebSocket
  socket.value.send(JSON.stringify(messageData));

  handleIncomingMessage(messageData);

  const persistData = {
    chat: state.message,
    senderId: me.id,
    receiverId: other.id,
  };

  await addChatRecord(persistData);

  state.message = null;
};

function getChatList() {
  itemSet.items = [];
  itemsMap.map.clear();

  let chat;

  for (let i = chatRecord.chatRecords.length - 1; i >= 0; i--) {
    chat = chatRecord.chatRecords[i];
    if (chat.receiverId === me.id) {
      const newItem = {
        id: chat.id,
        avatar: chat.senderAvatar,
        senderId: chat.senderId,
        title: chat.sender,
        subtitle: chat.chat,
        createdAt: chat.createdAt,
      };

      itemsMap.map.set(chat.senderId, newItem);
    }
  }

  itemSet.items = Array.from(itemsMap.map.values());

  // Sort items by createdAt in descending order (newest first)
  itemSet.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

const handleClick = async (item) => {
  index.value = findIndexById(chatRecord.chatRecords, item.senderId);
  Object.assign(other, await getOther());
  selectedItemId.value = item.senderId;
};

const findIndexById = (array, id) => {
  return array.findIndex((item) => item.senderId === id);
};

// Date formatting function
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("zh-TW", options).format(new Date(dateString));
};

const handleRetract = async (chatId) => {
  Swal.fire({
    title: "請確認是否要收回此訊息?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        const retractData = {
          type: "recall",
          id: chatId,
          receiverId: other.id,
        };

        socket.value.send(JSON.stringify(retractData));

        api({
          method: "put",
          url: `/chat-record/retract/${chatId}`,
        });

        handleIncomingMessage(retractData);

        Swal.fire({
          title: "訊息已收回！",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "訊息收回失敗，請重新操作一次！",
          icon: "error",
        });
        console.log(error);
      }
    }
  });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.list-container {
  margin-right: 30px;
}

.chat-recored {
  height: 500px;
  max-height: 500px;
  overflow: auto;
}

.chat-recored-text {
  display: flex;
  flex-direction: column;
}

.chat-recored-part {
  display: flex;
  align-items: center;
}

.chat-recored-title {
  margin-right: 50px;
}

#item-subtitle-1 {
  font-size: 15px;
}

#item-subtitle-2 {
  font-size: 10px;
}

.chat-content-1 {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  width: 100%;
}

.chat-content-2 {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#text {
  font-size: 25px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  margin: 10px;
}

#chat-box {
  display: flex;
  flex-direction: column-reverse;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
}

.chat-box-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.chat {
  width: 70%;
  display: flex;
  margin: 10px;
}

.member {
  display: flex;
  flex-direction: column;
  text-align: center;
}

#me {
  align-self: flex-end;
}

#other {
  align-self: flex-start;
}

#input {
  margin-top: 30px;
  display: flex;
}

#submit-btn {
  margin-left: 10px;
  height: 55px;
}

.selected-item {
  background-color: #b0bec5;
}
</style>
