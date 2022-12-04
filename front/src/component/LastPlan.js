import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";

const LastPlan = () => {

  const { viewCont, setViewCont, baseData } = useContext(ThemeContext);
  const [open, setOpen] = useState(0);
  const [detailCk, setDetailCk] = useState(false);
  const hourRef = useRef();
  const minuteRef = useRef();
  const [lastLocation, setLastLocation] = useState({
    lastLocation: "",
    lastAddress: ""
  });
  const [dayPlan, setDayPlan] = useState([
    {
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
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

  const deleteFnc = (delIdx) => {
    if (delIdx > 0) {
      setDayPlan(dayPlan.filter((_,idx) => idx !== delIdx));
      setOpen(delIdx - 1);
      setDetailCk(false);
    }
  }

  const dayPlanPostFnc = () => {
    //dayPlan post
    setViewCont("PlanView");
  }

  useEffect(() => {
    //dayPlan get
  }, [])

  return (
    <div className={Styles.lastPlanWrap}>
      <div className={Styles.planDiv}>
        <label>최종 도착지 이름
          <input type="text" value={lastLocation.lastLocation}
            onChange={(e) => {
              setLastLocation({...lastLocation, lastLocation: e.target.value})
            }}
          />
        </label>
        <label>최종 도착지 주소
          <input type="text" value={lastLocation.lastAddress}
            onChange={(e) => {
              setLastLocation({...lastLocation, lastAddress: e.target.value})
            }}
          />
        </label>
      </div>
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
                <label>주소<br />
                  <input type="text" value={obj.address}
                    onChange={(e) => inputChangeFnc(e, "address", idx)}
                  />
                </label>

                <div className={Styles.locationDiv}>

                  <label>장소 이름<br/>
                    <input type="text" value={obj.location}
                      onChange={(e) => inputChangeFnc(e, "location", idx)}
                    />
                  </label>

                  <div className={Styles.timeDiv}>
                    <label>활동 시간<br/>
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
      <input type="button" value="일정추가" onClick={dayPlanAddFnc} />
      <input type="button" value="완료" onClick={dayPlanPostFnc} />
    </div>
  );
}

export default LastPlan;