import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";


function OrderTracking (){
    
    return (
            <div className="profile-page">
                <SideMenu />
                <div className="current-profile-page">
                    <div className="page-info-text">
                        <h5>Active Orders</h5>
                        <button>Add Order Manually</button>
                    </div>
                    <div className="order-area">
                        <div className="order-container">
                            <div className="container-top-part">
                                <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                                <p>Tablo NO</p>
                            </div>
                            <div className="container-bottom-part">
                                <div className="container-edit-area">
                                    <p>Orders</p>
                                    <button className="edit-icon-button"><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
                                </div>
                                <hr/>
                                <div className="order-detail">
                                    <p>Order Name & Amount</p>
                                    <p>Price</p>
                                </div>
                                <hr/>
                                <div className="order-total-info">
                                    <p>Total:</p>
                                    <p>Total Price</p>
                                </div>
                                <hr/>
                                <button className="settle-up-button">Settle Up</button>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>

    )
}
export default OrderTracking
