import React, { useContext, useEffect, useState } from "react";
import Styles from "./SetPlan.module.scss";
import SetDate from "./SetDate";
import Start from "./Start";
import Logding from "./Logding";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetPlan = () => {

  const navigate = useNavigate();

  const { view, setView, dateArr, setPid, PLAN_URL, startPlan, logding}
   = useContext(ThemeContext);

  //post 하기 전에 data 유효성 검사
  const [dataCk, setDataCk] = useState(true);

  //여행 기본 정보
  const [baseData, setBaseData] = useState({
    start: '',
    end: '',
    days: '',
    title: '',
  });

  // //출발 정보
  // const [startPlan, setStartPlan] = useState({
  //   address: "",
  //   time: "",
  //   transportation: "car",
  //   memo: "",
  // });

  // //숙소 정보
  // const [logding, setLogding] = useState([{
  //   address: "",
  //   check_in: "",
  //   check_out: "",
  //   reservation: false,
  //   price: "",
  //   memo: "",
  // }]);

  const newPlanPostFnc = async () => {
    console.log('base',baseData);
    console.log('start',startPlan);
    console.log('log',logding);
    //출발지 및 숙소 Post
    const res = await axios.post(`${PLAN_URL}`,{
      SetPlan: baseData,
      Start: startPlan,
      Logding: logding,
    });
    setPid(res.data.PID);
    setView(0);
    navigate(`dayplan/${res.data.PID}/${dateArr[0]}`);
  }

  useEffect(() => {
    //필수 정보 유효성 검사
    if (baseData.days !== '' && startPlan.address !== '' && logding[0].address !== '') {
      setDataCk(false);
    }
  }, [baseData, startPlan, logding])

  return (
    <div className={Styles.setPlanWrap}>

      {(view === "STEP1") && <SetDate baseData={baseData} setBaseData={setBaseData} />}
      {(view === "STEP2") && <Start />}
      {(view === "STEP3") && (
        <>
          <Logding />
          <input className={Styles.postBtn} type="button" value="다음" onClick={newPlanPostFnc} disabled={dataCk} />
        </>
      )}

    </div>
  );
}

export default SetPlan;