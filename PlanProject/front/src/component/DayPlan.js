import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { PlanContext } from "../context/PlanContext";
import Styles from "./DayPlan.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SetMap, SearchMap, CreateLineMap} from '../naver/NaverApi';
import Directions from '../naver/Directions';

const DayPlans = () => {

  const navigate = useNavigate();

  const { navState, setNavState, plan, setBaseEditCk } = useContext(PlanContext);

  // id : planID , day : day index
  const { id, day } = useParams();

  // 일정 새로 만들기 or 수정하기 state
  const [editCk, setEditCk] = useState(false);

  //일정 open index
  const [open, setOpen] = useState(0);

  //상세 설정 CK
  const [detailCk, setDetailCk] = useState(false);

  //시간 input Ref
  const hourRef = useRef();
  const minuteRef = useRef();

  //하루 일정 state
  const [dayPlan, setDayPlan] = useState([{
    id: "",
    order: false,
    address: "",
    location: "",
    reservation: false,
    price: "",
    time: 0,
    memo: "",
    lastLocation: "",
    lastAddress: ""
  }]);

  //onchange 함수
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

  //일정 추가
  const dayPlanAddFnc = () => {
    const dayPlanObj = {
      id: "",
      order: false,
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
      lastLocation: "",
      lastAddress: "",
    }
    setDayPlan([...dayPlan, dayPlanObj]);
    setOpen(dayPlan.length);
    setDetailCk(false);
  }

  //일정 초기화
  const dayPlanReset = () => {
    setDayPlan([{
      id: "",
      order: false,
      address: "",
      location: "",
      reservation: false,
      price: "",
      time: 0,
      memo: "",
      lastLocation: "",
      lastAddress: "",
    }]);
  }

  //일정 삭제
  const deleteFnc = (delIdx) => {
    if (delIdx > 0) {
      setDayPlan(dayPlan.filter((_, idx) => idx !== delIdx));
      setOpen(delIdx - 1);
      setDetailCk(false);
    }
  }

  // 새로 만들기 Post
  const dayPlanPostFnc = async () => {

    //dayPlan post
    const res = await axios.post(`/back/plan/${id}/planDays`, {
      day,
      dayPlan,
      point: [],
      distance: [],
      duration: []
    });

    //저장 후 페이지 이동
    if (res.data.result) {
      setOpen(0);
      if (navState.view >= navState.dateArr.length - 1) {
        //setView("PlanView");
      } else {
        setNavState({
          ...navState,
          view: navState.view + 1
        })
        navigate(`/newplan/dayplan/${id}/${navState.view + 1}`);
      }
    }
  }

  //계획 수정 Post
  const dayPlanEditPostFnc = async () => {
    let i = 0;
    // for(let {address} of dayPlan){
    //   SearchMap(address, false, i++);
    // }

      const aa = await Directions();
      console.log(aa);
      CreateLineMap(aa.data.route.traoptimal[0].path);
  }

  //일자별 계획 GET
  const getDayPlan = async () => {

    setIsmap(false)

    const res = await axios.get(`/back/plan/${id}/planDays`, {
      params: { day },
    });

    setIsmap(true)

    const details = res.data.dayPlan.details;

    //id까지 가져와서 복사 후 state 저장
    let copyDayArr = [];
    let copyDayPlan = {};
    if (details?.length > 0) {

      for (let i = 0; i < details.length; i++) {
        copyDayPlan = {
          id: details[i]._id,
          order: details[i].order,
          address: details[i].addr,
          location: details[i].location,
          reservation: details[i].reser,
          price: details[i].price,
          memo: details[i].memo,
          reservation: details[i].reser,
          price: details[i].price,
          time: details[i].time,
          memo: details[i].memo,
          lastLocation: "",
          lastAddress: "",
        }
        copyDayArr.push(copyDayPlan);
      }

      //마지막 날짜인 경우 last 정보를 0번째 배열에 넣는다
      if (day === navState.dateArr.length - 1) {
        copyDayArr[0].lastLocation = details[0].last.location;
        copyDayArr[0].lastAddress = details[0].last.addr;
      }

      setDayPlan(copyDayArr);
      setEditCk(true);
    } else {
      //처음 작성하는 계획이면 초기화
      dayPlanReset();
      setEditCk(false);
    }
  }

  console.log(dayPlan);

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

  const pageBackFnc = () => {
    setNavState({ ...navState, view: 'STEP1' });
    setBaseEditCk(true);
    navigate('/newplan');
  }

  useEffect(() => {
    //dayPlan get
    getDayPlan();
  }, [navState.view])

  const [ismap, setIsmap] = useState(false)

  return (
    <div className={Styles.dayPlanWrap}>
      <div className={Styles.mapDiv}>
        {ismap && <SetMap />}
      </div>
      <div className={Styles.dayPlanDiv}>
        <input type="button" value="뒤로가기(초기세팅수정)" onClick={pageBackFnc} />
        {(navState.view === navState.dateArr.length - 1) && (
          <div className={Styles.lastLocDiv}>
            <label>최종 도착지 이름<br />
              <input type="text" value={dayPlan[0].lastLocation}
                onChange={(e) => inputChangeFnc(e, "lastLocation", 0)}
              />
            </label>
            <label>최종 도착지 주소<br />
              <input type="text" value={dayPlan[0].lastAddress}
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
        {editCk ? (
          <input className={Styles.btn} type="button" value="수정완료" onClick={dayPlanEditPostFnc} />
        ) : (
          <input className={Styles.btn} type="button" value="저장" onClick={dayPlanPostFnc} />
        )}
      </div>
    </div>

  );
}

export default DayPlans;