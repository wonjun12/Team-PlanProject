import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./SetPlan.module.scss";

const Start = () => {
  const { viewCont, setViewCont } = useContext(ThemeContext);
  const [startPlan, setStartPlan] = useState({
    address: "",
    time: "",
    transportation: "",
    memo: "",
  });

  const startPostFnc = ()=> {

    //start post
    setViewCont("Hotel");
  }

  return (
    <div  className={Styles.planWrap}>
      <div className={Styles.planDiv}>
        <label htmlFor="address">주소 : </label>
        <input type="text" id="address"
          value={startPlan.address}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            address: e.target.value,
          }))}
        />

        <label htmlFor="departure">출발시간 : </label>
        <input type="text" id="departure"
          value={startPlan.time}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            time: e.target.value,
          }))}
        />

        <label htmlFor="transportation">이동수단 : </label>
        <input type="text" id="transportation"
          value={startPlan.transportation}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            transportation: e.target.value,
          }))}
        />

        <label htmlFor="memo">메모 : </label>
        <input type="text" id="memo"
          value={startPlan.memo}
          onChange={(e) => setStartPlan((prev) => ({
            ...prev,
            memo: e.target.value,
          }))}
        />

        <input type="button" value="숙소설정" onClick={startPostFnc} />
      </div>
    </div>
  );
}

export default Start;