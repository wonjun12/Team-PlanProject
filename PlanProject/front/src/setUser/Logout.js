import React from "react";
import { axiosPost } from "../Axios/backAxios";
import styled from "./Logout.module.scss";

const LogoutDiv = () => {

    const logoutFnc = () => {
        window.sessionStorage.setItem('loginCk', false);
        axiosPost('/user/logout', {}, '/');
    };

    return (
        <div className={styled.logout} title='로그아웃' onClick={logoutFnc}>
            <img src='/img/logout.png'/>
        </div>
    );
}

export default LogoutDiv;