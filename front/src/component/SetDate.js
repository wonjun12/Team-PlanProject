import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import Styles from "./SetDate.module.scss";
import './Calendar.css';

import { PlanContext } from "../context/PlanContext";

const SetDate = () => {

  const { navState, setNavState, plan, setPlan, baseEditCk } = useContext(PlanContext);

  //여행 기본 정보
  const [base, setBase] = useState({
    start: '',
    end: '',
    days: '',
    title: '',
  });

  //달력 표시 state
  const [calDate, SetCalDate] = useState([new Date(),new Date()]);

  //날짜 유효성 CK
  const [dateCK, setDateCK] = useState(true);

  //날짜 가져오기 
  const getDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = date.getDay();

    return `${yyyy}-${mm}-${dd}`;

    //요일 숫자로 넘기기
    // const dayStr = ["일","월","화","수","목","금","토"];
    // return `${mm}-${dd}-${dayStr[day]}`;
  }

  //일자 계산
  const getDays = (start, end) => {
    const time = Math.abs(start.getTime() - end.getTime());
    return Math.ceil(time / (1000*60*60*24));
  }

  //onChange 함수
  const changeDate = (ranges) => {
    SetCalDate(ranges);
    const days = getDays(ranges[0],ranges[1]);
    setBase({
      ...base,
      start: getDate(ranges[0]),
      end: getDate(ranges[1]),
      days,
    });
    setDateCK(false);
  }

  //기본 정보 설정 완료
  const setDatePostFnc = () => {

    //console.log('setDate', base);
    
    //기본 정보 set
    setPlan({
      ...plan,
      baseData: base,
    })

    //날짜 배열 set / view 변경
    let arr = [];
    let date = new Date(base.start);
    for (let i = 0; i < parseInt(base.days); i++) {
      const dateStr = getDate(date);
      arr.push(
        dateStr
      );
      date.setDate(date.getDate() + 1);
    }
    arr.push('PlanView');
    setNavState({view: 'STEP2', dateArr: arr});

  }

  useEffect(() => {
    //수정할 때 get
    if(plan.baseData.start !== "" && plan.baseData.end !== ""){
      setBase(plan.baseData);
      SetCalDate([new Date(plan.baseData.start), new Date(plan.baseData.end)]);
      setDateCK(false);
    }
  }, []);

  return (
    <div className={Styles.setDateWrap}>
      <Calendar
        onChange={changeDate}
        selectRange={true}
        value={calDate}
      />
      <div className={Styles.setDateDiv}>
        <p className={Styles.hello}>HELLO USER</p>
        <label htmlFor="title">여행 제목</label>
        <input id="title" type="text" value={base.title} 
          onChange={(e) => setBase({...base, title: e.target.value})} />
        <div className={Styles.textDiv}>
          <p>START* : {base.start}</p>
          <p>END* : {base.end}</p>
          {(base.days !== 0 && base.days !== "") && 
            <p>{base.days - 1}박 {base.days}일</p>}

          <input type="button" value="다음" disabled={dateCK} onClick={setDatePostFnc}/>
        </div>
      </div>
    </div>
  );
}

export default SetDate;