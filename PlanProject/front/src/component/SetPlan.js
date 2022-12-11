import React, { useContext, useEffect, useState } from "react";
import Styles from "./SetPlan.module.scss";
import SetDate from "./SetDate";
import Start from "./Start";
import Lodging from "./Lodging";
import { PlanContext } from "../context/PlanContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetPlan = () => {

  const navigate = useNavigate();
  const { navState, setNavState, plan, setPlan, baseEditCk, } = useContext(PlanContext);

  //DB에 plan을 생성, 수정 하고 만들어진 id를 front obj에 저장
  const saveID = (resPlan) => {
    //각각의 숙소 id를 가져오기 위해 복사
    let copyLodgingArr = [];
    let copyLodging = {};
    if (resPlan.lodging.length > 0) {
      for (let i = 0; i < resPlan.lodging.length; i++) {
        copyLodging = {
          id: resPlan.lodging[i]._id,
          address: plan.lodging[i].address,
          check_in: plan.lodging[i].check_in,
          check_out: plan.lodging[i].check_out,
          reservation: plan.lodging[i].reservation,
          price: plan.lodging[i].price,
          memo: plan.lodging[i].memo,
        }
        copyLodgingArr.push(copyLodging);
      }
    }
    //각각의 id를 State에 담는다
    setPlan({
      ...plan,
      PID: resPlan._id,
      startPlan: {
        ...plan.startPlan,
        id: resPlan.starting._id,
      },
      lodging: copyLodgingArr,
    });
  }

  //날짜, 출발지, 숙소 새로만들기 Post
  const newPlanPostFnc = async () => {
    const res = await axios.post('/back/plan', {
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });

    //ID 저장
    saveID(res.data.plan);

    setNavState({ ...navState, view: 0 });
    navigate(`${res.data.plan._id}/0`);
  }

  //날짜, 출발지, 숙소 수정하기 Post
  const editPlanPostFnc = async () => {
    const res = await axios.post('/back/plan/editPlan', {
      PlanId: plan.PID,
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });

    //ID 저장
    saveID(res.data.plan);

    setNavState({ ...navState, view: 0 });
    navigate(`${plan.PID}/0`);
  }

  //필수 정보 유효성 검사
  const dataConfirm = () => {
    if (plan.baseData.start === '' || plan.baseData.end === '') {
      //setDate 유효성
      setNavState({ ...navState, view: 'STEP1' })
      return false;
    } else if (plan.startPlan.address === '' || plan.startPlan.time === '') {
      //start 유효성
      setNavState({ ...navState, view: 'STEP2' })
      return false;
    } else if (plan.lodging.length > 0) {
      //lodging 유효성
      for (let { address, check_in, check_out } of plan.lodging) {
        if (address === '' || check_in === '' || check_out === '') {
          setNavState({ ...navState, view: 'STEP3' })
          return false;
        }
      }
      //SetPlan 유효성 체크 OK
      console.log('SetPlan OK');
      return true;
    }
  }

  useEffect(() => {
    if (navState.view === 'DayPlan') {
      const res = dataConfirm();
      if (res) {
        if (baseEditCk) {
          editPlanPostFnc();
        } else {
          newPlanPostFnc();
        }
      } else {
        alert('필수 입력값을 다시 확인 해주세요');
      }
    }

    console.log('plan', plan);
  }, [plan, navState.view])

  return (
    <div className={Styles.setPlanWrap}>
      {(navState.view === "STEP1") && <SetDate />}
      {(navState.view === "STEP2") && <Start />}
      {(navState.view === "STEP3") && <Lodging />}
    </div>
  );
}

export default SetPlan;