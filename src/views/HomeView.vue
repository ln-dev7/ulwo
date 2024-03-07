<template>
  <div class="home" id="home">
    <a href="#home">
      <div class="arrow-up">
        <img src="../assets/icons/arrow-up.svg" alt="arrow-down" />
      </div>
    </a>
    <!-- <div class="comming-soon">
      <p>
        Téléchargez l'application mobile :
        <a href="https://ulwo.lndev.me">Ulwo App</a>
      </p>
    </div> -->
    <nav class="navigation">
      <div class="navigation__center">
        <div class="navigation-left">
          <img src="../assets/logo/logo.svg" alt="logo" />
          <span> <span>U</span>lwo </span>
        </div>
        <ul class="navigation-right">
          <li><a href="#about">A propos</a></li>
          <li><a href="#contact">Contact</a></li>
          <!-- <li><a href="" target="_blank" style="color: #bcbec3;">Contribuer</a></li> -->
          <li>
            <router-link to="/login">
              <button class="btn__login">Connexion</button>
            </router-link>
          </li>
          <li>
            <router-link to="/register">
              <button class="btn__register">Inscription</button>
            </router-link>
          </li>
        </ul>
        <img
          @click="toggleBurger"
          src="../assets/icons/burger.svg"
          alt="burger"
          class="navigation-burger"
        />
      </div>
    </nav>
    <header class="header">
      <div class="header__center">
        <div class="header-left">
          <h1><span>Ulwo</span> vous aide a trouver un emploi.</h1>
          <h2>Trouvez des jobs de votre profil.</h2>
          <router-link to="/login">
            <button>Commencez</button>
          </router-link>
        </div>
        <div class="header-right">
          <img
            src="../assets/illustrations/illustration.png"
            alt="illustration"
          />
        </div>
      </div>
    </header>
    <div class="about" id="about">
      <h1 class="about-title"><span>C</span>omment ca fonctionne ?</h1>
      <div class="about__center">
        <div class="about-card">
          <img src="../assets/illustrations/step-1.svg" alt="step 1" />
          <p>Creez vous un compte en moins de 2 minutes.</p>
        </div>
        <div class="about-card">
          <img src="../assets/illustrations/step-2.svg" alt="step 2" />
          <p>Creez ou postulez a une offre d' emploi.</p>
        </div>
        <div class="about-card">
          <img src="../assets/illustrations/step-3.svg" alt="step 3" />
          <p>C' est tout ! Vous avez votre job !</p>
        </div>
      </div>
      <router-link to="/login">
        <button>Commencez</button>
      </router-link>
    </div>
    <div class="contact" id="contact">
      <form action="https://formspree.io/f/xzboklab" method="POST">
        <h2><span>C</span>ontactez nous</h2>
        <div>
          <label for="email"></label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Entrez votre mail"
            required
          />
        </div>
        <div>
          <label for="message"></label>
          <textarea
            name="message"
            id="message"
            placeholder="Entrez votre message"
            maxlength="1000"
            required
          ></textarea>
        </div>
        <button type="submit">Envoyer</button>
      </form>
      <div class="contact-socials">
        <a href="https://twitter.com/ln_dev7" target="_blank">
          <img src="../assets/icons/twitter.svg" alt="twitter" />
        </a>
        <a href="https://github.com/ln-dev7/ulwo" target="_blank">
          <img src="../assets/icons/linkedin.svg" alt="github" />
        </a>
      </div>
      <a
        class="contact-buy"
        href="https://www.buymeacoffee.com/lndev"
        target="_blank"
      >
        <img src="../assets/images/BuyMeACoffee.webp" alt="buymeacoffee" />
      </a>
    </div>
    <p class="copy">
      &copy; Tout droits réservés | Ulwo - 2022 | Codé par
      <a href="https://lndev.me" target="_blank">Leonel Ngoya</a>
    </p>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    toggleBurger() {
      const burger = document.querySelector(".navigation-burger");
      const menu = document.querySelector(".navigation-right");
      burger.addEventListener("click", () => {
        menu.classList.toggle("active");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/settings.scss";

li {
  list-style: none;
}

.home {
  .comming-soon {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
    background: #7f3ef1;
    padding: 1rem 0;

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
  .arrow-up {
    position: fixed;
    right: 10px;
    bottom: 10px;
    border: 2px solid $dark;
    background: $info;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 35px;
    height: 35px;

    img {
      width: 25px;
    }
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    // border-bottom: 2px solid rgba($dark, 1);
    background: $white;

    &__center {
      width: 80%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-left {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-weight: 700;
        font-size: 25px;
        margin-left: 10px;

        span {
          font-weight: 700;
          font-size: 25px;
          color: $primary;
          margin: 0;
        }
      }

      img {
        cursor: pointer;
        width: 50px;
        height: auto;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        a:is(:not(a[href="/login"], a[href="/register"])) {
          padding: 20px;
          margin: 0 5px;
          font-weight: 600;

          &:hover {
            color: $purple;
          }
        }

        button {
          position: relative;
          cursor: pointer;
          padding: 18px;
          margin: 0 5px;
          font-weight: 600;
          background: $primary;
          color: $white;
          border: 2px solid $primary;
        }

        .btn__login {
          background: $ligth;
          border-color: $ligth;
          color: $primary;
        }
      }
    }

    &-burger {
      display: none;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../assets/images/01.png");
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;

    &__center {
      position: relative;
      width: 80%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .scroll-down {
      position: absolute;
      left: 50%;
      bottom: 10px;
      border: 3px solid $dark;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: 50px;
      height: 50px;

      img {
        width: 40px;
      }
    }

    &-left {
      span {
        font-weight: 900;
        background: linear-gradient(to right, #7f3ef1, #a94dfc);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
      }

      h1 {
        font-size: 56px;
        font-weight: 900;
        line-height: 78px;
        @media screen and (max-width: 1200px) {
          font-size: 40px;
        }
        @media screen and (max-width: 535px) {
          line-height: 55px;
        }
      }

      h2 {
        font-size: 30px;
        font-weight: 600;
        margin: 10px 0;
        @media screen and (max-width: 1200px) {
          font-size: 25px;
        }
      }

      button {
        cursor: pointer;
        background: linear-gradient(to right, #7f3ef1, #a94dfc);
        color: $white;
        border: 2px solid $purple;
        font-weight: 600;
        border-radius: 30px;
        padding: 13px;
        font-size: 16px;
        transition: 0.3s ease-in-out;

        &:hover {
          background: linear-gradient(to right, #a94dfc, #7f3ef1);
        }
      }
    }

    &-right {
      width: 90%;
      display: flex;
      @media screen and (max-width: 970px) {
        display: none;
      }

      img {
        width: 100%;
      }
    }
  }

  .about {
    // min-height: 100vh;
    background: url("../assets/images/bubbles.svg");
    // background-repeat: no-repeat;
    // background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px 0;

    &-title {
      font-size: 56px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 50px;
      margin-left: 10px;
      margin-right: 10px;

      span {
        font-size: 60px;
        font-weight: 700;
        color: $purple;
        @media screen and (max-width: 1200px) {
          font-size: 44px;
        }
      }

      @media screen and (max-width: 1200px) {
        font-size: 40px;
      }
    }

    &__center {
      position: relative;
      width: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }

    &-card {
      width: 350px;
      height: 400px;
      margin: 10px;
      position: relative;
      background: $white;
      border-radius: 5px;
      box-shadow: 2px 2px 10px #dfdfdf;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 300px;
      }

      p {
        font-family: "Inter", sans-serif;
        font-style: italic;
        font-size: 16px;
        text-align: center;
        font-weight: 400;
        padding-bottom: 20px;
      }

      &::before {
        content: "";
        position: absolute;
        width: 200%;
        height: 200%;
        background: $dark;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 30px;
        color: $white;
        transform: scale(0);
        transition: 0.5s ease-in-out;
        border-radius: 50%;
      }

      &:hover::before {
        transform: scale(100%);
      }
    }

    &__center {
      .about-card:nth-child(1)::before {
        content: "1";
        transform-origin: left bottom;
      }

      .about-card:nth-child(2)::before {
        content: "2";
        transform-origin: right bottom;
      }

      .about-card:nth-child(3)::before {
        content: "3";
        transform-origin: right top;
      }
    }

    button {
      cursor: pointer;
      background: linear-gradient(to right, #7f3ef1, #a94dfc);
      color: $white;
      border: 2px solid $purple;
      font-weight: 600;
      border-radius: 30px;
      padding: 13px;
      font-size: 16px;
      transition: 0.3s ease-in-out;
      margin-top: 30px;

      &:hover {
        background: linear-gradient(to right, #a94dfc, #7f3ef1);
      }
    }
  }

  .video {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .contact {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding-bottom: 30px;
    padding-top: 50px;
    background-image: repeating-linear-gradient(
        45deg,
        rgb(255, 255, 255) 0px,
        rgb(255, 255, 255) 10px,
        transparent 10px,
        transparent 11px
      ),
      repeating-linear-gradient(
        135deg,
        rgb(255, 255, 255) 0px,
        rgb(255, 255, 255) 10px,
        transparent 10px,
        transparent 11px
      ),
      linear-gradient(90deg, hsl(256, 7%, 84%), hsl(256, 7%, 84%));

    form {
      width: clamp(40%, 400px, 95%);
      padding: 15px;
      box-shadow: 2px 2px 10px #dfdfdf;
      background: $white;

      h2 {
        font-weight: 600;

        span {
          font-weight: 700;
          color: $purple;
        }
      }

      div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 20px 0;

        label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 10px;
          outline: none;
          resize: none;

          &:focus {
            border-color: #bcbec3;
          }
        }
      }

      button {
        background: $ligth;
        border: 1px solid $ligth;
        padding: 10px;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        color: $dark;
        margin-top: 20px;
        cursor: pointer;
        transition: box-shadow 0.2s ease-in-out;
      }
    }

    .line {
      margin: 15px 0;
    }

    &-socials {
      width: clamp(40%, 400px, 95%);
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 20px;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: $ligth;
        padding: 10px;
        transition: 0.3s ease-in-out;

        img {
          width: 30px;
        }

        &:hover {
          box-shadow: 2px 2px 10px #dfdfdf;
        }
      }
    }
    &-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      background: yellow;
      border-radius: 30px;
      padding: 1rem;
      margin: 2rem 0 1rem 0;
      width: 200px;
      transition: 0.3s;
      &:hover {
        box-shadow: 0 2px 10px rgba($dark, $alpha: 0.2);
      }
    }
  }

  .copy {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 600;
    background: rgb($dark, 0.05);

    a {
      font-weight: 500;
      text-decoration: underline;
    }
  }
}

@media only screen and (max-width: 990px) {
  .home {
    .navigation {
      &-left {
        span {
          display: none;
        }
      }
    }
  }
}

@media only screen and (max-width: 820px) {
  .home {
    .navigation {
      padding: 10px 0;
      position: relative;

      &-burger {
        display: block;
        cursor: pointer;
        width: 35px;
      }

      &-right {
        position: absolute;
        left: 0;
        width: 70%;
        height: calc(100vh - 70px);
        background: $ligth;
        top: 70px;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        padding-top: 50px;
        z-index: 3;
        transform: translateX(-100%);

        li {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          a:is(:not(a[href="/login"], a[href="/register"])) {
            width: 100%;
            padding: 20px 0;
            margin: 0;
            text-align: center;
          }

          a:is(a[href="/login"], a[href="/register"]) {
            width: 100%;
            margin: 7px 0;
          }

          button {
            width: 100%;
            margin: 0;
          }

          .btn__login {
            background: $white;
          }
        }
      }

      &-right.active {
        transform: translateX(0);
      }
    }
  }
}
</style>
