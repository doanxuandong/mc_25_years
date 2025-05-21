import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space, message, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import SongFormModal from "../components/SongFormModal";

export default function SongManagement() {
  const [songs, setSongs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [filters, setFilters] = useState({ title: '', author: '' });
  const [detailModal, setDetailModal] = useState({ open: false, song: null });

  const fetchSongs = async (filter = filters) => {
    const params = new URLSearchParams();
    if (filter.title) params.append('title', filter.title);
    if (filter.author) params.append('author', filter.author);
    const res = await fetch(`http://localhost:5000/api/songs?${params}`);
    const result = await res.json();
    setSongs(result.data || result);
  };

  useEffect(() => { fetchSongs(); }, []);

  const handleSubmit = async (values) => {
    const method = selectedSong ? "PUT" : "POST";
    const url = selectedSong
      ? `http://localhost:5000/api/songs/${selectedSong.id_song}`
      : "http://localhost:5000/api/songs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      fetchSongs(filters);
      setModalVisible(false);
      setSelectedSong(null);
      message.success(selectedSong ? "Cập nhật thành công!" : "Thêm thành công!");
    } else {
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = (song) => {
    console.log('Xóa bài hát:', song);
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa bài hát \"${song.title}\"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        const res = await fetch(`http://localhost:5000/api/songs/${song.id_song}`, { method: "DELETE" });
        if (res.ok) {
          fetchSongs(filters);
          message.success("Đã xóa bài hát!");
        } else {
          message.error("Xóa thất bại!");
        }
      }
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id_song", key: "id_song", width: 60 },
    { title: "Ảnh", dataIndex: "avatar", key: "avatar", render: url => url ? <Image width={50} src={url} /> : null, width: 80 },
    { title: "Tên bài hát", dataIndex: "title", key: "title" },
    { title: "Tác giả", dataIndex: "author", key: "author" },
    { title: "Audio", dataIndex: "audio", key: "audio", render: url => url ? <audio controls src={url} style={{ width: 120 }} /> : null },
    { title: "Lời bài hát", dataIndex: "lyrics", key: "lyrics", ellipsis: true },
    { title: "Votes", dataIndex: "votes", key: "votes", width: 80 },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            style={{ background: '#e0e7ff', color: '#1d4ed8', border: 'none' }}
            onClick={() => setDetailModal({ open: true, song: record })}
          />
          <Button
            icon={<EditOutlined />}
            style={{ background: '#3b82f6', color: '#fff', border: 'none' }}
            onClick={() => { setSelectedSong(record); setModalVisible(true); }}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{ background: '#f87171', color: '#fff', border: 'none' }}
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ flex: 1, fontWeight: 700, fontSize: 32, color: "#1976d2" }}>Quản lý bài hát</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setSelectedSong(null); setModalVisible(true); }}>Thêm</Button>
      </div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="Tìm theo tên bài hát..." style={{ width: 180 }} value={filters.title}
          onChange={e => setFilters(prev => ({ ...prev, title: e.target.value }))} />
        <Input placeholder="Tìm theo tác giả..." style={{ width: 180 }} value={filters.author}
          onChange={e => setFilters(prev => ({ ...prev, author: e.target.value }))} />
        <Button type="primary" onClick={() => fetchSongs(filters)}>Lọc</Button>
        <Button onClick={() => { setFilters({ title: '', author: '' }); fetchSongs({ title: '', author: '' }); }}>Làm mới</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={songs}
        rowKey="id_song"
        pagination={false}
        bordered
      />
      <SongFormModal
        visible={modalVisible}
        onCancel={() => { setModalVisible(false); setSelectedSong(null); }}
        onSubmit={handleSubmit}
        song={selectedSong}
      />
      <Modal
        open={detailModal.open}
        title={detailModal.song?.title}
        onCancel={() => setDetailModal({ open: false, song: null })}
        footer={null}
        width={500}
      >
        {detailModal.song && (
          <div>
            {detailModal.song.avatar && <Image src={detailModal.song.avatar} width={200} style={{ marginBottom: 16 }} />}
            <div><b>Tác giả:</b> {detailModal.song.author}</div>
            <div style={{ margin: '12px 0' }}>
              <audio controls src={detailModal.song.audio} style={{ width: '100%' }} />
            </div>
            <div><b>Lời bài hát:</b></div>
            <div style={{ whiteSpace: 'pre-line', marginBottom: 8 }}>{detailModal.song.lyrics}</div>
            <div><b>Votes:</b> {detailModal.song.votes}</div>
          </div>
        )}
      </Modal>
    </div>
  );
} 