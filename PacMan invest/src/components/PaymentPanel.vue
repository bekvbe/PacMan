<template>
    <div>
        <div class="h1">
            PacMan Invest
        </div>
        <div class="asset-interface">
            <div class="row1">
                <h3>Select Staking Pool</h3>
                <select name="currencyes1" id="currencyes1" v-model="currencyCOMPOUND">
                    <option value="DAI">DAI</option>
                    <option value="USDC">USDC</option>
                    <option value="WBTC">WBTC</option>
                </select>
            </div>
            <div class="row2">
                <input type="checkbox" id='COMPOUND, eth-apy' value="COMPOUND" v-model="addItem">
                <label for="COMPOUND 0.06%">{{ currency[3]['tittle'] }} {{currency[3]['currency'][currencyCOMPOUND]}}%</label>
            <select name="currencyes" id="currencyes" v-model="currencySELECT">
                <option value="USDC">
                    USDC
                </option>
            </select>   
            </div>
            <div class="row3">
                <input type="text" value="" placeholder='USDC' v-model="addMoney" @click='calculate'>
                <button id='Invest' v-bind:disabled='status' @click="investMoney" v-bind:title="message">Supply</button>
            </div>
            <div class="row4">
                <input id="eth-redeem" type="text" placeholder="cUSDC" />
                <button id="eth-redeem-button" >Redeem</button>
            </div>
        </div>

        <MetaMask/>
     
    </div>
</template>
<script>
    import MetaMask from '@/components/MetaMask'
    import {mapActions, mapGetters} from "vuex"
    export default ({

    computed: {
        ...mapGetters('metaMaskStore',[
            'status',
            'message',
            'money'
        ]),
    },
    components: {
        MetaMask
    },
    props: [
        'compound'
    ],
    data(){
        return { 
            currencyCOMPOUND: '',
            currencySELECT: '',            
            currency: [
                {id: 1, tittle:"COMPOUND", currency:{
                    DAI: 2.69,
                    WBTC: 0.15,
                    USDC: 1.86 
                    },
                    name: {
                        DAI: 'DAI',
                        BTC: 'BTC',
                        USDC: 'USDC'
                    }
                },
                {id: 1, tittle:"COMPOUND", currency:{
                    DAI: 2.69,
                    WBTC: 0.15,
                    USDC: 1.86 
                    },
                    name: {
                        DAI: 'DAI',
                        BTC: 'BTC',
                        USDC: 'USDC'
                    }
                },
                {id: 1, tittle:"COMPOUND", currency:{
                    DAI: 2.69,
                    WBTC: 0.15,
                    USDC: 1.86 
                    },
                    name: {
                        DAI: 'DAI',
                        BTC: 'BTC',
                        USDC: 'USDC'
                    }
                },
                {id: 1, tittle:"COMPOUND", currency:{
                    DAI: 2.69,
                    WBTC: 0.15,
                    USDC: 1.86 
                    },
                    name: {
                        DAI: 'DAI',
                        BTC: 'BTC',
                        USDC: 'USDC'
                    }
                }
            ],
            addItem: [],
            addMoney: 0,
            finalMoney: 0
        }
    },
    methods:{
        ...mapActions('metaMaskStore', [
            'txPanel',
            'updateMoney',
            'updateAddItem',
            'updateCurrencyCOMPOUND',
        ]),
        investMoney: function(){
                this.calculate();

                if(this.finalMoney == 0 || this.addItem.length == 3){
                    return;
                }
                else if(this.currencySELECT == ''){
                    alert('Please select currency to payment');
                    return;
                }
                console.log(this.addMoney, this.addItem, this.currencyCOMPOUND)
                this.updateMoney({money: this.addMoney})
                this.updateAddItem({addItem: this.addItem})
                this.updateCurrencyCOMPOUND({curCOMPOUND: this.currencyCOMPOUND})
                this.txPanel()
            },

            calculate: function(){
            if(this.addItem.length == 3){
                alert('Please choose even items(2, 4, 6 ...)')
            }
            else{
                var total = 0
                this.addItem.forEach(item => {
                    if(item == 'COMPOUND'){
                        total += this.currency[3]['currency'][this.currencyCOMPOUND]/100 * (this.addMoney/this.addItem.length)
                    }
                    this.finalMoney = Number(total) + Number(this.addMoney);
                    });
                }
            },
            }
    })
    
</script>
<style>
html,
body {
  font-family: Arial;
  color: #FFFFFF;
  margin: 0px;
  padding: 0px;
  background-color: #1a1a1a;
}

.enable-button {
    position: absolute;
    right: 8vh;
    top: 3rem;
}
h1, .asset-interface {
    margin: 40px auto;
  }

.h1 {
    text-align-last: left;
    margin-left: 3vh;
    font-size: 34px;
    color: white;
}

button {
  border: none;
  color: #FFFFFF;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  box-shadow: 0px 2px 4px 1px #00000040;
  cursor: pointer;
}

#currencyes{
    margin-left: 10px;
}
label {
  font-weight: bold;
  font-size: 14px;
}

.enable-button {
  display: block;
  padding: 15px 32px;
  background-color: rgb(1, 5, 14);
}

.enable-button:hover {
  background-color: #0494fb;
}

.asset-interface button {
    width: 78px;
    margin: 0px 2px;
    padding: 6px;
    border-radius: 5px;
  background-color: #00D395;
}

.asset-interface button:hover {
  background-color: #00ffb3;
}

.asset-interface [type=text] {
    width: 53px;
    padding: 6px;
    text-align: center;
    font-size: 14px;
    background-color: #f0f0f0;
    border-radius: 3px;
    border: none;
}

.asset-interface {
    margin-top: 9rem;
    width: 344px;
    height: 251px;
    display: grid;
    align-items: center;
    grid-template-columns: 20px auto 20px;
    grid-template-rows: 74px 40px 30px 50px 50px 20px;
    text-align: center;
    color: #FFFFFF;
    background-color: #070A0E;
    border: solid 1px #4d4d4d;
    border-radius: 8px;
}

.asset-interface .row1 {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
}

.asset-interface .row2 {
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
}

.asset-interface .row3 {
  grid-column: 2 / span 1;
  grid-row: 4 / span 1;
}

.asset-interface .row4 {
  grid-column: 2 / span 1;
  grid-row: 5 / span 1;
}
</style>