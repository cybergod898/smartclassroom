import { useState } from "react";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  message,
  Row,
  Col,
  Avatar,
  Upload,
  Divider,
  Tabs,
  List,
  Tag,
  Modal,
  InputNumber,
  TimePicker,
  Checkbox
} from "antd";
import { 
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BookOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Password } = Input;

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  department: string;
  employeeId: string;
  bio: string;
  address: string;
  subjects: string[];
  classes: string[];
};

type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  attendanceAlerts: boolean;
  systemUpdates: boolean;
};

type SystemSettings = {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: string;
  autoSave: boolean;
  sessionTimeout: number;
};

type ClassSchedule = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  class: string;
  room: string;
};

// 模拟用户数据
const mockUserProfile: UserProfile = {
  id: 1,
  name: "张老师",
  email: "zhang.teacher@school.edu.cn",
  phone: "138****8888",
  avatar: "",
  title: "高级教师",
  department: "数学教研组",
  employeeId: "T2024001",
  bio: "从事数学教学工作15年，擅长高中数学教学，曾获得市级优秀教师称号。",
  address: "北京市海淀区学院路123号",
  subjects: ["高等数学", "数学分析"],
  classes: ["高一(3)班", "高二(1)班"]
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  assignmentReminders: true,
  gradeNotifications: true,
  attendanceAlerts: false,
  systemUpdates: true
};

const mockSystemSettings: SystemSettings = {
  language: "zh-CN",
  timezone: "Asia/Shanghai",
  dateFormat: "YYYY-MM-DD",
  theme: "light",
  autoSave: true,
  sessionTimeout: 30
};

const mockSchedule: ClassSchedule[] = [
  {
    id: 1,
    day: "周一",
    startTime: "08:00",
    endTime: "09:40",
    subject: "高等数学",
    class: "高一(3)班",
    room: "A101"
  },
  {
    id: 2,
    day: "周三",
    startTime: "10:00",
    endTime: "11:40",
    subject: "高等数学",
    class: "高一(3)班",
    room: "A101"
  },
  {
    id: 3,
    day: "周五",
    startTime: "14:00",
    endTime: "15:40",
    subject: "数学分析",
    class: "高二(1)班",
    room: "B203"
  }
];

