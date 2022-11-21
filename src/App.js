import { useEffect, useState } from "react";
import RainTest from "./scss/rainTest";
import MainInput from "./scss/loginTest";
import SunTest from "./scss/sunTest";

import styled from "./App.scss";
import FallingSnow from "./scss/snowTest";

import SelectPage from "./select/SelectPage";

import { Route, Routes, BrowserRouter } from "react-router-dom";

//지도test
import NaverMapTest from "./naverAPI/naverMap";

//test
import NewPlan from "./component/NewPlan"
import SetPlan from "./component/SetPlan"
import ViewPlan from "./component/ViewPlan";


function App() {

  const [weather, setWeather] = useState('');

  useEffect(() => {
    setWeather('snow');
  },[])

  const backgroundFnc = () => {
    if(weather === 'rain'){
      return <RainTest/>
    }else if(weather === 'snow') {
      return <FallingSnow/>
    }else {
      return <SunTest/>
    }
  }


  return (
    <div className="mainDiv" id="mainId">
      {backgroundFnc()}
      <div className="App">
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainInput/>}></Route>
            <Route path="/select" element={<SelectPage/>}></Route>

            <Route path="/newplan" element={<NewPlan/>}></Route>
            <Route path="/newplan/:start/:end/:days/:title" element={<SetPlan/>}></Route>
            
            <Route path="/viewplan" element={<ViewPlan/>}></Route>
          </Routes>
        </BrowserRouter>
        
      </div>
    </div>
  );
}

export default App;
