import React, { useContext, useEffect, useRef, useState } from "react";
import Styles from "./Lodging.module.scss";
import { SetMap, SearchMap, PullSearchMap, CreateLineMap } from '../naver/NaverApi';
import Directions from "../naver/Directions";
import { StartContext } from "./SetPlan";
import Swal from 'sweetalert2';

const Lodging = () => {

  const { navState, setNavState, plan, setPlan, editCk, setLoading } = useContext(StartContext);

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

  //경로 좌표 가져오기
  const getPath = async (plan) => {

    let pointArr = [];
    try {
      for (let i = 0; i < plan.length; i++) {
        //좌표 가져오기
        const point = await PullSearchMap(plan[i].address);
        pointArr.push(point);
      }
      //전체 경로 정보 가져오기
      const data = await Directions(pointArr);
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '주소를 다시 입력해주세요',
      })
      return false;
    }
  }

  // 완료 버튼 > 주소 유효성 + 지도 경로 + 전역변수에 저장
  const hotelPostFnc = async () => {

    setLoading(true);
    try {
      if (log?.length > 1) {
        const data = await getPath(log);
        //CreateLineMap(data.path);
      } else {
        const result = SearchMap(log[0].address);
      }

      setPlan({
        ...plan,
        lodging: log,
      });
      setNavState('DayPlan');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '주소를 다시 입력해주세요',
      })
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
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '주소를 다시 입력해주세요',
      })
    }
  }

  const startLine = async () => {
    setLoading(true);
    try {
      if (editCk) {
        const result = await SearchMap(plan.lodging[0].address);
      }
    } catch (error) {
    }
    setLoading(false);
  }

  useEffect(() => {
    setLog(plan.lodging);
    //주소 값이 있으면 지도 표시
    startLine();
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
        <input className={Styles.btn} type="button" value="다음" onClick={hotelPostFnc} />
      </div>
    </div>
  );
}

export default Lodging;