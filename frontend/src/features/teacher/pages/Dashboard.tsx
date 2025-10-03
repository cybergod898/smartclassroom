import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, Button, Space, List, Avatar, Badge, Timeline, Alert } from "antd";
import { 
  UserOutlined, 
  BookOutlined, 
  CalendarOutlined, 
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  SettingOutlined,
  BellOutlined
} from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";

// 模拟数据
const attendanceData = [
  { name: '周一', value: 95 },
  { name: '周二', value: 88 },
  { name: '周三', value: 92 },
  { name: '周四', value: 85 },
  { name: '周五', value: 90 },
];

const gradeData = [
  { subject: '数学', average: 85, excellent: 12, good: 18, pass: 8, fail: 2 },
  { subject: '语文', average: 88, excellent: 15, good: 16, pass: 7, fail: 2 },
  { subject: '英语', average: 82, excellent: 10, good: 20, pass: 8, fail: 2 },
  { subject: '物理', average: 79, excellent: 8, good: 18, pass: 12, fail: 2 },
];

const recentActivities = [
  { id: 1, type: '作业', content: '数学第三章练习题', time: '2小时前', status: 'pending' },
  { id: 2, type: '考试', content: '期中考试成绩录入', time: '4小时前', status: 'completed' },
  { id: 3, type: '通知', content: '家长会安排通知', time: '1天前', status: 'sent' },
  { id: 4, type: '课件', content: '上传新课件资料', time: '2天前', status: 'completed' },
];

// 今日课堂数据
const todayClasses = [
  { 
    id: 1, 
    subject: '高等数学', 
    class: '高一(3)班', 
    time: '08:00-09:40', 
    room: '教学楼A201', 
    status: 'upcoming',
    students: 42,
    attendance: null
  },
  { 
    id: 2, 
    subject: '线性代数', 
    class: '高二(1)班', 
    time: '10:00-11:40', 
    room: '教学楼A203', 
    status: 'ongoing',
    students: 38,
    attendance: 36
  },
  { 
    id: 3, 
    subject: '概率论', 
    class: '高三(2)班', 
    time: '14:00-15:40', 
    room: '教学楼A205', 
    status: 'upcoming',
    students: 40,
    attendance: null
  },
  { 
    id: 4, 
    subject: '数学分析', 
    class: '高一(1)班', 
    time: '16:00-17:40', 
    room: '教学楼A201', 
    status: 'completed',
    students: 45,
    attendance: 43
  }
];

// 待处理事项数据
const pendingTasks = [
  { id: 1, type: 'review', title: '学生选课申请', count: 12, urgent: true },
  { id: 2, type: 'grade', title: '作业批改', count: 28, urgent: false },
  { id: 3, type: 'export', title: '成绩导出', count: 3, urgent: false },
  { id: 4, type: 'message', title: '未读消息', count: 7, urgent: true },
];