export default function Settings() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(mockSystemSettings);
  const [schedule, setSchedule] = useState<ClassSchedule[]>(mockSchedule);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [systemForm] = Form.useForm();

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
        // 这里应该更新用户头像
      }
    },
  };

  const handleProfileSave = async () => {
    try {
      const values = await profileForm.validateFields();
      setUserProfile(prev => ({ ...prev, ...values }));
      message.success('个人信息保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      // 这里应该调用修改密码的API
      message.success('密码修改成功');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleNotificationSave = async () => {
    try {
      const values = await notificationForm.validateFields();
      setNotificationSettings(values);
      message.success('通知设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSystemSave = async () => {
    try {
      const values = await systemForm.validateFields();
      setSystemSettings(values);
      message.success('系统设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">系统设置</h1>
        <p className="text-gray-600">管理个人信息、通知设置和系统偏好。</p>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 个人信息 */}
          <TabPane tab={
            <span>
              <UserOutlined />
              个人信息
            </span>
          } key="profile">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card title="头像设置" className="text-center">
                  <div className="mb-4">
                    <Avatar 
                      size={120} 
                      src={userProfile.avatar}
                      icon={<UserOutlined />}
                    />
                  </div>
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>
                      更换头像
                    </Button>
                  </Upload>
                  <p className="text-gray-500 text-sm mt-2">
                    支持 JPG、PNG 格式，文件大小不超过 2MB
                  </p>
                </Card>

                <Card title="快速信息" className="mt-4">
                  <List size="small">
                    <List.Item>
                      <List.Item.Meta
                        avatar={<UserOutlined />}
                        title="工号"
                        description={userProfile.employeeId}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<BookOutlined />}
                        title="部门"
                        description={userProfile.department}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<MailOutlined />}
                        title="邮箱"
                        description={userProfile.email}
                      />
                    </List.Item>
                  </List>
                </Card>
              </Col>

              <Col xs={24} lg={16}>
                <Card title="基本信息" extra={
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={handleProfileSave}
                    loading={loading}
                  >
                    保存
                  </Button>
                }>
                  <Form
                    form={profileForm}
                    layout="vertical"
                    initialValues={userProfile}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="姓名"
                          name="name"
                          rules={[{ required: true, message: '请输入姓名' }]}
                        >
                          <Input placeholder="请输入姓名" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="职称"
                          name="title"
                        >
                          <Select placeholder="请选择职称">
                            <Option value="助教">助教</Option>
                            <Option value="讲师">讲师</Option>
                            <Option value="副教授">副教授</Option>
                            <Option value="教授">教授</Option>
                            <Option value="高级教师">高级教师</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="邮箱"
                          name="email"
                          rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                          ]}
                        >
                          <Input placeholder="请输入邮箱" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="手机号"
                          name="phone"
                          rules={[{ required: true, message: '请输入手机号' }]}
                        >
                          <Input placeholder="请输入手机号" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="地址"
                          name="address"
                        >
                          <Input placeholder="请输入地址" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="个人简介"
                          name="bio"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="请输入个人简介"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                <Card title="安全设置" className="mt-4">
                  <List>
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          onClick={() => setIsPasswordModalVisible(true)}
                        >
                          修改
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<LockOutlined />}
                        title="登录密码"
                        description="定期更换密码可以提高账户安全性"
                      />
                    </List.Item>
                  </List>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 通知设置 */}
          <TabPane tab={
            <span>
              <BellOutlined />
              通知设置
            </span>
          } key="notifications">
            <Card title="通知偏好" extra={
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleNotificationSave}
                loading={loading}
              >
                保存设置
              </Button>
            }>
              <Form
                form={notificationForm}
                layout="vertical"
                initialValues={notificationSettings}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="通知方式" size="small">
                      <Form.Item name="emailNotifications" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">邮件通知</div>
                            <div className="text-gray-500 text-sm">通过邮件接收重要通知</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                      
                      <Form.Item name="smsNotifications" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">短信通知</div>
                            <div className="text-gray-500 text-sm">通过短信接收紧急通知</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                      
                      <Form.Item name="pushNotifications" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">推送通知</div>
                            <div className="text-gray-500 text-sm">浏览器推送通知</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="通知内容" size="small">
                      <Form.Item name="assignmentReminders" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">作业提醒</div>
                            <div className="text-gray-500 text-sm">作业截止日期提醒</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                      
                      <Form.Item name="gradeNotifications" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">成绩通知</div>
                            <div className="text-gray-500 text-sm">成绩录入和发布通知</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                      
                      <Form.Item name="attendanceAlerts" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">考勤提醒</div>
                            <div className="text-gray-500 text-sm">考勤异常提醒</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                      
                      <Form.Item name="systemUpdates" valuePropName="checked">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">系统更新</div>
                            <div className="text-gray-500 text-sm">系统维护和更新通知</div>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>

          {/* 系统设置 */}
          <TabPane tab={
            <span>
              <SettingOutlined />
              系统设置
            </span>
          } key="system">
            <Card title="系统偏好" extra={
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleSystemSave}
                loading={loading}
              >
                保存设置
              </Button>
            }>
              <Form
                form={systemForm}
                layout="vertical"
                initialValues={systemSettings}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label="语言"
                      name="language"
                    >
                      <Select>
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="时区"
                      name="timezone"
                    >
                      <Select>
                        <Option value="Asia/Shanghai">北京时间 (UTC+8)</Option>
                        <Option value="Asia/Tokyo">东京时间 (UTC+9)</Option>
                        <Option value="America/New_York">纽约时间 (UTC-5)</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="日期格式"
                      name="dateFormat"
                    >
                      <Select>
                        <Option value="YYYY-MM-DD">2024-11-20</Option>
                        <Option value="MM/DD/YYYY">11/20/2024</Option>
                        <Option value="DD/MM/YYYY">20/11/2024</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label="主题"
                      name="theme"
                    >
                      <Select>
                        <Option value="light">浅色主题</Option>
                        <Option value="dark">深色主题</Option>
                        <Option value="auto">跟随系统</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="会话超时时间（分钟）"
                      name="sessionTimeout"
                    >
                      <InputNumber 
                        min={5} 
                        max={120} 
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item name="autoSave" valuePropName="checked">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">自动保存</div>
                          <div className="text-gray-500 text-sm">自动保存表单数据</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>

          {/* 课程表设置 */}
          <TabPane tab={
            <span>
              <ClockCircleOutlined />
              课程表
            </span>
          } key="schedule">
            <Card title="我的课程表">
              <List
                itemLayout="horizontal"
                dataSource={schedule}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small" icon={<EditOutlined />}>
                        编辑
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ backgroundColor: '#1890ff' }}
                          icon={<BookOutlined />}
                        />
                      }
                      title={
                        <div className="flex items-center space-x-2">
                          <span>{item.subject}</span>
                          <Tag color="blue">{item.class}</Tag>
                        </div>
                      }
                      description={
                        <div className="space-y-1">
                          <div>
                            <ClockCircleOutlined className="mr-1" />
                            {item.day} {item.startTime}-{item.endTime}
                          </div>
                          <div>
                            <HomeOutlined className="mr-1" />
                            {item.room}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Password 
              placeholder="请输入当前密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Password 
              placeholder="请输入新密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Password 
              placeholder="请确认新密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}