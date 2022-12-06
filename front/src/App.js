import { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { axiosPost } from "./Axios/backAxios";
import "./App.scss";
import Rain from "./background/Rain";
import Sun from "./background/Sun";
import Snow from "./background/Snow";
import Login from "./setUser/Login";
import LogoutDiv from "./setUser/Logout";
import SelectPage from "./select/SelectPage";
import EmailCk from "./check/EmailCk";

import ViewPlan from "./route/ViewPlan";
import axios from "axios";



import NewPlan from "./route/NewPlan";


function App() {

  const [weather, setWeather] = useState('');
  const [loginCk, setLoginCk] = useState(false);


  useEffect(() => {
    loginCkFnc();
  }, [])

  const loginCkFnc = async () => {
    const { result } = await axiosPost('/home/loginCk');
    window.sessionStorage.setItem('loginCk', result);
    setLoginCk(result);
  }

  const backgroundFnc = () => {
    if (weather === 'Rain') {
      return <Rain />
    } else if (weather === 'Snow') {
      return <Snow />
    } else {
      return <Sun />
    }
  }

  //현재 위치 정보 허용
  const onGeoOk = async (position) => {

    //현재 위도,경도
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    //API
    const API_KEY = "29e6fdb8f4a2c1394c290696729a9c86";
    const url = `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await axios.get(url);
    //console.log(res.data);
    setWeather(res.data.weather[0].main);

    // fetch(url)                            
    // .then(response => response.json()) 
    // .then((data) => {
    //   console.log(data);
    //   console.log(data.name);//지역
    //   console.log(data.weather[0].main);//날씨
    //   // 날씨 종류 : Rain, Snow, Clouds, Clear 등등 https://openweathermap.org/weather-conditions
    //   console.log(data.main.temp);//온도
    // });
  }

  //현재 위치 정보 거부
  const onGeoError = () => {
    alert("Can't find you. No weather for you.");
  }

  useEffect(() => {
    //현재 위치 정보 가져오기 (허용, 거부)
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  }, [])


  return (
    <div className="mainDiv" id="mainId">
      {backgroundFnc()}
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/emailCerti" element={<EmailCk />}></Route>
            <Route path="/select" element={<SelectPage />}></Route>

            {/* <Route path="/newplan/*" element={<SetPlan />}></Route> */}

            {/* 수정중 */}
            <Route path="/newplan/*" element={<NewPlan />}></Route>

            <Route path="/viewplan" element={<ViewPlan />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      {(loginCk) ? <LogoutDiv /> : null}
    </div>
  );
}

export default App;
