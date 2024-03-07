<template>
  <div v-if="isOpen" class="container-alert">
    <!-- <div class="card">
      <span>Vous ne pouvez pas voir les offres d' emplois car vous n' avez pas activer votre compte !</span>
      <button @click="closeModal">Compris !</button>
    </div> -->
  </div>
  <div class="sidebar" id="sidebar">
    <div class="sidebar__container">
      <div class="content">
        <router-link
          to="/jobs"
          v-if="true === true"
          custom
          v-slot="{ navigate, isActive, isExactActive }"
        >
          <li
            @click="navigate"
            @keypress.enter="navigate"
            role="link"
            :class="[isActive && 'active', isExactActive && 'exactActive']"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
              />
            </svg>
            <span>Offres</span>
          </li>
        </router-link>
        <!-- <li v-if="isEmailVerified === false" @click="openModal">
          <img src="../assets/icons/offres.svg" alt="jobs">
          <span>Offres</span>
        </li> -->

        <router-link
          to="/dashboard"
          custom
          v-slot="{ navigate, isActive, isExactActive }"
        >
          <li
            @click="navigate"
            @keypress.enter="navigate"
            role="link"
            :class="[isActive && 'active', isExactActive && 'exactActive']"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
              />
            </svg>
            <span>Dashboard</span>
          </li>
        </router-link>
      </div>
      <div class="content">
        <li class="content-profile">
          <img v-show="photoURL" :src="photoURL" alt="profile image" />
          <div v-show="!photoURL" class="content-profile-default">
            {{ userName.split("")[0] }}
          </div>
          <div class="content-profile-infos">
            <h3>{{ email }}</h3>
            <span>{{ displayName ? displayName : userName }}</span>
          </div>
        </li>
        <li class="content-logout" @click="Logout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span>Deconnexion</span>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import db from "./../main.js";

export default {
  name: "SideBar",
  setup() {
    const isOpen = ref(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const isEmailVerified = ref(currentUser.emailVerified);
    const photoURL = ref(currentUser.photoURL);
    const email = ref(currentUser.email);
    const displayName = ref(currentUser.displayName);
    const id = ref(currentUser.uid);

    const openModal = () => {
      isOpen.value = true;
    };
    const closeModal = () => {
      isOpen.value = false;
    };
    const Logout = () => {
      signOut(auth)
        .then(() => {
          alert("Vous avez bien deconnecte");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      isOpen,
      auth,
      currentUser,
      isEmailVerified,
      photoURL,
      email,
      displayName,
      openModal,
      closeModal,
      Logout,
      id,
    };
  },
  data() {
    return {
      userName: "",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const docRef = doc(db, "users", this.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.userName = docSnap.data().name;
      } else {
        console.log("No such document!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/settings.scss";
li {
  list-style: none;
}

.sidebar {
  grid-area: 1 / 1 / 2 / 3;
  background: $white;

  padding-top: 70px;

  position: sticky;
  top: 0;
  height: 100vh;

  border-right: 1px solid #e5e4e1;
}

.sidebar__container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .content {
    width: 100%;

    li {
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 10px;
      margin: 10px 0;

      svg {
        width: 30px;
      }

      span {
        font-weight: 500;
        margin-left: 10px;
        color: #4f5b67;
      }

      &:hover {
        background: #f7f7fb;
      }

      &.exactActive {
        position: relative;
        background: #f7f7fb;

        &::before {
          content: "";
          position: absolute;
          background: $primary;
          width: 3px;
          height: 100%;
          right: 0;
        }
      }
    }

    .content-profile {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      border: 1px solid #e5e4e1;
      border-left: none;
      border-right: none;
      padding: 10px;

      &-infos {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-left: 5px;

        h3 {
          font-size: 12px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          overflow-wrap: anywhere;
        }

        span {
          font-size: 11px;
          overflow-wrap: anywhere;
          margin-left: 0;
        }
      }

      img {
        border-radius: 50%;
      }

      &-default {
        color: $white;
        background: $default;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        width: 30px;
        height: 30px;
      }
    }

    .content-logout {
      background: $ligth;

      svg {
        width: 30px;
      }

      span {
        color: #4f5b67;
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .sidebar {
    grid-area: 1 / 1 / 2 / 4;
  }
}

@media screen and (max-width: 700px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    margin: 0;
    top: initial;
    padding: 5px;
    width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border: 1px solid #e5e4e1;
    height: auto;
    z-index: 3;

    &__container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        li {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 5px;
          border-radius: 10px;

          span {
            font-size: 10px;
            text-align: center;
            margin: 0;
            font-family: "Inter", sans-serif;
            display: none;
          }

          &.exactActive {
            &::before {
              bottom: 0;
              width: 100%;
              height: 3px;
            }
          }
        }

        .content-profile {
          align-items: center;
          border: initial;
          background: initial;
          margin: 0;
          padding: 5px;

          &-infos {
            margin-left: 0;

            h3 {
              display: none;
            }

            span {
              display: none;
              font-weight: 500;
              text-align: center;
            }
          }

          &::before {
            background: initial;
          }
        }
      }
    }
  }
}

.container-alert {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);

  .card {
    width: clamp(40%, 400px, 95%);
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background: $white;

    span {
      color: $dark;
      text-align: left;
      padding: 5px;
      font-weight: 500;

      span {
        font-weight: 600;
        text-decoration: underline;
        padding: 0;
      }
    }

    button {
      background: crimson;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      padding: 10px;
      color: $white;
      font-weight: 500;
      align-self: flex-end;
    }
  }
}
</style>
