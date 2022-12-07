import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Styles from "./NewPlan.module.scss";

import NewPlanNav from "../component/NewPlanNav";

import SetPlan from "../component/SetPlan";
import DayPlan from "../component/DayPlan";

import PlanView from "../component/PlanView";

import { ThemeContext } from "../context/ThemeContext";
// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const NewPlan = () => {

  //게시글 생성 되면 PID를 가져와서 Nav에서 사용
  const [pid, setPid] = useState("");

  //server_url
  const PLAN_URL = 'http://localhost:3000/back/plan';

  //View Content
  const [view, setView] = useState("STEP1");

  //날짜 배열
  const [dateArr, setDateArr] = useState([]);

  //출발 정보
  const [startPlan, setStartPlan] = useState({
    address: "",
    time: "",
    transportation: "car",
    memo: "",
  });

  //숙소 정보
  const [logding, setLogding] = useState([{
    address: "",
    check_in: "",
    check_out: "",
    reservation: false,
    price: "",
    memo: "",
  }]);

  return (
    <div className={Styles.container}>

      <ThemeContext.Provider
        value={{ view, setView, dateArr, setDateArr, pid, setPid, PLAN_URL, 
          startPlan, setStartPlan, logding, setLogding }}>
        <NewPlanNav />
        <Routes>
          <Route path="/" element={<SetPlan />} />
          <Route path="/dayplan/:id/:day" element={<DayPlan />} />
        </Routes>

      </ThemeContext.Provider>
    </div>
  );
}

export default NewPlan;