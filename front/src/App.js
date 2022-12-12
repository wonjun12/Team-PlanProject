import { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import axiosPost from "./Axios/backAxiosPost";
import "./App.scss";
import Rain from "./background/Rain";
import Sun from "./background/Sun";
import Snow from "./background/Snow";
import Login from "./setUser/Login";
import LogoutDiv from "./setUser/Logout";
import SelectPage from "./select/SelectPage";
import EmailCk from "./check/EmailCk";


import NewPlan from "./route/NewPlan";
import ViewPlan from "./route/ViewPlan";
import EditPlan from "./route/EditPlan";

import PwdChange from "./pwdChange/PwdChange";
import OnGeoOk from "./weather/weather";
import MyPage from "./mypage/MyPage";
import HomeImg from "./background/Home";

function App() {

  const [weather, setWeather] = useState('');
  const [loginCk, setLoginCk] = useState(false);

  useEffect(() => {
    loginCkFnc();
    getWeather();
  },[])

  const getWeather = async () => {
    const getWeather = await OnGeoOk();
    setWeather(getWeather);
  }

  const loginCkFnc = async () => {
    const {result} = await axiosPost('/home/loginCk');
    window.sessionStorage.setItem('loginCk', result);
    setLoginCk(result);
  }

  const backgroundFnc = () => {
    if(weather === 'rain'){
      return <Rain/>
    }else if(weather === 'snow') {
      return <Snow/>
    }else {
      return <Sun/>
    }
    
  }

  return (
    <div className="mainDiv" id="mainId">
      {backgroundFnc()}
      <div className="App">
        <BrowserRouter>
        <HomeImg/>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/emailCerti" element={<EmailCk/>}></Route>
            <Route path="/select" element={<SelectPage/>}></Route>

            <Route path="/newplan/*" element={<NewPlan />}></Route>

            <Route path="/editplan/*" element={<EditPlan />}></Route>

            <Route path="/mypage" element={<MyPage/>}></Route>
            
            <Route path="/viewplan/:id" element={<ViewPlan/>}></Route>

            <Route path="/password" element={<PwdChange/>}></Route>

          </Routes>
        </BrowserRouter>
      </div>
      {(loginCk)? <LogoutDiv/> : null}
    </div>
  );
}

export default App;
