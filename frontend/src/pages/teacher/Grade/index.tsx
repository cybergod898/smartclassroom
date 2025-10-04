import React from "react";
export default function Grade() {
  return (
    <div>
      <h4>我的成绩（加权示例：考勤30% 提问20% 作业50%）</h4>
      <div className="tc-table">
        <div className="tc-row tc-row--head"><div>学生</div><div>平时</div><div>总评</div></div>
        <div className="tc-row"><div>张三</div><div>86</div><div>88</div></div>
      </div>
      <button className="tc-btn">导出</button>
    </div>
  );
}
