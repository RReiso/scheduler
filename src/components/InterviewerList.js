import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function DayListItem({
  interviewers,
  setInterviewer,
  interviewer,
}) {
  const allInterviewers = interviewers.map((person) => {
    return (
      <InterviewerListItem
        {...person}
        key={person.id}
        setInterviewer={() => setInterviewer(person.id)}
        selected={person.id === interviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{allInterviewers}</ul>
    </section>
  );
}