// 快捷操作数据
const quickActions = [
  { id: 1, title: '开始上课', icon: <PlayCircleOutlined />, color: '#52c41a', path: '/teacher/attendance' },
  { id: 2, title: '发布作业', icon: <FileTextOutlined />, color: '#1890ff', path: '/teacher/assignments' },
  { id: 3, title: '查看成绩', icon: <BarChartOutlined />, color: '#722ed1', path: '/teacher/grades' },
  { id: 4, title: '发送消息', icon: <MessageOutlined />, color: '#fa8c16', path: '/teacher/messages' },
  { id: 5, title: '课程管理', icon: <BookOutlined />, color: '#13c2c2', path: '/teacher/courses' },
  { id: 6, title: '系统设置', icon: <SettingOutlined />, color: '#eb2f96', path: '/teacher/settings' },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const activityColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          '作业': 'blue',
          '考试': 'green',
          '通知': 'orange',
          '课件': 'purple'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          'pending': { color: 'warning', text: '待处理' },
          'completed': { color: 'success', text: '已完成' },
          'sent': { color: 'processing', text: '已发送' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    }
  ];

  const getClassStatusConfig = (status: string) => {
    const configs = {
      'upcoming': { color: '#1890ff', text: '即将开始', icon: <ClockCircleOutlined /> },
      'ongoing': { color: '#52c41a', text: '正在进行', icon: <PlayCircleOutlined /> },
      'completed': { color: '#8c8c8c', text: '已结束', icon: <CheckCircleOutlined /> }
    };
    return configs[status as keyof typeof configs];
  };

  const getPendingTaskIcon = (type: string) => {
    const icons = {
      'review': <ExclamationCircleOutlined />,
      'grade': <EditOutlined />,
      'export': <BarChartOutlined />,
      'message': <BellOutlined />
    };
    return icons[type as keyof typeof icons];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">教师工作台</h1>
        <p className="text-gray-600">欢迎回来！今天是美好的一天，让我们开始工作吧。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="我的课程"
              value={8}
              prefix={<BookOutlined className="text-blue-500" />}
              suffix="门"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="学生总数"
              value={156}
              prefix={<UserOutlined className="text-green-500" />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="本周出勤率"
              value={90}
              prefix={<CalendarOutlined className="text-orange-500" />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="优秀率"
              value={32.5}
              prefix={<TrophyOutlined className="text-purple-500" />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 今日课堂 & 待处理事项 */}
      <Row gutter={[16, 16]} className="mb-6">
        {/* 今日课堂 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-blue-500" />
                <span>今日课堂</span>
                <Badge count={todayClasses.filter(c => c.status === 'upcoming').length} />
              </div>
            } 
            loading={loading}
            extra={
              <Button type="link" onClick={() => navigate('/teacher/attendance')}>
                查看全部
              </Button>
            }
          >
            <Timeline>
              {todayClasses.map(classItem => {
                const statusConfig = getClassStatusConfig(classItem.status);
                return (
                  <Timeline.Item
                    key={classItem.id}
                    dot={statusConfig.icon}
                    color={statusConfig.color}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">
                          {classItem.subject} - {classItem.class}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {classItem.time} | {classItem.room}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          学生: {classItem.students}人
                          {classItem.attendance !== null && (
                            <span className="ml-2">
                              出勤: {classItem.attendance}人 
                              ({Math.round((classItem.attendance / classItem.students) * 100)}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
                        {classItem.status === 'upcoming' && (
                          <Button 
                            type="primary" 
                            size="small" 
                            className="mt-2"
                            onClick={() => navigate('/teacher/attendance')}
                          >
                            开始上课
                          </Button>
                        )}
                        {classItem.status === 'ongoing' && (
                          <Button 
                            type="default" 
                            size="small" 
                            className="mt-2"
                            onClick={() => navigate('/teacher/attendance')}
                          >
                            进入课堂
                          </Button>
                        )}
                      </div>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Card>
        </Col>

        {/* 待处理事项 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="text-orange-500" />
                <span>待处理事项</span>
                <Badge count={pendingTasks.reduce((sum, task) => sum + task.count, 0)} />
              </div>
            } 
            loading={loading}
          >
            <List
              dataSource={pendingTasks}
              renderItem={task => (
                <List.Item className="px-0">
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getPendingTaskIcon(task.type)}
                        style={{ 
                          backgroundColor: task.urgent ? '#ff4d4f' : '#1890ff' 
                        }}
                      />
                    }
                    title={
                      <div className="flex justify-between items-center">
                        <span>{task.title}</span>
                        <Badge 
                          count={task.count} 
                          style={{ 
                            backgroundColor: task.urgent ? '#ff4d4f' : '#52c41a' 
                          }} 
                        />
                      </div>
                    }
                    description={
                      task.urgent ? (
                        <span className="text-red-500">紧急处理</span>
                      ) : (
                        <span className="text-gray-500">待处理</span>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <RiseOutlined className="text-green-500" />
                <span>快捷操作</span>
              </div>
            } 
            loading={loading}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map(action => (
                <Col xs={12} sm={8} md={6} lg={4} key={action.id}>
                  <Card
                    hoverable
                    className="text-center cursor-pointer transition-all duration-300 hover:shadow-lg"
                    bodyStyle={{ padding: '20px 16px' }}
                    onClick={() => navigate(action.path)}
                  >
                    <div 
                      className="text-3xl mb-2"
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {action.title}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        {/* 出勤趋势图 */}
        <Col xs={24} lg={12}>
          <Card title="本周出勤趋势" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 成绩分析 */}
        <Col xs={24} lg={12}>
          <Card title="各科成绩分析" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#52c41a" name="平均分" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 班级概况 */}
        <Col xs={24} lg={8}>
          <Card title="班级概况" loading={loading}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>高一(3)班</span>
                <Tag color="blue">班主任</Tag>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>出勤率</span>
                  <span>92%</span>
                </div>
                <Progress percent={92} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>作业完成率</span>
                  <span>88%</span>
                </div>
                <Progress percent={88} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>优秀率</span>
                  <span>35%</span>
                </div>
                <Progress percent={35} strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={16}>
          <Card title="最近活动" loading={loading}>
            <Table
              columns={activityColumns}
              dataSource={recentActivities}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}