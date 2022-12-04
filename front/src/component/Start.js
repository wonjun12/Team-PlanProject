import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";
//import Styles from "./Start.module.scss";

const Start = () => {
  const { viewCont, setViewCont } = useContext(ThemeContext);
  const [startPlan, setStartPlan] = useState({
    address: "",
    time: "",
    transportation: "car",
    memo: "",
  });

  const startPostFnc = ()=> {
    //start post
    console.log(startPlan);
    setViewCont("STEP3");
  }

  return (
    <div  className={Styles.startWrap}>
      <p>출발지 설정</p>
      <div className={Styles.planDiv}>
        <label htmlFor="address">주소</label>
        <input type="text" id="address"
          value={startPlan.address}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            address: e.target.value,
          }))}
        />

        <label htmlFor="departure">출발시간</label>
        <input type="time" id="departure"
          value={startPlan.time}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            time: e.target.value,
          }))}
        />

        <label htmlFor="transportation">이동수단</label>
        <select id="transportation" 
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            transportation: e.target.value,
          }))}>
          <option value="car">자동차</option>
          <option value="bus">대중교통</option>
          <option value="walk">도보</option>
        </select>

        <label htmlFor="memo">메모</label>
        <textarea id="memo" rows="12"
          value={startPlan.memo}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            memo: e.target.value,
          }))}
        ></textarea>

        <button onClick={startPostFnc}>숙소설정</button>
      </div>
    </div>
  );
}

export default Start;