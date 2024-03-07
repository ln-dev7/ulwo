<template>
  <div class="loading" v-if="isLoading">
    <div></div>
  </div>
  <div v-if="isOpen" class="container-alert">
    <!-- <div class="card">
      <span>Un mail a ete envoye a <span>{{ email }}</span> veuillez l' ouvrir et activer compte. <br> Ensuite reactualiser la page.</span>
      <button @click="closeModal">Compris !</button>
    </div> -->
  </div>
  <!-- <p v-if="!isEmailVerified" class="verify-email">
    <span @click="verifyEmail">Veuillez verifier votre email pour activer votre compte.</span>
  </p> -->
  <div class="card-fixed" v-if="modalJob">
    <form class="postulation-form">
      <div class="form-input">
        <label for="title">Titre du poste</label>
        <input
          type="text"
          id="title"
          placeholder="Entrez le titre du poste"
          v-model="title"
          required
        />
      </div>
      <div class="form-input">
        <label for="description">Description</label>
        <editor
          api-key="uz5nscj96ldxmdwjuelhavjby49db6rfbr3e5jrdb886w0of"
          :init="{
            height: 300,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
          }"
          v-model="description"
          style="width: 100%; height: 300px"
        />
      </div>
      <div class="form-input">
        <label for="salary">Salaire du poste</label>
        <input
          type="number"
          id="salary"
          placeholder="Montant du salaire"
          v-model="salary"
          required
        />
        <div>
          <input
            type="text"
            id="salaryDevise"
            placeholder="Devise (ex: FCFA)"
            v-model="salaryDevise"
            required
          />
          <input
            type="text"
            id="salaryFrequency"
            placeholder="Frequence (ex: par mois)"
            v-model="salaryFrequency"
            required
          />
        </div>
      </div>
      <div class="form-input">
        <label for="title">Lieu</label>
        <input
          type="text"
          id="location"
          placeholder="Lieu de travail"
          v-model="location"
          required
        />
      </div>
      <div class="form-input">
        <label for="init">Date de début</label>
        <input
          type="date"
          id="init"
          placeholder="En quel jour ce poste debute ?"
          v-model="init"
          required
        />
      </div>
      <div class="form-input">
        <label for="enterprise">Nom de l' entrprise</label>
        <input
          type="text"
          id="enterprise"
          placeholder="Le nom de l' entrprise qui offre le poste"
          v-model="enterprise"
          required
        />
      </div>
      <div class="form-input">
        <label for="status">Satut du post</label>
        <input
          type="text"
          id="picture"
          placeholder="CDI - CDD - STAGE - ALTERNANCE - FREELANCE ... ?"
          v-model="status"
          required
        />
        <span>Veuillez separer chaque statut par un " <b>-</b> "</span>
      </div>
      <div class="form-input">
        <label for="picture">Image illustrative</label>
        <input
          type="file"
          id="picture"
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Image illustrative du poste"
          @change="onFileChange"
          required
        />
      </div>
      <div class="form-button">
        <button @click="openNewJob">Annuler</button>
        <button @click.prevent="createJob">Soumettre</button>
      </div>
    </form>
  </div>
  <header class="header" id="header">
    <div class="header__center">
      <div class="header-logo">
        <h2>Ulwo<span>.</span></h2>
      </div>
      <div class="header-options">
        <button @click="openNewJob">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="#ffffff"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Creer une offre</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Editor from "@tinymce/tinymce-vue";
import {
  getStorage,
  uploadBytes,
  ref as stRef,
  getDownloadURL,
} from "firebase/storage";
import db from "./../main.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  components: {
    editor: Editor,
  },
  data() {
    return {
      isLoading: false,
      picture: "",
      title: "",
      description: "",
      salary: null,
      salaryDevise: "",
      salaryFrequency: "",
      init: null,
      enterprise: "",
      location: "",
      status: "",
    };
  },
  methods: {
    async createJob() {
      if (
        this.title === "" ||
        this.description === "" ||
        this.salary === null ||
        this.init === null ||
        this.enterprise === "" ||
        this.status === "" ||
        this.picture === "" ||
        this.salaryDevise === "" ||
        this.salaryFrequency === "" ||
        this.location === ""
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      this.isLoading = true;
      const colRef = collection(db, "jobs");
      const dataObj = {
        author: getAuth().currentUser.uid,
        title: this.title,
        description: this.description,
        salary: this.salary,
        salaryDevise: this.salaryDevise,
        salaryFrequency: this.salaryFrequency,
        init: new Date(this.init).getTime(),
        enterprise: this.enterprise,
        status: this.status.split("-"),
        picture: this.picture,
        location: this.location,
        postulations: [],
      };
      const docRef = await addDoc(colRef, dataObj);
      console.log("Document was created with ID:", docRef.id);
      alert(
        "Votre offre a bien été créé ! Veuillez actualiser la page s'il vous plaît."
      );
      this.openNewJob();
      this.isLoading = false;
    },

    async onFileChange(e) {
      this.isLoading = true;
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = stRef(storage, `PictureJob/${file.name}`);
      await uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          this.picture = url;
          // console.log(this.picture);
        });
        this.isLoading = false;
      });
    },
  },
  setup() {
    const isOpen = ref(false);
    const modalJob = ref(false);
    const auth = getAuth();
    const currentUser = getAuth().currentUser;
    const isEmailVerified = ref(currentUser.emailVerified);
    const email = ref(currentUser.email);

    const openNewJob = () => {
      modalJob.value = !modalJob.value;
    };

    const closeModal = () => {
      isOpen.value = false;
    };
    const verifyEmail = () => {
      sendEmailVerification(this.auth.currentUser).then(() => {
        isOpen.value = true;
      });
    };

    return {
      isEmailVerified,
      isOpen,
      auth,
      currentUser,
      email,
      openNewJob,
      modalJob,
      closeModal,
      verifyEmail,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/settings.scss";
li {
  list-style: none;
}

.comming-soon {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  background: #7f3ef1;
  padding: 1rem 0;
  z-index: 10;

  p {
    color: #fff;
    text-align: center;
  }

  a {
    color: #fff;
    font-weight: 600;
    text-decoration: underline;
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

.verify-email {
  display: flex;
  justify-content: center;
  align-items: center;
  background: crimson;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 4;

  span {
    color: $white;
    text-decoration: underline;
    text-align: center;
    padding: 5px 0;
    font-weight: 500;
    cursor: pointer;
    font-size: 15px;
    font-style: italic;
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
  padding: 50px 0;

  .postulation-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-width: 90%;
    max-height: 80%;
    background-color: #fff;
    z-index: 5;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: $dark;
      border-radius: 30px;
    }

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
      span {
        font-size: 12px;
        font-weight: 400;
        color: $purple;
        b {
          font-size: 20px;
          font-weight: 500;
        }
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid rgba($color: $default, $alpha: 0.5);
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
      textarea {
        // resize: none;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 5px;
        gap: 5px;
        @media (max-width: 500px) {
          width: 100%;
          flex-direction: column;
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

#header {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e5e4e1;
  background: $white;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 3;
}

.header {
  padding: 5px 0;

  &__center {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-logo {
    h2 {
      color: #0d0d54;
      font-weight: 700;

      span {
        color: $purple;
        font-weight: 700;
      }
    }
  }

  &-options {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      cursor: pointer;
      background: $primary;
      border: none;
      border-radius: 30px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      svg {
        width: 20px;
        margin-left: 5px;
      }

      span {
        color: $white;
        font-weight: 600;
        font-size: 14px;
        display: block;
      }
    }

    .options-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid $dark;
      margin-left: 30px;
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
