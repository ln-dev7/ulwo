<template>
  <div class="loading" v-if="isLoading">
    <div></div>
  </div>
  <div class="card-fixed" v-if="modalDelete">
    <form class="postulation-form">
      <h2>Voulez vous vraiment supprimer cette offre ?</h2>
      <div class="form-button">
        <button @click="openDelete">Annuler</button>
        <button @click.prevent="deleteJob">Supprimer</button>
      </div>
    </form>
  </div>
  <router-link :to="'/job/' + id" custom v-slot="{ navigate }">
    <div
      :class="[
        'job',
        {
          applied: this.postulations.includes(idUser),
        },
      ]"
      @click="navigate"
      v-if="id !== idJobTest"
    >
      <div
        v-show="author === idUser"
        class="delete-job"
        @click.stop.prevent="openDelete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#ffffff"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </div>
      <div class="job-image">
        <img :src="picture" alt="picture" />
      </div>
      <div class="job-body">
        <h1 class="job-title">{{ title }}</h1>
        <h3 class="job-location">
          <img src="./../assets/icons/location.svg" alt="location" />
          <span>{{ location }}</span>
        </h3>
        <h3 class="job-salary">
          <img src="./../assets/icons/salary.svg" alt="salary" /><span
            >{{ salary }} {{ salaryDevise }} / {{ salaryFrequency }}</span
          >
        </h3>
        <h3 class="job-init">
          <img src="./../assets/icons/time.svg" alt="init" />
          <span
            >Début : {{ new Date(init).getDate() }} /
            {{ new Date(init).getMonth() + 1 }} /
            {{ new Date(init).getFullYear() }}</span
          >
        </h3>
        <h3 class="job-enterprise">
          <img src="./../assets/icons/enterprise.svg" alt="enterprise" /><span
            >{{ enterprise }}</span
          >
        </h3>
        <!-- <button>Postuler</button> -->
      </div>
      <div class="job-footer">
        <!-- <h3>
          <img src="./../assets/icons/time.svg" alt="time" /><span
            >Depuis 1h</span
          >
        </h3> -->
        <div class="job-footer__tags">
          <button v-for="statu in status" :key="statu">{{ statu }}</button>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { ref } from "vue";
import { getAuth } from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
// import { query, collection, getDocs } from "firebase/firestore"
// the firestore instance
import db from "./../main.js";
export default {
  name: "JobCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    init: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    enterprise: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    status: {
      type: Array,
      required: true,
    },
    postulations: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    salaryFrequency: {
      type: String,
      required: true,
    },
    salaryDevise: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  setup() {
    const auth = getAuth();
    const currentUser = getAuth().currentUser;
    const idUser = ref(currentUser.uid);
    const modalDelete = ref(false);
    const openDelete = () => {
      modalDelete.value = !modalDelete.value;
    };
    return {
      auth,
      idUser,
      modalDelete,
      openDelete,
    };
  },
  data() {
    return {
      isLoading: false,

      idJobTest: "P21XJyFExt6DWfM86XQm",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async deleteJob() {
      this.isLoading = true;
      await deleteDoc(doc(db, "jobs", this.id));
      this.isLoading = false;
      this.openDelete();
    },
    async getUser() {
      const docSnap = await getDoc(doc(db, "users", this.idUser));
      if (docSnap.exists()) {
        //
      } else {
        // console.log("Document does not exist");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/settings.scss";
* {
  font-family: "Inter", sans-serif;
  font-weight: 300;
  color: #202121;
}

li {
  list-style: none;
}
.card-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4;
  .postulation-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 90%;
    background-color: #fff;
    z-index: 5;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h2 {
      font-size: 1.3rem;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .form-button {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: crimson;
        border: 1px solid crimson;
        border-radius: 4px;
        padding: 10px;
        font-size: 16px;
        font-weight: 500;
        color: $white;
        cursor: pointer;
        transition: box-shadow 0.2s ease-in-out;
        &:hover {
          box-shadow: 2px 2px 10px #dfdfdf;
        }
        &:nth-child(1) {
          background: $gray;
          border: 1px solid $gray;
          color: $dark;
        }
      }
    }
  }
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  div {
    background: transparent;
    border: 10px solid transparent;
    border-top-color: $white;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    animation: rotation 1s infinite linear;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(359deg);
    }
  }
}
.job {
  position: relative;
  cursor: pointer;
  background: $white;
  transition: 0.3s ease-out;
  border: 1px solid #e6eaea;
  .delete-job {
    position: absolute;
    background: crimson;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.3rem;
    cursor: pointer;
    z-index: 2;
    top: 10px;
    right: 10px;
    svg {
      width: 30px;
    }
    &:hover ~ div {
      filter: grayscale(1);
    }
  }
  &.applied {
    // background: #f5fbfb;
    opacity: 0.6;
  }
  &.displayNone {
    display: none;
  }
  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  &-image {
    width: 100%;
    height: 200px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 5px;
    .job-title {
      font-size: 18px;
      font-weight: 700;
    }
    .job-description {
      font-size: 15px;
      // font-style: italic;
      font-weight: 300;
      margin: 5px 0;
    }
    h3 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 15px;
      }
      span {
        margin-left: 5px;
        font-size: 14px;
      }
    }
    button {
      width: 100%;
      align-self: flex-end;
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      font-size: 14px;
      border: none;
      font-weight: 400;
      text-transform: uppercase;
      background: $default;
      color: #fff;
      margin-top: 10px;
    }
  }
  &-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0.5rem;
    padding: 0.5rem;
    padding-top: 10px;
    border-top: 1px solid #e6eaea;
    h3 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 15px;
      }
      span {
        margin-left: 5px;
        font-style: italic;
        font-size: 14px;
      }
    }
    &__tags {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
      button {
        padding: 0.25rem 0.5rem;
        border-radius: 30px;
        font-size: 12px;
        border: none;
        font-weight: 400;
        text-transform: uppercase;
        color: #fff;
      }
      button:nth-child(n) {
        background: #ff4e4e;
      }
      button:nth-child(2n) {
        background: #8154ef;
      }
      button:nth-child(3n) {
        background: #f9a825;
      }
    }
  }
}
</style>
