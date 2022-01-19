import React from "react";
import classNames from "classnames";
import "components/InterviewListItem.scss";

export default function DayListItem({
  id,
  name,
  avatar,
  selected,
  setInterviewer,
}) {
  let interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": selected,
  });

  return (
    <li onClick={() => setInterviewer(id)} className={interviewerClass}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
