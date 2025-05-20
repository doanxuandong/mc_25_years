import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'mc_25_years', 
  password: 'xddtk8303@@',
  port: 5432,
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

  const user = result.rows[0];
  if (user.password !== password) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

  // Cập nhật thời gian đăng nhập
  const now = new Date();
  await pool.query('UPDATE users SET last_login = $1 WHERE id = $2', [now, user.id]);

  res.json({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role_mc,
    position: user.position_mc,
    last_login: now,
  });
});

// Lấy danh sách user (cho User Management)
app.get('/api/users', async (req, res) => {
  try {
    const { name, position, email, role, startDate, endDate } = req.query;
    
    let query = 'SELECT id, full_name, email, position_mc, role_mc, last_login FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND LOWER(full_name) LIKE LOWER($${paramCount})`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (position) {
      query += ` AND position_mc = $${paramCount}`;
      params.push(position);
      paramCount++;
    }

    if (email) {
      query += ` AND LOWER(email) LIKE LOWER($${paramCount})`;
      params.push(`%${email}%`);
      paramCount++;
    }

    if (role) {
      query += ` AND role_mc = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (startDate && endDate) {
      query += ` AND last_login BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(startDate, endDate);
      paramCount += 2;
    }

    query += ' ORDER BY last_login DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Thêm user mới
app.post('/api/users', async (req, res) => {
  try {
    const { full_name, email, password, position_mc, role_mc } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }

    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, position_mc, role_mc, last_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [full_name, email, password, position_mc, role_mc, new Date()]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cập nhật thông tin user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, position_mc, role_mc } = req.body;

    // Kiểm tra email đã tồn tại (trừ user hiện tại)
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
    }

    await pool.query(
      'UPDATE users SET full_name = $1, email = $2, position_mc = $3, role_mc = $4 WHERE id = $5',
      [full_name, email, position_mc, role_mc, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Xóa user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));