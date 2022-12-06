import React, { useContext, useEffect, useState } from "react";
import Styles from "../route/SetPlan.module.scss";

const Logding = ({logding, setLogding}) => {

  //숙소 open index
  const [open, setOpen] = useState(0);

  //숙소 정보
  const [log, setLog] = useState([{
    address: "",
    check_in: "",
    check_out: "",
    reservation: false,
    price: "",
    memo: "",
  }]);

  const valueChangeFnc = (e, key, idx, obj) => {
    const changeValue = (key === "reservation") ? e.target.checked : e.target.value;
    let copy = [...log];
    copy[idx] = {
      ...copy[idx],
      [key]: changeValue,
    }
    setLog(copy);
  }

  const hotelAddFnc = () => {
    setLog([
      ...log,
      {
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

  const deleteFnc = (delIdx) => {
    if (delIdx > 0) {
      setLog(log.filter((_,idx) => idx !== delIdx));
      setOpen(delIdx - 1);
    }
  }

  const hotelPostFnc = () => {

    setLogding(log);
  }

  useEffect(() => {
    //수정할 때 get
    setLog(logding);
  }, []);

  return (
    <div className={Styles.logdingWrap}>
      {log.map((obj, idx) => {
        return (
          <div className={Styles.logdingDiv} key={idx}>
            <div className={Styles.openDiv}>
              <p>{idx + 1}번째 숙소</p>
              <span className={Styles.openSpan} onClick={() => setOpen(idx)}>
                {(open === idx) ? '●' : '▼'}
              </span>
            </div>
            {(open === idx) &&
              <>
                <label>
                  주소<br />
                  <input type="text" value={obj.address}
                    onChange={(e) => valueChangeFnc(e, "address", idx, obj)}
                  />
                </label>
                
                <label>
                  숙박일정
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

                <div className={Styles.logdingInfoDiv}>
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
      <input type="button" value="숙소추가" onClick={hotelAddFnc} />
      <input type="button" value="완료" onClick={hotelPostFnc} />
    </div>
  );
}

export default Logding;