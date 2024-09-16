<template>
  <div class="background-image">
    <v-img
      class="bg-grey-lighten-2"
      max-height="300"
      :src="backgroundImageUrl"
      cover
    ></v-img>
    <div class="file-input-container">
      <v-btn id="upload-background-image" width="50" @click="uploadImage"
        >上傳照片</v-btn
      >
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        :rules="rules"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";

// Default avatar image if no image is uploaded
const defaultBackgroundImage =
  "https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/b/AmazonStores/ATVPDKIKX0DER/10ed123c3324f0651a87521b62fc4fcc.w3000.h600._CR0%2C0%2C3000%2C600_SX1500_.jpg";

const userStore = useUserStore();
const { user, uploadBackgroundImage, downloadBackgroundImage } = userStore;

const fileInput = ref(null);
const backgroundImageUrl = ref(defaultBackgroundImage);
const selectedFile = ref(null);

const rules = [
  (value) => {
    return (
      !value ||
      !value.length ||
      value[0].size < 2000000 ||
      "Avatar size should be less than 2 MB!"
    );
  },
];

onMounted(async () => {
  if (user) {
    try {
      const response = await downloadBackgroundImage();
      const url = window.URL.createObjectURL(response);
      backgroundImageUrl.value = url;
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  }
});

const uploadImage = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    backgroundImageUrl.value = URL.createObjectURL(file);

    try {
      await uploadBackgroundImage(file);

      // Reload background image
      const response = await downloadBackgroundImage(user.id);
      const url = window.URL.createObjectURL(response);
      backgroundImageUrl.value = url;
    } catch (error) {
      console.error("Error uploading background image:", error);
    }
  } else {
    console.log("file does not exist");
  }
};
</script>

<style scoped>
.file-input-container {
  position: absolute;
  right: 20px;
  margin-top: -70px;
}

#upload-background-image {
  margin-top: 15px;
}
</style>
