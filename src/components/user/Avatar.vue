<template>
  <div class="avatar">
    <v-avatar color="surface-variant" size="150">
      <v-img :src="user?.avatarBase64" cover></v-img>
    </v-avatar>
    <h2>{{ user?.name }}</h2>
    <v-btn id="updateAvatar" width="50" @click="uploadImage">上傳照片</v-btn>
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { decodeToken, findUserById } = userStore;

const userInfo = ref(null);
const fileInput = ref(null);
const user = ref(null);

onMounted(async () => {
  userInfo.value = decodeToken();
  user.value = await findUserById();
});

// Function to handle file input change and convert image to Base64
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      sendImageToServer(base64Image);
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
};

// Function to trigger the file input dialog
const uploadImage = () => {
  fileInput.value.click();
};

// Function to send the image to the server in JSON format
const sendImageToServer = async (base64Image) => {
  const payload = {
    avatarBase64: base64Image,
  };

  try {
    const response = await api.put(
      `/user/upload-avatar/${userInfo.value.id}`,
      payload
    );
    console.log("Image uploaded successfully:", response.data);
    // Update the avatar with the new image (Base64)
    user.value = await findUserById();
    await findUserById();
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
</script>

<style scoped>
.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#updateAvatar {
  margin-top: 15px;
}
</style>
