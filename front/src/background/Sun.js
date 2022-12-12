import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";
import sytled from "./Sun.module.scss";

const SunTest = () => {

    const [mainDiv, setMainDiv] = useState();

    const [imgDeg, setImgDeg] = useState(0);
    const [imgChange, setImgChange] = useState(false);
    const [sunMove, setSunMove] = useState({left:'0%'});

    useEffect(() => {
        setMainDiv(document.getElementById("mainId"));
        setImgDeg(Math.random() * 110);
    },[]);

    useInterval(() => {
        if(imgDeg > 110) setImgChange(true);
        else if(imgDeg < -10) setImgChange(false);
        setImgDeg((deg) => {
           return (imgChange? (deg - 0.015) : (deg + 0.015));
        });

        mainDiv.style.backgroundImage = 
            `radial-gradient(circle at ${imgDeg}% 10%, #ffd460 0, #ffc764 8.33%, #ffb969 16.67%, #ffa96d 25%, #ff9870 33.33%, #ff8670 41.67%, #ea746e 50%, #d0636a 58.33%, #b95666 66.67%, #a54c63 75%, #934561 83.33%, #854060 91.67%, #7a3d60 100%)`;
        
        const leftPerse = (imgDeg - 1) + '%';

        setSunMove({left:leftPerse})
        
    },);

    return (
        <div>
            <div className={sytled.sunDiv} style={sunMove}>
                {"\u263C"}
            </div>
        </div>
    );

};

export default SunTest;