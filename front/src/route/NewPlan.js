import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Styles from "./SetPlan.module.scss";

import NewPlanNav from "../component/NewPlanNav";

import SetPlan from "../component/SetPlan";
import DayPlan from "../component/DayPlan";



import LastPlan from "../component/LastPlan";
import PlanView from "../component/PlanView";


import { ThemeContext } from "../context/ThemeContext";
// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const NewPlan = () => {

  //View Content
  const [view, setView] = useState("STEP1");

  //날짜 배열
  const [dateArr, setDateArr] = useState([]);

  return (
    <div className={Styles.container}>

      <ThemeContext.Provider
        value={{ view, setView, dateArr, setDateArr }}>
        <NewPlanNav />
        <Routes>
          <Route path="/" element={<SetPlan />} />
          <Route path="/dayplan/:id/:date" element={<DayPlan />} />
        </Routes>

      </ThemeContext.Provider>
    </div>
  );
}

export default NewPlan;