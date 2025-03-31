
import { db_ops } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const shortCode = getRouterParam(event, 'shortCode');
    const body = await readBody(event);
    const { url } = body;

    if (!shortCode) {
      throw createError({
        statusCode: 400,
        message: '请提供短链接代码',
      });
    }

    if (!url) {
      throw createError({
        statusCode: 400,
        message: '请提供新的URL',
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

    await db_ops.updateUrl(shortCode, url);
    
    return {
      message: '链接更新成功',
      shortCode,
      newUrl: url,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || '更新链接失败',
    });
  }
});