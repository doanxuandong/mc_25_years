import { Card, Row, Col, Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import dayjs from 'dayjs';

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

function getCountdownString(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return '0d 00:00:00';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
    .toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function AdminDashboard() {
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [top5Songs, setTop5Songs] = useState([]);
  const [votesPerDay, setVotesPerDay] = useState([]);
  const [todayLogins, setTodayLogins] = useState([]);

  useEffect(() => {
    // Fetch total songs and total votes
    fetch('http://localhost:5000/api/songs')
      .then(res => res.json())
      .then(data => {
        setTotalSongs(data.data ? data.data.length : 0);
        // Tổng votes là tổng votes của tất cả bài hát
        const sumVotes = (data.data || []).reduce((acc, song) => acc + (song.votes || 0), 0);
        setTotalVotes(sumVotes);
        // Top 5 songs by votes
        const top5 = [...(data.data || [])]
          .sort((a, b) => (b.votes || 0) - (a.votes || 0))
          .slice(0, 5)
          .map(song => ({ title: song.title, votes: song.votes || 0 }));
        setTop5Songs(top5);
      });
    // Fetch total users
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(users => {
        const loggedInUsers = users.filter(u => u.last_login);
        setTotalUsers(loggedInUsers.length);
        const today = dayjs().format('YYYY-MM-DD');
        const filtered = users.filter(u => u.last_login && dayjs(u.last_login).format('YYYY-MM-DD') === today);
        setTodayLogins(filtered);
      });
    // Fetch votes per day
    fetch('http://localhost:5000/api/votes/per-day')
      .then(res => res.json())
      .then(data => setVotesPerDay(data.map(row => ({ date: row.date, votes: Number(row.votes) }))));
    // Countdown
    const target = new Date('2025-08-07T00:00:00');
    setCountdown(getCountdownString(target));
    const timer = setInterval(() => {
      setCountdown(getCountdownString(target));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const summaryData = [
    { title: 'Total Songs', value: totalSongs, icon: '🎵' },
    { title: 'Total Users', value: totalUsers, icon: '👤' },
    { title: 'Total Votes', value: totalVotes, icon: '🗳️' },
    { title: 'Time Remaining', value: countdown, icon: '⏳' },
  ];

  const todayLoginColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'full_name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role_mc' },
    { title: 'Position', dataIndex: 'position_mc' },
    { title: 'Last Login', dataIndex: 'last_login', render: t => t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : '' },
  ];

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
          <Card title="Top 5 Songs" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={top5Songs} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#1976d2" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Votes Per Day" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={votesPerDay} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#f59e42" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Table
        columns={todayLoginColumns}
        dataSource={todayLogins}
        pagination={false}
        rowKey="id"
        title={() => 'Today Login'}
      />
    </div>
  );
} 