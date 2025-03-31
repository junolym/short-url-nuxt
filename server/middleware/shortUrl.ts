
import { db_ops } from '../utils/db';

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  
  // 忽略API请求和静态资源
  if (path.startsWith('/api/') || 
      path.startsWith('/_nuxt/') || 
      path === '/' || 
      path === '/manage') {
    return;
  }

  // 获取短码（移除开头的斜杠）
  const shortCode = path.substring(1);
  
  try {
    const originalUrl = await db_ops.getOriginalUrl(shortCode);
    
    if (originalUrl) {
      // 返回302临时重定向
      return sendRedirect(event, originalUrl, 302);
    }
    
    // 如果找不到对应的URL，重定向到首页
    return sendRedirect(event, '/', 302);
  } catch (err) {
    console.error('Error in shortUrl middleware:', err);
    // 发生错误时重定向到首页
    return sendRedirect(event, '/', 302);
  }
});