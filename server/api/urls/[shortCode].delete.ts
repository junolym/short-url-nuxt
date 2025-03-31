
import { db_ops } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const shortCode = getRouterParam(event, 'shortCode');
    
    if (!shortCode) {
      throw createError({
        statusCode: 400,
        message: '请提供短链接代码',
      });
    }

    await db_ops.deleteUrl(shortCode);
    
    return {
      message: '链接删除成功',
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || '删除链接失败',
    });
  }
});