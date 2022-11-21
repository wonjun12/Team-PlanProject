import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";
import styled from "./snowTest.module.scss";

const FallingSnow = () => {

    const [toSnow, setToSnow] = useState([{offset: 0, key: 0, fontSize: 10, bool:true, snow:""}]);

    useEffect(() => {
        const mainDiv = document.getElementById('mainId');
        mainDiv.style.backgroundImage = 'linear-gradient(to top, #a18cd1, #fbc2eb)';
    },[])


    useInterval(() => {

        if(toSnow.length > 200){
            toSnow.shift();
        }

        const bool = Math.random() < 0.5;
        const fontSize = 10 + (Math.random() * 10);
        const offset = Math.floor(Math.random() * 2000);
        const key = offset + Math.random() * 100000000;
        const snow = "\u2745";

        toSnow.push({offset, key, fontSize, bool, snow});

        setToSnow([...toSnow]);
    }, 250);

    return (
        <div>
            {toSnow.map(({key, offset, fontSize, bool, snow}) => {
                return(
                    (bool) ? 
                    <div key={key} className={styled.snowDiv} style={{left:offset, fontSize:fontSize}}>
                        {snow}
                    </div> : 
                    <div key={key} className={styled.snowDiv2} style={{left:offset, fontSize:fontSize}}>
                        {snow}
                    </div>
                    
                );
            })}
        </div>
    );
};

export default FallingSnow;
