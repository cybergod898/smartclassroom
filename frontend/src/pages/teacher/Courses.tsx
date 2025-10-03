import React from "react";
import { Table, Button, Space } from "antd";
type Row = { id: number; name: string; weekday: string; time: string };
const data: Row[] = [
  { id: 1, name: "高一数学", weekday: "周一", time: "08:00-08:45" },
  { id: 2, name: "高一物理", weekday: "周三", time: "09:00-09:45" },
];
export default function Courses(){
  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={[
        { title: "课程名称", dataIndex: "name" },
        { title: "上课时间", render: (_, r) => `${r.weekday} ${r.time}` },
        { title: "操作", render: () => <Space><Button type="link">编辑</Button><Button danger type="link">删除</Button></Space> }
      ]}
    />
  );
}
