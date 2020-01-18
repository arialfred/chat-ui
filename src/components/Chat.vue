<template>
  <div id="chat">
    <div id="messages" v-bar>
      <div style="margin-left: 10px; margin-right: 10px" v-chat-scroll>
        <div v-for="message in messages" :key="message.id">
          <template v-if="message.type === 'JOIN'">
            <p>{{message.sender}} joined!</p>
          </template>
          <template v-else-if="message.type === 'LEAVE'">
            <p>{{message.sender}} left!</p>
          </template>
          <template v-else-if="message.type === 'MESSAGE'">
            <p>{{message.sender}} says:</p>
            <p>{{message.content}}</p>
          </template>
          <hr/>
        </div>
      </div>
    </div>
    <div id="footer">
      <input id="message-input" ref="messageField" maxlength="200" v-model.trim="message" @keyup.enter="sendMessage" placeholder="Type a message and press Enter to send it.">
      <p>You are signed in as {{username}}. <button @click="signOut">Sign out</button></p>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  mounted() {
    this.$refs.messageField.focus();
    this.connect();
  },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      messages: [],
      message: "",
      stompClient: null,
      signInReplySubscription: null,
      chatSubscription: null
    }
  },
  methods: {
    connect: function () {
      const socket = new SockJS('http://localhost:8081/chat-ws');
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, this.onConnected, this.onError);
    },
    onConnected: function () {
      this.signInReplySubscription = this.stompClient.subscribe('/user/sign-in-reply', this.onMessageReceived);
      this.stompClient.send('/app/chat.signIn', JSON.stringify({
        username: this.username
      }));
    },
    onError: function () {
      this.signOut();
      alert('Connection error. Please try to sign in again.');
    },
    onMessageReceived: function (payload) {
      const message = JSON.parse(payload.body);
      if (message.type === 'SIGN_IN_REPLY') {
        this.signInReplySubscription.unsubscribe();
        if (message.content === 'OK') {
          this.chatSubscription = this.stompClient.subscribe('/topic/public', this.onMessageReceived);
          this.stompClient.send('/app/chat.broadcastUserJoin', JSON.stringify({
            type: 'JOIN',
            sender: this.username
          }));
        } else {
          this.signOut();
          alert('Username is already in use. Please sign in with different username.');
        }
      } else {
        message.id = this.messages.length + 1;
        this.messages.push(message);
      }
    },
    sendMessage: function () {
      if (this.message.length > 0) {
        this.stompClient.send('/app/chat.broadcastMessage', JSON.stringify({
          type: 'MESSAGE',
          content: this.message,
          sender: this.username
        }));
      }
      this.message = "";
      this.$refs.messageField.focus();
    },
    signOut: function () {
      this.disconnect();
      this.$emit("userSignedOut");
    },
    disconnect: function () {
      if (this.chatSubscription) {
        this.chatSubscription.unsubscribe();
      }
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    }
  }
}
</script>

<style scoped>
  #chat {
    height: 100vh;
    background-color: darkgray;
    display: grid;
    grid-template-rows: 1fr auto;
  }
  #messages {
    margin: 15px 15px 0 15px;
    background-color: white;
  }
  #footer {
    margin: 15px;
    grid-row-start: 2;
    grid-row-end: 3;
  }
  #message-input {
    width: 100%;
  }
</style>
