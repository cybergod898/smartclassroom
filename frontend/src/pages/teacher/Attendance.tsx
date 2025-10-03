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
  DatePicker,
  Radio,
  Avatar,
  Calendar,
  Badge,
  Typography
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileExcelOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type AttendanceRecord = {
  id: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  course: string;
  class: string;
  date: string;
  time: string;
  status: "出勤" | "迟到" | "早退" | "缺勤" | "请假";
  reason?: string;
  teacher: string;
  checkInTime?: string;
  checkOutTime?: string;
};

type AttendanceStats = {
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  leaveCount: number;
  attendanceRate: number;
};

// 模拟考勤数据
const mockAttendance: AttendanceRecord[] = [
  {
    id: 1,
    studentId: 1001,
    studentName: "张三",
    studentNumber: "2024001",
    course: "高等数学",
    class: "高一(3)班",
    date: "2024-11-20",
    time: "08:00-09:40",
    status: "出勤",
    teacher: "李老师",
    checkInTime: "07:58",
    checkOutTime: "09:42"
  },
  {
    id: 2,
    studentId: 1002,
    studentName: "李四",
    studentNumber: "2024002",
    course: "高等数学",
    class: "高一(3)班",
    date: "2024-11-20",
    time: "08:00-09:40",
    status: "迟到",
    teacher: "李老师",
    checkInTime: "08:15",
    checkOutTime: "09:40",
    reason: "交通堵塞"
  },
  {
    id: 3,
    studentId: 1003,
    studentName: "王五",
    studentNumber: "2024003",
    course: "现代汉语",
    class: "高一(2)班",
    date: "2024-11-20",
    time: "10:00-11:40",
    status: "缺勤",
    teacher: "王老师",
    reason: "未请假"
  },
  {
    id: 4,
    studentId: 1004,
    studentName: "赵六",
    studentNumber: "2024004",
    course: "英语综合",
    class: "高一(1)班",
    date: "2024-11-19",
    time: "14:00-15:40",
    status: "请假",
    teacher: "张老师",
    reason: "生病请假"
  },
  {
    id: 5,
    studentId: 1005,
    studentName: "钱七",
    studentNumber: "2024005",
    course: "物理基础",
    class: "高一(4)班",
    date: "2024-11-19",
    time: "16:00-17:40",
    status: "早退",
    teacher: "刘老师",
    checkInTime: "15:58",
    checkOutTime: "17:20",
    reason: "身体不适"
  },
  {
    id: 6,
    studentId: 1006,
    studentName: "孙八",
    studentNumber: "2024006",
    course: "高等数学",
    class: "高一(3)班",
    date: "2024-11-18",
    time: "08:00-09:40",
    status: "出勤",
    teacher: "李老师",
    checkInTime: "07:55",
    checkOutTime: "09:45"
  }
];

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [form] = Form.useForm();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs());

  // 过滤考勤数据
  useEffect(() => {
    let filtered = attendance;

    if (selectedCourse) {
      filtered = filtered.filter(record => record.course === selectedCourse);
    }

    if (selectedStatus) {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    setFilteredAttendance(filtered);
  }, [selectedCourse, selectedStatus, selectedDate, attendance]);

  // 计算统计数据
  const calculateStats = (records: AttendanceRecord[]): AttendanceStats => {
    const totalStudents = new Set(records.map(r => r.studentId)).size;
    const presentCount = records.filter(r => r.status === '出勤').length;
    const lateCount = records.filter(r => r.status === '迟到').length;
    const absentCount = records.filter(r => r.status === '缺勤').length;
    const leaveCount = records.filter(r => r.status === '请假').length;
    const attendanceRate = totalStudents > 0 ? ((presentCount + lateCount) / records.length) * 100 : 0;

    return {
      totalStudents,
      presentCount,
      lateCount,
      absentCount,
      leaveCount,
      attendanceRate
    };
  };

  const stats = calculateStats(filteredAttendance);

  const handleAddRecord = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs().format('YYYY-MM-DD'),
      status: '出勤'
    });
    setIsModalVisible(true);
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date
    });
    setIsModalVisible(true);
  };

  const handleDeleteRecord = (recordId: number) => {
    setAttendance(prev => prev.filter(r => r.id !== recordId));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRecord) {
        // 编辑记录
        setAttendance(prev => prev.map(r => 
          r.id === editingRecord.id ? { ...r, ...values } : r
        ));
        message.success('修改成功');
      } else {
        // 添加新记录
        const newRecord: AttendanceRecord = {
          id: Date.now(),
          studentId: Date.now(),
          ...values,
          teacher: "当前教师"
        };
        setAttendance(prev => [...prev, newRecord]);
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
      '出勤': 'success',
      '迟到': 'warning',
      '早退': 'processing',
      '缺勤': 'error',
      '请假': 'default'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      '出勤': <CheckCircleOutlined />,
      '迟到': <ClockCircleOutlined />,
      '早退': <ClockCircleOutlined />,
      '缺勤': <CloseCircleOutlined />,
      '请假': <UserOutlined />
    };
    return icons[status as keyof typeof icons];
  };

  // 日历数据处理
  const getCalendarData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayRecords = attendance.filter(r => r.date === dateStr);
    
    if (dayRecords.length === 0) return null;
    
    const presentCount = dayRecords.filter(r => r.status === '出勤').length;
    const totalCount = dayRecords.length;
    const rate = (presentCount / totalCount) * 100;
    
    let type: 'success' | 'warning' | 'error' = 'success';
    if (rate < 60) type = 'error';
    else if (rate < 80) type = 'warning';
    
    return { type, content: `${rate.toFixed(0)}%` };
  };

  const dateCellRender = (value: Dayjs) => {
    const data = getCalendarData(value);
    if (!data) return null;
    
    return (
      <Badge 
        status={data.type} 
        text={data.content}
        style={{ fontSize: '12px' }}
      />
    );
  };

  const columns: ColumnsType<AttendanceRecord> = [
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
      fixed: 'left',
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{name}</span>
        </div>
      )
    },
    {
      title: '课程',
      dataIndex: 'course',
      width: 120
    },
    {
      title: '班级',
      dataIndex: 'class',
      width: 100
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 120
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: 120
    },
    {
      title: '考勤状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '签到时间',
      dataIndex: 'checkInTime',
      width: 100
    },
    {
      title: '签退时间',
      dataIndex: 'checkOutTime',
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'reason',
      width: 120,
      render: (reason: string) => reason || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small" 
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEditRecord(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除这条考勤记录吗？"
            onConfirm={() => handleDeleteRecord(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button 
                type="text" 
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
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <Title level={2} className="mb-2">考勤管理</Title>
        <Text type="secondary">管理学生考勤记录，统计出勤情况</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="出勤人数"
              value={stats.presentCount}
              prefix={<CheckCircleOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="迟到人数"
              value={stats.lateCount}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="缺勤人数"
              value={stats.absentCount}
              prefix={<CloseCircleOutlined className="text-red-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="出勤率"
              value={stats.attendanceRate}
              precision={1}
              prefix={<TeamOutlined className="text-blue-500" />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 考勤日历 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          {/* 操作区域 */}
          <Card className="mb-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <Space wrap>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddRecord}
                >
                  添加考勤
                </Button>
                <Button icon={<UploadOutlined />}>
                  批量导入
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出考勤
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
                  placeholder="考勤状态"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  allowClear
                  style={{ width: 120 }}
                >
                  <Option value="出勤">出勤</Option>
                  <Option value="迟到">迟到</Option>
                  <Option value="早退">早退</Option>
                  <Option value="缺勤">缺勤</Option>
                  <Option value="请假">请假</Option>
                </Select>

                <DatePicker
                  placeholder="选择日期"
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
                  allowClear
                />
              </Space>
            </div>
          </Card>

          {/* 考勤表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredAttendance}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={{
                total: filteredAttendance.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="考勤日历" className="h-full">
            <Calendar
              fullscreen={false}
              value={calendarValue}
              onSelect={setCalendarValue}
              dateCellRender={dateCellRender}
            />
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Badge status="success" />
                  <span>出勤率 ≥ 80%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge status="warning" />
                  <span>出勤率 60-80%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge status="error" />
                  <span>出勤率 &lt; 60%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 添加/编辑考勤模态框 */}
      <Modal
        title={editingRecord ? "编辑考勤" : "添加考勤"}
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
            status: '出勤'
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
              label="班级"
              name="class"
              rules={[{ required: true, message: '请输入班级' }]}
            >
              <Input placeholder="请输入班级" />
            </Form.Item>

            <Form.Item
              label="日期"
              name="date"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label="时间"
              name="time"
              rules={[{ required: true, message: '请输入时间' }]}
            >
              <Input placeholder="如：08:00-09:40" />
            </Form.Item>

            <Form.Item
              label="签到时间"
              name="checkInTime"
            >
              <Input placeholder="如：07:58" />
            </Form.Item>

            <Form.Item
              label="签退时间"
              name="checkOutTime"
            >
              <Input placeholder="如：09:42" />
            </Form.Item>
          </div>

          <Form.Item
            label="考勤状态"
            name="status"
            rules={[{ required: true, message: '请选择考勤状态' }]}
          >
            <Radio.Group>
              <Radio value="出勤">出勤</Radio>
              <Radio value="迟到">迟到</Radio>
              <Radio value="早退">早退</Radio>
              <Radio value="缺勤">缺勤</Radio>
              <Radio value="请假">请假</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="备注"
            name="reason"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入备注信息（如请假原因等）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}