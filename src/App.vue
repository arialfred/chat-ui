<template>
  <div id="app">
    <SignIn v-if="!isUserSignedIn" @userSignedIn="userSignedIn" />
    <Chat v-else @userSignedOut="userSignedOut" :username="username" />
  </div>
</template>

<script>
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";

export default {
  data: function() {
    return {
      isUserSignedIn: false,
      username: ""
    }
  },
  methods: {
    userSignedIn: function(username) {
      this.username = username;
      this.isUserSignedIn = true;
    },
    userSignedOut: function() {
      this.isUserSignedIn = false;
      this.username = "";
    }
  },
  components: {
    Chat,
    SignIn
  }
}
</script>
