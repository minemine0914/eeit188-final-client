<template>
  <div class="container">
    <div class="list-container">
      <v-card class="mx-auto" width="300">
        <v-card
          class="title"
          color="blue-grey-lighten-4"
          title="聊天紀錄"
          width="500"
        ></v-card>
        <v-list class="chat-recored">
          <v-list-item
            v-for="item in itemSet.items"
            :key="item.id"
            @click="handleClick(item)"
          >
            <div class="chat-recored-part">
              <div class="chat-recored-title">
                <v-list-item-avatar>
                  <v-img :src="item.avatar" width="50px" alt=""></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </div>
              <v-list-item-content class="chat-recored-content">
                <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
            </div>
            <v-divider :thickness="5"></v-divider>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div class="chat-container" @scroll="handleScroll">
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
            id="me"
          >
            <div class="chat-content">
              <v-card-text class="bg-surface-light pt-4" id="text" width="300">
                {{ chat?.chat }}
              </v-card-text>
              <v-card-text class="bg-surface-light pt-4" width="300">
                {{ chat?.createdAt }}
              </v-card-text>
            </div>
            <div class="member">
              <v-avatar class="avatar" color="surface-variant" size="50">
                <v-img :src="me?.avatarBase64" cover></v-img>
              </v-avatar>
              {{ me?.name }}
              <!-- <v-btn color="red-darken-4">收回</v-btn> -->
            </div>
          </v-card>
          <v-card
            v-if="chat?.senderId === other?.id && chat?.receiverId === me?.id"
            class="chat"
            id="other"
          >
            <div class="member">
              <v-avatar class="avatar" color="surface-variant" size="50">
                <v-img :src="other?.avatarBase64" cover></v-img>
              </v-avatar>
              {{ other?.name }}
              <!-- <v-btn color="red-darken-4">收回</v-btn> -->
            </div>
            <div class="chat-content">
              <v-card-text class="bg-surface-light pt-4" id="text" width="300">
                {{ chat?.chat }}
              </v-card-text>
              <v-card-text class="bg-surface-light pt-4" width="300">
                {{ chat?.createdAt }}
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

const userStore = useUserStore();
const { user, getChatRecord, addChatRecord } = userStore;

const me = ref(null);
const other = ref(null);
const index = ref(0);
const itemsMap = ref(new Map());
const page = ref(0);

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

const socket = ref(null);

onMounted(async () => {
  chatRecord.chatRecords = await getChatRecord(user.id);
  me.value = user;
  other.value = await getOther();
  getChatList();

  // Connect to WebSocket
  socket.value = new WebSocket("ws://localhost:8081");

  socket.value.onmessage = async (event) => {
    if (event.data instanceof Blob) {
      const textData = await event.data.text();
      try {
        const parsedData = JSON.parse(textData);
        handleIncomingMessage(parsedData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      try {
        const parsedData = JSON.parse(event.data);
        handleIncomingMessage(parsedData);
        console.log(parsedData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  };

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };
});

function handleIncomingMessage(message) {
  if (message.chat != "" && message.chat != null) {
    chatRecord.chatRecords.unshift(message);
    getChatList();
  }
}

async function getOther() {
  try {
    const otherId = checkOther(index.value);
    const response = await api({
      method: "get",
      url: `/user/${otherId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function checkOther(index) {
  if (chatRecord.chatRecords[index].senderId === me.value.id) {
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
    chat: state.message,
    senderId: me.value.id,
    receiverId: other.value.id,
  };

  // Send message through WebSocket
  socket.value.send(JSON.stringify(messageData));

  handleIncomingMessage(messageData);

  await addChatRecord(messageData);

  state.message = null; // Clear input after sending
};

function getChatList() {
  itemSet.items = [];
  itemsMap.value.clear();

  for (let i = chatRecord.chatRecords.length - 1; i >= 0; i--) {
    const chat = chatRecord.chatRecords[i];
    if (chat.senderId !== me.value.id) {
      const newItem = {
        id: chat.id,
        avatar: chat.senderAvatar,
        title: chat.sender,
        subtitle: chat.chat,
        createdAt: chat.createdAt,
      };

      itemsMap.value.set(chat.senderId, newItem);
    }
  }

  itemSet.items = Array.from(itemsMap.value.values());
}

const handleClick = async (item) => {
  index.value = findIndexById(chatRecord.chatRecords, item.id);
  other.value = await getOther();
};

const findIndexById = (array, id) => {
  return array.findIndex((item) => item.id === id);
};

// function handleScroll(event) {
//   const container = event.target;
//   if (container.scrollTop === 0) {
//     loadMoreChats();
//   }
// }

// async function loadMoreChats() {
//   page.value += 1;
//   const newChatRecord = await getChatRecord(user.id, page.value);
//   chatRecord.value.push(newChatRecord);
//   getChatList();
// }
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
  height: 400px;
  max-height: 400px;
  overflow: auto;
}

.chat-recored-part {
  display: flex;
  align-items: center;
}

.chat-recored-title {
  margin-right: 50px;
}

.chat-content {
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
  height: 400px;
  max-height: 400px;
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
  margin: 30px;
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
</style>
