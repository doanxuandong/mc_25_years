import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Space, DatePicker, Modal } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import UserFormModal from "../components/UserFormModal";
import 'antd/dist/reset.css'; // với antd v5

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    position: "",
    email: "",
    role: "",
    dateRange: null
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.position) queryParams.append("position", filters.position);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.role) queryParams.append("role", filters.role);
      if (filters.dateRange) {
        queryParams.append("startDate", filters.dateRange[0].toISOString());
        queryParams.append("endDate", filters.dateRange[1].toISOString());
      }

      const res = await fetch(`http://localhost:5000/api/users?${queryParams}`);
      const users = await res.json();
      setData(users);

      const uniquePositions = [...new Set(users.map(user => user.position_mc))];
      setPositions(uniquePositions);
    } catch (err) {
      console.error("Error fetching users:", err);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilter = () => {
    fetchUsers(); 
  };
  const handleReset = () => {
    setFilters({
      name: "",
      position: "",
      email: "",
      role: "",
      dateRange: null
    });
    fetchUsers();
  };

  // Thêm/sửa
  const handleSubmit = async (values) => {
    try {
      if (selectedUser) {
        // Sửa
        const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        if (!response.ok) throw new Error('Failed to update user');
        
      } else {
        // Thêm user
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        if (!response.ok) throw new Error('Failed to create user');
      }

      // Reload
      fetchUsers();
      setModalVisible(false);
      setSelectedUser(null);
      Modal.success({
        title: selectedUser ? 'Cập nhật thành công!' : 'Thêm thành công!',
        content: selectedUser ? 'Thông tin người dùng đã được cập nhật.' : 'Người dùng mới đã được thêm vào hệ thống.'
      });
    } catch (error) {
      console.error('Error:', error);
      Modal.error({
        title: 'Có lỗi xảy ra!',
        content: error.message
      });
    }
  };

  // xóa user
  const handleDelete = (user) => {
    
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa người dùng "${user.full_name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        console.log('Đã bấm OK xác nhận xóa', user);
        try {
          const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
            method: 'DELETE'
          });

          if (!response.ok) throw new Error('Failed to delete user');

          fetchUsers();
          Modal.success({
            title: 'Xóa thành công!',
            content: 'Người dùng đã được xóa khỏi hệ thống.'
          });
        } catch (error) {
          console.error('Error:', error);
          Modal.error({
            title: 'Có lỗi xảy ra!',
            content: error.message
          });
        }
      }
    });
    console.log('User to delete:', user);
  };

  const columns = [
    { title: "Tên người dùng", dataIndex: "full_name", key: "full_name" },
    { title: "Chức vụ", dataIndex: "position_mc", key: "position_mc" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mật khẩu", dataIndex: "password", key: "password", render: () => "********" },
    { 
      title: "Tham gia", 
      dataIndex: "last_login", 
      key: "last_login",
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : "",
      sorter: (a, b) => new Date(a.last_login) - new Date(b.last_login)
    },
    { title: "Vai trò", dataIndex: "role_mc", key: "role_mc" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="primary"
            onClick={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            type="primary" 
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ flex: 1, fontWeight: 700, fontSize: 32, color: "#1976d2" }}>Quản lý tài khoản</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => {
            setSelectedUser(null);
            setModalVisible(true);
          }}
        >
          Thêm
        </Button>
      </div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input 
          placeholder="Tìm theo tên..." 
          style={{ width: 180 }} 
          value={filters.name}
          onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <Select 
          placeholder="Chức vụ" 
          style={{ width: 200 }}
          value={filters.position}
          onChange={value => setFilters(prev => ({ ...prev, position: value }))}
          allowClear
        >
          <Option value="">Tất cả</Option>
          {positions.map(position => (
            <Option key={position} value={position}>{position}</Option>
          ))}
        </Select>
        <Input 
          placeholder="Email..." 
          style={{ width: 180 }}
          value={filters.email}
          onChange={e => setFilters(prev => ({ ...prev, email: e.target.value }))}
        />
        <Select 
          placeholder="Vai trò" 
          style={{ width: 120 }}
          value={filters.role}
          onChange={value => setFilters(prev => ({ ...prev, role: value }))}
          allowClear
        >
          <Option value="">Tất cả</Option>
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
        <RangePicker 
          style={{ width: 280 }}
          value={filters.dateRange}
          onChange={dates => setFilters(prev => ({ ...prev, dateRange: dates }))}
          placeholder={["Từ ngày", "Đến ngày"]}
        />
        <Button icon={<FilterOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>Làm mới</Button>
      </Space>
      <Table 
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 7, 
          position: ["bottomCenter"],
          showTotal: (total) => `Tổng số ${total} người dùng`
        }}
        rowKey="id"
      />

      <UserFormModal
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmit}
        initialValues={selectedUser}
        positions={positions}
        title={selectedUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
      />
    </div>
  );
}