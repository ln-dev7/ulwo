<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {onBeforeMount} from "vue";
import { useRouter, useRoute} from "vue-router";
import { getAuth } from "firebase/auth";
// import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default {
  name: "App",
  setup() {
    const route = useRoute();
    const router = useRouter();

    onBeforeMount(() => {
      getAuth().onAuthStateChanged(user => {
        if (user) {
          if (route.path === "/" || route.path === "/login" || route.path === "/register") {
            router.push("/dashboard");
          }
          if ((user.emailVerified === false ) && (route.path === "/jobs")) {
            router.push("/dashboard")
          }
        } else {
          if (route.path !== "/" && route.path !== "/login" && route.path !== "/register") {
            router.push("/");
          }
        }
      });
    });
  }
}
</script>

<style lang="scss">
@import "assets/styles/settings";
</style>
