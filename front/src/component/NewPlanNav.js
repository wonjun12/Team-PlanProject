import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/NewPlan.module.scss";

const NewPlanNav = () => {

  const navigate = useNavigate();

  const { view, setView, dateArr, pid } = useContext(ThemeContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  //nav 항목
  const startNav = ["STEP1", "STEP2", "STEP3"];

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < dateArr.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  //날짜 클릭
  const planMovekFnc = (step, idx) => {
    
    setView(idx);
  }

  useEffect(() => {

    console.log(view);

    if(typeof(view) === 'number'){

      if(view > 4 && view > (currentIndex + 4)) {
        setCurrentIndex(view-4);
      }else if(view < 5 && view < (currentIndex + 5)){
        setCurrentIndex(0);
      }
      
      navigate(`dayplan/${pid}/${dateArr[view]}`);
    }
  }, [view]);

  //현재 일정날짜에 따라 nav 위치 변경
  // useEffect(() => {
  //   

  // }, [viewCont])

  return (
    <div className={Styles.navWrap}>
      <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
      <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
      <div className={Styles.navDiv}>
        {(view === 'STEP1' || view === 'STEP2' || view === 'STEP3') ? (
          startNav.map((step, idx) => {
            if (step === view) {
              return (
                <div key={idx} style={{ backgroundColor: 'rgba(183, 182, 182, 0.5)' }}
                  onClick={() => setView(step)}>
                  {step}
                </div>
              );
            } else {
              return (
                <div key={idx} onClick={() => setView(step)}>{step}</div>
              );
            }
          })
        ) : (
          dateArr.map((date, idx) => {
            if (view === idx) {
              return (
                <div onClick={() => planMovekFnc(date, idx)} key={idx}
                  className={Styles.dayNavDiv}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                    backgroundColor: 'rgba(183, 182, 182, 0.5)',
                  }}>
                  {date}
                </div>
              );
            } else {
              return (
                <div onClick={() => planMovekFnc(date, idx)} key={idx}
                  className={Styles.dayNavDiv}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                  }}>
                  {date}
                </div>
              );
            }
          })
        )}
        {/* 미리보기에서 최종완료 or 수정 선택*/}
        {/* {(viewCont === "PlanView") && (
          <>
            <div onClick={() => setViewCont(0)}>계획수정</div>
            <div onClick={() => setViewCont("Complete")}>최종완료</div>
          </>
        )}  */}
      </div>
    </div>
  );
}
export default NewPlanNav;