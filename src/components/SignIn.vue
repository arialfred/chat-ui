<template>
  <div id="login">
    <h1>Real-time chat</h1>
    <input maxlength="30" ref="usernameField" v-model.trim="username" @keyup.enter="signIn" placeholder="Please enter a username">
    <button :disabled="username.length === 0" @click="signIn">Sign in</button>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$refs.usernameField.focus();
    },
    data: function () {
      return {
        username: ""
      }
    },
    methods: {
      signIn() {
        if (this.username.length > 0) {
          this.$emit("userSignedIn", this.username);
        } else {
          this.$refs.usernameField.focus();
        }
      }
    }
  }
</script>

<style scoped>
  #login {
    margin: 15px;
  }
</style>
