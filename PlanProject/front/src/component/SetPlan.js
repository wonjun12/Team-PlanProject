import React, { useContext, useEffect, useState } from "react";
import Styles from "./SetPlan.module.scss";
import SetDate from "./SetDate";
import Start from "./Start";
import Logding from "./Logding";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const SetPlan = () => {

  const navigate = useNavigate();

  const { view, setView, dateArr } = useContext(ThemeContext);

  //post 하기 전에 data 유효성 검사
  const [dataCk, setDataCk] = useState(true);

  //여행 기본 정보
  const [baseData, setBaseData] = useState({
    start: '',
    end: '',
    days: '',
    title: '',
  });

  //출발 정보
  const [startPlan, setStartPlan] = useState({
    address: "",
    time: "",
    transportation: "car",
    memo: "",
  });

  //숙소 정보
  const [logding, setLogding] = useState([{
    address: "",
    check_in: "",
    check_out: "",
    reservation: false,
    price: "",
    memo: "",
  }]);

  const newPlanPostFnc = () => {
    console.log("SetPlan POST");
    const PID = 0;
    setView(0);
    navigate(`dayplan/${PID}/${dateArr[0]}`);
  }

  useEffect(() => {
    //필수 정보 유효성 검사
    if (baseData.days !== '' && startPlan.address !== '' && logding[0].address !== '') {
      setDataCk(false);
    }
  }, [baseData, startPlan, logding])

  return (
    <div className={Styles.setPlanWrap}>

      <input type="button" value="저장" onClick={newPlanPostFnc} disabled={dataCk} />

      {(view === "STEP1") && <SetDate baseData={baseData} setBaseData={setBaseData} />}
      {(view === "STEP2") && <Start startPlan={startPlan} setStartPlan={setStartPlan}/>}
      {(view === "STEP3") && <Logding logding={logding} setLogding={setLogding} />}

    </div>
  );
}

export default SetPlan;