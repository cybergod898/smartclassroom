import React from "react";
export default function SeatLayout() {
  return (
    <div>
      <h4>座位布局</h4>
      <div className="tc-grid tc-seat">
        {Array.from({length: 30}).map((_,i)=>(<div key={i} className="tc-seat-cell">{i+1}</div>))}
      </div>
      <button className="tc-btn">保存模板</button>
    </div>
  );
}
