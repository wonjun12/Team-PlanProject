import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Styles from "../route/NewPlan.module.scss";

import { StartContext } from "./SetPlan";
import { DayContext } from "./SetDayPlan";

export const StartNav = () => {

  const { navState, setNavState, editCk } = useContext(StartContext);

  //nav 항목
  const startNav = ["STEP1", "STEP2", "STEP3", "DayPlan"];

  return (
    <div className={Styles.navWrap}>
      <div className={Styles.navDiv}>
        {startNav.map((step, idx) => {
          const str = (step === 'DayPlan') ? `${step} ▷` : step;
          if (step === navState) {
            return (
              <div key={idx} style={{ backgroundColor: 'rgba(183, 182, 182, 0.5)' }}>
                {str}
              </div>
            );
          } else {
            return (
              <div key={idx}
                onClick={() => setNavState(step)}>
                {str}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export const DayNav = () => {

  const navigate = useNavigate();

  const { dateArr, plan, navState, setNavState, editCk } = useContext(DayContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < dateArr.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  //날짜 클릭
  const planMovekFnc = (idx) => {
    setNavState(idx);
    if (editCk) {
      navigate(`/editplan/${plan.PID}/${idx}`);
    } else {
      navigate(`/newplan/${plan.PID}/${idx}`);
    }
  }

  const movePlanViewFnc = () => {
    window.location.href = `/viewplan/${plan.PID}`;
  }

  useEffect(() => {
    if (navState > 4 && navState > (currentIndex + 4)) {
      setCurrentIndex(navState - 4);
    } else if (navState < 5 && navState < (currentIndex + 5)) {
      setCurrentIndex(0);
    }
  }, [navState]);

  return (
    <div className={Styles.navWrap}>
      <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
      <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
      <div className={Styles.navDiv}>
        {dateArr?.map((date, idx) => {
          const dt = new Date(date);
          const dayStr = ["일", "월", "화", "수", "목", "금", "토"];
          const dateStr = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}-${dayStr[dt.getDay()]}`;
          if (navState === idx) {
            return (
              <div key={idx} className={Styles.dayNavDiv}
                style={{
                  transform: `translate(-${currentIndex * 100}%)`,
                  backgroundColor: 'rgba(183, 182, 182, 0.5)',
                }}>
                {dateStr}
              </div>
            );
          } else {
            return (
              <div onClick={() => planMovekFnc(idx)} key={idx}
                className={Styles.dayNavDiv}
                style={{
                  transform: `translate(-${currentIndex * 100}%)`,
                }}>
                {dateStr}
              </div>
            );
          }
        })}
        <div onClick={movePlanViewFnc} className={Styles.dayNavDiv}
          style={{ transform: `translate(-${currentIndex * 100}%)` }}>
          PlanView ▷
        </div>
      </div>
    </div>
  );
}