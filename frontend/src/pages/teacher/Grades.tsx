import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tabs,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Space,
  Tooltip,
  Popconfirm,
  Upload,
  Typography
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 数据类型定义
interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  students: number;
  description: string;
}

interface Student {
  id: string;
  studentId: string;
  name: string;
  courseId: string;
}

interface DailyGrade {
  attendance: number; // 考勤分数：出勤(5) / 迟到(3) / 早退(2) / 缺勤(0)
  question: number;   // 回答问题分数：A(15) / B(10) / C(5) / 未回答(0)
}

interface Assignment {
  id: string;
  name: string;
  totalScore: number;
  dueDate: string;
  type: 'homework' | 'quiz' | 'midterm' | 'final';
}

interface StudentGrades {
  assignments: { [assignmentId: string]: number };
  midterm: number;
  final: number;
}

// 模拟数据
const mockCourses: Course[] = [
  {
    id: 'course1',
    name: '高等数学A',
    code: 'MATH101',
    semester: '2024春季',
    students: 45,
    description: '理工科基础数学课程'
  },
  {
    id: 'course2',
    name: '线性代数',
    code: 'MATH201',
    semester: '2024春季',
    students: 38,
    description: '数学专业核心课程'
  },
  {
    id: 'course3',
    name: '概率论与数理统计',
    code: 'MATH301',
    semester: '2024春季',
    students: 42,
    description: '统计学基础课程'
  }
];

const generateStudentsData = (courseId: string, studentCount: number): Student[] => {
  const students: Student[] = [];
  for (let i = 1; i <= studentCount; i++) {
    students.push({
      id: `student${i}`,
      studentId: `2024${String(i).padStart(3, '0')}`,
      name: `学生${i}`,
      courseId: courseId
    });
  }
  return students;
};

const generateDates = (count: number): string[] => {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 3); // 每3天一次课
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const mockAssignments: Assignment[] = [
  { id: 'hw1', name: '第一章习题', totalScore: 100, dueDate: '2024-03-15', type: 'homework' },
  { id: 'quiz1', name: '第一次单元测试', totalScore: 50, dueDate: '2024-03-20', type: 'quiz' },
  { id: 'hw2', name: '第二章习题', totalScore: 100, dueDate: '2024-03-30', type: 'homework' },
  { id: 'quiz2', name: '第二次单元测试', totalScore: 50, dueDate: '2024-04-05', type: 'quiz' },
  { id: 'hw3', name: '期中作业', totalScore: 150, dueDate: '2024-04-15', type: 'homework' },
  { id: 'midterm1', name: '期中测试1', totalScore: 100, dueDate: '2024-04-20', type: 'midterm' },
  { id: 'hw4', name: '第三章习题', totalScore: 100, dueDate: '2024-05-01', type: 'homework' },
  { id: 'quiz3', name: '第三次单元测试', totalScore: 50, dueDate: '2024-05-08', type: 'quiz' },
  { id: 'hw5', name: '第四章习题', totalScore: 100, dueDate: '2024-05-15', type: 'homework' },
  { id: 'midterm2', name: '期中测试2', totalScore: 100, dueDate: '2024-05-22', type: 'midterm' },
  { id: 'hw6', name: '期末作业', totalScore: 200, dueDate: '2024-05-30', type: 'homework' }
];

