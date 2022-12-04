import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";

const PlanNav = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const { viewCont, setViewCont, baseData } = useContext(ThemeContext);

  //nav 항목
  const [startNav, setStartNav] = useState(["STEP1", "STEP2", "STEP3"]);
  const [dateNav, setDateNav] = useState([]);

  //날짜 설정
  const setDate = () => {
    let navArr = [];
    let navDate = new Date(baseData.start.substring(0, baseData.start.length - 2));
    for (let i = 1; i <= parseInt(baseData.days); i++) {
      navArr.push(
        `${navDate.getMonth() + 1}월${navDate.getDate()}일`
      );
      navDate.setDate(navDate.getDate() + 1);
    }
    setDateNav(navArr);
  }

  //날짜 클릭
  const planMovekFnc = (idx) => {
    setViewCont(idx);
    //console.log(idx);
  }

  //Nav 화살표 이동
  const navPrevFnc = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const navNextFnc = () => {
    if (currentIndex < dateNav.length - 5) {
      setCurrentIndex(currentIndex + 1);
    }
  }
  
  //현재 일정날짜에 따라 nav 위치 변경
  useEffect(() => {
    if(typeof(viewCont) === 'number'){

      if(viewCont > 4 && viewCont > (currentIndex + 4)) {
        setCurrentIndex(viewCont-4);
      }else if(viewCont < 5 && viewCont < (currentIndex + 5)){
        setCurrentIndex(0);
      }
    }
    
  }, [viewCont])

  useEffect(() => {
    setDate();
  }, [])

  return (
    <>
      <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
      <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
      <div className={Styles.navDiv}>
        {/* 출발지, 숙소 설정 */}
        {(viewCont === "STEP1" || viewCont === "STEP2" || viewCont === "STEP3") && (
          startNav.map((step, idx) => {
            if (step === viewCont) {
              return (
                <div key={idx} style={{ backgroundColor: 'lightgray' }}
                  onClick={() => planMovekFnc(step)}>
                  {step}
                </div>
              );
            } else {
              return (
                <div key={idx} onClick={() => planMovekFnc(step)}>{step}</div>
              );
            }
          })
        )}
        {/* 일별계획 */}
        {(typeof (viewCont) === "number") &&
          (dateNav.map((cont, index) => {
            if (index === viewCont) {
              return (
                <div onClick={() => planMovekFnc(index)} key={index}
                  className={Styles.dayNavDiv}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                    backgroundColor: 'lightgray',
                  }}>
                  {cont}
                </div>
              );
            } else {
              return (
                <div onClick={() => planMovekFnc(index)} key={index}
                  className={Styles.dayNavDiv}
                  style={{
                    transform: `translate(-${currentIndex * 100}%)`,
                  }}>
                  {cont}
                </div>
              );
            }
          })
          )}
        {/* 미리보기에서 최종완료 or 수정 선택*/}
        {(viewCont === "PlanView") && (
          <>
            <div onClick={() => setViewCont(0)}>계획수정</div>
            <div onClick={() => setViewCont("Complete")}>최종완료</div>
          </>
        )}
      </div>
    </>
  );
}
export default PlanNav;