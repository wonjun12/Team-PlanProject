import React, { useEffect, useState, createContext } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Styles from "./NewPlan.module.scss";
import { PlanContext } from '../context/PlanContext';

import NewPlanNav from "../component/NewPlanNav";

import SetPlan from "../component/SetPlan";
import DayPlan from "../component/DayPlan";

import Loading from "../loading/Loading";
import axios from "axios";

// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const EditPlan = () => {

  const { id } = useParams();

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

  const getDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = date.getDay();

    return `${yyyy}-${mm}-${dd}`;

    //요일 숫자로 넘기기
    // const dayStr = ["일","월","화","수","목","금","토"];
    // return `${mm}-${dd}-${dayStr[day]}`;
  }

  const setPlanData = async () => {
    const res = await axios.get(`/back/plan/${id}/overallPlan`);

    const plan = res.data.plan;

    let arr = [];
    for (let { _id, addr, check_in, check_out, reser, price, memo } of plan.lodging) {
      const ckin = check_in.split('T');
      const ckout = check_out.split('T');
      arr.push({
        id: _id,
        address: addr,
        check_in: ckin[0],
        check_out: ckout[0],
        reservation: reser,
        price: price,
        memo: memo,
      })
    }

    const start = plan.start.split('T');
    const end = plan.end.split('T');

    const time = Math.abs(new Date(plan.start).getTime() - new Date(plan.end).getTime());
    const days = Math.ceil(time / (1000*60*60*24))+1;

    const stTime = new Date(plan.starting.time);
    let hh = stTime.getHours();
    hh = hh >= 10 ? hh : '0' + hh;
    let mm = stTime.getMinutes();
    mm = mm >= 10 ? mm : '0' + mm;

    //날짜 배열 set / view 변경
    let dateArr = [];
    let date = new Date(start);
    for (let i = 0; i < parseInt(days); i++) {
      const dateStr = getDate(date);
      dateArr.push(
        dateStr
      );
      date.setDate(date.getDate() + 1);
    }
    arr.push('PlanView');
    setNavState({...navState, dateArr: arr});

    setPlan({
      PID: id,
      baseData: {
        start: start[0],
        end: end[0],
        days,
        title: plan.title,
      },
      startPlan: {
        id: plan.starting._id,
        address: plan.starting.addr,
        time: `${hh}:${mm}`,
        transportation: plan.starting.trans,
        memo: plan.starting.memo,
      },
      lodging: arr,
    })
  }

  //수정 페이지 CK
  const [baseEditCk, setBaseEditCk] = useState(false);

  useEffect(() => {
    if (id !== undefined) {
      setPlanData();
      setBaseEditCk(true);
    }
  }, []);

  return (
    <>
    {loading && <Loading/>}
    <div className={Styles.container}>
      <PlanContext.Provider
        value={{navState, setNavState, plan, setPlan, baseEditCk, setBaseEditCk, dataCk, setDataCk, setLoading}}>
        <NewPlanNav />
        <Routes>
          <Route path="/" element={<SetPlan />} />
          <Route path="/:day" element={<DayPlan />} />
        </Routes>

      </PlanContext.Provider>
    </div>
    </>
  );
}

export default EditPlan;