import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SendOutlined,
  DownloadOutlined,
  UploadOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 作业数据类型定义
interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  type: 'homework' | 'project' | 'exam';
  status: 'active' | 'pending' | 'completed';
  deadline: string;
  totalStudents: number;
  submittedCount: number;
  totalScore: number;
  description?: string;
}

// 模拟作业数据
const mockAssignments: AssignmentItem[] = [
  {
    id: 'A001',
    title: '微积分基础练习',
    course: '高等数学A',
    courseCode: 'MATH101',
    type: 'homework',
    status: 'active',
    deadline: '2024-04-15 23:59',
    totalStudents: 48,
    submittedCount: 32,
    totalScore: 100,
    description: '完成教材第3章的练习题1-20题'
  },
  {
    id: 'A002',
    title: '数学建模项目',
    course: '高等数学A',
    courseCode: 'MATH101',
    type: 'project',
    status: 'pending',
    deadline: '2024-04-20 23:59',
    totalStudents: 48,
    submittedCount: 0,
    totalScore: 200,
    description: '选择一个实际问题进行数学建模分析'
  },
  {
    id: 'M001',
    title: '矩阵运算练习',
    course: '线性代数',
    courseCode: 'MATH201',
    type: 'homework',
    status: 'completed',
    deadline: '2024-03-30 23:59',
    totalStudents: 42,
    submittedCount: 40,
    totalScore: 100,
    description: '完成矩阵运算相关练习'
  },
  {
    id: 'P001',
    title: '概率分布分析',
    course: '概率论与数理统计',
    courseCode: 'MATH301',
    type: 'exam',
    status: 'active',
    deadline: '2024-04-18 15:00',
    totalStudents: 35,
    submittedCount: 28,
    totalScore: 150,
    description: '期中考试：概率分布相关内容'
  }
];

// 课程选项
const courseOptions = [
  { value: 'MATH101', label: '高等数学A - MATH101' },
  { value: 'MATH201', label: '线性代数 - MATH201' },
  { value: 'MATH301', label: '概率论与数理统计 - MATH301' },
  { value: 'PHYS101', label: '大学物理 - PHYS101' }
];

// 作业类型选项
const typeOptions = [
  { value: 'homework', label: '课后作业' },
  { value: 'project', label: '项目作业' },
  { value: 'exam', label: '考试' }
];

