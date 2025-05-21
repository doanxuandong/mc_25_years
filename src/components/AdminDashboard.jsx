import { Card, Row, Col, Table, Button } from 'antd';
import { useEffect, useState } from 'react';

const summaryData = [
  { title: 'Total Songs', value: 12, icon: '🎵' },
  { title: 'Total Users', value: 1045, icon: '👤' },
  { title: 'Total Votes', value: 23456, icon: '🗳️' },
  { title: 'Time Remaining', value: '20d 15:23:45', icon: '⏳' },
];

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Title', dataIndex: 'title' },
  { title: 'Author', dataIndex: 'author' },
  { title: 'Votes', dataIndex: 'votes' },
  { title: 'Status', dataIndex: 'status' },
  {
    title: 'Actions',
    render: () => <Button type="primary" size="small">Edit</Button>,
  },
];

const data = [
  { id: 1, title: 'Đi về nhà', author: 'Doa Xuan Dong', votes: '8.303', status: 'Open' },
  { id: 2, title: 'Đi về nhà', author: 'Doa Xuan Dong', votes: '5.123', status: 'Open' },
  { id: 3, title: '...', author: '...', votes: '4.567', status: 'Open' },
  { id: 4, title: 'Open', author: 'Doé Xuan Dong', votes: '3.830', status: 'Open' },
];

export default function AdminDashboard() {
  const [voteStats, setVoteStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vote-stats')
      .then(res => res.json())
      .then(data => setVoteStats(data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontWeight: 600, fontSize: 24 }}>MC GROUP Voting Dashboard</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {summaryData.map((item, idx) => (
          <Col span={6} key={idx}>
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{item.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{item.value}</div>
              <div>{item.title}</div>
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          {/* Biểu đồ Top 5 Songs sẽ thêm sau */}
          <Card title="Top 5 Songs" style={{ height: 300 }}>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              (Chart here)
            </div>
          </Card>
        </Col>
        <Col span={12}>
          {/* Biểu đồ Votes Per Day sẽ thêm sau */}
          <Card title="Votes Per Day" style={{ height: 300 }}>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              (Chart here)
            </div>
          </Card>
        </Col>
      </Row>
      <h2 style={{ fontWeight: 600, fontSize: 20, margin: '24px 0 12px' }}>Vote Statistics</h2>
      <Table
        columns={[
          { title: 'Tên người dùng', dataIndex: 'full_name', key: 'full_name' },
          { title: 'Số lượt vote', dataIndex: 'vote_count', key: 'vote_count' },
        ]}
        dataSource={voteStats}
        pagination={false}
        rowKey="full_name"
        bordered
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        title={() => 'Songs'}
      />
    </div>
  );
} 