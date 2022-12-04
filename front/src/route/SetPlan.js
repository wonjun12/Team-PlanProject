import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./SetPlan.module.scss";
import { ThemeContext } from "../context/ThemeContext";

import PlanNav from "../component/PlanNav";
import SetDate from "../component/SetDate";
import Start from "../component/Start";
import Logding from "../component/Logding";
import DayPlan from "../component/DayPlan";
import LastPlan from "../component/LastPlan";
import PlanView from "../component/PlanView";

// $('input').attr('autocomplete','off'); input 자동완성 끄기

const SetPlan = () => {

  // start(출발지 설정) / hotel / 숫자(일별 계획)
  const [viewCont, setViewCont] = useState("");
  // 여행 기본 정보
  const [baseData, setBaseData] = useState({
    start: '',
    end: '',
    days: '',
    title: '',
  });

  const pageBackFnc = () => {
    //경고창으로 이전으로 돌아가면 데이터가 사라진다고 알려주고
    //DB에서 여행 계획 삭제??
    if (viewCont === "STEP2") {
      setViewCont("STEP1");
    } else if (viewCont === "STEP3") {
      setViewCont("STEP2");
    } else if (typeof (viewCont) === "number") {
      setViewCont("STEP1");
    } else if (viewCont === "PlanView") {
      setViewCont(0);
    }
  }

  useEffect(() => {
    setViewCont("STEP1");
  }, []);

  return (
    <ThemeContext.Provider value={{ viewCont, setViewCont, baseData, setBaseData }}>
      <div className={Styles.container}>
        <PlanNav />

        <div className={Styles.titleDiv}>
          {(viewCont !== 'STEP1') ? (
            <>
              <div className={Styles.backBtn} onClick={pageBackFnc}>뒤로가기</div>
              <h1>{baseData.title}</h1>
            </>
          ):(
            <h1>새로운 여행</h1>
          )}
        </div>

        <div className={Styles.contentDiv}>
          {(viewCont !== 'STEP1') && (
            <div className={Styles.mapDiv}>
            </div>
          )}
          <div className={Styles.plansDiv}>
            {viewCont === "STEP1" && <SetDate />}
            {viewCont === "STEP2" && <Start />}
            {viewCont === "STEP3" && <Logding />}
            {(typeof (viewCont) === "number" && viewCont < parseInt(baseData.days) - 1) && <DayPlan />}
            {(typeof (viewCont) === "number" && viewCont === parseInt(baseData.days) - 1) && <LastPlan />}
            {viewCont === "PlanView" && <PlanView />}
          </div>

        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default SetPlan;