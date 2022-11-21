import React, {useEffect, useState} from "react";
import {useInterval} from "react-use";
import styled from "./rainTest.module.scss"


const RainTest = (props) => {
    const [toRain, setToRain] = useState([{offset: 0, key:0, rain:""}]);
    const [weather, setWeather] = useState();

    useEffect(() => {
        const mainDiv = document.getElementById('mainId');
        mainDiv.style.backgroundImage = 'linear-gradient(to bottom, #0B3B7C, #3176D6)';
    },[])
 
    useInterval(() => {

        if(toRain.length > 200){
            toRain.shift();
        }

        const offset = Math.floor(Math.random() * 2000);
        const key = offset + Math.random() * 100000000;
        const rain = "\u2758";

        toRain.push({offset, key, rain});

        setToRain([...toRain]);
    }, 100);
    
    return (
        <div>
            {toRain.map(({key, offset, rain}) => {
                return(
                    <div key={key} className={styled.rainDiv} style={{left:offset}}>
                        {rain}
                    </div>
                );
            })}
        </div>
    );
};

export default RainTest;

