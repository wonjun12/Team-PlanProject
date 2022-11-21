import React, { useEffect, useState } from "react";
import styled from "./selectPage.module.scss";

const SelectPage = () => {

    const [buttonDisable, setButtonDisable] = useState(true);

    const changeAni = () => {
        const selectedId = document.getElementById("selectedId");
        selectedId.style.transform = 'rotateY(90deg)';
        selectedId.style.transition = 'all 3s';
    };
    useEffect(() => {
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

    const click2 = () => {
        setButtonDisable(true);
        changeAni();
        setTimeout(() => {
            window.location.href = '/viewplan';
        },3100)
    }

    return(
        <div id="selectedId" className={styled.selectDiv}>
            <button onClick={click1} disabled={buttonDisable}> 1번 </button>
            <button onClick={click2} disabled={buttonDisable}> 2번 </button>
        </div>
    );
};

export default SelectPage;