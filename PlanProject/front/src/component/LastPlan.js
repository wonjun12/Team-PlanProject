import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./SetPlan.module.scss";

const LastPlan = () => {

  const { viewCont, setViewCont, baseData } = useContext(ThemeContext);
  const [lastLocation, setLastLocation] = useState("");
  const [dayPlan, setDayPlan] = useState([
    {
      address: "",
      location: "",
      reservation: "",
      price: "",
      time: "",
      memo: "",
    },
  ]);

  const inputChangeFnc = (e, key, idx) => {
    setDayPlan(dayPlan.map((dayObj, objIdx) =>
      idx === objIdx ?
        { ...dayObj, [key]: e.target.value } : dayObj
    ));
  }

  const dayPlanAddFnc = () => {
    const dayPlanObj = {
      set: "",
      address: "",
      location: "",
      reservation: "",
      price: "",
      time: "",
      memo: "",
    }
    setDayPlan([...dayPlan, dayPlanObj]);
  }

  const dayPlanReset = () => {
    setDayPlan([{
      set: "",
      address: "",
      location: "",
      reservation: "",
      price: "",
      time: "",
      memo: "",
    }]);
  }

  const dayPlanPostFnc = () => {
    //dayPlan post
    dayPlanReset();
    if (viewCont >= baseData.days - 1) {
      setViewCont("PlanView");
    } else {
      setViewCont(viewCont + 1);
    }

  }

  useEffect(() => {
    //dayPlan get
    dayPlanReset();
  }, [viewCont])

  return (
    <div className={Styles.planWrap}>
      <div className={Styles.planDiv}>
        <label htmlFor="set">최종 도착지 주소 : </label>
        <input type="text" id="lastLocation"
          value={lastLocation}
          onChange={(e) => setLastLocation(e.target.value)}
        />
      </div>
      {dayPlan.map((_, idx) => {
        return (
          <div key={idx} className={Styles.planDiv}>

            <label htmlFor="address">주소 : </label>
            <input type="text" id="address"
              value={dayPlan.address}
              onChange={(e) => inputChangeFnc(e, "address", idx)}
            />

            <label htmlFor="location">장소 이름 : </label>
            <input type="text" id="location"
              value={dayPlan.location}
              onChange={(e) => inputChangeFnc(e, "location", idx)}
            />

            <label htmlFor="reservation">예약 유무 : </label>
            <input type="text" id="reservation"
              value={dayPlan.reservation}
              onChange={(e) => inputChangeFnc(e, "reservation", idx)}
            />

            <label htmlFor="price">예상 가격 : </label>
            <input type="text" id="price"
              value={dayPlan.price}
              onChange={(e) => inputChangeFnc(e, "price", idx)}
            />

            <label htmlFor="time">활동 시간 : </label>
            <input type="text" id="time"
              value={dayPlan.time}
              onChange={(e) => inputChangeFnc(e, "time", idx)}
            />

            <label htmlFor="memo">메모 : </label>
            <input type="text" id="memo"
              value={dayPlan.memo}
              onChange={(e) => inputChangeFnc(e, "memo", idx)}
            />

          </div>
        );
      })}
      <input type="button" value="일정추가" onClick={dayPlanAddFnc} />
      <input type="button" value="완료" onClick={dayPlanPostFnc} />
    </div>

  );
}

export default LastPlan;