import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function SongFormModal({ visible, onCancel, onSubmit, song }) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (song) {
      form.setFieldsValue(song);
    } else {
      form.resetFields();
    }
  }, [song, form]);

  // Upload file lên server thật, trả về URL
  const handleUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        // Lưu URL thực sự trả về từ server
        form.setFieldsValue({ [type]: "http://localhost:5000" + data.url });
        message.success("Tải lên thành công!");
      } else {
        message.error("Tải lên thất bại!");
      }
    } catch {
      message.error("Tải lên thất bại!");
    }
    setUploading(false);
    return false;
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSubmit(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      open={visible}
      title={song ? "Chỉnh sửa bài hát" : "Thêm bài hát mới"}
      onCancel={onCancel}
      onOk={handleOk}
      okText={song ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Upload ảnh đại diện">
          <Upload
            showUploadList={false}
            customRequest={({ file }) => handleUpload(file, "avatar")}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="avatar" label="Avatar (URL ảnh)" rules={[{ required: false }]}> 
          <Input placeholder="URL ảnh sẽ tự động điền khi upload" disabled />
        </Form.Item>
        <Form.Item name="title" label="Tên bài hát" rules={[{ required: true, message: "Vui lòng nhập tên bài hát" }]}> 
          <Input placeholder="Nhập tên bài hát" />
        </Form.Item>
        <Form.Item name="author" label="Tác giả" rules={[{ required: false }]}> 
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>
        <Form.Item label="Upload file audio">
          <Upload
            showUploadList={false}
            customRequest={({ file }) => handleUpload(file, "audio")}
            accept="audio/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>Chọn file nhạc</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="audio" label="Audio (URL file nhạc)" rules={[{ required: false }]}> 
          <Input placeholder="URL file audio sẽ tự động điền khi upload" disabled />
        </Form.Item>
        <Form.Item name="lyrics" label="Lời bài hát" rules={[{ required: false }]}> 
          <Input.TextArea placeholder="Nhập lời bài hát" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="votes" label="Votes" rules={[{ required: false }]}> 
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Số lượt bình chọn" />
        </Form.Item>
      </Form>
    </Modal>
  );
} 