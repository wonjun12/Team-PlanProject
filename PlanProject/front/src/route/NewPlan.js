import React, { useEffect, useState, createContext } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Styles from "./NewPlan.module.scss";
import { PlanContext } from '../context/PlanContext';

import NewPlanNav from "../component/NewPlanNav";

import SetPlan from "../component/SetPlan";
import DayPlan from "../component/DayPlan";

import Loading from "../loading/Loading";

// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const NewPlan = () => {

  //로딩 state
  const [loading, setLoading] = useState(false);

  //Nav State
  const [navState, setNavState] = useState({
    view: 'STEP1',
    dateArr: [],
  })

  //여행 시작 계획 post 하기 전에 data 유효성 검사
  const [dataCk, setDataCk] = useState(false);

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

  //수정 페이지 CK
  const [baseEditCk, setBaseEditCk] = useState(false);

  useEffect(() => {
    
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className={Styles.container}>
        <PlanContext.Provider
          value={{ navState, setNavState, plan, setPlan, baseEditCk, setBaseEditCk, dataCk, setDataCk, setLoading }}>
          <NewPlanNav />
          <Routes>
            <Route path="/" element={<SetPlan />} />
            <Route path="/:id/:day" element={<DayPlan />} />
          </Routes>

        </PlanContext.Provider>
      </div>
    </>
  );
}

export default NewPlan;