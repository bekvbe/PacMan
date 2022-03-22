<template>
    <div>
        <a type="button" class='neon-button' @click="connectToMetamask">Connect Wallet</a>
        <h4 class="accountBox">Account: <span class="showAccount">{{ account }}</span></h4>
    </div>
</template>

<script>
import {mapActions, mapGetters }from 'vuex'

export default({
    name: 'MetaMask',
    data () {
        return {
            disabled: true,
            messageMetamask: "Metamask connected"
        }
    },
    computed: {
        ...mapGetters('metaMaskStore',[
            'account'
        ])
    },
    methods: {
        ...mapActions('metaMaskStore', [
            'connectToMetamask'
        ]),
    }
})
</script>

<style scoped>
    .neon-button{
        position: absolute;
        right: 8vh;
        top: 3rem;
        display: block;
        padding: 15px 32px;
        background-color: rgb(1, 5, 14);
        cursor: pointer;
        color: white;
    }
    .neon-button:hover{
        background-color: #0494fb;
    }
    .accountBox {
        position: relative;
        top: -300;
    }
    .accountBox {
        position: absolute;
        right: 17rem;
        top: 26px; 
        display: block;
        padding: 15px 32px;
        background-color: rgb(1, 5, 14);
        cursor: pointer;
        color: white;
    }

</style>
