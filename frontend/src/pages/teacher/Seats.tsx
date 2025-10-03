import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Badge,
  Divider,
  Statistic
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// 教室数据类型
type Classroom = {
  id: number;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
};

// 座位状态类型
type SeatStatus = 'empty' | 'occupied' | 'absent' | 'late';

// 座位数据类型
type Seat = {
  number: number;
  status: SeatStatus;
  studentName?: string;
  studentId?: string;
};

// 模拟教室数据
const mockClassrooms: Classroom[] = [
  { id: 1, name: 'A101 教室', capacity: 48, rows: 6, cols: 8 },
  { id: 2, name: 'B203 教室', capacity: 60, rows: 8, cols: 8 },
  { id: 3, name: 'C305 教室', capacity: 36, rows: 6, cols: 6 },
  { id: 4, name: 'D102 教室', capacity: 72, rows: 9, cols: 8 }
];

// 模拟学生数据
const mockStudents = [
  { id: '2024001', name: '张三' },
  { id: '2024002', name: '李四' },
  { id: '2024003', name: '王五' },
  { id: '2024004', name: '赵六' },
  { id: '2024005', name: '钱七' },
  { id: '2024006', name: '孙八' },
  { id: '2024007', name: '周九' },
  { id: '2024008', name: '吴十' }
];

