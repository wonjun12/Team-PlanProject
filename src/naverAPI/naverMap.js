import React, { useEffect } from "react";
import {naverMapSet, naverMapSearch} from "./naverMapApi";

const NaverMapTest = () => {
    useEffect(() => {
        naverMapSet(11);
    }, [])

    const mapSearch = (v) => {
        const search = v.target.value;
        
        naverMapSearch(search);

    };

    return(
        <div>
            <input onChange={mapSearch} />
            <div id="naverDiv" style={{width:'300px', height:'300px', zIndex:0}}>
            </div>
        </div>
    );
};

export default NaverMapTest;