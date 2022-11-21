import React, { useEffect, useState } from "react";
import Styles from "./NewPlan.module.scss";
import { Calendar } from "react-calendar";
import './NewPlan.css';
import { Link } from "react-router-dom";

const NewPlan = () => {
  const [planDate, setPlanDate] = useState({
    startDate: "",
    endDate: ""
  });
  const [dateCK, setDateCK] = useState(true);
  const [days, setDays] = useState(0);
  const [title, setTitle] = useState("");

  const toDate = (date) => {
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
    setDays(getDays(ranges[0],ranges[1]));
    setPlanDate({
      startDate: toDate(ranges[0]),
      endDate: toDate(ranges[1]),
    });
    setDateCK(false);

  }

  useEffect(() => {

  },[]);

  return(
    <div className={Styles.container}>
      <div className={Styles.calendarDiv}>
        <h1>Hello</h1>
        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <Calendar
          onChange={changeDate}
          selectRange={true}
        />
        <div className={Styles.deteDiv}>
          <p>Start : {planDate.startDate}</p>
          <p>End : {planDate.endDate}</p>
          {(days !== 0) && <p>{days-1}박 {days}일</p>}
          <Link to={`${planDate.startDate}/${planDate.endDate}/${days}/${title}`}>
            <input type="button" value="다음" disabled={dateCK} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewPlan;