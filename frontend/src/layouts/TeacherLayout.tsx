import React, { useState } from "react";
import { Layout, Menu, Typography, theme, Button } from "antd";
import {
  HomeOutlined,
  BellOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const items = [
  { key: "/teacher/dashboard", icon: <HomeOutlined />, label: "首页" },
  { key: "/teacher/messages", icon: <BellOutlined />, label: "我的消息" },
  { key: "/teacher/schedule", icon: <CalendarOutlined />, label: "我的课表" },
  { key: "/teacher/teaching", icon: <PlayCircleOutlined />, label: "我的上课" },
  { key: "/teacher/courses", icon: <FileTextOutlined />, label: "我的备课" },
  { key: "/teacher/assignments", icon: <FileDoneOutlined />, label: "我的作业" },
  { key: "/teacher/grades", icon: <BarChartOutlined />, label: "我的成绩" },
];

export default function TeacherLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const nav = useNavigate();
  const loc = useLocation();

  const activeKey = items.find(i => loc.pathname.startsWith(i.key))?.key ?? "/teacher/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 48, margin: 12, color: "#fff", display: "flex", alignItems: "center" }}>
          <Title level={5} style={{ color: "#fff", margin: 0 }}>
            智慧课堂 · 教师端
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={(e) => nav(e.key)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: token.colorBgContainer, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Title level={5} style={{ margin: 0 }}>智慧课堂 - 教师工作台</Title>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="用户头像" 
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#2d3748" }}>张老师</div>
                <div style={{ fontSize: "12px", color: "#718096" }}>高级教师</div>
              </div>
            </div>
            <Button type="text" icon={<UserOutlined />}>个人资料</Button>
            <Button type="primary">退出登录</Button>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <div style={{ padding: 16, background: token.colorBgContainer, minHeight: 360, borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
