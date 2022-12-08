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
  const { navState, setNavState, plan, setPlan, baseEditCk } = useContext(PlanContext);

  //post 하기 전에 data 유효성 검사
  const [dataCk, setDataCk] = useState(true);

  //날짜, 출발지, 숙소 새로만들기 Post
  const newPlanPostFnc = async () => {
    const res = await axios.post('/back/plan',{
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });

    //각각의 숙소 id를 가져오기 위해 복사
    let copyLodgingArr = [];
    let copyLodging = {};
    if(res.data.plan.lodging.length > 0) {
      for(let i = 0; i < res.data.plan.lodging.length; i++){
        copyLodging = {
          id: res.data.plan.lodging[i]._id,
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
      PID: res.data.plan._id,
      startPlan: {
        ...plan.startPlan,
        id: res.data.plan.starting._id,
      },
      lodging: copyLodgingArr,
    });

    setNavState({...navState, view: 0});
    navigate(`dayplan/${res.data.plan._id}/${navState.dateArr[0]}`);
  }

  //날짜, 출발지, 숙소 수정하기 Post
  const editPlanPostFnc = async () => {
    const res = await axios.post('/back/plan/editPlan',{
      PlanId: plan.PID,
      SetPlan: plan.baseData,
      Start: plan.startPlan,
      lodging: plan.lodging,
    });
    console.log('editPost',res.data.paln);

    // setNavState({...navState, view: 0});
    // navigate(`dayplan/${plan.PID}/${navState.dateArr[0]}`);
  }

  //필수 정보 유효성 검사
  useEffect(() => {

    if(plan.baseData.start === '' || plan.baseData.end === ''){
      //setDate 유효성
      setDataCk(true);
    }else if(plan.startPlan.address === '' || plan.startPlan.time === ''){
      //start 유효성
      setDataCk(true);
    }else if(plan.lodging.length > 0) {
      //lodging 유효성
      for (let { address, check_in, check_out } of plan.lodging) {
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
  }, [plan]);

  return (
    <div className={Styles.setPlanWrap}>
      {(navState.view === "STEP1") && <SetDate />}
      {(navState.view === "STEP2") && <Start />}
      {(navState.view === "STEP3") && (
        <>
          <Lodging />
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