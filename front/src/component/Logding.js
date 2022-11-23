import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Styles from "../route/SetPlan.module.scss";
//import Styles from "./Logding.module.scss";

const Hotel = () => {

  const { viewCont, setViewCont } = useContext(ThemeContext);
  const [open, setOpen] = useState(0);
  const [logding, setLogding] = useState({
    0: {
      address: "",
      check_in: "",
      check_out: "",
      reservation: false,
      price: "",
      memo: "",
    },
  });

  const valueChangeFnc = (e, key, idx, obj) => {
    const changeValue = (key === "reservation") ? e.target.checked : e.target.value;
    const change = { ...obj, [key]: changeValue, }
    setLogding({
      ...logding,
      [idx]: change,
    });
  }

  const hotelAddFnc = () => {
    const idxKey = Object.keys(logding).length;
    setLogding({
      ...logding,
      [idxKey]: {
        address: "",
        check_in: "",
        check_out: "",
        reservation: false,
        price: "",
        memo: "",
      }
    });
    setOpen(idxKey);
  }

  ///삭제 진행중
  const deleteFnc = (idx) => {
    if(idx > 0){
      const currentObj = Object.assign({}, logding);
      delete currentObj[idx];
      setLogding(currentObj);
      setOpen(idx-1);
    }
  }

  const hotelPostFnc = () => {
    //hotel post
    console.log(logding);
    //setViewCont(0);
  }

  console.log(logding)

  return (
    <div className={Styles.logdingWrap}>
      {Object.entries(logding).map(([idx, obj]) => (
        <div className={Styles.logdingDiv} key={idx}>

          <div className={Styles.openDiv}>
            <p>{parseInt(idx) + 1}번째 숙소</p>
            <span className={Styles.openSpan} onClick={() => setOpen(parseInt(idx))}>▼</span>
          </div>
          {(open === parseInt(idx)) &&
            <>
              <label htmlFor={`address${idx}`}>
                주소<br />
                <input type="text" id={`address${idx}`}
                  value={obj?.address}
                  onChange={(e) => valueChangeFnc(e, "address", idx, obj)}
                />
              </label>
              <label>
                숙박일정
                <div className={Styles.logDateDiv}>
                  <input type="date"
                    value={obj?.check_in}
                    onChange={(e) => valueChangeFnc(e, "check_in", idx, obj)}
                  />
                  <p className={Styles.dateText}>~</p>
                  <input type="date"
                    value={obj?.check_out}
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
                  value={obj?.price}
                  onChange={(e) => valueChangeFnc(e, "price", idx, obj)} />
              </div>

              <label htmlFor={`memo${idx}`}>
                메모<br />
                <textarea id={`memo${idx}`} rows="5"
                  value={obj?.memo}
                  onChange={(e) => valueChangeFnc(e, "memo", idx, obj)}
                ></textarea>
              </label>
              <input className={Styles.deleteBtn} type="button" value="삭제" onClick={() => deleteFnc(idx)}/>
            </>
          }
        </div>
      ))}
      <input type="button" value="숙소추가" onClick={hotelAddFnc} />
      <input type="button" value="완료" onClick={hotelPostFnc} />
    </div>
  );
}

export default Hotel;