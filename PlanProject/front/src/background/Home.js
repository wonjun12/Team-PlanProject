import React from 'react';
import styled from './Home.module.scss';
import { useLocation, useNavigate } from 'react-router-dom'

const HomeImg = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const goHome =() => {
        if(location.pathname !== '/'){
            navigate('/select');
        }
    }

    return (
        <div onClick={goHome} className={styled.homeDiv}>
            <img src='/img/home.png' />
        </div>
    )

}

export default HomeImg;