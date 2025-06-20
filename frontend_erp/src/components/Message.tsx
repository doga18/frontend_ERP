import React from 'react'
import './messages.css';

type Props = {
  msg: string;
  type: string;
}

const Message = (props: Props) => {
  // console.log(props.msg);
  // console.log(props.type);
  return (
    <div className={`message ${props.type} fw-bold rounded`}>
      <p>{props.msg}</p>
    </div>
  )
}

export default Message