import React, { useEffect, useState } from "react";
import Styles from "./ViewPlan.module.scss";

const ViewPlan = () => {

  const [plans, setPlans] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setData = () => {
    for(let i=0; i<10; i++){
      setPlans((prev) => [
        ...prev,
        ...["plan"+i],
      ])  
    }
  }

  const navPrevFnc = () => {
    if(currentIndex !== 0){
      setCurrentIndex(currentIndex-1);
    } 
  }

  const navNextFnc = () => {
    if(currentIndex < plans.length-5){
      setCurrentIndex(currentIndex+1);
    }
  }

  const planClickFnc = (idx) => {
    console.log(idx);
  }

  useEffect(() => {
    setData();
  },[]);

  return(
    <div className={Styles.container}>
      <div className={Styles.btnDiv}>
        <div className={Styles.prevBtn} onClick={navPrevFnc}>◀</div>
        <div className={Styles.nextBtn} onClick={navNextFnc}>▶</div>
      </div>
      <div className={Styles.navDiv}>
        {plans.map((plan,index) => {
          return(
            <div onClick={() => planClickFnc(index)} key={index} 
              style={{transform: `translate(-${currentIndex * 100}%)`}}>
              {plan}
            </div>
          );
        })}
      </div>
      <div className={Styles.contentDiv}>
        <div className={Styles.mapDiv}>
        </div>
        <div className={Styles.planDiv}>
        </div>
      </div>
    </div>
  );
}

export default ViewPlan;