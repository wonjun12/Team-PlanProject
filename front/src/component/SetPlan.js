import React, { createContext, useEffect, useState } from "react";

import { StartNav } from './PlanNav'; //네비
import SetDate from "./SetDate"; //날짜
import Start from "./Start"; //출발지
import Lodging from "./Lodging"; //숙소

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

export const StartContext = createContext();

const initPlan = {
  PID: "", //게시글PID
  baseData: {
    //여행 기본 정보
    start: '',
    end: '',
    days: 0,
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

const SetPlan = ({ editCk, setLoading, loading }) => {

  const navigate = useNavigate();

  //edit 일경우 플랜 id 를 가져온다
  const { id } = useParams();

  //네비
  const [navState, setNavState] = useState('STEP1');

  //여행 시작 계획
  const [plan, setPlan] = useState(initPlan);

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
    setLoading(true);
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

    const dateTime = Math.abs(new Date(plan.start).getTime() - new Date(plan.end).getTime());
    const days = Math.ceil(dateTime / (1000*60*60*24)) + 1;

    //plan state에 담가
    setPlan({
      PID: id,
      baseData: {
        start: start[0],
        end: end[0],
        days: days,
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
    setLoading(false);
  }

  //날짜, 출발지, 숙소 새로만들기 Post
  const newPlanPostFnc = async () => {
    setLoading(true);
    const res = await axios.post('/back/plan', {
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });
    navigate(`/newplan/${res.data.plan._id}/0`);
    setLoading(false);
  }

  //날짜, 출발지, 숙소 수정하기 Post
  const editPlanPostFnc = async () => {
    setLoading(true);
    const res = await axios.post('/back/plan/editPlan', {
      PlanId: plan.PID,
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });
    navigate(`/editplan/${res.data.plan._id}/0`);
    // window.location.href = `/editplan/${res.data.plan._id}/0`;
    setLoading(false);
  }

  //필수 정보 유효성 검사
  const dataConfirm = () => {
    if (plan.baseData.start === '' || plan.baseData.end === '') {
      //setDate 유효성
      setNavState('STEP1');
      return false;
    } else if (plan.startPlan.address === '' || plan.startPlan.time === '') {
      //start 유효성
      setNavState('STEP2');
      return false;
    } else if (plan.lodging.length > 0) {
      //lodging 유효성
      for (let { address, check_in, check_out } of plan.lodging) {
        if (address === '' || check_in === '' || check_out === '') {
          setNavState('STEP3');
          return false;
        }
      }
      //SetPlan 유효성 체크 OK
      console.log('SetPlan OK');
      return true;
    }
  }

  useEffect(() => {
    if (editCk) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (navState === 'DayPlan') {
      const result = dataConfirm();
      if (result) {
        if (editCk) {
          editPlanPostFnc();
        } else {
          newPlanPostFnc();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '오류',
          text: '필수 입력란을 다시 입력해주세요',
        })
      }
    }
    console.log('plan', plan);
  }, [navState])

  return (
    <StartContext.Provider value={{ plan, setPlan, navState, setNavState, editCk, setLoading }}>
      <StartNav />
      {(navState === 'STEP1' && !loading) && <SetDate />}
      {(navState === 'STEP2') && <Start />}
      {(navState === 'STEP3') && <Lodging />}
    </StartContext.Provider>
  );
}

export default SetPlan;