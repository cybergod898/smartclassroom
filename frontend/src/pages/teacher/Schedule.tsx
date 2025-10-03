import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tabs, 
  Select, 
  Typography, 
  Space, 
  Tag, 
  Button,
  List,
  Badge,
  Empty
} from 'antd';
import {
  CalendarOutlined,
  HistoryOutlined,
  EyeOutlined,
  BookOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 课程数据类型定义
interface CourseItem {
  id: string;
  name: string;
  location: string;
  color?: string;
}

interface ScheduleData {
  [key: string]: {
    [key: string]: CourseItem | null;
  };
}

// 历史课表数据类型
interface HistorySchedule {
  id: string;
  semester: string;
  courses: string[];
  courseCount: number;
}

// 时间段定义
const timeSlots = [
  '08:00-09:40',
  '10:00-11:40', 
  '14:00-15:40',
  '16:00-17:40',
  '19:00-20:40'
];

// 工作日定义
const weekdays = ['周一', '周二', '周三', '周四', '周五'];

// 模拟当前课表数据
const currentScheduleData: ScheduleData = {
  '08:00-09:40': {
    '周一': null,
    '周二': { id: '1', name: '数据结构与算法', location: '教学楼A201', color: '#1890ff' },
    '周三': null,
    '周四': { id: '2', name: '数据结构与算法', location: '教学楼A201', color: '#1890ff' },
    '周五': null
  },
  '10:00-11:40': {
    '周一': { id: '3', name: '计算机网络', location: '教学楼B305', color: '#52c41a' },
    '周二': null,
    '周三': { id: '4', name: '计算机网络', location: '教学楼B305', color: '#52c41a' },
    '周四': null,
    '周五': { id: '5', name: '软件工程', location: '教学楼C102', color: '#fa8c16' }
  },
  '14:00-15:40': {
    '周一': null,
    '周二': { id: '6', name: '软件工程', location: '教学楼C102', color: '#fa8c16' },
    '周三': null,
    '周四': { id: '7', name: '数据库系统', location: '实验楼D201', color: '#722ed1' },
    '周五': null
  },
  '16:00-17:40': {
    '周一': { id: '8', name: '数据库系统', location: '实验楼D201', color: '#722ed1' },
    '周二': null,
    '周三': { id: '9', name: '人工智能导论', location: '教学楼A301', color: '#eb2f96' },
    '周四': null,
    '周五': { id: '10', name: '人工智能导论', location: '教学楼A301', color: '#eb2f96' }
  },
  '19:00-20:40': {
    '周一': null,
    '周二': null,
    '周三': { id: '11', name: '算法设计与分析', location: '教学楼B201', color: '#13c2c2' },
    '周四': null,
    '周五': null
  }
};

// 模拟历史课表数据
const historySchedules: HistorySchedule[] = [
  {
    id: '2023-fall',
    semester: '2023年秋季学期',
    courses: ['操作系统原理', '数据库系统', '编译原理', '计算机图形学', '软件测试', '项目管理'],
    courseCount: 6
  },
  {
    id: '2023-spring',
    semester: '2023年春季学期',
    courses: ['算法设计与分析', '计算机组成原理', '离散数学', '概率论与数理统计', '英语'],
    courseCount: 5
  },
  {
    id: '2022-fall',
    semester: '2022年秋季学期',
    courses: ['高等数学', '线性代数', 'C语言程序设计', '计算机导论'],
    courseCount: 4
  }
];

// 学期选项
const semesterOptions = [
  { value: '2024-spring', label: '2024年春季学期' },
  { value: '2023-fall', label: '2023年秋季学期' },
  { value: '2023-spring', label: '2023年春季学期' }
];

export default function Schedule() {
  const [currentSemester, setCurrentSemester] = useState('2024-spring');
  const [activeTab, setActiveTab] = useState('current');

  // 渲染课程单元格
  const renderCourseCell = (course: CourseItem | null) => {
    if (!course) {
      return (
        <div style={{ 
          padding: '12px', 
          color: '#bfbfbf', 
          fontStyle: 'italic',
          fontSize: '13px'
        }}>
          无课程
        </div>
      );
    }

    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`,
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          {course.name}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          {course.location}
        </div>
      </div>
    );
  };

  // 构建表格数据
  const tableData = timeSlots.map(timeSlot => ({
    key: timeSlot,
    time: timeSlot,
    ...weekdays.reduce((acc, day) => ({
      ...acc,
      [day]: currentScheduleData[timeSlot]?.[day] || null
    }), {})
  }));

  // 表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 120,
      render: (text: string) => (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '8px', 
          borderRadius: '6px',
          fontWeight: 600,
          color: '#666',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          {text}
        </div>
      )
    },
    ...weekdays.map(day => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (course: CourseItem | null) => renderCourseCell(course)
    }))
  ];

  // 处理历史课表查看
  const handleViewHistory = (scheduleId: string) => {
    console.log('查看历史课表:', scheduleId);
    // 这里可以添加查看历史课表的逻辑
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          我的课表
        </Title>
      </div>

      {/* 标签页和学期选择 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'current',
                label: (
                  <span>
                    <CalendarOutlined />
                    当前课表
                    <Badge count={8} style={{ marginLeft: '8px' }} />
                  </span>
                )
              },
              {
                key: 'history',
                label: (
                  <span>
                    <HistoryOutlined />
                    历史课表
                    <Badge count={3} style={{ marginLeft: '8px' }} />
                  </span>
                )
              }
            ]}
          />
          
          <Space>
            <Text strong>学期选择：</Text>
            <Select
              value={currentSemester}
              onChange={setCurrentSemester}
              style={{ minWidth: 180 }}
            >
              {semesterOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
      </Card>

      {/* 当前课表 */}
      {activeTab === 'current' && (
        <Card 
          title="课程安排表" 
          style={{ borderRadius: '12px' }}
        >
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            bordered
            size="middle"
            style={{ 
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Card>
      )}

      {/* 历史课表 */}
      {activeTab === 'history' && (
        <Card 
          title="历史课表记录" 
          style={{ borderRadius: '12px' }}
        >
          {historySchedules.length > 0 ? (
            <List
              dataSource={historySchedules}
              renderItem={(item) => (
                <List.Item
                  style={{
                    background: '#fafafa',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  actions={[
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />}
                      onClick={() => handleViewHistory(item.id)}
                    >
                      查看课表
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={
                      <Text strong style={{ fontSize: '18px' }}>
                        {item.semester}
                      </Text>
                    }
                    description={
                      <div>
                        <Text type="secondary">
                          共{item.courseCount}门课程：{item.courses.join('、')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无历史课表记录"
            />
          )}
        </Card>
      )}
    </div>
  );
}