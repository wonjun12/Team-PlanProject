import React, { useEffect, useState, createContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Styles from "./NewPlan.module.scss";
import { PlanContext } from '../context/PlanContext';

import NewPlanNav from "../component/NewPlanNav";

import SetPlan from "../component/SetPlan";
import DayPlan from "../component/DayPlan";

import PlanView from "../component/PlanView";

// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const NewPlan = () => {

  /*
  //게시글 생성 되면 PID를 가져와서 Nav에서 사용
  const [pid, setPid] = useState("");

  //server_url
  const PLAN_URL = '/back/plan';

  //View Content
  const [view, setView] = useState("STEP1");

  //날짜 배열
  const [dateArr, setDateArr] = useState([]);
  */

  //Nav State
  const [navState, setNavState] = useState({
    view: 'STEP1',
    dateArr: [],
  })

  //여행 시작 계획
  const [plan, setPlan] = useState({
    PID: "", //게시글이 생성 되면 PID 저장
    baseData: {
      //여행 기본 정보
      start: '',
      end: '',
      days: '',
      title: '',
    },
    startPlan: {
      //출발 정보
      id: '',
      address: "",
      time: "",
      transportation: "car",
      memo: "",
    },
    lodging: [{
      //숙소 정보
      id: '',
      address: "",
      check_in: "",
      check_out: "",
      reservation: false,
      price: "",
      memo: "",
    }]
  });

  // //여행 기본 정보
  // const [baseData, setBaseData] = useState({
  //   start: '',
  //   end: '',
  //   days: '',
  //   title: '',
  // });

  // //출발 정보
  // const [startPlan, setStartPlan] = useState({
  //   id: '',
  //   address: "",
  //   time: "",
  //   transportation: "car",
  //   memo: "",
  // });

  // //숙소 정보
  // const [lodging, setlodging] = useState([{
  //   id: '',
  //   address: "",
  //   check_in: "",
  //   check_out: "",
  //   reservation: false,
  //   price: "",
  //   memo: "",
  // }]);

  //수정 페이지 CK
  const [baseEditCk, setBaseEditCk] = useState(false);

  useEffect(() => {
    console.log(baseEditCk);
  }, [baseEditCk]);

  return (
    <div className={Styles.container}>

      {/* <PlanContext.Provider
        value={{
          view, setView, dateArr, setDateArr, pid, setPid, PLAN_URL,
          baseData, setBaseData, startPlan, setStartPlan, lodging, setlodging, baseEditCk, setBaseEditCk
        }}> */}

      <PlanContext.Provider
        value={{navState, setNavState, plan, setPlan, baseEditCk, setBaseEditCk}}>
        <NewPlanNav />
        <Routes>
          <Route path="/" element={<SetPlan />} />
          <Route path="/" element={<SetPlan />} />
          <Route path="/dayplan/:id/:day" element={<DayPlan />} />
        </Routes>

      </PlanContext.Provider>
    </div>
  );
}

export default NewPlan;