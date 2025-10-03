import { useEffect, useState } from "react";
import { 
  Table, 
  Input, 
  Button, 
  Tag, 
  Space, 
  Card, 
  Select, 
  Modal, 
  Form, 
  message,
  Avatar,
  Tooltip,
  Popconfirm
} from "antd";
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  ExportOutlined,
  ImportOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

type Student = {
  id: number;
  studentId: string;
  name: string;
  gender: string;
  grade: string;
  class: string;
  phone: string;
  email: string;
  status: "在读" | "休学" | "毕业";
  avatar?: string;
  enrollDate: string;
  parentPhone: string;
};

// 模拟学生数据
const mockStudents: Student[] = [
  {
    id: 1,
    studentId: "2024001",
    name: "张三",
    gender: "男",
    grade: "高一",
    class: "高一(3)班",
    phone: "13800138001",
    email: "zhangsan@example.com",
    status: "在读",
    enrollDate: "2024-09-01",
    parentPhone: "13900139001"
  },
  {
    id: 2,
    studentId: "2024002", 
    name: "李四",
    gender: "女",
    grade: "高一",
    class: "高一(3)班",
    phone: "13800138002",
    email: "lisi@example.com",
    status: "在读",
    enrollDate: "2024-09-01",
    parentPhone: "13900139002"
  },
  {
    id: 3,
    studentId: "2024003",
    name: "王五",
    gender: "男", 
    grade: "高一",
    class: "高一(3)班",
    phone: "13800138003",
    email: "wangwu@example.com",
    status: "休学",
    enrollDate: "2024-09-01",
    parentPhone: "13900139003"
  },
  {
    id: 4,
    studentId: "2024004",
    name: "赵六",
    gender: "女",
    grade: "高一", 
    class: "高一(3)班",
    phone: "13800138004",
    email: "zhaoliu@example.com",
    status: "在读",
    enrollDate: "2024-09-01",
    parentPhone: "13900139004"
  }
];

export default function Students() {
  const [searchText, setSearchText] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  // 过滤学生数据
  useEffect(() => {
    let filtered = students;

    if (searchText) {
      filtered = filtered.filter(student => 
        student.name.includes(searchText) || 
        student.studentId.includes(searchText) ||
        student.phone.includes(searchText)
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedStatus) {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  }, [searchText, selectedGrade, selectedClass, selectedStatus, students]);

  const handleSearch = () => {
    // 搜索逻辑已在useEffect中处理
    message.success('搜索完成');
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingStudent) {
        // 编辑学生
        setStudents(prev => prev.map(s => 
          s.id === editingStudent.id ? { ...s, ...values } : s
        ));
        message.success('修改成功');
      } else {
        // 添加新学生
        const newStudent: Student = {
          id: Date.now(),
          ...values,
          status: values.status || '在读'
        };
        setStudents(prev => [...prev, newStudent]);
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

  const columns: ColumnsType<Student> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar 
          src={avatar} 
          icon={<UserOutlined />}
          size={40}
        />
      )
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      sorter: (a, b) => a.studentId.localeCompare(b.studentId)
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' }
      ],
      onFilter: (value, record) => record.gender === value
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
      width: 120,
      sorter: (a, b) => a.class.localeCompare(b.class)
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '在读', value: '在读' },
        { text: '休学', value: '休学' },
        { text: '毕业', value: '毕业' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const colors = {
          '在读': 'green',
          '休学': 'orange', 
          '毕业': 'blue'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEditStudent(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个学生吗？"
            onConfirm={() => handleDeleteStudent(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button 
                type="link" 
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">学生管理</h1>
        <p className="text-gray-600">管理班级学生信息，包括添加、编辑、删除学生档案。</p>
      </div>

      {/* 操作按钮区域 */}
      <Card className="mb-4">
        <Space wrap>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
          >
            添加学生
          </Button>
          <Button icon={<ImportOutlined />}>
            批量导入
          </Button>
          <Button icon={<ExportOutlined />}>
            导出数据
          </Button>
        </Space>
      </Card>

      {/* 搜索筛选区域 */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索学生
            </label>
            <Input
              placeholder="输入姓名、学号或电话"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年级
            </label>
            <Select
              placeholder="选择年级"
              value={selectedGrade}
              onChange={setSelectedGrade}
              allowClear
              className="w-full"
            >
              <Option value="高一">高一</Option>
              <Option value="高二">高二</Option>
              <Option value="高三">高三</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              班级
            </label>
            <Select
              placeholder="选择班级"
              value={selectedClass}
              onChange={setSelectedClass}
              allowClear
              className="w-full"
            >
              <Option value="高一(1)班">高一(1)班</Option>
              <Option value="高一(2)班">高一(2)班</Option>
              <Option value="高一(3)班">高一(3)班</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态
            </label>
            <Select
              placeholder="选择状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              className="w-full"
            >
              <Option value="在读">在读</Option>
              <Option value="休学">休学</Option>
              <Option value="毕业">毕业</Option>
            </Select>
          </div>

          <div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleSearch}
              className="w-full"
            >
              搜索
            </Button>
          </div>
        </div>
      </Card>

      {/* 学生列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredStudents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 添加/编辑学生模态框 */}
      <Modal
        title={editingStudent ? "编辑学生" : "添加学生"}
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
            status: '在读'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="学号"
              name="studentId"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input placeholder="请输入学号" />
            </Form.Item>

            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
              label="性别"
              name="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择性别">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
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
              label="联系电话"
              name="phone"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              label="家长电话"
              name="parentPhone"
              rules={[
                { required: true, message: '请输入家长电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入家长电话" />
            </Form.Item>

            <Form.Item
              label="入学日期"
              name="enrollDate"
              rules={[{ required: true, message: '请选择入学日期' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="状态"
              name="status"
            >
              <Select>
                <Option value="在读">在读</Option>
                <Option value="休学">休学</Option>
                <Option value="毕业">毕业</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}