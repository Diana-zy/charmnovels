<template>
  <footer>
    <div class="introduction">
      CharmNovels is an online novel reading platform dedicated to providing readers with a rich
      variety of novel choices, ensuring that everyone can find a story they love. <br />
      At CharmNovels, you can explore thousands of novels covering a wide range of genres, such as
      werewolves, billionaires, romance, fantasy adventures, sci-fi futures, urban life, mystery and
      suspense, rebirth and time travel, gaming competition, and more. Whether you enjoy sweet love
      stories or crave thrilling adventures, there's something for you here. Our platform brings
      together talented authors from around the world, offering fresh creations and exciting
      storylines. <br />
      We provide a user-friendly interface that allows you to easily browse and search for novels.
      Based on your reading habits and preferences, we recommend personalized books to ensure you
      always find content that interests you. Additionally, you can create a personal bookshelf for
      convenient access to your favorite novels whenever you want to continue reading. <br />
      We believe that reading is not only a pleasure but also a way of life. Whether you are an avid
      reader or an occasional one, CharmNovels welcomes you to join our community. Start your
      journey of storytelling and explore an endless world of novels! If you have any suggestions or
      feedback, please feel free to contact us at:
      <a href="mailto:Service@charmnovels.com">Service@charmnovels.com</a>
    </div>

    <div class="copyright">
      <div>
        <CustomLink to="/eula.html" target="_blank">Terms of Service</CustomLink>
        <CustomLink to="/privacy.html" target="_blank">Privacy Policy</CustomLink
        ><CustomLink to="/cookies.html" target="_blank">Cookies Policy</CustomLink>
        <a href="mailto:Service@charmnovels.com">Contact</a>
      </div>
      <span>Copyright ©&nbsp; 2024 charmnovels &nbsp;All rights reserved.</span>
    </div>
  </footer>
</template>

<script>
export default {
  methods: {}
};
</script>

<style lang="scss" scoped>
footer {
  padding: 16px 0 0;
  margin: 32px auto 0;
  box-sizing: content-box;
  border-top: 1px solid rgba($color2, 0.1);
}

.introduction {
  font-size: 14px;
  line-height: 20px;
  color: rgba($color2, 0.6);
  a {
    font-family: "seb";
    color: $color2;
  }
}

.copyright {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  color: $color2;
  font-size: 14px;
  line-height: 20px;
  a {
    &::after {
      content: "|";
      margin-left: 6px;
      margin-right: 6px;
    }
    &:last-child {
      &::after {
        content: "";
      }
    }
  }
}

@media screen and (max-width: 750px) {
  footer {
    padding: 0 vw(46);
    margin-top: vw(32);
  }
  .introduction {
    font-size: vw(24);
    line-height: vw(32);
    margin: vw(24) 0 0;
  }

  .copyright {
    height: auto;
    flex-direction: column;
    padding: vw(20) 0;
    font-size: vw(24);
    &::before {
      background: none;
      box-shadow: none;
    }
    div {
      margin-bottom: vw(20);
    }
    a {
      &::after {
        margin-left: vw(8);
        margin-right: vw(8);
      }
    }
  }
}
</style>
