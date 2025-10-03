import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, List, Avatar, Tag, Progress } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Dashboard() {
  // 模拟数据
  const stats = [
    { title: '我的学生', value: 156, icon: <UserOutlined />, color: '#1890ff' },
    { title: '我的课程', value: 8, icon: <BookOutlined />, color: '#52c41a' },
    { title: '待批作业', value: 23, icon: <FileTextOutlined />, color: '#faad14' },
    { title: '今日课程', value: 3, icon: <CalendarOutlined />, color: '#722ed1' },
  ];

  const recentMessages = [
    { id: 1, student: '张小明', content: '老师，关于今天的作业有个问题...', time: '2分钟前', avatar: '张' },
    { id: 2, student: '李小红', content: '请假申请：明天因病无法上课', time: '15分钟前', avatar: '李' },
    { id: 3, student: '王小华', content: '作业提交：数学练习册第三章', time: '1小时前', avatar: '王' },
  ];

  const todaySchedule = [
    { id: 1, time: '08:00-09:40', course: '高等数学', class: '计算机1班', room: 'A101' },
    { id: 2, time: '10:00-11:40', course: '数据结构', class: '计算机2班', room: 'B203' },
    { id: 3, time: '14:00-15:40', course: '算法设计', class: '计算机1班', room: 'A101' },
  ];

  const pendingTasks = [
    { id: 1, task: '批改数学作业', deadline: '今天 18:00', priority: 'high' },
    { id: 2, task: '准备明天课件', deadline: '明天 08:00', priority: 'medium' },
    { id: 3, task: '学生成绩录入', deadline: '本周五', priority: 'low' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
        教师工作台
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 今日课程安排 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                今日课程安排
              </Space>
            }
            extra={<Button type="link">查看完整课表</Button>}
          >
            <List
              dataSource={todaySchedule}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{item.course}</Text>
                        <Tag color="blue">{item.class}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{item.time}</Text>
                        <Text type="secondary">教室: {item.room}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最近消息 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                最近消息
              </Space>
            }
            extra={<Button type="link">查看全部</Button>}
          >
            <List
              dataSource={recentMessages}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.avatar}</Avatar>}
                    title={<Text strong>{item.student}</Text>}
                    description={
                      <div>
                        <Text ellipsis style={{ display: 'block', marginBottom: '4px' }}>
                          {item.content}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* 待办任务 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CheckCircleOutlined />
                待办任务
              </Space>
            }
          >
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">完成</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.task}</Text>
                        <Tag color={getPriorityColor(item.priority)}>
                          {item.priority === 'high' ? '紧急' : 
                           item.priority === 'medium' ? '普通' : '低优先级'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary">截止时间: {item.deadline}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 教学进度 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                本学期教学进度
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>高等数学</Text>
                <Progress percent={75} size="small" />
              </div>
              <div>
                <Text>数据结构</Text>
                <Progress percent={60} size="small" />
              </div>
              <div>
                <Text>算法设计</Text>
                <Progress percent={45} size="small" />
              </div>
              <div>
                <Text>计算机网络</Text>
                <Progress percent={30} size="small" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