export default function Grades() {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [dailyGradeDates, setDailyGradeDates] = useState<string[]>([]);
  const [dailyGrades, setDailyGrades] = useState<{ [studentId: string]: { [date: string]: DailyGrade } }>({});
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: StudentGrades }>({});
  const [activeTab, setActiveTab] = useState('summary');

  // 初始化课程数据
  const initializeCourseData = (course: Course) => {
    const courseStudents = generateStudentsData(course.id, course.students);
    const dates = generateDates(10); // 最近10次课程
    
    setStudents(courseStudents);
    setDailyGradeDates(dates);
    
    // 初始化平时成绩数据
    const dailyGradesData: { [studentId: string]: { [date: string]: DailyGrade } } = {};
    courseStudents.forEach(student => {
      dailyGradesData[student.id] = {};
      dates.forEach(date => {
        const attendanceRand = Math.random();
        let attendance = 5; // 默认出勤
        if (attendanceRand < 0.05) attendance = 0; // 5%缺勤
        else if (attendanceRand < 0.1) attendance = 2; // 5%早退
        else if (attendanceRand < 0.15) attendance = 3; // 5%迟到
        
        let question = 0;
        if (attendance > 0) {
          const questionRand = Math.random();
          if (questionRand < 0.2) question = 15; // 20% A等
          else if (questionRand < 0.4) question = 10; // 20% B等
          else if (questionRand < 0.6) question = 5; // 20% C等
        }
        
        dailyGradesData[student.id][date] = { attendance, question };
      });
    });
    setDailyGrades(dailyGradesData);
    
    // 初始化作业成绩数据
    const gradesData: { [studentId: string]: StudentGrades } = {};
    courseStudents.forEach(student => {
      const assignmentGrades: { [assignmentId: string]: number } = {};
      assignments.forEach(assignment => {
        const percentage = 0.7 + Math.random() * 0.3; // 70%-100%
        assignmentGrades[assignment.id] = Math.floor(assignment.totalScore * percentage);
      });
      
      gradesData[student.id] = {
        assignments: assignmentGrades,
        midterm: Math.floor(Math.random() * 20) + 75,
        final: Math.floor(Math.random() * 20) + 80
      };
    });
    setStudentGrades(gradesData);
  };

  // 选择课程
  const selectCourse = (course: Course) => {
    setCurrentCourse(course);
    initializeCourseData(course);
  };

  // 返回课程选择
  const backToCourseSelection = () => {
    setCurrentCourse(null);
    setStudents([]);
    setDailyGrades({});
    setStudentGrades({});
  };

  // 更新平时成绩
  const updateDailyGrade = (studentId: string, date: string, type: 'attendance' | 'question', value: number) => {
    setDailyGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: {
          ...prev[studentId][date],
          [type]: value
        }
      }
    }));
  };

  // 更新作业成绩
  const updateAssignmentGrade = (studentId: string, assignmentId: string, score: number) => {
    setStudentGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        assignments: {
          ...prev[studentId].assignments,
          [assignmentId]: score
        }
      }
    }));
  };

  // 计算学生总评成绩
  const calculateFinalGrade = (studentId: string) => {
    const student = studentGrades[studentId];
    if (!student) return 0;

    // 计算出勤分 (20%)
    let attendanceTotal = 0;
    let attendanceCount = 0;
    dailyGradeDates.forEach(date => {
      if (dailyGrades[studentId] && dailyGrades[studentId][date]) {
        attendanceTotal += dailyGrades[studentId][date].attendance;
        attendanceCount++;
      }
    });
    const attendanceScore = attendanceCount > 0 ? (attendanceTotal / attendanceCount) * 4 : 0; // 转换为20分制

    // 计算课堂表现分 (10%)
    let participationTotal = 0;
    let participationCount = 0;
    dailyGradeDates.forEach(date => {
      if (dailyGrades[studentId] && dailyGrades[studentId][date]) {
        participationTotal += dailyGrades[studentId][date].question;
        participationCount++;
      }
    });
    const participationScore = participationCount > 0 ? (participationTotal / participationCount) * (10/15) : 0; // 转换为10分制

    // 计算作业平均分 (30%)
    const homeworkScores = assignments
      .filter(a => a.type === 'homework')
      .map(a => (student.assignments[a.id] / a.totalScore) * 100);
    const homeworkAverage = homeworkScores.length > 0 ? 
      homeworkScores.reduce((sum, score) => sum + score, 0) / homeworkScores.length : 0;
    const homeworkScore = homeworkAverage * 0.3;

    // 期中成绩 (20%)
    const midtermScore = student.midterm * 0.2;

    // 期末成绩 (20%)
    const finalScore = student.final * 0.2;

    return attendanceScore + participationScore + homeworkScore + midtermScore + finalScore;
  };

  // 获取成绩等级
  const getGradeLevel = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  // 格式化日期显示
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 获取考勤状态显示
  const getAttendanceDisplay = (score: number) => {
    switch (score) {
      case 5: return { text: '出勤', color: 'success' };
      case 3: return { text: '迟到', color: 'warning' };
      case 2: return { text: '早退', color: 'warning' };
      case 0: return { text: '缺勤', color: 'error' };
      default: return { text: '未知', color: 'default' };
    }
  };

  // 获取回答问题等级显示
  const getQuestionDisplay = (score: number) => {
    switch (score) {
      case 15: return { text: 'A', color: 'success' };
      case 10: return { text: 'B', color: 'processing' };
      case 5: return { text: 'C', color: 'warning' };
      case 0: return { text: '-', color: 'default' };
      default: return { text: '-', color: 'default' };
    }
  };

  // 课程选择界面
  if (!currentCourse) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="mb-6">
          <Title level={2}>成绩管理</Title>
          <Text type="secondary">请选择要管理成绩的课程</Text>
        </div>
        
        <Row gutter={[24, 24]}>
          {mockCourses.map(course => (
            <Col xs={24} sm={12} lg={8} key={course.id}>
              <Card
                hoverable
                className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => selectCourse(course)}
              >
                <div className="mb-4">
                  <Title level={4} className="mb-2">{course.name}</Title>
                  <Text type="secondary" className="text-sm">{course.code}</Text>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <CalendarOutlined className="mr-2" />
                    <span>{course.semester}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserOutlined className="mr-2" />
                    <span>{course.students}人</span>
                  </div>
                </div>
                
                <Text type="secondary" className="text-sm">{course.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // 平时成绩表格列配置
  const dailyGradeColumns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'studentId',
      width: 100,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      fixed: 'left'
    },
    ...dailyGradeDates.map(date => ({
      title: formatDateForDisplay(date),
      key: date,
      width: 120,
      children: [
        {
          title: '考勤',
          key: `${date}-attendance`,
          width: 60,
          render: (_: any, record: Student) => {
            const grade = dailyGrades[record.id]?.[date];
            const display = getAttendanceDisplay(grade?.attendance || 0);
            return (
              <Tag color={display.color} className="text-xs">
                {display.text}
              </Tag>
            );
          }
        },
        {
          title: '回答',
          key: `${date}-question`,
          width: 60,
          render: (_: any, record: Student) => {
            const grade = dailyGrades[record.id]?.[date];
            const display = getQuestionDisplay(grade?.question || 0);
            return (
              <Tag color={display.color} className="text-xs">
                {display.text}
              </Tag>
            );
          }
        }
      ]
    })),
    {
      title: '平均分',
      key: 'average',
      width: 80,
      fixed: 'right',
      render: (_: any, record: Student) => {
        let total = 0;
        let count = 0;
        dailyGradeDates.forEach(date => {
          if (dailyGrades[record.id]?.[date]) {
            total += dailyGrades[record.id][date].attendance + dailyGrades[record.id][date].question;
            count++;
          }
        });
        const average = count > 0 ? total / count : 0;
        return <Text strong>{average.toFixed(1)}</Text>;
      }
    }
  ];

  // 作业成绩表格列配置
  const assignmentColumns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'studentId',
      width: 100,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      fixed: 'left'
    },
    ...assignments.map(assignment => ({
      title: assignment.name,
      key: assignment.id,
      width: 120,
      render: (_: any, record: Student) => {
        const score = studentGrades[record.id]?.assignments[assignment.id] || 0;
        const percentage = (score / assignment.totalScore) * 100;
        return (
          <div className="text-center">
            <div>{score}/{assignment.totalScore}</div>
            <Progress 
              percent={percentage} 
              size="small" 
              showInfo={false}
              strokeColor={percentage >= 80 ? '#52c41a' : percentage >= 60 ? '#1890ff' : '#ff4d4f'}
            />
          </div>
        );
      }
    })),
    {
      title: '作业平均',
      key: 'homework-average',
      width: 100,
      fixed: 'right',
      render: (_: any, record: Student) => {
        const homeworkScores = assignments
          .filter(a => a.type === 'homework')
          .map(a => (studentGrades[record.id]?.assignments[a.id] || 0) / a.totalScore * 100);
        const average = homeworkScores.length > 0 ? 
          homeworkScores.reduce((sum, score) => sum + score, 0) / homeworkScores.length : 0;
        return <Text strong>{average.toFixed(1)}</Text>;
      }
    }
  ];

  // 成绩汇总表格列配置
  const summaryColumns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'studentId',
      width: 100
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100
    },
    {
      title: '出勤分',
      key: 'attendance',
      width: 100,
      render: (_: any, record: Student) => {
        let total = 0;
        let count = 0;
        dailyGradeDates.forEach(date => {
          if (dailyGrades[record.id]?.[date]) {
            total += dailyGrades[record.id][date].attendance;
            count++;
          }
        });
        const score = count > 0 ? (total / count) * 4 : 0; // 转换为20分制
        return <Text>{score.toFixed(1)}</Text>;
      }
    },
    {
      title: '课堂表现',
      key: 'participation',
      width: 100,
      render: (_: any, record: Student) => {
        let total = 0;
        let count = 0;
        dailyGradeDates.forEach(date => {
          if (dailyGrades[record.id]?.[date]) {
            total += dailyGrades[record.id][date].question;
            count++;
          }
        });
        const score = count > 0 ? (total / count) * (10/15) : 0; // 转换为10分制
        return <Text>{score.toFixed(1)}</Text>;
      }
    },
    {
      title: '作业平均',
      key: 'homework',
      width: 100,
      render: (_: any, record: Student) => {
        const homeworkScores = assignments
          .filter(a => a.type === 'homework')
          .map(a => (studentGrades[record.id]?.assignments[a.id] || 0) / a.totalScore * 100);
        const average = homeworkScores.length > 0 ? 
          homeworkScores.reduce((sum, score) => sum + score, 0) / homeworkScores.length : 0;
        return <Text>{(average * 0.3).toFixed(1)}</Text>;
      }
    },
    {
      title: '期中成绩',
      key: 'midterm',
      width: 100,
      render: (_: any, record: Student) => {
        const score = (studentGrades[record.id]?.midterm || 0) * 0.2;
        return <Text>{score.toFixed(1)}</Text>;
      }
    },
    {
      title: '期末成绩',
      key: 'final',
      width: 100,
      render: (_: any, record: Student) => {
        const score = (studentGrades[record.id]?.final || 0) * 0.2;
        return <Text>{score.toFixed(1)}</Text>;
      }
    },
    {
      title: '总评成绩',
      key: 'total',
      width: 100,
      render: (_: any, record: Student) => {
        const total = calculateFinalGrade(record.id);
        return <Text strong>{total.toFixed(1)}</Text>;
      }
    },
    {
      title: '等级',
      key: 'level',
      width: 80,
      render: (_: any, record: Student) => {
        const total = calculateFinalGrade(record.id);
        const level = getGradeLevel(total);
        const color = level === 'A' ? 'success' : level === 'B' ? 'processing' : 
                     level === 'C' ? 'warning' : level === 'D' ? 'default' : 'error';
        return <Tag color={color}>{level}</Tag>;
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={backToCourseSelection}
            className="mr-4"
          >
            返回
          </Button>
          <div>
            <Title level={2} className="mb-0">{currentCourse.name}</Title>
            <Text type="secondary">{currentCourse.code} - {currentCourse.semester}</Text>
          </div>
        </div>
        
        <Space>
          <Button icon={<UploadOutlined />}>批量导入</Button>
          <Button icon={<DownloadOutlined />}>导出成绩</Button>
          <Button type="primary" icon={<FileExcelOutlined />}>生成报告</Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总学生数"
              value={students.length}
              prefix={<UserOutlined className="text-blue-500" />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均分"
              value={students.length > 0 ? 
                students.reduce((sum, student) => sum + calculateFinalGrade(student.id), 0) / students.length : 0
              }
              precision={1}
              prefix={<BarChartOutlined className="text-green-500" />}
              suffix="分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="及格率"
              value={students.length > 0 ? 
                (students.filter(student => calculateFinalGrade(student.id) >= 60).length / students.length) * 100 : 0
              }
              precision={1}
              prefix={<CheckCircleOutlined className="text-orange-500" />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="优秀率"
              value={students.length > 0 ? 
                (students.filter(student => calculateFinalGrade(student.id) >= 90).length / students.length) * 100 : 0
              }
              precision={1}
              prefix={<BookOutlined className="text-purple-500" />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 成绩管理标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="平时成绩" key="daily">
            <div className="mb-4">
              <Text type="secondary">
                考勤分数：出勤(5分) / 迟到(3分) / 早退(2分) / 缺勤(0分)；
                回答问题：A(15分) / B(10分) / C(5分) / 未回答(0分)
              </Text>
            </div>
            <Table
              columns={dailyGradeColumns}
              dataSource={students}
              rowKey="id"
              scroll={{ x: 1500, y: 400 }}
              pagination={{ pageSize: 20 }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="作业成绩" key="assignments">
            <div className="mb-4 flex justify-between items-center">
              <Text type="secondary">管理各项作业和测试的成绩</Text>
              <Button type="primary" icon={<PlusOutlined />}>
                添加作业
              </Button>
            </div>
            <Table
              columns={assignmentColumns}
              dataSource={students}
              rowKey="id"
              scroll={{ x: 1800, y: 400 }}
              pagination={{ pageSize: 20 }}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="成绩汇总" key="summary">
            <div className="mb-4">
              <Text type="secondary">
                总评成绩 = 出勤分(20%) + 课堂表现(10%) + 作业平均(30%) + 期中成绩(20%) + 期末成绩(20%)
              </Text>
            </div>
            <Table
              columns={summaryColumns}
              dataSource={students}
              rowKey="id"
              scroll={{ x: 1200, y: 400 }}
              pagination={{ pageSize: 20 }}
              size="small"
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}