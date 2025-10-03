import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Title, Text } = Typography;

// 定义角色类型
type UserRole = 'teacher' | 'student' | 'admin';

// 用户角色配置
const USER_ROLES: Record<UserRole, { name: string; dashboard: string; permissions: string[] }> = {
  teacher: {
    name: '教师',
    dashboard: '/teacher/dashboard',
    permissions: ['teaching', 'grading', 'attendance']
  },
  student: {
    name: '学生', 
    dashboard: '/student/dashboard',
    permissions: ['learning', 'homework']
  },
  admin: {
    name: '管理员',
    dashboard: '/admin/dashboard', 
    permissions: ['user_management', 'system_config', 'data_analysis', 'all']
  }
};

// 模拟用户数据
const MOCK_USERS: Array<{ username: string; password: string; role: UserRole; name: string; email: string }> = [
  { username: 'teacher001', password: '123456', role: 'teacher', name: '王教授', email: 'teacher@example.com' },
  { username: 'student001', password: '123456', role: 'student', name: '张同学', email: 'student@example.com' },
  { username: 'admin001', password: '123456', role: 'admin', name: '系统管理员', email: 'admin@example.com' }
];

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // 清除可能存在的用户登录状态，避免循环跳转
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
  }, []);

  // 角色选择处理
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    
    // 根据角色自动填充账号密码
    switch(role) {
      case 'teacher':
        form.setFieldsValue({ username: 'teacher001', password: '123456' });
        break;
      case 'student':
        form.setFieldsValue({ username: 'student001', password: '123456' });
        break;
      case 'admin':
        form.setFieldsValue({ username: 'admin001', password: '123456' });
        break;
      default:
        form.setFieldsValue({ username: '', password: '' });
    }
  };

  // 用户认证
  const authenticateUser = (username: string, password: string, role: string) => {
    const user = MOCK_USERS.find(u => 
      u.username === username && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      const userInfo = {
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('userRole', user.role);
      
      return {
        success: true,
        user: userInfo,
        redirectUrl: USER_ROLES[user.role as UserRole].dashboard
      };
    } else {
      return {
        success: false,
        message: '用户名、密码或角色不匹配'
      };
    }
  };

  // 登录表单提交
  const handleSubmit = async (values: LoginForm) => {
    if (!selectedRole) {
      message.error('请选择角色');
      return;
    }

    setLoading(true);
    
    try {
      const result = authenticateUser(values.username, values.password, selectedRole);
      
      if (result.success) {
        message.success('登录成功！正在跳转...');
        setTimeout(() => {
          navigate(result.redirectUrl);
        }, 1000);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 背景装饰 */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Card className="login-card">
        {/* Logo和标题 */}
        <div className="login-header">
          <div className="logo-container">
            <UserOutlined className="logo-icon" />
          </div>
          <Title level={2} className="login-title">海国图志·睿课堂</Title>
          <Text className="login-subtitle">智慧教学管理系统</Text>
        </div>

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          className="login-form"
        >
          {/* 角色选择 */}
          <Form.Item label="选择角色" className="role-selection">
            <div className="role-cards">
              {Object.entries(USER_ROLES).map(([key, role]) => (
                <div
                  key={key}
                  className={`role-card ${selectedRole === key ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(key)}
                >
                  <div className="role-icon">
                    {key === 'teacher' && '👨‍🏫'}
                    {key === 'student' && '👨‍🎓'}
                    {key === 'admin' && '👨‍💼'}
                  </div>
                  <div className="role-name">{role.name}</div>
                </div>
              ))}
            </div>
          </Form.Item>

          {/* 账号输入 */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              size="large"
            />
          </Form.Item>

          {/* 密码输入 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="login-button"
              block
            >
              登录
            </Button>
          </Form.Item>

          {/* 注册链接 */}
          <div className="register-link">
            <Text type="secondary">还没有账号？</Text>
            <Button type="link" className="register-btn">立即注册</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}