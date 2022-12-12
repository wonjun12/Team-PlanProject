import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Styles from "./NewPlan.module.scss";

import SetPlan from "../component/SetPlan";
import SetDayPlan from "../component/SetDayPlan";

import Loading from "../loading/Loading";

// $('input').attr('autocomplete','off'); //input 자동완성 끄기

const EditPlan = () => {

  const [loading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <>
      {loading && <Loading/>}
      <div className={Styles.container}>
        <Routes>
          <Route path="/:id" element={<SetPlan editCk={true} setLoading={setLoading} loading={loading}/>} />
          <Route path="/:id/:day" element={<SetDayPlan editCk={true} setLoading={setLoading} loading={loading} />} />
        </Routes>
      </div>
    </>
  );
}

export default EditPlan;