import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Modal, Upload, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import SongFormModal from "../components/SongFormModal";

export default function SongManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    author: ""
  });

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.title) queryParams.append("title", filters.title);
      if (filters.author) queryParams.append("author", filters.author);
      const res = await fetch(`http://localhost:5000/api/songs?${queryParams}`);
      const songs = await res.json();
      setData(songs);
    } catch (err) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleFilter = () => {
    fetchSongs();
  };
  const handleReset = () => {
    setFilters({ title: "", author: "" });
    fetchSongs();
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedSong) {
        // Sửa
        const response = await fetch(`http://localhost:5000/api/songs/${selectedSong.id_song}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) throw new Error('Failed to update song');
      } else {
        // Thêm
        const response = await fetch('http://localhost:5000/api/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!response.ok) throw new Error('Failed to create song');
      }
      fetchSongs();
      setModalVisible(false);
      setSelectedSong(null);
      Modal.success({
        title: selectedSong ? 'Cập nhật thành công!' : 'Thêm thành công!',
        content: selectedSong ? 'Bài hát đã được cập nhật.' : 'Bài hát mới đã được thêm.'
      });
    } catch (error) {
      Modal.error({ title: 'Có lỗi xảy ra!', content: error.message });
    }
  };

  const handleDelete = (song) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa bài hát "${song.title}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/songs/${song.id_song}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Failed to delete song');
          fetchSongs();
          Modal.success({ title: 'Xóa thành công!', content: 'Bài hát đã được xóa.' });
        } catch (error) {
          Modal.error({ title: 'Có lỗi xảy ra!', content: error.message });
        }
      }
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id_song", key: "id_song" },
    { title: "Avatar", dataIndex: "avatar", key: "avatar", render: (url) => url ? <Image width={50} src={url} /> : null },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Audio", dataIndex: "audio", key: "audio", render: (url) => url ? <audio controls src={url} style={{ width: 120 }} /> : null },
    { title: "Lyrics", dataIndex: "lyrics", key: "lyrics", ellipsis: true },
    { title: "Votes", dataIndex: "votes", key: "votes" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={() => { setSelectedSong(record); setModalVisible(true); }} />
          <Button icon={<DeleteOutlined />} type="primary" danger onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ flex: 1, fontWeight: 700, fontSize: 32, color: "#1976d2" }}>Quản lý bài hát</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setSelectedSong(null); setModalVisible(true); }}>Thêm</Button>
      </div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="Tìm theo tên bài hát..." style={{ width: 180 }} value={filters.title} onChange={e => setFilters(prev => ({ ...prev, title: e.target.value }))} />
        <Input placeholder="Tìm theo tác giả..." style={{ width: 180 }} value={filters.author} onChange={e => setFilters(prev => ({ ...prev, author: e.target.value }))} />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>Làm mới</Button>
      </Space>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id_song" pagination={{ pageSize: 7, position: ["bottomCenter"], showTotal: (total) => `Tổng số ${total} bài hát` }} />
      <SongFormModal visible={modalVisible} onCancel={() => { setModalVisible(false); setSelectedSong(null); }} onSubmit={handleSubmit} song={selectedSong} />
    </div>
  );
} 