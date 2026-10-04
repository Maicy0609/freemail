// 全站开关：通过 SITE_ENABLED 环境变量控制整个网站与服务的可用性。
// 未设置或为 "true" 时正常服务；显式设为 "false" 时全站关闭（HTTP 与收信均停止）。
// 建议在 Cloudflare Dashboard 的 Worker 环境变量中修改，保存后立即生效，无需重新部署。

export interface SwitchEnv {
  SITE_ENABLED?: string;
}

export function isSiteEnabled(env: SwitchEnv): boolean {
  return env.SITE_ENABLED?.trim().toLowerCase() !== "false";
}

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>服务暂时关闭</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#0b1220; color:#e2e8f0;
         font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  .card { max-width:420px; margin:16px; padding:40px 32px; text-align:center;
          background:#111a2e; border:1px solid #1e293b; border-radius:16px; }
  h1 { margin:0 0 12px; font-size:20px; font-weight:600; }
  p { margin:0; color:#94a3b8; font-size:14px; }
</style>
</head>
<body>
  <div class="card">
    <h1>🔒 服务已暂时关闭</h1>
    <p>本站当前已停用，请稍后再试。</p>
  </div>
</body>
</html>`;

export function createMaintenanceResponse(): Response {
  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "3600",
      "Cache-Control": "no-store",
    },
  });
}
