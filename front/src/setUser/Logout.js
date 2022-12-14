import React from "react";
import  axiosPost  from "../Axios/backAxiosPost";
import styled from "./Logout.module.scss";

const LogoutDiv = () => {

    const logoutFnc = () => {
        window.sessionStorage.setItem('loginCk', false);
        axiosPost('/user/logout', {}, '/');
    };

    return (
        <div className={styled.logout} title='๋ก๊ทธ์์' onClick={logoutFnc}>
            <img src='/img/logout.png'/>
        </div>
    );
}

export default LogoutDiv;