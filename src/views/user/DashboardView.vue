<template>
  <div class="loading" v-if="isLoading">
    <div></div>
  </div>
  <div v-if="isOpen" class="container-alert">
    <div class="card">
      <span>Votre profile a bien ete mis a jour :)</span>
      <button @click="closeModal">Compris !</button>
    </div>
  </div>
  <Header />
  <div class="dashboard-body">
    <SideBar />
    <div class="body-content">
      <div class="content-header">
        <h1>
          Salut, {{ displayName ? displayName : userName }} ici tu pourras
          consulter toutes tes offres ( crées et postulées ).
        </h1>
      </div>
      <div class="content-cards content-cards-created">
        <h2 v-if="allJobs.filter((job) => job.author === id).length === 0">
          Vous n'avez pas encore créé d'offre d'emploi.
        </h2>
        <div
          v-for="job in allJobs
            .slice()
            .sort((a, b) => b.id - a.id)
            .filter((job) => job.author === id)"
          :key="job.id"
        >
          <JobCard
            :title="job.title"
            :init="job.init"
            :salary="job.salary"
            :location="job.location"
            :enterprise="job.enterprise"
            :picture="job.picture"
            :status="job.status"
            :postulations="job.postulations"
            :id="job.id"
            :salaryFrequency="job.salaryFrequency"
            :salaryDevise="job.salaryDevise"
            :author="job.author"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="content-cards content-cards-applied">
        <h2
          v-if="
            allJobs.filter((job) => job.postulations.includes(id)).length === 0
          "
        >
          Vous n'avez pas encore postulé à une offre.
        </h2>
        <div
          v-for="job in allJobs
            .slice()
            .sort((a, b) => b.id - a.id)
            .filter((job) => job.postulations.includes(id))"
          :key="job.id"
        >
          <JobCard
            :title="job.title"
            :init="job.init"
            :salary="job.salary"
            :location="job.location"
            :enterprise="job.enterprise"
            :picture="job.picture"
            :status="job.status"
            :postulations="job.postulations"
            :id="job.id"
            :salaryFrequency="job.salaryFrequency"
            :salaryDevise="job.salaryDevise"
            :author="job.author"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, updateProfile } from "firebase/auth";
import SideBar from "./../../components/SideBar.vue";
import Header from "./../../components/Header.vue";
import JobCard from "./../../components/JobCard.vue";
import { query, collection, doc, getDocs, getDoc } from "firebase/firestore";
import db from "./../../main.js";

export default {
  components: { JobCard, Header, SideBar },
  setup() {
    const isOpen = ref(false);
    const auth = getAuth();
    const currentUser = getAuth().currentUser;
    const isEmailVerified = ref(currentUser.emailVerified);
    const displayName = ref(currentUser.displayName);
    const id = ref(currentUser.uid);
    const photoURL = ref(currentUser.photoURL);

    const closeModal = () => {
      isOpen.value = false;
    };
    const updateProfileFunc = () => {
      updateProfile(currentUser, {
        displayName: "",
        photoURL: "",
      })
        .then(() => {
          isOpen.value = true;
        })
        .catch((error) => {
          console.log("Error updating profile: ", error);
        });
    };

    return {
      isOpen,
      auth,
      isEmailVerified,
      displayName,
      photoURL,
      closeModal,
      updateProfileFunc,
      id,
    };
  },
  data() {
    return {
      allJobs: [],
      allUsers: [],
      userName: "",
      isLoading: false,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        this.getJobs();
        this.getUser();
      },
      { immediate: true }
    );
  },
  methods: {
    async getJobs() {
      this.isLoading = true;
      const querySnap = await getDocs(query(collection(db, "jobs")));

      querySnap?.forEach((doc) => {
        const data = doc.data();
        const idDocument = { id: doc.id };

        const finalResult = Object.assign(data, idDocument);
        // console.log(finalResult);

        this.allJobs.push(finalResult);
        this.isLoading = false;
      });
      this.isLoading = false;
    },
    async getUser() {
      this.isLoading = true;
      const docSnap = await getDoc(doc(db, "users", this.id));
      if (docSnap.exists()) {
        this.userName = docSnap.data().name;
        this.isLoading = false;
      } else {
        // console.log("Document does not exist");
        this.isLoading = false;
      }
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/settings.scss";
li {
  list-style: none;
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

.dashboard-body {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
  background: $ligth;
}

.body-content {
  grid-area: 1 / 3 / 2 / 13;
  padding-top: 70px;
  margin-right: 10px;
}

.content-header {
  width: 100%;
  // border-bottom: 1px solid #E5E4E1;
  h1 {
    width: 100%;
    font-family: "Ubuntu", sans-serif;
    font-style: italic;
    font-weight: 500;
    font-size: 24px;
    margin-bottom: 15px;
  }
}

.content-cards {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  padding-top: 30px;
  padding-bottom: 20px;
  grid-gap: 10px;

  h2 {
    width: 100%;
    font-family: "Ubuntu", sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

  &::before {
    position: absolute;
    top: 5px;
    left: 0;
    font-style: italic;
    font-family: "Inter", sans-serif;
    //color: $gray;
    margin-bottom: 10px;
    opacity: 0.6;
  }
}

.content-cards-created {
  &::before {
    content: "Mes offres | (cliquer pour voir les candidatures)";
  }
}
.content-cards-applied {
  &::before {
    content: "Mes postulations";
  }
}

.line {
  background: #ededeb;
  height: 1px;
}

@media screen and (max-width: 1100px) {
  .body-content {
    grid-area: 1 / 4 / 2 / 13;
  }
}

@media screen and (max-width: 700px) {
  .body-content {
    margin-right: 0;
    padding: 65px 5px 85px 5px;
    grid-area: 1 / 1 / 2 / 13;
    min-height: 100vh;
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
  z-index: 3;

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
      background: $success;
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
