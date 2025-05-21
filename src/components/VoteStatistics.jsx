import { useEffect, useState } from 'react';
import { Table, Input, Select, Space, Button } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

export default function VoteStatistics() {
  const [voteStats, setVoteStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [voteFilter, setVoteFilter] = useState('all');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
  const [loading, setLoading] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/vote-stats')
      .then(res => res.json())
      .then(data => {
        setVoteStats(data);
        setFilteredStats(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = voteStats;
    if (nameFilter) {
      filtered = filtered.filter(item => item.full_name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (voteFilter !== 'all') {
      if (voteFilter === '0') filtered = filtered.filter(item => parseInt(item.vote_count) === 0);
      else if (voteFilter === '1-4') filtered = filtered.filter(item => parseInt(item.vote_count) > 0 && parseInt(item.vote_count) < 5);
      else if (voteFilter === '5+') filtered = filtered.filter(item => parseInt(item.vote_count) >= 5);
    }
    setFilteredStats(filtered);
    setPagination(p => ({ ...p, current: 1 })); // Reset về trang 1 khi lọc
  }, [nameFilter, voteFilter, voteStats]);

  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  const handleReset = () => {
    setNameFilter('');
    setVoteFilter('all');
    fetchStats();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontWeight: 600, fontSize: 24, marginBottom: 24 }}>Vote Statistics</h1>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Lọc theo tên người dùng"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={{ width: 220 }}
        />
        <Select
          value={voteFilter}
          onChange={setVoteFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="all">Tất cả số lượt vote</Select.Option>
          <Select.Option value="0">Chưa vote</Select.Option>
          <Select.Option value="1-4">1-4 lượt vote</Select.Option>
          <Select.Option value="5+">5 lượt vote trở lên</Select.Option>
        </Select>
        <Button icon={<FilterOutlined />} type="primary" onClick={() => {}} disabled style={{ cursor: 'default' }}>Lọc</Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>Làm mới</Button>
      </Space>
      <Table
        columns={[
          { title: 'Tên người dùng', dataIndex: 'full_name', key: 'full_name' },
          { title: 'Số lượt vote', dataIndex: 'vote_count', key: 'vote_count' },
        ]}
        dataSource={filteredStats}
        loading={loading}
        pagination={{
          ...pagination,
          total: filteredStats.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} người dùng`,
          position: ['bottomCenter'],
        }}
        rowKey="full_name"
        bordered
        onChange={handleTableChange}
      />
    </div>
  );
} 