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


import NewPlan from "./component/NewPlan"
import SetPlan from "./component/SetPlan"
import ViewPlan from "./component/ViewPlan";



function App() {

  const [weather, setWeather] = useState('');
  const [loginCk, setLoginCk] = useState(false);


  useEffect(() => {
    loginCkFnc();
  },[])

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
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/emailCerti" element={<EmailCk/>}></Route>
            <Route path="/select" element={<SelectPage/>}></Route>

            <Route path="/newplan" element={<NewPlan/>}></Route>
            <Route path="/newplan/:start/:end/:days/:title" element={<SetPlan/>}></Route>
            
            <Route path="/viewplan" element={<ViewPlan/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      {(loginCk)? <LogoutDiv/> : null}
    </div>
  );
}

export default App;
