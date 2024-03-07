<template>
  <!-- <h1>{{ this.$route.params.id }}</h1> -->
  <div class="loading" v-if="isLoading">
    <div></div>
  </div>
  <div class="card-fixed" v-if="modalPostulation">
    <form class="postulation-form">
      <div class="form-input">
        <label for="cv">Charger votre CV (en pdf)</label>
        <input
          id="cv"
          type="file"
          @change="onFileChange"
          accept="application/pdf,application/vnd.ms-excel"
          required
        />
      </div>
      <div class="form-button">
        <button @click="openPostulation">Annuler</button>
        <button @click.prevent="submitPostulation">Soumettre</button>
      </div>
    </form>
  </div>
  <Header />
  <div class="job-body">
    <SideBar />
    <div class="body-content">
      <div class="body-content-card">
        <div
          class="card-header"
          v-show="jobInfo[0].author !== idUser ? true : false"
        >
          <img :src="jobInfo[0].picture" alt="picture" class="job-picture" />
          <h1>{{ jobInfo[0].title }}</h1>
          <div>
            <h3>
              <img
                src="./../../assets/icons/location-white.svg"
                alt="location"
              />
              <span>{{ jobInfo[0].location }}</span>
            </h3>
            <h3>
              <img
                src="./../../assets/icons/salary-white.svg"
                alt="salary"
              /><span
                >{{ jobInfo[0].salary }} {{ jobInfo[0].salaryDevise }} /
                {{ jobInfo[0].salaryFrequency }}</span
              >
            </h3>
            <h3>
              <img
                src="./../../assets/icons/enterprise-white.svg"
                alt="enterprise"
              /><span>{{ jobInfo[0].enterprise }}</span>
            </h3>
            <h3>
              <img
                src="./../../assets/icons/time-white.svg"
                alt="enterprise"
              /><span
                >Début : {{ new Date(jobInfo[0].init).getDate() }} /
                {{ new Date(jobInfo[0].init).getMonth() + 1 }} /
                {{ new Date(jobInfo[0].init).getFullYear() }}</span
              >
            </h3>
          </div>
          <div>
            <button v-for="statut in jobInfo[0].status" :key="statut">
              {{ statut }}
            </button>
          </div>
        </div>
        <div
          class="card-header"
          v-show="jobInfo[0].author === idUser ? true : false"
        >
          <img :src="jobInfo[0].picture" alt="picture" class="job-picture" />
          <h1>Liste des candidatures</h1>
          <div>
            <h2>{{ jobInfo[0].title }}</h2>
          </div>
          <div>
            <h3>
              <img src="./../../assets/icons/time-white.svg" alt="init" /><span
                >Début : {{ new Date(jobInfo[0].init).getDate() }} /
                {{ new Date(jobInfo[0].init).getMonth() + 1 }} /
                {{ new Date(jobInfo[0].init).getFullYear() }}</span
              >
            </h3>
          </div>
        </div>
        <div
          class="card-post"
          v-show="jobInfo[0].author !== idUser ? true : false"
        >
          <h2>Description</h2>
          <p class="descriptionHtml"></p>
          <div>
            <h3>
              <img
                src="./../../assets/icons/enterprise.svg"
                alt="enterprise"
              /><span>{{ jobInfo[0].enterprise }}</span>
            </h3>
            <h4
              v-show="!jobInfo[0].postulations.includes(idUser) ? true : false"
            >
              Vous êtes intéressé ?
            </h4>
            <button
              v-if="!jobInfo[0].postulations.includes(idUser)"
              @click="openPostulation"
            >
              Postuler
            </button>
            <button v-else>Déjà postulé</button>
          </div>
        </div>
        <div
          class="card-postulations"
          v-show="jobInfo[0].author === idUser ? true : false"
        >
          <div
            class="card-postulation"
            v-for="postulation in postulationsUser"
            :key="postulation"
          >
            <!-- <h1>{{postulation.cvs[`${this.$route.params.id}`]}}</h1> -->
            <h2>{{ postulation.name }}</h2>
            <a
              :href="postulation.cv"
              target="_blank"
              class="card-postulation-cv"
              >Téléchargez son CV</a
            >
            <a :href="postulation.emailMailto" class="card-postulation-contact"
              >CONTACTER</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import SideBar from "./../../components/SideBar.vue";
