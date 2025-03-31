
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { useRuntimeConfig } from '#imports';

interface DbResult {
  original_url?: string;
}

interface UrlRecord {
  id: number;
  short_code: string;
  original_url: string;
  created_at: string;
}

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取运行时配置
const config = useRuntimeConfig();
const dbPath = config.dbPath;

// 确保数据库目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
    // 初始化数据库
    initDb().catch(console.error);
  }
});

// 将数据库操作转换为 Promise
const dbRun = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const dbGet = (sql: string, params: any[] = []): Promise<DbResult> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || {});
    });
  });
};

const dbAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// 初始化数据库表
const initDb = async () => {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

// 生成短码
const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 数据库操作函数
export const db_ops = {
  // 保存URL
  async saveUrl(originalUrl: string): Promise<string> {
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        shortCode = generateShortCode();
        await dbRun(
          'INSERT INTO urls (short_code, original_url) VALUES (?, ?)',
          [shortCode, originalUrl]
        );
        return shortCode;
      } catch (err) {
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Failed to generate unique short code');
        }
      }
    }
    throw new Error('Failed to save URL');
  },

  // 获取原始URL
  async getOriginalUrl(shortCode: string): Promise<string | null> {
    try {
      const result = await dbGet(
        'SELECT original_url FROM urls WHERE short_code = ?',
        [shortCode]
      );
      return result.original_url || null;
    } catch (err) {
      console.error('Error getting original URL:', err);
      throw err;
    }
  },

  // 获取所有URL
  async getAllUrls(): Promise<UrlRecord[]> {
    return dbAll<UrlRecord>(
      'SELECT id, short_code, original_url, created_at FROM urls ORDER BY created_at DESC'
    );
  },

  // 删除URL
  async deleteUrl(shortCode: string): Promise<void> {
    try {
      await dbRun('DELETE FROM urls WHERE short_code = ?', [shortCode]);
    } catch (err) {
      console.error('Error deleting URL:', err);
      throw err;
    }
  },

  // 更新URL
  async updateUrl(shortCode: string, newOriginalUrl: string): Promise<void> {
    try {
      await dbRun(
        'UPDATE urls SET original_url = ? WHERE short_code = ?',
        [newOriginalUrl, shortCode]
      );
    } catch (err) {
      console.error('Error updating URL:', err);
      throw err;
    }
  }
};