export default function Seats() {
  const [currentClassroomIndex, setCurrentClassroomIndex] = useState(0);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isLayoutModalVisible, setIsLayoutModalVisible] = useState(false);
  const [layoutForm] = Form.useForm();

  const currentClassroom = mockClassrooms[currentClassroomIndex];

  // 初始化座位数据
  useEffect(() => {
    generateSeats();
  }, [currentClassroomIndex]);

  // 生成座位数据
  const generateSeats = () => {
    const newSeats: Seat[] = [];
    const totalSeats = currentClassroom.capacity;
    
    // 随机分配一些学生到座位上
    const occupiedSeats = new Set<number>();
    const numOccupied = Math.floor(totalSeats * 0.7); // 70%的座位有人
    
    while (occupiedSeats.size < numOccupied) {
      occupiedSeats.add(Math.floor(Math.random() * totalSeats) + 1);
    }

    for (let i = 1; i <= totalSeats; i++) {
      let status: SeatStatus = 'empty';
      let studentName: string | undefined;
      let studentId: string | undefined;

      if (occupiedSeats.has(i)) {
        const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
        const statusOptions: SeatStatus[] = ['occupied', 'absent', 'late'];
        const weights = [0.8, 0.15, 0.05]; // 80%出勤，15%缺勤，5%迟到
        
        let random = Math.random();
        let selectedIndex = 0;
        for (let j = 0; j < weights.length; j++) {
          if (random < weights[j]) {
            selectedIndex = j;
            break;
          }
          random -= weights[j];
        }
        
        status = statusOptions[selectedIndex];
        studentName = randomStudent.name;
        studentId = randomStudent.id;
      }

      newSeats.push({
        number: i,
        status,
        studentName,
        studentId
      });
    }

    setSeats(newSeats);
  };

  // 切换教室
  const switchClassroom = (direction: number) => {
    const newIndex = currentClassroomIndex + direction;
    if (newIndex >= 0 && newIndex < mockClassrooms.length) {
      setCurrentClassroomIndex(newIndex);
      setSelectedSeat(null);
      message.info(`已切换到 ${mockClassrooms[newIndex].name}`);
    }
  };

  // 获取座位状态配置
  const getSeatStatusConfig = (status: SeatStatus) => {
    switch (status) {
      case 'empty':
        return {
          color: '#f5f5f5',
          borderColor: '#d9d9d9',
          textColor: '#8c8c8c',
          label: '空座'
        };
      case 'occupied':
        return {
          color: '#52c41a',
          borderColor: '#52c41a',
          textColor: '#fff',
          label: '出勤'
        };
      case 'absent':
        return {
          color: '#ff4d4f',
          borderColor: '#ff4d4f',
          textColor: '#fff',
          label: '缺勤'
        };
      case 'late':
        return {
          color: '#faad14',
          borderColor: '#faad14',
          textColor: '#fff',
          label: '迟到'
        };
      default:
        return {
          color: '#f5f5f5',
          borderColor: '#d9d9d9',
          textColor: '#8c8c8c',
          label: '未知'
        };
    }
  };

  // 选择座位
  const selectSeat = (seatNumber: number) => {
    setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber);
  };

  // 打开布局设置
  const openLayoutSettings = () => {
    layoutForm.setFieldsValue({
      rows: currentClassroom.rows,
      cols: currentClassroom.cols
    });
    setIsLayoutModalVisible(true);
  };

  // 应用布局设置
  const applyLayoutSettings = async () => {
    try {
      const values = await layoutForm.validateFields();
      const newCapacity = values.rows * values.cols;
      
      // 更新当前教室配置（实际项目中应该调用API）
      mockClassrooms[currentClassroomIndex] = {
        ...currentClassroom,
        rows: values.rows,
        cols: values.cols,
        capacity: newCapacity
      };
      
      generateSeats();
      setIsLayoutModalVisible(false);
      message.success(`座位布局已更新为 ${values.rows}行×${values.cols}列，共${newCapacity}个座位`);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 统计数据
  const stats = {
    total: seats.length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    absent: seats.filter(s => s.status === 'absent').length,
    late: seats.filter(s => s.status === 'late').length,
    empty: seats.filter(s => s.status === 'empty').length
  };

  const attendanceRate = stats.total > 0 ? ((stats.occupied / (stats.total - stats.empty)) * 100).toFixed(1) : '0';

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <Title level={2} className="mb-2">智能座位管理</Title>
        <Text type="secondary">管理教室座位布局，查看学生出勤情况</Text>
      </div>

      {/* 教室信息和导航 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              icon={<LeftOutlined />}
              disabled={currentClassroomIndex === 0}
              onClick={() => switchClassroom(-1)}
            >
              上一个
            </Button>
            
            <div className="text-center">
              <Title level={4} className="mb-1">{currentClassroom.name}</Title>
              <Tag color="blue">容量: {currentClassroom.capacity}人</Tag>
            </div>
            
            <Button
              disabled={currentClassroomIndex === mockClassrooms.length - 1}
              onClick={() => switchClassroom(1)}
            >
              下一个
              <RightOutlined />
            </Button>
          </div>

          <Space>
            <Button
              icon={<SettingOutlined />}
              onClick={openLayoutSettings}
            >
              调整布局
            </Button>
          </Space>
        </div>
      </Card>

      {/* 统计信息 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="总座位数"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="出勤人数"
              value={stats.occupied}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="缺勤人数"
              value={stats.absent}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="出勤率"
              value={attendanceRate}
              suffix="%"
              valueStyle={{ color: parseFloat(attendanceRate) >= 80 ? '#52c41a' : '#faad14' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 座位布局 */}
      <Card title="座位布局" className="mb-6">
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 min-h-96">
          {/* 讲台 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <UserOutlined className="mr-2" />
            讲台
          </div>

          {/* 座位网格 */}
          <div 
            className="grid gap-3 mb-16 max-w-4xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${currentClassroom.cols}, 1fr)`
            }}
          >
            {seats.map((seat) => {
              const config = getSeatStatusConfig(seat.status);
              const isSelected = selectedSeat === seat.number;
              
              return (
                <Tooltip
                  key={seat.number}
                  title={
                    seat.status !== 'empty' ? (
                      <div>
                        <div>座位: {seat.number}</div>
                        <div>学生: {seat.studentName}</div>
                        <div>学号: {seat.studentId}</div>
                        <div>状态: {config.label}</div>
                      </div>
                    ) : (
                      `座位 ${seat.number} - 空座`
                    )
                  }
                >
                  <div
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer
                      transition-all duration-300 hover:scale-110 hover:shadow-lg
                      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    `}
                    style={{
                      backgroundColor: config.color,
                      borderColor: config.borderColor,
                      color: config.textColor,
                      border: `2px solid ${config.borderColor}`
                    }}
                    onClick={() => selectSeat(seat.number)}
                  >
                    <span className="text-xs font-semibold">{seat.number}</span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex justify-center space-x-6 mt-4 p-4 bg-gray-50 rounded-lg">
          {[
            { status: 'empty' as SeatStatus, icon: <UserOutlined /> },
            { status: 'occupied' as SeatStatus, icon: <CheckCircleOutlined /> },
            { status: 'absent' as SeatStatus, icon: <CloseCircleOutlined /> },
            { status: 'late' as SeatStatus, icon: <ClockCircleOutlined /> }
          ].map(({ status, icon }) => {
            const config = getSeatStatusConfig(status);
            return (
              <div key={status} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: config.color, border: `1px solid ${config.borderColor}` }}
                />
                <span className="text-sm text-gray-600">{config.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 布局设置模态框 */}
      <Modal
        title="座位布局设置"
        open={isLayoutModalVisible}
        onOk={applyLayoutSettings}
        onCancel={() => setIsLayoutModalVisible(false)}
        okText="应用设置"
        cancelText="取消"
      >
        <Form form={layoutForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="行数"
                name="rows"
                rules={[
                  { required: true, message: '请输入行数' },
                  { type: 'number', min: 3, max: 10, message: '行数应在3-10之间' }
                ]}
              >
                <InputNumber min={3} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="列数"
                name="cols"
                rules={[
                  { required: true, message: '请输入列数' },
                  { type: 'number', min: 4, max: 12, message: '列数应在4-12之间' }
                ]}
              >
                <InputNumber min={4} max={12} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item dependencies={['rows', 'cols']}>
            {({ getFieldValue }) => {
              const rows = getFieldValue('rows') || currentClassroom.rows;
              const cols = getFieldValue('cols') || currentClassroom.cols;
              const total = rows * cols;
              
              return (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Text strong>预计座位数: {total}</Text>
                  <div className="mt-2 text-sm text-gray-600">
                    当前配置: {rows}行 × {cols}列
                  </div>
                </div>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}