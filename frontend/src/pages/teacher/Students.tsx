import React, { useMemo, useState } from "react";
import { Table, Input, Space, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";

type Student = {
  id: number; name: string; className: string; phone?: string; status: "在读" | "休学";
};

const mock: Student[] = [
  { id: 1, name: "王明", className: "高一(1)班", phone: "13800000001", status: "在读" },
  { id: 2, name: "李丽", className: "高一(1)班", phone: "13800000002", status: "在读" },
  { id: 3, name: "赵强", className: "高一(2)班", phone: "13800000003", status: "休学" },
];

export default function Students() {
  const [q, setQ] = useState("");
  const data = useMemo(() => mock.filter(m => m.name.includes(q) || m.className.includes(q)), [q]);

  const columns: ColumnsType<Student> = [
    { title: "学号", dataIndex: "id", width: 80 },
    { title: "姓名", dataIndex: "name" },
    { title: "班级", dataIndex: "className" },
    { title: "电话", dataIndex: "phone" },
    { title: "状态", dataIndex: "status", render: (v) => <Tag color={v === "在读" ? "green" : "orange"}>{v}</Tag> },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space>
        <Input placeholder="搜索姓名/班级" value={q} onChange={e => setQ(e.target.value)} allowClear />
        <Button type="primary" icon={<PlusOutlined />}>新增学生</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
    </Space>
  );
}
