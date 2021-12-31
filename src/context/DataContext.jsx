import React, { useState, createContext, useEffect } from 'react'
import urlApi from '../urlApi'
import axios from 'axios';
import { Toast } from './service'
import { web3, eth, mycontract, contractOwner } from './web3Service'
import minersShop from "../items/miners";
import iron_bar from '../img/meterials/refined/iron_bar.webp'
import silver_bar from '../img/meterials/refined/silver_bar.webp'
import gold_bar from '../img/meterials/refined/gold_bar.webp'
import cut_diamond from '../img/meterials/refined/cut_diamond.webp'
import ice_bar from '../img/meterials/refined/ice_bar.webp'
import oil from '../img/meterials/refined/oil.webp'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const [sellObj, setSellObj] = useState(minersShop)

    const [user, setUser] = useState({});
    const [ships, setShips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bnb, setBNB] = useState(0);
    const [glx, setGlx] = useState(0);
    const [refinerys, setRefinerys] = useState([])
    const [factorys,setFactorys] = useState([])

    useEffect(() => {
        connectOrRegister()
        getFactorys()
    }, []);

    const getFactorys = async ()=>{
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        const wallet = await accounts[0]
        const fac = await axios.get(urlApi+"/api/v1/getFactorys/"+wallet)
        setFactorys(fac.data)
    }

    function park() {
        var stationsPark = []
        ships.map((ship) => {
            if (ship.type === "Refinery") {
                stationsPark.push({
                    ...ship,
                    prepare: false
                })
            }
        })
        setRefinerys(stationsPark)
    }

    async function buyShip(objSell) {

        stateLoading(true)
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        const account = accounts[0]
        const price = objSell.sellPrice;
        await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: account,
                        to: contractOwner,
                        value: web3.utils.toHex(web3.utils.toWei(price, 'ether')),
                        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                        gas: web3.utils.toHex(web3.utils.toWei('22000', 'wei')),
                    },
                ],
            })
            .then(async (txHash) => {
                await buyShipDbUpdate(txHash, objSell)
                connectOrRegister()

                stateLoading(false)
                Toast(1, "Success Buy a ship");
                console.log("Transaction hash: " + txHash);
            })
            .catch((error) => {
                stateLoading(false)
                //getErrorToast(true, error.message)
                console.log(error.message)
                Toast(0, error.message)
            })
    }

    async function buyShipDbUpdate(txHash, objSell) {
        const hash = txHash
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        const account = accounts[0]
        const wallet = account.toLowerCase()
        const buyShip = await axios.put(urlApi + "/api/v1/buyship", { wallet, hash, objSell })
        console.log(buyShip.data)
        connectOrRegister()
    }

    /* window.ethereum.on('chainChanged', async (chainId) => {
         switchChain()
     }*/

    async function getBNB(w) {
        web3.eth.getBalance(w).then((r) => {
            setBNB(web3.utils.fromWei(r, 'ether'))
        })
    }
    //test 97 smart 56
    const net = web3.utils.toHex(97)



    async function connectOrRegister() {
        setLoading(true);
        if (typeof window.ethereum !== 'undefined') {
            const chainIdhex = await window.ethereum.request({ method: 'eth_chainId' })
            if (chainIdhex === net) {

                eth.request({ 'method': 'eth_requestAccounts' }).then(async (res) => {
                    const wallet = res[0].toLowerCase();
                    await getShips(wallet);
                    await getBNB(wallet);
                    await getGlx(wallet);
                    const axiosHeader = { headers: { "Content-Type": "application/json" } }
                    axios.post(urlApi + "/api/v1/x/", { wallet }, axiosHeader).then((res) => {
                        setUser(res.data);
                        setLoading(false);
                        var recharge = res.data.recharge
                        var rectime = recharge - Date.now()
                        if (rectime < 1) {
                            upEnergy(wallet)
                        }
                    }).catch((err) => {
                        alert(err.message);
                    });
                }).catch((err) => {
                    alert(err.message);
                })

            } else {
                alert("Wrong Network: Configure Binance Testnet in Metamask")
                switchEthereumChain()
            }
        } else {
            alert("Need Metamask extension!")
        }
    }


    async function switchEthereumChain() {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: net }],
        })
        connectOrRegister()
    }

    async function getShips(wallet) {
        const axiosHeader = { headers: { "Content-Type": "application/json" } }

        let ships = await axios.get(urlApi + '/api/v1/getShips/' + wallet, axiosHeader);
        //console.log(ships.data)
        setShips(ships.data)
    }

    async function upEnergy() {

        const account = await eth.request({ 'method': 'eth_requestAccounts' })
        const wallet = account[0].toLowerCase()
        const axiosHeader = { headers: { "Content-Type": "application/json" } }
        axios.put(`${urlApi}/api/v1/upEnergy`, { wallet }, axiosHeader)
            .then(res => console.log(res.data))
            .catch((err) => alert(err.message))
            .finally(() => connectOrRegister())
    }

    function stateLoading(imp) {
        setLoading(imp);
    }
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', () => {
            window.location.href = './login';
        });
    }


    async function getGlx(ownerAddress) {
        mycontract.methods.balanceOf(ownerAddress).call().then((r) => {
            setGlx(web3.utils.fromWei(r, 'ether'))
        })
    }

    //xxx
    const [miners, setMiners] = useState([])
    const [selectships, setSelectship] = useState(false);
    const [planet, setPlanet] = useState({});

    async function unlockPlanet(planet) {
        var amount
        if (planet === 0)
            amount = 600
        if (planet === 1)
            amount = 1000
        if (planet === 2)
            amount = 3000
        if (planet === 3)
            amount = 6000
        if (planet === 4)
            amount = 9000
        if (planet === 5)
            amount = 12000

        stateLoading(true)

        if (user.gm > amount) {
            const wallet = user.wallet.toLowerCase()
            const unlock = await axios.put(urlApi + "/api/v1/unlockPlanet", { planet, wallet, amount })
            Toast(1, "planet Unlocked")
            console.log(unlock)
            stateLoading(false)
            connectOrRegister()
        } else {
            Toast(0, "Insuficient GM balance!")
            stateLoading(false)
            connectOrRegister()
        }
    }

    function mineryLevel(xp) {
        if (xp < 58) 
            return 1
        if (xp >= 58 && xp < 420 )
            return 2
        if (xp >= 420 && xp < 1080 ) 
            return 3
        if( xp >= 1080 && xp < 2012)
            return 4
        if(xp >= 2012 && xp < 2920)
            return 5
        if(xp >= 2920)
            return 6      
    }

    async function prepareMaterial(station, material, cant) {
        if (cant < 5) {
            Toast(0, "Insuficient materials")
        } else {

            const newStationsState = []
            refinerys.forEach(async (e) => {
                if (station._id === e._id) {
                    e.prepare = true
                    e.material = material

                    e.result = switchMaterial(material)
                    e.cost = switchCost(material)

                    newStationsState.push(e)
                } else {
                    newStationsState.push(e)
                }
            });
            setRefinerys(newStationsState)
        }


    }

    const switchCost = material => {
        if (material === "iron")
            return 5
        if (material === "silver")
            return 10
        if (material === "gold")
            return 15
        if (material === "diamond")
            return 20
        if (material === "ice")
            return 25
        if (material === "petroleum")
            return 30
    }

    const switchMaterial = material => {
        if (material === "iron")
            return "Iron Bar"
        if (material === "silver")
            return "Silver Bar"
        if (material === "gold")
            return "Gold Bar"
        if (material === "diamond")
            return "Cut Diamond"
        if (material === "ice")
            return "Ice Bar"
        if (material === "petroleum")
            return "Oil"
    }

    function changeMaterialForImg(material) {
        if (material === "iron")
            return iron_bar
        if (material === "silver")
            return silver_bar
        if (material === "gold")
            return gold_bar
        if (material === "diamond")
            return cut_diamond
        if (material === "ice")
            return ice_bar
        if (material === "petroleum")
            return oil
    }
    async function refine(station) {

        if (station.energy > 0) {

            if (station.material === undefined) {
                Toast(0, "Select Material ")
            } else {
                const Headers = { headers: { "Content-Type": "application/json", } }
                stateLoading(true)
                await axios.put(urlApi + "/api/v1/refine", {
                    station,
                    wallet: user.wallet
                }, Headers)
                    .then(res => {
                        console.log(res.data)
                        if (!res.data.error) {
                            Toast(1, res.data.msg)
                        } else {
                            alert("Error!: " + res.data.msg)
                        }
                    })
                    .catch(err => alert(err))
                    .finally(() => {
                        connectOrRegister()
                        stateLoading(false)
                    })
            }
        } else {
            Toast(0, "No Energy!")
        }

    }

    const energyTozero = (energy) => {
        if (energy < 1) {
            return 0
        } else {
            return energy
        }
    }

    const dataX = {
        Toast,
        connectOrRegister,
        upEnergy,
        stateLoading,
        setSelectship,
        setPlanet,
        unlockPlanet,
        mineryLevel,
        setMiners,
        buyShipDbUpdate,
        buyShip,
        setSellObj,
        ships,
        glx,
        bnb,
        user,
        loading,
        planet,
        selectships,
        miners,
        contractOwner,
        minersShop,
        sellObj,
        refinerys,
        setRefinerys,
        park,
        prepareMaterial,
        switchCost,
        switchMaterial,
        changeMaterialForImg,
        refine,
        energyTozero,
        factorys

    }

    return (
        <DataContext.Provider value={dataX}>
            {children}
        </DataContext.Provider>
    )
}