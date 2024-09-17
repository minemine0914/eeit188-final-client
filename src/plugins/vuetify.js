// Vuetify
import { createVuetify } from "vuetify";

// Vuetify components and directives
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

// Vuetify styles or scss
import "vuetify/styles";
// import '@/styles/main.scss'

// Icons
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";

// Translations provided by Vuetify
import { zhHant } from "vuetify/locale";

// Labs components
import { VDateInput } from "vuetify/labs/VDateInput";

const nomadTheme = {
    dark: false,
    colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        primary: "#1867C0",
        secondary: "#48A9A6",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
        "surface-bright": "#FFFFFF",
        "surface-light": "#EEEEEE",
        "surface-variant": "#424242",
        "on-surface-variant": "#EEEEEE",
        "primary-darken-1": "#1F5592",
        "secondary-darken-1": "#018786",
    },
    variables: {
        "border-color": "#000000",
        "border-opacity": 0.12,
        "high-emphasis-opacity": 0.87,
        "medium-emphasis-opacity": 0.6,
        "disabled-opacity": 0.38,
        "idle-opacity": 0.04,
        "hover-opacity": 0.04,
        "focus-opacity": 0.12,
        "selected-opacity": 0.08,
        "activated-opacity": 0.12,
        "pressed-opacity": 0.12,
        "dragged-opacity": 0.08,
        "theme-kbd": "#212529",
        "theme-on-kbd": "#FFFFFF",
        "theme-code": "#F5F5F5",
        "theme-on-code": "#000000",
    },
};

const vuetify = createVuetify({
    components: {
        // ...components,
        VDateInput,
    },
    // directives,
    theme: {
        defaultTheme: "nomadTheme",
        themes: { nomadTheme },
    },
    icons: {
        defaultSet: "mdi",
        // aliases,
        sets: {
            fa,
            mdi,
        },
    },
    locale: {
        locale: "zhHant",
        messages: { zhHant },
    },
});

export default vuetify;