export default function Assignments() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(mockAssignments);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取作业类型标签
  const getTypeTag = (type: string) => {
    const typeMap = {
      homework: { color: '#1890ff', text: '作业' },
      project: { color: '#52c41a', text: '项目' },
      exam: { color: '#fa8c16', text: '考试' }
    };
    const config = typeMap[type as keyof typeof typeMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      active: { color: 'success', text: '进行中' },
      pending: { color: 'warning', text: '待开始' },
      completed: { color: 'default', text: '已完成' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 计算截止时间状态
  const getDeadlineStatus = (deadline: string) => {
    const now = dayjs();
    const deadlineTime = dayjs(deadline);
    const diffDays = deadlineTime.diff(now, 'day');
    
    if (diffDays < 0) {
      return { color: '#ff4d4f', text: '已截止', urgent: true };
    } else if (diffDays <= 2) {
      return { color: '#ff4d4f', text: `还剩${diffDays}天`, urgent: true };
    } else {
      return { color: '#666', text: `还剩${diffDays}天`, urgent: false };
    }
  };

  // 处理布置作业
  const handleAddAssignment = () => {
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newAssignment: AssignmentItem = {
        id: `A${Date.now()}`,
        title: values.title,
        course: courseOptions.find(c => c.value === values.course)?.label.split(' - ')[0] || '',
        courseCode: values.course,
        type: values.type,
        status: 'pending',
        deadline: values.deadline.format('YYYY-MM-DD HH:mm'),
        totalStudents: 48, // 模拟数据
        submittedCount: 0,
        totalScore: values.totalScore,
        description: values.description
      };
      
      setAssignments([newAssignment, ...assignments]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('作业布置成功！');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 处理查看详情
  const handleViewDetails = (record: AssignmentItem) => {
    message.info(`查看作业详情: ${record.title}`);
  };

  // 处理批改作业
  const handleGradeAssignment = (record: AssignmentItem) => {
    message.info(`批改作业: ${record.title}`);
  };

  // 处理编辑作业
  const handleEditAssignment = (record: AssignmentItem) => {
    message.info(`编辑作业: ${record.title}`);
  };

  // 处理发布作业
  const handlePublishAssignment = (record: AssignmentItem) => {
    Modal.confirm({
      title: '确认发布',
      content: '确定要发布这个作业吗？发布后学生将能看到并提交作业。',
      onOk: () => {
        const updatedAssignments = assignments.map(item =>
          item.id === record.id ? { ...item, status: 'active' as const } : item
        );
        setAssignments(updatedAssignments);
        message.success('作业已发布！');
      }
    });
  };

  // 处理下载结果
  const handleDownloadResults = (record: AssignmentItem) => {
    message.info(`下载作业结果: ${record.title}`);
  };

  // 表格列定义
  const columns: ColumnsType<AssignmentItem> = [
    {
      title: '作业信息',
      key: 'info',
      width: 280,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
            {record.title}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {record.course} - {record.courseCode}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => getTypeTag(type)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: '截止时间',
      key: 'deadline',
      width: 160,
      render: (_, record) => {
        const deadlineStatus = getDeadlineStatus(record.deadline);
        return (
          <div>
            <div style={{ fontSize: '14px', marginBottom: '2px' }}>
              {dayjs(record.deadline).format('MM-DD HH:mm')}
            </div>
            <div style={{ 
              color: deadlineStatus.color, 
              fontSize: '12px',
              fontWeight: deadlineStatus.urgent ? 600 : 400
            }}>
              {deadlineStatus.text}
            </div>
          </div>
        );
      }
    },
    {
      title: '提交进度',
      key: 'progress',
      width: 180,
      render: (_, record) => {
        const percentage = Math.round((record.submittedCount / record.totalStudents) * 100);
        return (
          <div>
            <div style={{ fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>
              {record.submittedCount}/{record.totalStudents} ({percentage}%)
            </div>
            <Progress 
              percent={percentage} 
              size="small" 
              strokeColor={percentage >= 80 ? '#52c41a' : percentage >= 50 ? '#1890ff' : '#faad14'}
            />
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
          
          {record.status === 'active' && record.submittedCount > 0 && (
            <Button 
              type="default" 
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleGradeAssignment(record)}
              style={{ color: '#52c41a', borderColor: '#52c41a' }}
            >
              批改作业
            </Button>
          )}
          
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditAssignment(record)}
          >
            编辑
          </Button>
          
          {record.status === 'pending' && (
            <Button 
              size="small" 
              icon={<SendOutlined />}
              onClick={() => handlePublishAssignment(record)}
              style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
            >
              发布
            </Button>
          )}
          
          {record.status === 'completed' && (
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadResults(record)}
            >
              下载结果
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOutlined style={{ color: '#1890ff' }} />
          作业管理
        </Title>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAddAssignment}
        >
          布置作业
        </Button>
      </div>

      {/* 作业列表 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockCircleOutlined />
            我的作业
            <Badge count={assignments.length} style={{ marginLeft: '8px' }} />
          </div>
        }
        style={{ borderRadius: '12px' }}
      >
        <Table
          dataSource={assignments}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 布置作业模态框 */}
      <Modal
        title="布置作业"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="布置作业"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="作业标题"
            rules={[{ required: true, message: '请输入作业标题' }]}
          >
            <Input placeholder="请输入作业标题" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="course"
              label="所属课程"
              rules={[{ required: true, message: '请选择课程' }]}
            >
              <Select placeholder="请选择课程">
                {courseOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="作业类型"
              rules={[{ required: true, message: '请选择作业类型' }]}
            >
              <Select placeholder="请选择类型">
                {typeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="deadline"
              label="截止时间"
              rules={[{ required: true, message: '请选择截止时间' }]}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }}
                placeholder="选择截止时间"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="totalScore"
              label="总分"
              rules={[{ required: true, message: '请输入总分' }]}
              initialValue={100}
            >
              <InputNumber 
                min={1} 
                max={1000} 
                style={{ width: '100%' }}
                placeholder="100"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="作业描述"
            rules={[{ required: true, message: '请输入作业描述' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请详细描述作业要求和评分标准..."
            />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="附件上传"
          >
            <Upload
              multiple
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
