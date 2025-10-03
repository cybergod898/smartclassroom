import { useEffect, useState } from "react";
import { 
  Card, 
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
  Progress,
  Statistic
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

type Course = {
  id: number;
  name: string;
  code: string;
  subject: string;
  grade: string;
  class: string;
  description: string;
  teacher: string;
  studentCount: number;
  schedule: string;
  room: string;
  status: "进行中" | "已结束" | "未开始";
  progress: number;
  startDate: string;
  endDate: string;
  color: string;
};

// 模拟课程数据
const mockCourses: Course[] = [
  {
    id: 1,
    name: "高等数学",
    code: "MATH001",
    subject: "数学",
    grade: "高一",
    class: "高一(3)班",
    description: "高中数学基础课程，包括函数、几何、代数等内容。",
    teacher: "张老师",
    studentCount: 40,
    schedule: "周一、三、五 08:00-09:40",
    room: "A101",
    status: "进行中",
    progress: 65,
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    color: "#1890ff"
  },
  {
    id: 2,
    name: "现代汉语",
    code: "CHIN001", 
    subject: "语文",
    grade: "高一",
    class: "高一(3)班",
    description: "现代汉语语法、修辞、文学作品赏析。",
    teacher: "李老师",
    studentCount: 40,
    schedule: "周二、四 10:00-11:40",
    room: "B203",
    status: "进行中",
    progress: 58,
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    color: "#52c41a"
  },
  {
    id: 3,
    name: "英语综合",
    code: "ENG001",
    subject: "英语", 
    grade: "高一",
    class: "高一(3)班",
    description: "英语听说读写综合训练，提高英语应用能力。",
    teacher: "王老师",
    studentCount: 40,
    schedule: "周一、二、四 14:00-15:40",
    room: "C305",
    status: "进行中",
    progress: 72,
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    color: "#722ed1"
  },
  {
    id: 4,
    name: "物理基础",
    code: "PHYS001",
    subject: "物理",
    grade: "高一", 
    class: "高一(3)班",
    description: "物理基础知识，力学、热学、电学等。",
    teacher: "赵老师",
    studentCount: 40,
    schedule: "周三、五 16:00-17:40",
    room: "D401",
    status: "未开始",
    progress: 0,
    startDate: "2024-11-01",
    endDate: "2025-03-15",
    color: "#fa8c16"
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 过滤课程数据
  useEffect(() => {
    let filtered = courses;

    if (selectedSubject) {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    if (selectedStatus) {
      filtered = filtered.filter(course => course.status === selectedStatus);
    }

    setFilteredCourses(filtered);
  }, [selectedSubject, selectedStatus, courses]);

  // 统计数据
  const stats = {
    total: courses.length,
    ongoing: courses.filter(c => c.status === '进行中').length,
    upcoming: courses.filter(c => c.status === '未开始').length,
    completed: courses.filter(c => c.status === '已结束').length,
    totalStudents: courses.reduce((sum, c) => sum + c.studentCount, 0)
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCourse) {
        // 编辑课程
        setCourses(prev => prev.map(c => 
          c.id === editingCourse.id ? { ...c, ...values } : c
        ));
        message.success('修改成功');
      } else {
        // 添加新课程
        const newCourse: Course = {
          id: Date.now(),
          ...values,
          teacher: "当前教师",
          progress: 0,
          color: "#1890ff"
        };
        setCourses(prev => [...prev, newCourse]);
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

  const getStatusColor = (status: string) => {
    const colors = {
      '进行中': 'processing',
      '已结束': 'success',
      '未开始': 'default'
    };
    return colors[status as keyof typeof colors];
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <Card
      className="h-full hover:shadow-lg transition-shadow duration-300"
      actions={[
        <Tooltip title="查看详情" key="view">
          <EyeOutlined />
        </Tooltip>,
        <Tooltip title="编辑课程" key="edit">
          <EditOutlined onClick={() => handleEditCourse(course)} />
        </Tooltip>,
        <Popconfirm
          title="确定要删除这门课程吗？"
          onConfirm={() => handleDeleteCourse(course.id)}
          okText="确定"
          cancelText="取消"
          key="delete"
        >
          <Tooltip title="删除课程">
            <DeleteOutlined className="text-red-500" />
          </Tooltip>
        </Popconfirm>
      ]}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Avatar 
              style={{ backgroundColor: course.color }} 
              icon={<BookOutlined />}
              size={40}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-0">
                {course.name}
              </h3>
              <p className="text-sm text-gray-500 mb-0">
                {course.code} · {course.subject}
              </p>
            </div>
          </div>
          <Tag color={getStatusColor(course.status)}>
            {course.status}
          </Tag>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <TeamOutlined className="mr-2" />
            <span>{course.class} · {course.studentCount}人</span>
          </div>
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2" />
            <span>教室: {course.room}</span>
          </div>
        </div>

        {course.status === '进行中' && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>课程进度</span>
              <span>{course.progress}%</span>
            </div>
            <Progress 
              percent={course.progress} 
              strokeColor={course.color}
              size="small"
            />
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">课程管理</h1>
        <p className="text-gray-600">管理您的教学课程，包括课程信息、进度跟踪和学生管理。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总课程数"
              value={stats.total}
              prefix={<BookOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={stats.ongoing}
              prefix={<ClockCircleOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="未开始"
              value={stats.upcoming}
              prefix={<CalendarOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="学生总数"
              value={stats.totalStudents}
              prefix={<UserOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddCourse}
            >
              创建课程
            </Button>
          </Space>

          <Space wrap>
            <Select
              placeholder="筛选科目"
              value={selectedSubject}
              onChange={setSelectedSubject}
              allowClear
              style={{ width: 120 }}
            >
              <Option value="数学">数学</Option>
              <Option value="语文">语文</Option>
              <Option value="英语">英语</Option>
              <Option value="物理">物理</Option>
              <Option value="化学">化学</Option>
            </Select>

            <Select
              placeholder="筛选状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: 120 }}
            >
              <Option value="进行中">进行中</Option>
              <Option value="未开始">未开始</Option>
              <Option value="已结束">已结束</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* 课程卡片网格 */}
      <Row gutter={[16, 16]}>
        {filteredCourses.map(course => (
          <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>

      {filteredCourses.length === 0 && (
        <Card className="text-center py-12">
          <BookOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">暂无课程数据</p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddCourse}
          >
            创建第一门课程
          </Button>
        </Card>
      )}

      {/* 添加/编辑课程模态框 */}
      <Modal
        title={editingCourse ? "编辑课程" : "创建课程"}
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
            status: '未开始',
            studentCount: 40
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="课程名称"
              name="name"
              rules={[{ required: true, message: '请输入课程名称' }]}
            >
              <Input placeholder="请输入课程名称" />
            </Form.Item>

            <Form.Item
              label="课程代码"
              name="code"
              rules={[{ required: true, message: '请输入课程代码' }]}
            >
              <Input placeholder="请输入课程代码" />
            </Form.Item>

            <Form.Item
              label="科目"
              name="subject"
              rules={[{ required: true, message: '请选择科目' }]}
            >
              <Select placeholder="请选择科目">
                <Option value="数学">数学</Option>
                <Option value="语文">语文</Option>
                <Option value="英语">英语</Option>
                <Option value="物理">物理</Option>
                <Option value="化学">化学</Option>
                <Option value="生物">生物</Option>
                <Option value="历史">历史</Option>
                <Option value="地理">地理</Option>
                <Option value="政治">政治</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="年级"
              name="grade"
              rules={[{ required: true, message: '请选择年级' }]}
            >
              <Select placeholder="请选择年级">
                <Option value="高一">高一</Option>
                <Option value="高二">高二</Option>
                <Option value="高三">高三</Option>
              </Select>
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
              label="学生人数"
              name="studentCount"
              rules={[{ required: true, message: '请输入学生人数' }]}
            >
              <Input type="number" placeholder="请输入学生人数" />
            </Form.Item>

            <Form.Item
              label="教室"
              name="room"
              rules={[{ required: true, message: '请输入教室' }]}
            >
              <Input placeholder="请输入教室" />
            </Form.Item>

            <Form.Item
              label="课程状态"
              name="status"
            >
              <Select>
                <Option value="未开始">未开始</Option>
                <Option value="进行中">进行中</Option>
                <Option value="已结束">已结束</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="开始日期"
              name="startDate"
              rules={[{ required: true, message: '请选择开始日期' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="结束日期"
              name="endDate"
              rules={[{ required: true, message: '请选择结束日期' }]}
            >
              <Input type="date" />
            </Form.Item>
          </div>

          <Form.Item
            label="上课时间"
            name="schedule"
            rules={[{ required: true, message: '请输入上课时间' }]}
          >
            <Input placeholder="例如：周一、三、五 08:00-09:40" />
          </Form.Item>

          <Form.Item
            label="课程描述"
            name="description"
            rules={[{ required: true, message: '请输入课程描述' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入课程描述和教学目标"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}