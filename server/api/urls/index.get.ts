
import { db_ops } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const urls = await db_ops.getAllUrls();
    const baseUrl = getRequestURL(event).origin;
    
    // 为每个URL添加完整的短链接
    return urls.map(url => ({
      ...url,
      short_url: `${baseUrl}/${url.short_code}`
    }));
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message || '获取链接列表失败',
    });
  }
});