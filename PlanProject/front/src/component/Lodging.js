import React, { useContext, useEffect, useRef, useState } from "react";
import Styles from "./Lodging.module.scss";
import { SetMap, SearchMap, PullSearchMap, CreateLineMap, Map } from '../naver/NaverApi';
import Directions from "../naver/Directions";
import { PlanContext } from "../context/PlanContext";

const Lodging = () => {

  const { plan, setPlan, setLoading } = useContext(PlanContext);

  //숙소 open index
  const [open, setOpen] = useState(0);

  //숙소 정보
  const [log, setLog] = useState([{
    id: '',
    address: "",
    check_in: "",
    check_out: "",
    reservation: false,
    price: "",
    memo: "",
  }]);

  // onchange 함수
  const valueChangeFnc = (e, key, idx, obj) => {
    const changeValue = (key === "reservation") ? e.target.checked : e.target.value;
    let copy = [...log];
    copy[idx] = {
      ...copy[idx],
      [key]: changeValue,
    }
    setLog(copy);
  }

  // 숙소 추가
  const hotelAddFnc = () => {
    setLog([
      ...log,
      {
        id: '',
        address: "",
        check_in: "",
        check_out: "",
        reservation: false,
        price: "",
        memo: "",
      }
    ]);
    setOpen(log.length);
  }

  // 숙소 삭제
  const deleteFnc = (delIdx) => {
    if (log.length > 1) {
      setLog(log.filter((_, idx) => idx !== delIdx));
      if (delIdx > 0) {
        setOpen(delIdx - 1);
      }
    }
  }

  // 완료 버튼 > 주소 유효성 + 지도 경로 + 전역변수에 저장
  const hotelPostFnc = async () => {

    setLoading(true);
    let pointArr = []
    let i = 0; // 잘 못 입력된 주소 idx
    try {
      for (let { address } of log) {
        const point = await PullSearchMap(address);
        pointArr.push(point);
        i++;
      }

      if (log?.length > 1) {
        const data = await Directions(pointArr);
        CreateLineMap(data.path);
      }

      setPlan({
        ...plan,
        lodging: log,
      })

      setLoading(false);

    } catch (error) {

      setLoading(false);
      alert('주소를 다시 검색해주세요');
      let copy = [...log];
      copy[i] = {
        ...copy[i],
        address: "",
      }
      setLog(copy);
      setOpen(i);

      return;
    }

  }

  // 지도 검색 
  const searchAddFnc = async (idx) => {

    let result = false;
    try {
      result = await SearchMap(log[idx].address);
    } catch (error) {
      result = false;
    }
    if (!result) {
      let copy = [...log];
      copy[idx].address = ""
      setLog(copy)
      alert('주소를 다시 검색해주세요');
    }
  }

  useEffect(() => {
    setLog(plan.lodging);
    //주소 값이 있으면 지도 표시
    try {
      if (plan.lodging[0].address !== '') {
        SearchMap(plan.lodging[0].address);
      }
    } catch (error) {
    }
  }, []);

  return (
    <div className={Styles.lodgingWrap}>
      <div className={Styles.mapDiv}>
        <SetMap />
      </div>
      <div className={Styles.lodgingsDiv}>
        {log.map((obj, idx) => {
          return (
            <div className={Styles.lodgingDiv} key={idx}>
              <div className={Styles.openDiv}>
                <p>{idx + 1}번째 숙소</p>
                <span className={Styles.openSpan} onClick={() => setOpen(idx)}>
                  {(open === idx) ? '●' : '▼'}
                </span>
              </div>
              {(open === idx) &&
                <>
                  <div className={Styles.addDiv}>
                    <label>
                      주소*<br />
                      <input type="text" value={obj.address}
                        onChange={(e) => valueChangeFnc(e, "address", idx, obj)} />
                    </label>
                    <input type="button" value="검색" onClick={() => searchAddFnc(idx)} />
                  </div>

                  <label>
                    숙박일정*
                    <div className={Styles.logDateDiv}>
                      <input type="date"
                        value={obj.check_in}
                        onChange={(e) => valueChangeFnc(e, "check_in", idx, obj)}
                      />
                      <p className={Styles.dateText}>~</p>
                      <input type="date"
                        value={obj.check_out}
                        onChange={(e) => valueChangeFnc(e, "check_out", idx, obj)}
                      />
                    </div>
                  </label>

                  <div className={Styles.lodgingInfoDiv}>
                    <input type="checkbox" id={`reservation${idx}`} checked={obj.reservation}
                      onChange={(e) => valueChangeFnc(e, "reservation", idx, obj)} />
                    <label className={Styles.reservLabel}
                      htmlFor={`reservation${idx}`}>예약완료</label>

                    <label htmlFor={`price${idx}`} className={Styles.priceLabel}>숙소가격</label>
                    <input type="number" id={`price${idx}`}
                      value={obj.price}
                      onChange={(e) => valueChangeFnc(e, "price", idx, obj)} />
                  </div>

                  <label>
                    메모<br />
                    <textarea rows="5"
                      value={obj.memo}
                      onChange={(e) => valueChangeFnc(e, "memo", idx, obj)}
                    ></textarea>
                  </label>
                  <input className={Styles.deleteBtn} type="button" value="삭제" onClick={() => deleteFnc(idx)} />
                </>
              }
            </div>
          )
        })}
        <input className={Styles.btn} type="button" value="숙소추가" onClick={hotelAddFnc} />
        <input className={Styles.btn} type="button" value="완료" onClick={hotelPostFnc} />
      </div>
    </div>
  );
}

export default Lodging;