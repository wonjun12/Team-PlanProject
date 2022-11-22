import React, { useEffect, useState } from "react";
import styled from "./selectPage.module.scss";
import loginCheck from "../check/loginCheck";

const SelectPage = () => {

    const [buttonDisable, setButtonDisable] = useState(true);

    const changeAni = () => {
        const selectedId = document.getElementById("selectedId");
        selectedId.style.transform = 'rotateY(90deg)';
        selectedId.style.transition = 'all 3s';
    };



    useEffect(() => {
        loginCheck();
        setTimeout(() => {
            setButtonDisable(false);
        }, 3100)
    },[])

    const click1 = () => {
        setButtonDisable(true);
        changeAni();
        setTimeout(() => {
            window.location.href = '/newplan';
        },3100)
    }

    return(
        <div id="selectedId" className={styled.selectDiv}>
            <div>
                <button onClick={click1} disabled={buttonDisable}> 계획표 작성 </button>
                <button disabled={buttonDisable}> 나의 계획표 </button>
            </div>
        </div>
    );
};

export default SelectPage;