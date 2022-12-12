import React, { createContext, useEffect, useState } from "react";
import { DayNav } from './PlanNav'; //네비
import DayPlan from './DayPlan'; //일별 계획

import { useParams } from "react-router-dom";
import axios from "axios";

export const DayContext = createContext();

const initPlan = {
  PID: "", //게시글PID
  baseData: {
    //여행 기본 정보
    start: '',
    end: '',
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
}

const SetDayPlan = ({ editCk, setLoading }) => {

  //edit 일경우 플랜 id 를 가져온다
  const { id } = useParams();

  //네비
  const [navState, setNavState] = useState(0);

  //네비 DateArr
  const [dateArr, setDateArr] = useState([]);

  //여행 시작 계획
  const [plan, setPlan] = useState(initPlan);


  const dateToStr = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = date.getDay();

    return `${yyyy}-${mm}-${dd}`;

    //요일 숫자로 넘기기
    // const dayStr = ["일","월","화","수","목","금","토"];
    // return `${mm}-${dd}-${dayStr[day]}`;
  }

  // date => hh:mm
  const timeToStr = (dateStr) => {
    const time = new Date(dateStr);
    let hh = time.getHours();
    hh = hh >= 10 ? hh : '0' + hh;
    let mm = time.getMinutes();
    mm = mm >= 10 ? mm : '0' + mm;
    return `${hh}:${mm}`;
  }


  //plan 기본 정보 가져오기
  const fetchData = async () => {
    const res = await axios.get(`/back/plan/${id}/overallPlan`);
    const plan = res.data.plan;

    //숙소 정보
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

    //start 정보
    const start = plan.start.split('T');
    const end = plan.end.split('T');
    const time = timeToStr(plan.starting.time);

    //plan state에 담가
    setPlan({
      PID: id,
      baseData: {
        start: start[0],
        end: end[0],
        title: plan.title,
      },
      startPlan: {
        id: plan.starting._id,
        address: plan.starting.addr,
        time,
        transportation: plan.starting.trans,
        memo: plan.starting.memo,
      },
      lodging: arr,
    });

    //날짜 nav 만들기
    const dateTime = Math.abs(new Date(plan.start).getTime() - new Date(plan.end).getTime());
    const days = Math.ceil(dateTime / (1000 * 60 * 60 * 24));
    let dateArr = [];
    let date = new Date(start);
    for (let i = 0; i <= days; i++) {
      const dateStr = dateToStr(date);
      dateArr.push(
        dateStr
      );
      date.setDate(date.getDate() + 1);
    }
    setDateArr(dateArr);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DayContext.Provider value={{ dateArr, plan, navState, setNavState, editCk, setLoading }}>
      <DayNav />
      <DayPlan />
    </DayContext.Provider>
  );
}

export default SetDayPlan;