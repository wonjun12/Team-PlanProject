import React, { useEffect, useState, createContext } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Styles from "./NewPlan.module.scss";

import SetPlan from "../component/SetPlan";
import SetDayPlan from "../component/SetDayPlan";
import Loading from "../loading/Loading";

// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const NewPlan = () => {

  const [loading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <>
      {loading && <Loading/>}
      <div className={Styles.container}>
        <Routes>
          <Route path="/" element={<SetPlan editCk={false} setLoading={setLoading}/>} />
          <Route path="/:id/:day" element={<SetDayPlan editCk={false} setLoading={setLoading} />} />
        </Routes>
      </div>
    </>
  );
}

export default NewPlan;