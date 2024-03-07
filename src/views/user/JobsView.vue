<template>
  <div class="loading" v-if="isLoading">
    <div></div>
  </div>
  <Header />
  <div class="jobs-body">
    <SideBar />
    <div class="body-content">
      <h1 v-if="allJobs.filter((job) => job.author !== id).length === 0">
        Aucune offre d'emploi pour le moment
      </h1>
      <div class="content-cards">
        <div
          v-for="job in allJobs
            .slice()
            .sort((a, b) => b.id - a.id)
            .filter((job) => job.author !== id)"
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
import { getAuth } from "firebase/auth";
import SideBar from "./../../components/SideBar.vue";
import Header from "./../../components/Header.vue";
import JobCard from "./../../components/JobCard.vue";
import { query, collection, getDocs } from "firebase/firestore";
import db from "./../../main.js";

export default {
  components: { JobCard, Header, SideBar },
  setup() {
    const auth = getAuth();
    const currentUser = getAuth().currentUser;
    const id = ref(currentUser.uid);
    return {
      auth,
      id,
    };
  },
  data() {
    return {
      allJobs: [],
      isLoading: false,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      () => {
        this.getJobs();
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
.jobs-body {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 10px;
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
