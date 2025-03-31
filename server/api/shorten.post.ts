
import { db_ops } from '../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: '请提供URL',
      });
    }

    // 验证URL格式
    try {
      new URL(url);
    } catch (err) {
      throw createError({
        statusCode: 400,
        message: '请输入有效的链接地址',
      });
    }

    const shortCode = await db_ops.saveUrl(url);
    const shortUrl = `${getRequestURL(event).origin}/${shortCode}`;

    return {
      shortUrl,
      shortCode,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || '生成短链接失败',
    });
  }
});