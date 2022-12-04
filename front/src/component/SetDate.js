import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";
import { Calendar } from "react-calendar";
import './Calendar.css';

const SetDate = () => {

  const { viewCont, setViewCont, baseData, setBaseData } = useContext(ThemeContext);

  const [dateCK, setDateCK] = useState(true);

  const getDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = date.getDay();
    const dayStr = ["일","월","화","수","목","금","토"];
    return `${yyyy}-${mm}-${dd}-${dayStr[day]}`;
  }

  const getDays = (start, end) => {
    const time = Math.abs(start.getTime() - end.getTime());
    return Math.ceil(time / (1000*60*60*24));
  }

  const changeDate = (ranges) => {
    const days = getDays(ranges[0],ranges[1]);
    setBaseData({
      ...baseData,
      start: getDate(ranges[0]),
      end: getDate(ranges[1]),
      days,
    });
    setDateCK(false);
  }

  const setDatePostFnc = () => {
    //post

    setViewCont('STEP2');
  }

  console.log(baseData);
  return (
    <div className={Styles.settingDiv}>
      <label>여행 제목
        <input type="text" value={baseData.title} 
          onChange={(e) => setBaseData({...baseData, title: e.target.value})} />
      </label>
      <Calendar
        onChange={changeDate}
        selectRange={true}
      />
      <div className={Styles.deteDiv}>
        <p>Start : {baseData.start}</p>
        <p>End : {baseData.end}</p>
        {(baseData.days !== 0 && baseData.days !== "") && 
          <p>{baseData.days - 1}박 {baseData.days}일</p>}

        <input type="button" value="다음" disabled={dateCK} onClick={setDatePostFnc}/>
      </div>
    </div>
  );
}

export default SetDate;