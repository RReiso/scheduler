import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";
import Appointment from "components/Appointment";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: [],
  });

  function bookInterview(appointmentID, interview) {
    console.log(appointmentID, interview);
    const appointment = {
      ...state.appointments[appointmentID],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [appointmentID]: appointment,
    };
    setState({
      ...state,
      appointments,
    });

    return axios
      .put(`/api/appointments/${appointmentID}`, { interview })
      .then(() => {
        setState({
          ...state,
          appointments,
        });
      })
      .catch((er) => console.log("error", er));
  }

  const cancelInterview = (appointmentID) => {
    const appointment = {
      ...state.appointments[appointmentID],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [appointmentID]: appointment,
    };
    console.log("HERE");

    return axios
      .delete(`/api/appointments/${appointmentID}`)
      .then(() =>
        setState({
          ...state,
          appointments,
        })
      )
      .catch((er) => console.log("error", er));
  };

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        console.log(all);
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((er) => console.log("error", er));
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map((appmt) => {
          const interview = getInterview(state, appmt.interview);
          return (
            <Appointment
              key={appmt.id}
              id={appmt.id}
              time={appmt.time}
              interview={interview}
              interviewers={dailyInterviewers}
              bookInterview={bookInterview}
              cancelInterview={cancelInterview}
            />
          );
        })}
        <Appointment key="last" time="5pm" cancelInterview={cancelInterview} />
      </section>
    </main>
  );
}
