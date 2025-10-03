import { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Tag, 
  Space, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message,
  Tooltip,
  Popconfirm,
  Progress,
  Statistic,
  Row,
  Col
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

type Assignment = {
  id: number;
  title: string;
  subject: string;
  class: string;
  description: string;
  dueDate: string;
  createDate: string;
  status: "未发布" | "进行中" | "已截止" | "已批改";
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  type: "作业" | "测验" | "项目";
  attachments?: string[];
};

// 模拟作业数据
const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: "数学第三章练习题",
    subject: "数学",
    class: "高一(3)班",
    description: "完成教材第三章所有练习题，注意解题步骤的完整性。",
    dueDate: "2024-10-15",
    createDate: "2024-10-01",
    status: "进行中",
    totalStudents: 40,
    submittedCount: 32,
    gradedCount: 20,
    type: "作业"
  },
  {
    id: 2,
    title: "英语阅读理解训练",
    subject: "英语", 
    class: "高一(3)班",
    description: "阅读指定文章并回答相关问题，提高阅读理解能力。",
    dueDate: "2024-10-12",
    createDate: "2024-09-28",
    status: "已截止",
    totalStudents: 40,
    submittedCount: 38,
    gradedCount: 38,
    type: "作业"
  },
  {
    id: 3,
    title: "物理实验报告",
    subject: "物理",
    class: "高一(3)班", 
    description: "完成光学实验并撰写实验报告，包括实验过程和结论。",
    dueDate: "2024-10-20",
    createDate: "2024-10-05",
    status: "未发布",
    totalStudents: 40,
    submittedCount: 0,
    gradedCount: 0,
    type: "项目"
  },
  {
    id: 4,
    title: "语文古诗词默写",
    subject: "语文",
    class: "高一(3)班",
    description: "默写本学期学过的古诗词，要求字迹工整，无错别字。",
    dueDate: "2024-10-08",
    createDate: "2024-09-25",
    status: "已批改",
    totalStudents: 40,
    submittedCount: 40,
    gradedCount: 40,
    type: "测验"
  }
];

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(mockAssignments);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [form] = Form.useForm();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 过滤作业数据
  useEffect(() => {
    let filtered = assignments;

    if (selectedSubject) {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }

    if (selectedStatus) {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    setFilteredAssignments(filtered);
  }, [selectedSubject, selectedStatus, assignments]);

  // 统计数据
  const stats = {
    total: assignments.length,
    ongoing: assignments.filter(a => a.status === '进行中').length,
    overdue: assignments.filter(a => a.status === '已截止').length,
    graded: assignments.filter(a => a.status === '已批改').length
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    form.setFieldsValue({
      ...assignment,
      dueDate: dayjs(assignment.dueDate)
    });
    setIsModalVisible(true);
  };

  const handleDeleteAssignment = (assignmentId: number) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    message.success('删除成功');
  };

  const handlePublishAssignment = (assignmentId: number) => {
    setAssignments(prev => prev.map(a => 
      a.id === assignmentId ? { ...a, status: '进行中' as const } : a
    ));
    message.success('作业已发布');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingAssignment) {
        // 编辑作业
        setAssignments(prev => prev.map(a => 
          a.id === editingAssignment.id ? { 
            ...a, 
            ...values,
            dueDate: values.dueDate.format('YYYY-MM-DD')
          } : a
        ));
        message.success('修改成功');
      } else {
        // 添加新作业
        const newAssignment: Assignment = {
          id: Date.now(),
          ...values,
          dueDate: values.dueDate.format('YYYY-MM-DD'),
          createDate: dayjs().format('YYYY-MM-DD'),
          status: '未发布',
          totalStudents: 40,
          submittedCount: 0,
          gradedCount: 0
        };
        setAssignments(prev => [...prev, newAssignment]);
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
      '未发布': 'default',
      '进行中': 'processing',
      '已截止': 'warning',
      '已批改': 'success'
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      '作业': 'blue',
      '测验': 'green',
      '项目': 'purple'
    };
    return colors[type as keyof typeof colors];
  };

  const columns: ColumnsType<Assignment> = [
    {
      title: '作业标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (title, record) => (
        <div>
          <Tooltip placement="topLeft" title={title}>
            <div className="font-medium text-gray-900">{title}</div>
          </Tooltip>
          <div className="text-sm text-gray-500">{record.subject} · {record.class}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      filters: [
        { text: '作业', value: '作业' },
        { text: '测验', value: '测验' },
        { text: '项目', value: '项目' }
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
      render: (date: string) => {
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day');
        return (
          <span className={isOverdue ? 'text-red-500' : 'text-gray-900'}>
            {dayjs(date).format('MM-DD')}
          </span>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '未发布', value: '未发布' },
        { text: '进行中', value: '进行中' },
        { text: '已截止', value: '已截止' },
        { text: '已批改', value: '已批改' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '提交情况',
      key: 'submission',
      width: 150,
      render: (_, record) => {
        const percentage = record.totalStudents > 0 
          ? Math.round((record.submittedCount / record.totalStudents) * 100)
          : 0;
        
        return (
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {record.submittedCount}/{record.totalStudents}
            </div>
            <Progress 
              percent={percentage} 
              size="small"
              strokeColor={percentage >= 80 ? '#52c41a' : percentage >= 60 ? '#faad14' : '#ff4d4f'}
            />
          </div>
        );
      }
    },
    {
      title: '批改进度',
      key: 'grading',
      width: 120,
      render: (_, record) => {
        const percentage = record.submittedCount > 0 
          ? Math.round((record.gradedCount / record.submittedCount) * 100)
          : 0;
        
        return record.submittedCount > 0 ? (
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {record.gradedCount}/{record.submittedCount}
            </div>
            <Progress 
              percent={percentage} 
              size="small"
              strokeColor="#1890ff"
            />
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          
          <Tooltip title="编辑">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditAssignment(record)}
            />
          </Tooltip>

          {record.status === '未发布' && (
            <Tooltip title="发布">
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handlePublishAssignment(record.id)}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="确定要删除这个作业吗？"
            onConfirm={() => handleDeleteAssignment(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
                size="small"
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">作业管理</h1>
        <p className="text-gray-600">发布和管理班级作业，跟踪学生提交和批改进度。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总作业数"
              value={stats.total}
              prefix={<FileTextOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={stats.ongoing}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已截止"
              value={stats.overdue}
              prefix={<ExclamationCircleOutlined className="text-red-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已批改"
              value={stats.graded}
              prefix={<CheckCircleOutlined className="text-green-500" />}
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
              onClick={handleAddAssignment}
            >
              布置作业
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
              <Option value="未发布">未发布</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已截止">已截止</Option>
              <Option value="已批改">已批改</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* 作业列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAssignments}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredAssignments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 添加/编辑作业模态框 */}
      <Modal
        title={editingAssignment ? "编辑作业" : "布置作业"}
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
        >
          <Form.Item
            label="作业标题"
            name="title"
            rules={[{ required: true, message: '请输入作业标题' }]}
          >
            <Input placeholder="请输入作业标题" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="作业类型"
              name="type"
              rules={[{ required: true, message: '请选择作业类型' }]}
            >
              <Select placeholder="请选择类型">
                <Option value="作业">作业</Option>
                <Option value="测验">测验</Option>
                <Option value="项目">项目</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="截止日期"
            name="dueDate"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker 
              className="w-full"
              placeholder="请选择截止日期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="作业描述"
            name="description"
            rules={[{ required: true, message: '请输入作业描述' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请详细描述作业要求和注意事项"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}