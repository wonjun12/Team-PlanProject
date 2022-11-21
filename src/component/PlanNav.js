import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./SetPlan.module.scss";

const PlanNav = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const { viewCont, setViewCont, baseData } = useContext(ThemeContext);

  //nav 항목
  const [startNav, setStartNav] = useState(["Start", "Hotel"]);
  const [dateNav, setDateNav] = useState([]);
  //getParams
  const { start, end, days, title } = useParams();


  const setDate = () => {
    let navArr = [];
    let navDate = new Date(baseData.start.substring(0, start.length - 2));
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

  //Nav 화살표 이동==================
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
  //====================================

  useEffect(() => {
    setDate();
  }, [])

  return (
    <>
      <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
      <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
      <div className={Styles.navDiv}>
        {/* 출발지, 숙소 설정 */}
        {(viewCont === "Start" || viewCont === "Hotel") && (
          startNav.map((cont, idx) => {
            if (cont === viewCont) {
              return (
                <div key={idx} style={{ backgroundColor: 'red' }}
                  onClick={() => planMovekFnc(cont)}>
                  {cont}
                </div>
              );
            } else {
              return (
                <div key={idx} onClick={() => planMovekFnc(cont)}>{cont}</div>
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
                    backgroundColor: 'red',
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