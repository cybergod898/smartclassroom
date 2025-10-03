import React from "react";
import { Form, Input, Button, Card } from "antd";
export default function Settings(){
  return (
    <Card title="个人设置">
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} onFinish={(v)=>console.log(v)}>
        <Form.Item label="姓名" name="name"><Input placeholder="张老师" /></Form.Item>
        <Form.Item label="邮箱" name="email"><Input placeholder="teacher@example.com" /></Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}><Button type="primary" htmlType="submit">保存</Button></Form.Item>
      </Form>
    </Card>
  );
}
