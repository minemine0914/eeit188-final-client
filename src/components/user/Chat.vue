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
            v-for="item in items"
            :key="item.index"
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
            <v-card-text class="bg-surface-light pt-4" width="300">
              {{ chat?.chat }}
            </v-card-text>
            <div class="member">
              <v-avatar class="avatar" color="surface-variant" size="50">
                <v-img :src="me?.avatarBase64" cover></v-img>
              </v-avatar>
              {{ me?.name }}
              <v-btn color="red-darken-4">收回</v-btn>
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
              <v-btn color="red-darken-4">收回</v-btn>
            </div>
            <v-card-text class="bg-surface-light pt-4" width="300">
              {{ chat?.chat }}
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const userStore = useUserStore();
const { user, getChatRecord, addChatRecord } = userStore;

const me = ref(null);
const other = ref(null);
const chatRecord = ref([]);
const index = ref(0);
const items = ref([]);
const itemsMap = ref(new Map());
const page = ref(0);

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

let socket = ref(null);

onMounted(async () => {
  chatRecord.value = await getChatRecord(user.id);
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
        console.log(parsedData);
        // Now handle parsedData as usual
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      try {
        const parsedData = JSON.parse(event.data);
        handleIncomingMessage(parsedData);
        console.log(parsedData);
        // Handle parsedData as usual
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
  console.log("message comming!");
  chatRecord.value.chatRecords.push(message);
  getChatList();
}

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
  if (chatRecord.value.chatRecords[index.value].senderId === me.value.id) {
    return chatRecord.value.chatRecords[index.value].receiverId;
  }

  return chatRecord.value.chatRecords[index.value].senderId;
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

  chatRecord.value.chatRecords.push(messageData);

  await addChatRecord(messageData);

  state.message = null; // Clear input after sending
};

function getChatList() {
  let count = 0;

  chatRecord.value.chatRecords.forEach((chat) => {
    const key = chat.senderId !== me.value.id ? chat.senderId : chat.receiverId;

    if (!itemsMap.value.has(key)) {
      itemsMap.value.set(key, {
        index: count,
        avatar:
          chat.senderId !== me.value.id
            ? chat.senderAvatar
            : chat.receiverAvatar,
        title: chat.senderId !== me.value.id ? chat.sender : chat.receiver,
        subtitle: chat.chat,
      });

      items.value.push(itemsMap.value.get(key));
    }

    count++;
  });
}

const handleClick = async (item) => {
  index.value = item.index;
  other.value = await getOther();
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
