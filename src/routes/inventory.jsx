import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'
import iron from '../img/meterials/crud/iron.webp';
import silver from '../img/meterials/crud/silver.webp';
import gold from '../img/meterials/crud/gold.webp';
import diamond from '../img/meterials/crud/diamond.webp';
import ice from '../img/meterials/crud/ice.webp';
import petroleum from '../img/meterials/crud/petroleum.webp';
import RecTimer from '../components/recTimer';

function Inventory(props) {

    const [sell, setSell] = useState();

    async function sellShip(id) {
        props.Toast(0, "Market is off")
    }

    return (
        <>
            <div className="container-fluid m-0 p-0 bg-stars">

                <div className="row gx-0">
                    <div className="col-3 bg-danger d-none d-md-block">
                        < Sidebar glx={props.glx} connectOrRegister={props.connectOrRegister} user={props.user} bnb={props.bnb} loading={props.loading} stateLoading={props.stateLoading} />
                    </div>

                    <div className="col-12 col-md-9">
                        <div className="w-market-container p-3">


                            <div className=''>
                                <RecTimer user={props.user} upEnergy={props.upEnergy} />
                            </div>
                            <div className="w-inventory-item p-2">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-center bg-title-market"> Ships </h3>

                                    </div>
                                    {props.loading ? <>
                                        <div class="spinner-border" role="status"></div>
                                    </> : <>
                                        {props.user.wallet != null ?
                                            props.ships.map((item) => {
                                                return (
                                                    <div key={item._id} className="col-12 col-sm-6 col-xl-3 ">
                                                        <div className="nft">
                                                            <div className="img">
                                                                <img className="nft-image w-100" src={item.img} />
                                                                <div className="mp-img">
                                                                    mp : {item.mp}
                                                                </div>
                                                                <div className="id-img">
                                                                    {item._id}
                                                                </div>
                                                                <div className="type-img d-flex">
                                                                    <div className="w-text-img">
                                                                        {item.type} {item.subType}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="energy">
                                                                <div className="border-energy">
                                                                    {item.energy > 0 ? <div className="in-energy">  </div> : <></>}
                                                                    {item.energy > 1 ? <div className="in-energy">  </div> : <></>}
                                                                    {item.energy < 2 ? <div className="out-energy">  </div> : <></>}
                                                                    {item.energy < 1 ? <div className="out-energy">  </div> : <></>}
                                                                </div>
                                                            </div>

                                                            <div className="row pt-1 gx-0">
                                                                <div className="col-6">
                                                                    <h4 className="name-nft m-0 p-0">{item.name}</h4>
                                                                    <p className="text-white m-0 p-0"> ATK {item.attack!= null?<>{item.attack}</>:<>0</> } </p>
                                                                </div>
                                                                <div className="col-6">
                                                                    <button onClick={() => sellShip(item.id)} className='form-control'> Sell </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            : <>
                                                No ships in inventory
                                            </>
                                        }
                                    </>}
                                </div>
                            </div>

                            <div className="w-inventory-item p-3">
                                <h3 className="text-center bg-title-market"> Materials </h3>

                                {props.user.wallet != null ? <>
                                    <div className="row">

                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Iron</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={iron} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.iron}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Silver</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={silver} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.silver}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Gold</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={gold} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.gold}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Diamond</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={diamond} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.diamond}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Ice</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={ice} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.ice}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 col-6 col-md-2  my-2">
                                            <div className="p-2 material-bg text-center ">
                                                <div>
                                                    <h4 className="text-white m-0 p-0">Petroleum</h4>
                                                </div>
                                                <div>
                                                    <img height="50px" className="" src={petroleum} />

                                                </div>
                                                <div className="text-white">
                                                    {props.user.materials.petroleum}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </> : <></>}

                            </div>

                            <div className="w-inventory-item p-3">
                                <h3 className="text-center bg-title-market"> Items </h3>
                                <div className="p-2 ">
                                    Coming soon...
                                </div>
                            </div>

                            <div className="w-inventory-item p-2">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className='text-center bg-title-market'>Account XP</h3>
                                        {props.user.wallet != null ? <>
                                            Minery: {props.user.xp.minery}
                                        </> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Inventory