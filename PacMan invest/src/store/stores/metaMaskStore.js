export const metaMaskStore = {
  namespaced: true,
  state: {
    account: '',
    status: true,
    message: 'Please connect with Metamask',
    addrMetaMask: '',
    money: '',
    addItem: [],
    metamaskAddress: '',
    currencyCOMPOUND: '',
    countTxWBTC: '',
    countTxUSDC: '',
    countTxDAI: '',
  },

  getters: {
    account(state) {
      return state.account
    },
    status(state) {
      return state.status
    },
    message(state) {
      return state.message
    },
    addItem(state) {
      return state.addItem
    },
    money(state) {
      return state.money
    },
    addrMetaMask(state) {
      return state.metamaskAddress
    },

  },
  mutations: {
    setAccount(state, accounts) {
      state.account = accounts[0]
    },
    setStatus(state, status) {
      state.status = status
    },
    setMessage(state, message) {
      state.message = message
    },
    setAddrMetaMask(state, addrMetaMask) {
      state.addrMetaMask = addrMetaMask
    },
    setMoney(state, money) {
      state.money = money
    },
    setCurrencyCOMPOUND(state, currencyCOMPOUND) {
      state.currencyCOMPOUND = currencyCOMPOUND
    },
    setAddItem(state, addItem) {
      state.addItem = addItem
    },
    setCountTxWBTC(state, countTxWBTC) {
      state.countTxWBTC = countTxWBTC
    },
    setCountTxDAI(state, countTxDAI) {
      state.countTxDAI = countTxDAI
    },
    setCountTxUSDC(state, countTxUSDC) {
      state.countTxUSDC = countTxUSDC
    },
  },

  actions: {
    updateCountTxDAI: async ({ commit }, countTxDAI) => {
      commit('setCountTxDAI', countTxDAI.countDAI)
    },

    updateCountTxUSDC: async ({ commit }, countTxUSDC) => {
      commit('setCountTxUSDC', countTxUSDC.countUSDC)
    },

    updateCountTxWBTC: async ({ commit }, countTxWBTC) => {
      commit('setCountTxWBTC', countTxWBTC.countWBTC)
    },

    updateAddItem: async ({ commit }, addItem1) => {
      commit('setAddItem', addItem1.addItem)
    },

    updateCurrencyCOMPOUND: async ({ commit }, curCOMPOUND) => {
      commit('setCurrencyCOMPOUND', curCOMPOUND)
    },

    updateMoney: async ({ commit }, money) => {
      commit('setMoney', money)
    },

    // Подключить Metamask
    connectToMetamask: async ({ commit }) => {
      if (typeof window.ethereum === 'undefined') {
        alert('Please download the plugin "Metamask".');
        return
      }
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      commit('setAccount', result)
      commit('setStatus', false)
      commit('setMessage', 'Metamask connected')
    },

    // 4. Метод для стейкинга токенов в Rinkeby (Compound/)
    sendToken: async ({ state }, data) => {
      const Web3 = require('web3')
      const nodeAddr = 'https://rinkeby.infura.io/v3/c542afb4643c4724b04582e99c2037b3'
      const web3 = new Web3(nodeAddr)
      let abi = data.abi
      let abiStaking = data.abiStaking
      let addr = data.addr
      let addrStaking = data.addrStaking
      let tokenAmount = parseInt(data.tokenAmount / data.counter, 10)
      console.log('Rinkeby Token     ' + tokenAmount)
      let senderAddr = state.account
      let counter = 0
      let contractErc20 = new web3.eth.Contract(abi, addr)
      let contractStaking = new web3.eth.Contract(abiStaking, addrStaking)
      let approve = contractErc20.methods.approve(addrStaking, tokenAmount).encodeABI()
      let params = [{
        from: senderAddr,
        gasPrice: web3.utils.toHex(web3.utils.toWei("21", "Gwei")),
        gas: web3.utils.toHex(web3.utils.toWei("100000", "wei")),
        data: approve
      }]
      window.ethereum.request({
        method: 'eth_sendTransaction',
        params: params
      })
        .then(async function (res) {
          let timeOut = setInterval(function () {
            counter += 1
            let checkTx = web3.eth.getTransactionReceipt(res)
            if (checkTx != null) {
              let mint = contractStaking.methods.mint(tokenAmount).encodeABI()
              let params = [{
                from: senderAddr,
                to: addrStaking,
                gas: web3.utils.toHex('210000'),
                gasPrice: web3.utils.toHex(web3.utils.toWei('21', 'gwei')),
                data: mint
              }]
              window.ethereum.request({
                method: 'eth_sendTransaction',
                params: params
              })
              clearTimeout(timeOut)
            }
            if (counter == 10) {
              clearTimeout(timeOut)
            }
          }, 5500)
        })
    },

    callTheSendToken: async ({ state, dispatch }, data) => {
      let tokenAmount = data.tokenAmount
      let counter = data.counter
      state.addItem.forEach(item => {
        if (item == 'COMPOUND') {
          if (state.currencyCOMPOUND.curCOMPOUND == 'WBTC') {
            dispatch('sendToken', {
              abiStaking: require('../../../abi/abiCWbtc.json'),
              abi: require('../../../abi/abiWbtc.json'),
              addrStaking: '0x0014f450b8ae7708593f4a46f8fa6e5d50620f96',
              addr: '0x577d296678535e4903d59a4c929b718e1d575e0a',
              tokenAmount: tokenAmount,
              counter: counter
            })
          }
        }
      });
    },
    // 3. Обмен токенов
    swapToken: async ({ state, dispatch }, data) => {
      let Web3 = require('web3')
      let UNISWAP = require('@uniswap/sdk')
      let url = 'https://rinkeby.infura.io/v3/502b002c20104834a8fbda450229f913'
      let web3 = new Web3(url)
      let uniswapAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
      let uniswapAbi = require('../../../abi/abiUniswap.json')
      let tokenA = data.tokenA
      let abiA = data.abiA
      let tokenB = data.tokenB
      let countTx = data.counter
      let senderAddr = state.account
      let USDCAddr = '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b'
      // Что бы не обменивать одну валюту больше 1 раза 
      let tokenAmount = (state.money.money / state.addItem.length) * countTx
      // Отправляет сразу на стейкинг если это USDC
      if (tokenB == USDCAddr) {
        tokenAmount *= 1000000
        dispatch('callTheSendToken', { tokenAmount: tokenAmount, counter: countTx })
        return
      }
      // Этот метод { trade() } узнает курс между {TOKEN}/USDC
      async function trade() {
        console.log('TRADE PANEL')
        const USDC = new UNISWAP.Token(UNISWAP.ChainId.RINKEBY, USDCAddr, 6)
        const USDCtoSwapToken = new UNISWAP.Token(UNISWAP.ChainId.RINKEBY, tokenB, 18)
        const USDCtoSwapTokenUSDCPair = await UNISWAP.Fetcher.fetchPairData(USDCtoSwapToken, USDC)
        const route = new UNISWAP.Route([USDCtoSwapTokenUSDCPair], USDCtoSwapToken)
        let pricePair = route.midPrice.toSignificant(6)
        console.log(pricePair)
        tokenAmount = parseInt((tokenAmount / pricePair) * 1000000, 10)
        console.log(tokenAmount + ' asddassdadaaddaasdadsadsdadsadasdadsadsadasdadsdas')
      }
      await trade()
      let contractUniswap = new web3.eth.Contract(uniswapAbi, uniswapAddr)
      let contractA = new web3.eth.Contract(abiA, tokenA)
      let approveA = contractA.methods.approve(uniswapAddr, tokenAmount).encodeABI()
      let paramsA = [{
        from: senderAddr,
        to: tokenA,
        gas: web3.utils.toHex('210000'),
        gasPrice: web3.utils.toHex(web3.utils.toWei('21', 'gwei')),
        data: approveA
      }]
      window.ethereum.request({
        method: 'eth_sendTransaction',
        params: paramsA
      }).then(function (res) {
        console.log(res)
        let setTimer = setInterval(async function (res) {
          let checkTx = web3.eth.getTransactionReceipt(res)
          if (checkTx != null) {
            let swapERC20TokenToERC20Token = contractUniswap.methods.swapExactTokensForTokens(
              tokenAmount,
              '10000000',
              [tokenA, tokenB],
              senderAddr,
              "1629882772").encodeABI()
            let paramsUniswap = [{
              from: senderAddr,
              to: uniswapAddr,
              gas: web3.utils.toHex('210000'),
              gasPrice: web3.utils.toHex(web3.utils.toWei('21', 'gwei')),
              data: swapERC20TokenToERC20Token
            }]
            window.ethereum.request({
              method: 'eth_sendTransaction',
              params: paramsUniswap
            }).then(function (res) {
              setTimer = setInterval(function () {
                if (web3.eth.getTransactionReceipt(res) != null) {
                  dispatch('callTheSendToken', { tokenAmount: tokenAmount, counter: countTx })
                  clearTimeout(setTimer)
                }
              }, 3000)
            })
          }
          clearTimeout(setTimer)
        }, 10000)
      })


    },
    // 2. Метод для подсчета сколько одинаковых валют что бы обменять их 1 раз
    swapPanel: async ({ state, dispatch }) => {
      let arrayCurrency = [state.currencyCOMPOUND.curCOMPOUND, state.currencyAAVE.curAAVE,
      state.currency1INCH.cur1INCH, state.currencyUNISWAP.curUNISWAP]
      let countWBTC = 0
      let countDAI = 0
      let countUSDC = 0

      await arrayCurrency.forEach(currency => {
        if (currency == 'WBTC') {
          countWBTC += 1
        }
        else if (currency == 'DAI') {
          countDAI += 1
        }
        else if (currency == 'USDC') {
          countUSDC += 1
        }
      });
      console.log(countWBTC, countDAI, countUSDC)
      if (countWBTC > 0) {
        dispatch('updateCountTxWBTC', { countWBTC: countWBTC })
        dispatch('swapToken', {
          abiA: require('../../../abi/usdcAbi.json'),
          tokenA: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
          abiB: require('../../../abi/abiWbtc.json'),
          tokenB: "0x577d296678535e4903d59a4c929b718e1d575e0a",
          counter: countWBTC
        })
      }
      if (countDAI > 0) {
        dispatch('updateCountTxDAI', { countDAI: countDAI })
        dispatch('swapToken', {
          abiA: require('../../../abi/usdcAbi.json'),
          tokenA: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
          abiB: require('../../../abi/abiDai.json'),
          tokenB: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
          counter: countDAI
        })
      }
      if (countUSDC > 0) {
        dispatch('updateCountTxUSDC', { countUSDC: countUSDC })
        dispatch('swapToken', {
          abiA: require('../../../abi/usdcAbi.json'),
          tokenA: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
          abiB: require('../../../abi/abiDai.json'),
          tokenB: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
          counter: countUSDC
        })
        countUSDC = 0
      }
    },

    // 1. Вызывает панель для обмена токенов(swapPanel)
    txPanel: async ({ dispatch }) => {
      await dispatch('swapPanel')

    },

  }

}
