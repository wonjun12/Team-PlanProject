import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlanContext } from "../context/PlanContext";
import Styles from "../route/NewPlan.module.scss";

const NewPlanNav = () => {

  const navigate = useNavigate();

  const { navState, setNavState, plan } = useContext(PlanContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  //nav 항목
  const startNav = ["STEP1", "STEP2", "STEP3", "DayPlan"];

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < navState.dateArr.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  //날짜 클릭
  const planMovekFnc = (idx) => {
    setNavState({
      ...navState,
      view: idx,
    });
    navigate(`${plan.PID}/${idx}`);
  }

  const movePlanViewFnc = () => {
    window.location.href = `/viewplan/${plan.PID}`;
  }

  useEffect(() => {

    if (typeof(navState.view) === 'number') {
      if (navState.view > 4 && navState.view > (currentIndex + 4)) {
        setCurrentIndex(navState.view - 4);
      } else if (navState.view < 5 && navState.view < (currentIndex + 5)) {
        setCurrentIndex(0);
      }
    }
  }, [navState.view]);

  return (
    <div className={Styles.navWrap}>
      {(typeof (navState.view) === 'number') &&
        <>
          <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
          <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
        </>
      }

      <div className={Styles.navDiv}>
        {(navState.view === 'STEP1' || navState.view === 'STEP2' || navState.view === 'STEP3') ? (
          startNav.map((step, idx) => {
            if (step === navState.view) {
              return (
                <div key={idx} style={{ backgroundColor: 'rgba(183, 182, 182, 0.5)' }}
                  onClick={() => setNavState({ ...navState, view: step })}>
                  {step}
                </div>
              );
            } else {
              if (step === "DayPlan") {
                return (
                  <div key={idx}
                    onClick={() => setNavState({ ...navState, view: "DayPlan" })}>
                    {step} ▷
                  </div>
                );
              } else {
                return (
                  <div key={idx} onClick={() => setNavState({ ...navState, view: step })}>
                    {step}
                  </div>
                );
              }
            }
          })
        ) : (
          navState.dateArr.map((date, idx) => {
            const dt = new Date(date);
            const dayStr = ["일","월","화","수","목","금","토"];
            const dateStr =`${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}-${dayStr[dt.getDay()]}`;

            if (navState.view === idx) {
              return (
                <div onClick={() => planMovekFnc(idx)} key={idx}
                  className={Styles.dayNavDiv}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                    backgroundColor: 'rgba(183, 182, 182, 0.5)',
                  }}>
                  {dateStr}
                </div>
              );
            } else {
              if(idx === navState.dateArr.length-1){
                return (
                  <div onClick={movePlanViewFnc} key={idx}
                    className={Styles.dayNavDiv}
                    style={{
                      transform: `translate(-${currentIndex * 100}%)`,
                    }}>
                    {date} ▷
                  </div>
                );
              }else {
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
            }
          })
        )}
      </div>
    </div>
  );
}
export default NewPlanNav;