import Header from "./../../components/Header.vue";
import "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  ref as stRef,
  getDownloadURL,
} from "firebase/storage";
import db from "./../../main.js";
export default {
  components: { Header, SideBar },
  setup() {
    const modalPostulation = ref(false);
    const auth = getAuth();
    const currentUser = getAuth().currentUser;
    const idUser = ref(currentUser.uid);

    const openPostulation = () => {
      modalPostulation.value = !modalPostulation.value;
    };

    return {
      auth,
      idUser,
      modalPostulation,
      openPostulation,
    };
  },
  data() {
    return {
      jobInfo: [], // jobInfo[0]
      postulationsUser: [],
      isLoading: false,
      cv: "",
    };
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        this.getJob();
      },
      { immediate: true }
    );
  },
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      const descriptionHtml = document.querySelector(".descriptionHtml");
      descriptionHtml.innerHTML = this.jobInfo[0].description;
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    async getJob() {
      this.isLoading = true;
      const docSnap = await getDoc(doc(db, "jobs", this.$route.params.id));
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        this.jobInfo.push(docSnap.data());
        this.jobInfo[0].postulations.forEach((element) => {
          this.getPostulations(element);
        });
        this.isLoading = false;
      } else {
        console.log("Document does not exist");
        this.isLoading = false;
      }
    },

    async onFileChange(e) {
      this.isLoading = true;
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = stRef(storage, `CV/${file.name}`);
      await uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          this.cv = url;
          // console.log(this.cv);
        });
        this.isLoading = false;
      });
    },

    async submitPostulation() {
      // if file is empty => error
      if (this.cv === "") {
        alert("Veuillez choisir un CV");
        return;
      }
      this.isLoading = true;
      await updateDoc(doc(db, "users", this.idUser), {
        cv: this.cv,
      });
      await updateDoc(doc(db, "jobs", this.$route.params.id), {
        postulations: [...this.jobInfo[0].postulations, this.idUser],
      });
      this.openPostulation();
      this.isLoading = false;
      this.$router.push("/jobs");
    },

    async getPostulations(element) {
      this.isLoading = true;
      const docSnap = await getDoc(doc(db, "users", element));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const emailMailto = { emailMailto: `mailto:${docSnap.data().email}` };

        const finalResult = Object.assign(data, emailMailto);
        //console.log(finalResult);

        this.postulationsUser.push(finalResult);
        this.isLoading = false;
      } else {
        // console.log("Document does not exist");
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/settings.scss";

li {
  list-style: disc;
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

    .form-input {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 20px;

      label {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
      }

      input {
        width: 100%;
        border: 1px solid $dark;
        border-radius: 4px;
        padding: 10px;
        outline: none;

        &:focus {
          border-color: #bcbec3;
        }

        &::-webkit-file-upload-button {
          border: none;
          padding: 4px;
          color: $dark;
          background: rgba($color: #bcbec3, $alpha: 0.4);
          border: 1px solid #bcbec3;
          border-radius: 15px;
        }
      }
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
        background: $dark;
        border: 1px solid $dark;
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
.job-body {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  // grid-column-gap: 10px;
  grid-row-gap: 0px;
  background: $ligth;
  background-size: 42px 42px;
}
.body-content {
  grid-area: 1 / 3 / 2 / 13;
  padding-top: 56px;
  // margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &-card {
    width: 100%;
    // background: $white;
    .card-header {
      position: relative;
      height: 25rem;
      .job-picture {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &::before {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        content: " ";
        z-index: 2;
      }
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 1rem;
      h1 {
        font-family: "Inter", sans-serif;
        font-weight: 700;
        font-size: 2.8125rem;
        line-height: 1.2;
        text-align: center;
        color: $white;
        z-index: 2;
        @media (max-width: 768px) {
          font-size: 2.125rem;
        }
      }
      h2 {
        font-family: "Inter", sans-serif;
        font-weight: 700;
        font-size: 1.5rem;
        line-height: 1.2;
        text-align: center;
        color: $white;
        z-index: 2;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        z-index: 2;
        h3 {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          img {
            width: 18px;
          }
          span {
            color: $white;
            margin-left: 5px;
            font-weight: 400;
            font-size: 1rem;
          }
        }
        button {
          padding: 0.25rem 0.75rem;
          font-size: 16px;
          border: 2px solid $white;
          border-radius: 30px;
          font-weight: 500;
          text-transform: uppercase;
          background: rgba($color: $white, $alpha: 0.1);
          color: #fff;
        }
      }
    }

    .card-post {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h2 {
        font-family: "Inter", sans-serif;
        font-weight: 700;
        margin-bottom: 15px;
        font-size: 2rem;
        align-self: flex-start;
      }
      p {
        width: 100%;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        opacity: 0.8;
        padding: 0.5rem 1rem 2rem 1rem;
        line-height: 1.5rem;
      }
      div {
        width: 400px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1.5rem 1rem;
        border: 1px solid rgb(229, 229, 229);
        background: $white;
        h3 {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 20px;
          }
          span {
            margin-left: 10px;
            font-weight: 600;
            font-size: 1.2rem;
          }
        }
        h4 {
          margin: 10px 0;
          font-weight: 400;
          font-size: 1rem;
        }
        button {
          //width: 100%;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          font-size: 14px;
          border: none;
          font-weight: 400;
          text-transform: uppercase;
          background: $default;
          color: #fff;
          margin-top: 10px;
          &:hover {
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }

    .card-postulations {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      padding: 1rem;
      grid-gap: 10px;

      .card-postulation {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1.5rem 1rem;
        border: 1px solid rgb(229, 229, 229);
        background: $white;
        h2 {
          font-weight: 600;
          font-size: 1.2rem;
        }
        &-cv {
          margin: 10px 0;
          font-weight: 400;
          font-size: 1rem;
          text-decoration: underline;
        }
        &-contact {
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          font-size: 14px;
          border: none;
          font-weight: 400;
          text-transform: uppercase;
          background: $default;
          color: #fff;
          margin-top: 10px;
          &:hover {
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .body-content {
    grid-area: 1 / 4 / 2 / 13;
  }
}

@media screen and (max-width: 700px) {
  .body-content {
    grid-area: 1 / 1 / 2 / 13;
    min-height: 100vh;
    margin: 0 5px 90px 5px;
  }
}
</style>
