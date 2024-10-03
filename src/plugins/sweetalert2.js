import Swal from "sweetalert2";

const CustomSwal = Swal.mixin({
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    denyButtonText: "重試",
    customClass: {
        cancelButton: "v-btn v-btn--elevated v-theme--nomadTheme bg-blue-grey-lighten-1 v-btn--density-default v-btn--size-large v-btn--variant-elevated",
        confirmButton: "v-btn v-btn--elevated v-theme--nomadTheme bg-brown-lighten-1 v-btn--density-default v-btn--size-large v-btn--variant-elevated",
        denyButton: "v-btn v-btn--elevated v-theme--nomadTheme bg-red-lighten-1 v-btn--density-default v-btn--size-large v-btn--variant-elevated",
    },
});

export default CustomSwal;
