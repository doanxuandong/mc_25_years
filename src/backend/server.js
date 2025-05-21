import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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

// Song Management////////////////////////////////////////////////////////
// Lấy danh sách bài hát
app.get('/api/songs', async (req, res) => {
  try {
    const { title, author, page = 1, pageSize = 8 } = req.query;
    let query = 'SELECT * FROM songs WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (title) {
      query += ` AND LOWER(title) LIKE LOWER($${paramCount})`;
      params.push(`%${title}%`);
      paramCount++;
    }
    if (author) {
      query += ` AND LOWER(author) LIKE LOWER($${paramCount})`;
      params.push(`%${author}%`);
      paramCount++;
    }

    // Clone query & params cho truy vấn đếm tổng số
    const countQuery = query;
    const countParams = [...params];
    const countResult = await pool.query(countQuery, countParams);
    const total = countResult.rows.length;

    // Truy vấn phân trang
    query += ` ORDER BY id_song DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(pageSize);
    params.push((page - 1) * pageSize);

    const result = await pool.query(query, params);
    res.json({ data: result.rows, total });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Thêm bài hát mới
app.post('/api/songs', async (req, res) => {
  try {
    const { avatar, title, author, audio, lyrics, votes } = req.body;
    const result = await pool.query(
      'INSERT INTO songs (avatar, title, author, audio, lyrics, votes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [avatar, title, author, audio, lyrics, votes || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cập nhật bài hát
app.put('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar, title, author, audio, lyrics, votes } = req.body;
    const result = await pool.query(
      'UPDATE songs SET avatar=$1, title=$2, author=$3, audio=$4, lyrics=$5, votes=$6, updated_at=NOW() WHERE id_song=$7 RETURNING *',
      [avatar, title, author, audio, lyrics, votes || 0, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Xóa bài hát
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM songs WHERE id_song=$1', [id]);
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// API upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// lưu ở uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));

// API: Lấy danh sách vote của user
app.get('/api/votes', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'Thiếu user_id' });
  const result = await pool.query(
    `SELECT v.id, s.id_song, s.title, s.author, s.avatar, v.created_at
     FROM votes v
     JOIN songs s ON v.song_id = s.id_song
     WHERE v.user_id = $1
     ORDER BY v.created_at DESC`,
    [user_id]
  );
  res.json(result.rows);
});

// API: Thực hiện vote
app.post('/api/votes', async (req, res) => {
  const { user_id, song_id } = req.body;
  if (!user_id || !song_id) return res.status(400).json({ message: 'Thiếu user_id hoặc song_id' });
  // Kiểm tra đã vote đủ 5 chưa
  const count = await pool.query('SELECT COUNT(*) FROM votes WHERE user_id = $1', [user_id]);
  if (parseInt(count.rows[0].count) >= 5) {
    return res.status(400).json({ message: 'Bạn đã vote đủ 5 lượt' });
  }
  // Kiểm tra đã vote bài này chưa
  const exist = await pool.query('SELECT id FROM votes WHERE user_id = $1 AND song_id = $2', [user_id, song_id]);
  if (exist.rows.length > 0) {
    return res.status(400).json({ message: 'Bạn đã vote bài này rồi' });
  }
  // Thêm vote
  await pool.query('INSERT INTO votes (user_id, song_id) VALUES ($1, $2)', [user_id, song_id]);
  await pool.query('UPDATE songs SET votes = votes + 1 WHERE id_song = $1', [song_id]);
  res.json({ message: 'Vote thành công' });
});

// API: Unvote
app.delete('/api/votes/:id', async (req, res) => {
  // Lấy song_id trước khi xóa để giảm votes
  const vote = await pool.query('SELECT song_id FROM votes WHERE id = $1', [req.params.id]);
  if (vote.rows.length === 0) return res.status(404).json({ message: 'Vote không tồn tại' });
  const song_id = vote.rows[0].song_id;
  await pool.query('DELETE FROM votes WHERE id = $1', [req.params.id]);
  await pool.query('UPDATE songs SET votes = votes - 1 WHERE id_song = $1', [song_id]);
  res.json({ message: 'Unvote thành công' });
});

// API: Thống kê vote
app.get('/api/vote-stats', async (req, res) => {
  const result = await pool.query(`
    SELECT u.full_name, COUNT(v.id) AS vote_count
    FROM users u
    LEFT JOIN votes v ON u.id = v.user_id
    GROUP BY u.id, u.full_name
    ORDER BY vote_count DESC
  `);
  res.json(result.rows);
});