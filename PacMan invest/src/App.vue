<template>
  <div id="app" class="paymentbox">
    <PaymentPanel/>
  </div>
</template>

<script>
import PaymentPanel from './components/PaymentPanel'

export default {
  name: 'App',
  data(){
    return {
    }
  },
  components: {
    PaymentPanel
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style scoped>

</style>