import { useEffect, useState } from "react";
import { 
  Card, 
  Table, 
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
  Tooltip,
  Popconfirm,
  Progress,
  Statistic,
  InputNumber,
  DatePicker,
  Upload
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileExcelOutlined,
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const { Option } = Select;

type Grade = {
  id: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  course: string;
  examType: string;
  examName: string;
  score: number;
  fullScore: number;
  percentage: number;
  rank: number;
  totalStudents: number;
  examDate: string;
  teacher: string;
  class: string;
  subject: string;
  status: "已发布" | "未发布" | "草稿";
};

type GradeStats = {
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
  excellentRate: number;
};

// 模拟成绩数据
const mockGrades: Grade[] = [
  {
    id: 1,
    studentId: 1001,
    studentName: "张三",
    studentNumber: "2024001",
    course: "高等数学",
    examType: "期中考试",
    examName: "2024年秋季期中考试",
    score: 85,
    fullScore: 100,
    percentage: 85,
    rank: 8,
    totalStudents: 40,
    examDate: "2024-11-15",
    teacher: "张老师",
    class: "高一(3)班",
    subject: "数学",
    status: "已发布"
  },
  {
    id: 2,
    studentId: 1002,
    studentName: "李四",
    studentNumber: "2024002",
    course: "高等数学",
    examType: "期中考试",
    examName: "2024年秋季期中考试",
    score: 92,
    fullScore: 100,
    percentage: 92,
    rank: 3,
    totalStudents: 40,
    examDate: "2024-11-15",
    teacher: "张老师",
    class: "高一(3)班",
    subject: "数学",
    status: "已发布"
  },
  {
    id: 3,
    studentId: 1003,
    studentName: "王五",
    studentNumber: "2024003",
    course: "现代汉语",
    examType: "月考",
    examName: "10月月考",
    score: 78,
    fullScore: 100,
    percentage: 78,
    rank: 15,
    totalStudents: 40,
    examDate: "2024-10-25",
    teacher: "李老师",
    class: "高一(3)班",
    subject: "语文",
    status: "已发布"
  },
  {
    id: 4,
    studentId: 1004,
    studentName: "赵六",
    studentNumber: "2024004",
    course: "英语综合",
    examType: "单元测试",
    examName: "Unit 3 测试",
    score: 88,
    fullScore: 100,
    percentage: 88,
    rank: 5,
    totalStudents: 40,
    examDate: "2024-11-10",
    teacher: "王老师",
    class: "高一(3)班",
    subject: "英语",
    status: "已发布"
  }
];

// 模拟成绩趋势数据
const mockTrendData = [
  { month: '9月', average: 82, highest: 95, lowest: 65 },
  { month: '10月', average: 85, highest: 98, lowest: 68 },
  { month: '11月', average: 87, highest: 96, lowest: 72 },
];

// 模拟科目分布数据
const mockSubjectData = [
  { subject: '数学', average: 85, count: 40 },
  { subject: '语文', average: 82, count: 40 },
  { subject: '英语', average: 88, count: 40 },
  { subject: '物理', average: 79, count: 40 },
];

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>(mockGrades);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [form] = Form.useForm();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 过滤成绩数据
  useEffect(() => {
    let filtered = grades;

    if (selectedCourse) {
      filtered = filtered.filter(grade => grade.course === selectedCourse);
    }

    if (selectedExamType) {
      filtered = filtered.filter(grade => grade.examType === selectedExamType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(grade => grade.status === selectedStatus);
    }

    setFilteredGrades(filtered);
  }, [selectedCourse, selectedExamType, selectedStatus, grades]);

  // 计算统计数据
  const calculateStats = (gradeList: Grade[]): GradeStats => {
    if (gradeList.length === 0) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0, excellentRate: 0 };
    }

    const scores = gradeList.map(g => g.score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passCount = scores.filter(score => score >= 60).length;
    const excellentCount = scores.filter(score => score >= 90).length;
    const passRate = (passCount / scores.length) * 100;
    const excellentRate = (excellentCount / scores.length) * 100;

    return { average, highest, lowest, passRate, excellentRate };
  };

  const stats = calculateStats(filteredGrades);

  const handleAddGrade = () => {
    setEditingGrade(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade);
    form.setFieldsValue({
      ...grade,
      examDate: grade.examDate
    });
    setIsModalVisible(true);
  };

  const handleDeleteGrade = (gradeId: number) => {
    setGrades(prev => prev.filter(g => g.id !== gradeId));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingGrade) {
        // 编辑成绩
        setGrades(prev => prev.map(g => 
          g.id === editingGrade.id ? { 
            ...g, 
            ...values,
            percentage: (values.score / values.fullScore) * 100
          } : g
        ));
        message.success('修改成功');
      } else {
        // 添加新成绩
        const newGrade: Grade = {
          id: Date.now(),
          ...values,
          percentage: (values.score / values.fullScore) * 100,
          teacher: "当前教师",
          rank: 1,
          totalStudents: 40
        };
        setGrades(prev => [...prev, newGrade]);
        message.success('添加成功');
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
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'processing';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      '已发布': 'success',
      '未发布': 'warning',
      '草稿': 'default'
    };
    return colors[status as keyof typeof colors];
  };

  const columns: ColumnsType<Grade> = [
    {
      title: '学号',
      dataIndex: 'studentNumber',
      width: 100,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      width: 100,
      fixed: 'left'
    },
    {
      title: '课程',
      dataIndex: 'course',
      width: 120
    },
    {
      title: '考试类型',
      dataIndex: 'examType',
      width: 100
    },
    {
      title: '考试名称',
      dataIndex: 'examName',
      width: 150
    },
    {
      title: '成绩',
      dataIndex: 'score',
      width: 80,
      render: (score: number, record: Grade) => (
        <Tag color={getScoreColor(score)}>
          {score}/{record.fullScore}
        </Tag>
      )
    },
    {
      title: '百分比',
      dataIndex: 'percentage',
      width: 100,
      render: (percentage: number) => (
        <Progress 
          percent={percentage} 
          size="small" 
          strokeColor={percentage >= 90 ? '#52c41a' : percentage >= 60 ? '#1890ff' : '#ff4d4f'}
        />
      )
    },
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
      render: (rank: number, record: Grade) => (
        <span>{rank}/{record.totalStudents}</span>
      )
    },
    {
      title: '考试日期',
      dataIndex: 'examDate',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="link" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEditGrade(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条成绩记录吗？"
            onConfirm={() => handleDeleteGrade(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button 
                type="link" 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">成绩管理</h1>
        <p className="text-gray-600">管理学生成绩，包括录入、统计分析和成绩发布。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均分"
              value={stats.average}
              precision={1}
              prefix={<BarChartOutlined className="text-blue-500" />}
              suffix="分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="最高分"
              value={stats.highest}
              prefix={<TrophyOutlined className="text-gold" />}
              suffix="分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="及格率"
              value={stats.passRate}
              precision={1}
              prefix={<UserOutlined className="text-green-500" />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="优秀率"
              value={stats.excellentRate}
              precision={1}
              prefix={<BookOutlined className="text-purple-500" />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="成绩趋势" className="h-80">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="average" stroke="#1890ff" name="平均分" />
                <Line type="monotone" dataKey="highest" stroke="#52c41a" name="最高分" />
                <Line type="monotone" dataKey="lowest" stroke="#ff4d4f" name="最低分" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="科目成绩分布" className="h-80">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockSubjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="average" fill="#1890ff" name="平均分" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card className="mb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddGrade}
            >
              录入成绩
            </Button>
            <Button icon={<UploadOutlined />}>
              批量导入
            </Button>
            <Button icon={<DownloadOutlined />}>
              导出成绩
            </Button>
            <Button icon={<FileExcelOutlined />}>
              生成报表
            </Button>
          </Space>

          <Space wrap>
            <Select
              placeholder="筛选课程"
              value={selectedCourse}
              onChange={setSelectedCourse}
              allowClear
              style={{ width: 120 }}
            >
              <Option value="高等数学">高等数学</Option>
              <Option value="现代汉语">现代汉语</Option>
              <Option value="英语综合">英语综合</Option>
              <Option value="物理基础">物理基础</Option>
            </Select>

            <Select
              placeholder="考试类型"
              value={selectedExamType}
              onChange={setSelectedExamType}
              allowClear
              style={{ width: 120 }}
            >
              <Option value="期中考试">期中考试</Option>
              <Option value="期末考试">期末考试</Option>
              <Option value="月考">月考</Option>
              <Option value="单元测试">单元测试</Option>
            </Select>

            <Select
              placeholder="发布状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: 120 }}
            >
              <Option value="已发布">已发布</Option>
              <Option value="未发布">未发布</Option>
              <Option value="草稿">草稿</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* 成绩表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredGrades}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredGrades.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 添加/编辑成绩模态框 */}
      <Modal
        title={editingGrade ? "编辑成绩" : "录入成绩"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullScore: 100,
            status: '草稿'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="学生学号"
              name="studentNumber"
              rules={[{ required: true, message: '请输入学生学号' }]}
            >
              <Input placeholder="请输入学生学号" />
            </Form.Item>

            <Form.Item
              label="学生姓名"
              name="studentName"
              rules={[{ required: true, message: '请输入学生姓名' }]}
            >
              <Input placeholder="请输入学生姓名" />
            </Form.Item>

            <Form.Item
              label="课程"
              name="course"
              rules={[{ required: true, message: '请选择课程' }]}
            >
              <Select placeholder="请选择课程">
                <Option value="高等数学">高等数学</Option>
                <Option value="现代汉语">现代汉语</Option>
                <Option value="英语综合">英语综合</Option>
                <Option value="物理基础">物理基础</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="考试类型"
              name="examType"
              rules={[{ required: true, message: '请选择考试类型' }]}
            >
              <Select placeholder="请选择考试类型">
                <Option value="期中考试">期中考试</Option>
                <Option value="期末考试">期末考试</Option>
                <Option value="月考">月考</Option>
                <Option value="单元测试">单元测试</Option>
                <Option value="随堂测验">随堂测验</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="得分"
              name="score"
              rules={[{ required: true, message: '请输入得分' }]}
            >
              <InputNumber 
                min={0} 
                max={200}
                placeholder="请输入得分"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="满分"
              name="fullScore"
              rules={[{ required: true, message: '请输入满分' }]}
            >
              <InputNumber 
                min={1} 
                max={200}
                placeholder="请输入满分"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="班级"
              name="class"
              rules={[{ required: true, message: '请选择班级' }]}
            >
              <Select placeholder="请选择班级">
                <Option value="高一(1)班">高一(1)班</Option>
                <Option value="高一(2)班">高一(2)班</Option>
                <Option value="高一(3)班">高一(3)班</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="考试日期"
              name="examDate"
              rules={[{ required: true, message: '请选择考试日期' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="发布状态"
              name="status"
            >
              <Select>
                <Option value="草稿">草稿</Option>
                <Option value="未发布">未发布</Option>
                <Option value="已发布">已发布</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="考试名称"
            name="examName"
            rules={[{ required: true, message: '请输入考试名称' }]}
          >
            <Input placeholder="请输入考试名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}