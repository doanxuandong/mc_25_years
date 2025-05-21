import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SettingOutlined,
  FileExcelOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  return (
    <Sider style={{ minHeight: '100vh', background: '#1a2950' }}>
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 32, lineHeight: 1.1 }}>
          25 <span style={{ fontSize: 16 }}>YEARS</span><br />
          <span style={{ fontSize: 18 }}>MC GROUP</span>
        </div>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ background: '#1a2950' }}>
        <Menu.Item key="1" icon={<LineChartOutlined />} onClick={() => navigate('/admin/dashboard')}>Dashboard</Menu.Item>
        <Menu.Item key="2" icon={<CustomerServiceOutlined />} onClick={() => navigate('/admin/songs')}>Song Management</Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate('/admin/users')}>User Management</Menu.Item>
        <Menu.Item key="4" icon={<BarChartOutlined />} onClick={() => navigate('/admin/vote-statistics')}>Vote Statistics</Menu.Item>
        <Menu.Item key="5" icon={<SettingOutlined />}>Program Settings</Menu.Item>
        <Menu.Item key="6" icon={<FileExcelOutlined />}>Export Reports</Menu.Item>
        <Menu.Item key="7" icon={<LogoutOutlined />} onClick={onLogout}>Logout</Menu.Item>
      </Menu>
    </Sider>
  );
} 