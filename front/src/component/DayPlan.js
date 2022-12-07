import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "./DayPlan.module.scss";
import { useParams } from "react-router-dom";
import { SetMap, SearchMap } from '../naver/NaverApi';

const DayPlans = () => {

  const { id, day } = useParams();
  const { view, setView, dateArr, PLAN_URL, pid } = useContext(ThemeContext);
  const [open, setOpen] = useState(0);
  const [detailCk, setDetailCk] = useState(false);
  const hourRef = useRef();
  const minuteRef = useRef();
  const [dayPlan, setDayPlan] = useState([
    {
      order: false,
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
      lastLocation: "",
      lastAddress: ""
    },
  ]);

  const inputChangeFnc = (e, key, idx) => {

    let changeValue;
    if (key === "time") {
      changeValue = (hourRef.current.value * 60) + (minuteRef.current.value * 1);
    } else if (key === "reservation") {
      changeValue = e.target.checked;
    } else {
      changeValue = e.target.value;
    }

    let copy = [...dayPlan];

    copy[idx] = {
      ...copy[idx],
      [key]: key === 'order' ? !copy[idx].order : changeValue,
    }
    setDayPlan(copy);
  }

  const dayPlanAddFnc = () => {
    const dayPlanObj = {
      order: false,
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
    }
    setDayPlan([...dayPlan, dayPlanObj]);
    setOpen(dayPlan.length);
    setDetailCk(false);
  }

  const dayPlanReset = () => {
    setDayPlan([{
      order: false,
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
    }]);
  }

  const deleteFnc = (delIdx) => {
    if (delIdx > 0) {
      setDayPlan(dayPlan.filter((_, idx) => idx !== delIdx));
      setOpen(delIdx - 1);
      setDetailCk(false);
    }
  }

  const dayPlanPostFnc = async () => {
    //dayPlan post
    const res = await axios.post(`${PLAN_URL}/${id}/planDays`, {
      day: view,
      dayPlan,
      point: [],
      distance: [],
      duration: []
    });

    if (res.data.result) {
      setOpen(0);
      if (view >= dateArr.length - 1) {
        //setView("PlanView");
      } else {
        setView(view + 1);
      }
    }
  }

  //일자별 계획 GET
  const getDayPlan = async () => {

    //console.log(dateArr[view]);
    const res = await axios.get(`${PLAN_URL}/${id}/planDays`, {
      params: { day: view },
    });

    if (res.data.dayPlan.length > 0) {
      //이미 작성한 계획이 있으면 state에 담기      
      const { details } = res.data.dayPlan[0];

      console.log('backGet',res.data.dayPlan);

      if(view === dateArr.length-1){

      }

      let planArr = [];
      details.map((obj) => {
        planArr.push({
          order: obj.order,
          address: obj.addr,
          location: obj.location,
          reservation: obj.reser,
          price: obj.price,
          time: obj.time,
          memo: obj.memo,
        });
      });
      setDayPlan(planArr);
    } else {
      //처음 작성하는 계획이면 초기화
      dayPlanReset();
    }
  }

  const searchAddFnc = async (idx) => {

    const searchCK = await SearchMap(dayPlan[idx].address, true);
    if (!searchCK) {
      let copy = [...dayPlan];
      copy[idx] = {
        ...copy[idx],
        address: "",
      }
      setDayPlan(copy);
    }
  }

  useEffect(() => {
    //dayPlan get
    getDayPlan();
  }, [view])

  return (
    <div className={Styles.dayPlanWrap}>
      <div className={Styles.mapDiv}>
        <SetMap />
      </div>
      <div className={Styles.dayPlanDiv}>
        {(view === dateArr.length - 1) && (
          <div className={Styles.lastLocDiv}>
            <label>최종 도착지 이름<br />
              <input type="text" value={dayPlan.lastLocation}
                onChange={(e) => inputChangeFnc(e, "lastLocation", 0)}
              />
            </label>
            <label>최종 도착지 주소<br />
              <input type="text" value={dayPlan.lastAddress}
                onChange={(e) => inputChangeFnc(e, "lastAddress", 0)}
              />
            </label>
          </div>
        )}
        {dayPlan.map((obj, idx) => {
          let hour = Math.floor(obj.time / 60);
          let minute = Math.floor(obj.time % 60);

          return (
            <div key={idx} className={Styles.planDiv}>
              <div className={Styles.openDiv}>
                <p>{idx + 1}번째 일정</p>
                <span className={Styles.openSpan} onClick={() => setOpen(idx)}>
                  {(open === idx) ? '●' : '▼'}
                </span>
              </div>
              {(open === idx) &&
                <>
                  <div className={Styles.orderDiv}>
                    <label>
                      <input type="radio" checked={!obj.order} value={false} name="order"
                        onChange={(e) => inputChangeFnc(e, "order", idx)} />
                      숙소 도착 전 일정
                    </label>
                    <label>
                      <input type="radio" checked={obj.order} value={true} name="order"
                        onChange={(e) => inputChangeFnc(e, "order", idx)} />
                      숙소 도착 후 일정
                    </label>
                  </div>

                  <div className={Styles.addDiv}>
                    <label htmlFor="address">주소</label>
                    <div className={Styles.addInputDiv}>
                      <input id="address" type="text" value={obj.address}
                        onChange={(e) => inputChangeFnc(e, "address", idx)}
                      />
                      <input type="button" value="검색" onClick={() => searchAddFnc(idx)} />
                    </div>
                  </div>

                  <div className={Styles.locationDiv}>

                    <label>장소 이름<br />
                      <input type="text" value={obj.location}
                        onChange={(e) => inputChangeFnc(e, "location", idx)}
                      />
                    </label>

                    <div className={Styles.timeDiv}>
                      <label>활동 시간<br />
                        <input type="number" value={hour}
                          step='1' min='0' max='12' ref={hourRef}
                          onChange={(e) => inputChangeFnc(e, "time", idx)}
                        />시간
                        <input type="number" value={minute}
                          step='10' min='0' max='59' ref={minuteRef}
                          onChange={(e) => inputChangeFnc(e, "time", idx)}
                        />분
                      </label>
                    </div>
                  </div>

                  <div className={Styles.detailBtnDiv}>
                    <p>상세 일정</p>
                    <span onClick={() => setDetailCk(!detailCk)}>
                      {(detailCk) ? '▲' : '▼'}
                    </span>
                  </div>

                  {detailCk && (
                    <>
                      <div className={Styles.detailDiv}>
                        <label>
                          <input type="checkbox"
                            checked={obj.reservation}
                            onChange={(e) => inputChangeFnc(e, "reservation", idx)}
                          />예약 완료
                        </label>

                        <label>예상 가격
                          <input type="number"
                            value={obj.price}
                            onChange={(e) => inputChangeFnc(e, "price", idx)}
                          />
                        </label>
                      </div>

                      <label>메모<br />
                        <textarea rows='5' value={obj.memo}
                          onChange={(e) => inputChangeFnc(e, "memo", idx)}
                        />
                      </label>
                    </>
                  )}
                  <input className={Styles.deleteBtn} type="button" value="삭제" onClick={() => deleteFnc(idx)} />
                </>
              }
            </div>
          );
        })}
        <input className={Styles.btn} type="button" value="일정추가" onClick={dayPlanAddFnc} />
        <input className={Styles.btn} type="button" value="저장" onClick={dayPlanPostFnc} />
      </div>
    </div>

  );
}

export default DayPlans;