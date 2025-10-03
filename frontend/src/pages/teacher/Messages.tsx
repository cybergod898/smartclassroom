import { useEffect, useState } from "react";
import { 
  Card, 
  List, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Row,
  Col,
  Tag,
  Avatar,
  Tooltip,
  Popconfirm,
  Badge,
  Divider,
  Empty,
  Tabs
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  SendOutlined,
  ReloadOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  MailOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

type Message = {
  id: number;
  title: string;
  content: string;
  sender: string;
  senderAvatar?: string;
  recipient: string;
  recipientType: "个人" | "班级" | "全体";
  type: "通知" | "作业" | "提醒" | "私信";
  priority: "高" | "中" | "低";
  status: "已发送" | "草稿" | "已读" | "未读";
  sendTime: string;
  readTime?: string;
  attachments?: string[];
  replyCount: number;
};

type Notification = {
  id: number;
  title: string;
  content: string;
  type: "系统" | "作业" | "考试" | "通知";
  priority: "高" | "中" | "低";
  status: "已读" | "未读";
  time: string;
  action?: string;
};

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: 1,
    title: "关于期中考试安排的通知",
    content: "各位同学，期中考试将于下周一开始，请大家做好复习准备。考试时间为上午8:00-10:00，地点在A101教室。",
    sender: "张老师",
    senderAvatar: "",
    recipient: "高一(3)班",
    recipientType: "班级",
    type: "通知",
    priority: "高",
    status: "已发送",
    sendTime: "2024-11-20 09:30",
    replyCount: 5
  },
  {
    id: 2,
    title: "数学作业提交提醒",
    content: "请同学们记得在今天晚上12点前提交数学作业第三章练习题。",
    sender: "张老师",
    recipient: "高一(3)班",
    recipientType: "班级",
    type: "作业",
    priority: "中",
    status: "已发送",
    sendTime: "2024-11-19 16:45",
    replyCount: 2
  },
  {
    id: 3,
    title: "家长会邀请函",
    content: "尊敬的家长，我们将于本周六下午2点在学校礼堂举行家长会，请您准时参加。",
    sender: "李老师",
    recipient: "全体家长",
    recipientType: "全体",
    type: "通知",
    priority: "高",
    status: "已发送",
    sendTime: "2024-11-18 14:20",
    replyCount: 12
  },
  {
    id: 4,
    title: "课程调整通知",
    content: "由于教室维修，明天的物理课调整到B203教室上课。",
    sender: "赵老师",
    recipient: "高一(3)班",
    recipientType: "班级",
    type: "通知",
    priority: "中",
    status: "草稿",
    sendTime: "2024-11-20 11:15",
    replyCount: 0
  }
];

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "系统维护通知",
    content: "系统将于今晚22:00-24:00进行维护，期间可能无法正常使用。",
    type: "系统",
    priority: "高",
    status: "未读",
    time: "2024-11-20 10:00",
    action: "查看详情"
  },
  {
    id: 2,
    title: "作业批改提醒",
    content: "您有15份作业待批改，请及时处理。",
    type: "作业",
    priority: "中",
    status: "未读",
    time: "2024-11-20 08:30"
  },
  {
    id: 3,
    title: "考试安排确认",
    content: "期中考试安排已确认，请查看考试时间表。",
    type: "考试",
    priority: "高",
    status: "已读",
    time: "2024-11-19 15:20",
    action: "查看时间表"
  },
  {
    id: 4,
    title: "课程表更新",
    content: "下周课程表已更新，请注意时间变动。",
    type: "通知",
    priority: "中",
    status: "已读",
    time: "2024-11-19 12:00"
  }
];

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("messages");
  const [form] = Form.useForm();

  // 计算统计数据
  const stats = {
    totalMessages: messages.length,
    unreadNotifications: notifications.filter(n => n.status === '未读').length,
    draftMessages: messages.filter(m => m.status === '草稿').length,
    sentMessages: messages.filter(m => m.status === '已发送').length
  };

  // 筛选消息
  const filteredMessages = messages.filter(msg => {
    const typeMatch = !selectedType || msg.type === selectedType;
    const statusMatch = !selectedStatus || msg.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高': return 'red';
      case '中': return 'orange';
      case '低': return 'green';
      default: return 'default';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '已发送': return 'green';
      case '草稿': return 'orange';
      case '已读': return 'blue';
      case '未读': return 'red';
      default: return 'default';
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case '通知': return 'blue';
      case '作业': return 'green';
      case '提醒': return 'orange';
      case '私信': return 'purple';
      case '系统': return 'gray';
      case '考试': return 'red';
      default: return 'default';
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case '系统': return <ExclamationCircleOutlined />;
      case '作业': return <EditOutlined />;
      case '考试': return <ClockCircleOutlined />;
      case '通知': return <BellOutlined />;
      default: return <MessageOutlined />;
    }
  };

  // 标记通知为已读
  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, status: '已读' } : n
    ));
    message.success('已标记为已读');
  };

  // 处理发送消息
  const handleSendMessage = () => {
    setEditingMessage(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditMessage = (msg: Message) => {
    setEditingMessage(msg);
    form.setFieldsValue(msg);
    setIsModalVisible(true);
  };

  const handleDeleteMessage = (msgId: number) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMessage) {
        // 编辑消息
        setMessages(prev => prev.map(m => 
          m.id === editingMessage.id ? { ...m, ...values } : m
        ));
        message.success('修改成功');
      } else {
        // 发送新消息
        const newMessage: Message = {
          id: Date.now(),
          ...values,
          sender: "当前教师",
          status: values.status || "已发送",
          sendTime: new Date().toLocaleString(),
          replyCount: 0
        };
        setMessages(prev => [...prev, newMessage]);
        message.success('发送成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingMessage(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">消息中心</h1>
        <p className="text-gray-600">管理消息通知、发送通知和查看系统提醒。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">总消息数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
              </div>
              <MessageOutlined className="text-3xl text-blue-500" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">未读通知</p>
                <p className="text-2xl font-bold text-orange-500">{stats.unreadNotifications}</p>
              </div>
              <Badge count={stats.unreadNotifications}>
                <BellOutlined className="text-3xl text-orange-500" />
              </Badge>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">草稿箱</p>
                <p className="text-2xl font-bold text-gray-500">{stats.draftMessages}</p>
              </div>
              <EditOutlined className="text-3xl text-gray-500" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">已发送</p>
                <p className="text-2xl font-bold text-green-500">{stats.sentMessages}</p>
              </div>
              <SendOutlined className="text-3xl text-green-500" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={
            <span>
              <MessageOutlined />
              消息管理
            </span>
          } key="messages">
            {/* 操作区域 */}
            <div className="mb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <Space wrap>
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                  >
                    发送消息
                  </Button>
                </Space>

                <Space wrap>
                  <Select
                    placeholder="消息类型"
                    value={selectedType}
                    onChange={setSelectedType}
                    allowClear
                    style={{ width: 120 }}
                  >
                    <Option value="通知">通知</Option>
                    <Option value="作业">作业</Option>
                    <Option value="提醒">提醒</Option>
                    <Option value="私信">私信</Option>
                  </Select>

                  <Select
                    placeholder="状态"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    allowClear
                    style={{ width: 120 }}
                  >
                    <Option value="已发送">已发送</Option>
                    <Option value="草稿">草稿</Option>
                    <Option value="已读">已读</Option>
                    <Option value="未读">未读</Option>
                  </Select>
                </Space>
              </div>
            </div>

            {/* 消息列表 */}
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              dataSource={filteredMessages}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Space key="actions">
                      <Tooltip title="查看详情">
                        <Button type="link" size="small" icon={<EyeOutlined />} />
                      </Tooltip>
                      <Tooltip title="编辑">
                        <Button 
                          type="link" 
                          size="small" 
                          icon={<EditOutlined />}
                          onClick={() => handleEditMessage(item)}
                        />
                      </Tooltip>
                      <Tooltip title="回复">
                        <Button type="link" size="small" icon={<ReloadOutlined />} />
                      </Tooltip>
                      <Popconfirm
                        title="确定要删除这条消息吗？"
                        onConfirm={() => handleDeleteMessage(item.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Tooltip title="删除">
                          <Button 
                            type="link" 
                            size="small" 
                            icon={<DeleteOutlined />}
                            danger
                          />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />}
                        src={item.senderAvatar}
                      />
                    }
                    title={
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-semibold">{item.title}</span>
                        <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                        <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
                        <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>发送者: {item.sender}</span>
                          <span>接收者: {item.recipient}</span>
                          <span>发送时间: {item.sendTime}</span>
                          {item.replyCount > 0 && (
                            <span>回复: {item.replyCount}条</span>
                          )}
                        </div>
                      </div>
                    }
                  />
                  <div className="mt-2 text-gray-700">
                    {item.content}
                  </div>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab={
            <span>
              <BellOutlined />
              系统通知
              {stats.unreadNotifications > 0 && (
                <Badge count={stats.unreadNotifications} size="small" className="ml-2" />
              )}
            </span>
          } key="notifications">
            {/* 通知列表 */}
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    item.action && (
                      <Button type="link" size="small">
                        {item.action}
                      </Button>
                    ),
                    item.status === '未读' && (
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => markNotificationAsRead(item.id)}
                      >
                        标记已读
                      </Button>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getNotificationIcon(item.type)}
                        style={{ 
                          backgroundColor: item.status === '未读' ? '#1890ff' : '#d9d9d9' 
                        }}
                      />
                    }
                    title={
                      <div className="flex items-center space-x-2">
                        <span className={item.status === '未读' ? 'font-bold' : ''}>
                          {item.title}
                        </span>
                        <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                        <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
                        {item.status === '未读' && (
                          <Badge status="processing" text="未读" />
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <p>{item.content}</p>
                        <p className="text-xs text-gray-400">
                          <ClockCircleOutlined className="mr-1" />
                          {item.time}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            {notifications.length === 0 && (
              <Empty 
                description="暂无通知"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* 发送/编辑消息模态框 */}
      <Modal
        title={editingMessage ? "编辑消息" : "发送消息"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText="发送"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: '通知',
            priority: '中',
            recipientType: '班级',
            status: '已发送'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="消息标题"
              name="title"
              rules={[{ required: true, message: '请输入消息标题' }]}
            >
              <Input placeholder="请输入消息标题" />
            </Form.Item>

            <Form.Item
              label="消息类型"
              name="type"
              rules={[{ required: true, message: '请选择消息类型' }]}
            >
              <Select placeholder="请选择消息类型">
                <Option value="通知">通知</Option>
                <Option value="作业">作业</Option>
                <Option value="提醒">提醒</Option>
                <Option value="私信">私信</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="接收者类型"
              name="recipientType"
              rules={[{ required: true, message: '请选择接收者类型' }]}
            >
              <Select placeholder="请选择接收者类型">
                <Option value="个人">个人</Option>
                <Option value="班级">班级</Option>
                <Option value="全体">全体</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="接收者"
              name="recipient"
              rules={[{ required: true, message: '请输入接收者' }]}
            >
              <Input placeholder="请输入接收者" />
            </Form.Item>

            <Form.Item
              label="优先级"
              name="priority"
            >
              <Select>
                <Option value="高">高</Option>
                <Option value="中">中</Option>
                <Option value="低">低</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="状态"
              name="status"
            >
              <Select>
                <Option value="已发送">立即发送</Option>
                <Option value="草稿">保存草稿</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="消息内容"
            name="content"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="请输入消息内容"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
