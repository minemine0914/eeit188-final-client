<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <span class="navbar-brand">Vue串接</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/wu/time">時間區隔</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/wu/user-analysis">客戶分析</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/wu/income">房源收入</RouterLink>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#" @click="logout" v-show="false">登出</a>
                    </li>

                    <li class="nav-item dropdown">
                        <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">功能</span>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">產品</RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script setup>
// import useUserStore from '@/stores/user';
// const userStore = useUserStore();
// function logout() {
//     userStore.setEmail("");
//     userStore.setLogin(false);
// }
</script>

<style></style>