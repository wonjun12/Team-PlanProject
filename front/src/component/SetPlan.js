import React, { useContext, useEffect, useState } from "react";
import Styles from "./SetPlan.module.scss";
import SetDate from "./SetDate";
import Start from "./Start";
import Logding from "./Logding";
import { PlanContext } from "../context/PlanContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetPlan = () => {

  const navigate = useNavigate();

  const { view, setView, dateArr, pid, setPid, PLAN_URL, baseData, startPlan, logding, baseEditCk}
   = useContext(PlanContext);

  //post 하기 전에 data 유효성 검사
  const [dataCk, setDataCk] = useState(true);

  //날짜, 출발지, 숙소 새로만들기 Post
  const newPlanPostFnc = async () => {
    const res = await axios.post(`${PLAN_URL}`,{
      SetPlan: baseData,
      Start: startPlan,
      Logding: logding,
    });
    setPid(res.data.PID);
    setView(0);
    navigate(`dayplan/${res.data.PID}/${dateArr[0]}`);
  }

  //날짜, 출발지, 숙소 수정하기 Post
  const editPlanPostFnc = async () => {
    console.log(pid);
    const res = await axios.post(`${PLAN_URL}/editPlan`,{
      PlanId: pid,
      SetPlan: baseData,
      Start: startPlan,
      Logding: logding,
    });
    console.log(res.data);
    // setView(0);
    // navigate(`dayplan/${res.data.PID}/${dateArr[0]}`);
  }

  //필수 정보 유효성 검사
  useEffect(() => {

    if(baseData.start === '' || baseData.end === ''){
      //setDate 유효성
      setDataCk(true);
    }else if(startPlan.address === '' || startPlan.time === ''){
      //start 유효성
      setDataCk(true);
    }else if(logding.length > 0) {
      //logding 유효성
      for (let { address, check_in, check_out } of logding) {
        if(address === '' || check_in === '' || check_out === ''){
          setDataCk(true);
          break;
        }else{
          //SetPlan 유효성 체크 OK
          console.log('SetPlan OK');
          setDataCk(false);
        }
      }
    }
  }, [baseData, startPlan, logding]);

  return (
    <div className={Styles.setPlanWrap}>

      {(view === "STEP1") && <SetDate />}
      {(view === "STEP2") && <Start />}
      {(view === "STEP3") && (
        <>
          <Logding />
          {(baseEditCk) ? (
            <input className={Styles.postBtn} type="button" value="수정완료" 
            hidden={dataCk} onClick={editPlanPostFnc}/>
          ) : (
            <input className={Styles.postBtn} type="button" value="다음" 
            hidden={dataCk} onClick={newPlanPostFnc}/>
          )}
          
        </>
      )}

    </div>
  );
}

export default SetPlan;