/** EmbedForge Web UI（单页，内嵌样式与脚本） */
export const UI_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>EmbedForge · 嵌入式 AI 开发 Agent</title>
<style>
  :root { --bg:#0f1115; --panel:#171a21; --border:#262b36; --text:#e6e9ef; --muted:#8b93a3; --accent:#4f8cff; --ok:#3fb96f; --err:#e5534b; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:14px/1.6 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif; }
  header { padding:18px 28px; border-bottom:1px solid var(--border); display:flex; align-items:baseline; gap:14px; }
  header h1 { margin:0; font-size:18px; }
  header span { color:var(--muted); font-size:12px; }
  main { max-width:980px; margin:0 auto; padding:22px 28px 60px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media (max-width:820px){ .grid{grid-template-columns:1fr;} }
  .panel { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:16px; }
  .panel h2 { margin:0 0 10px; font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
  label { display:block; font-size:12px; color:var(--muted); margin:10px 0 4px; }
  input, textarea, select { width:100%; background:#0d0f14; border:1px solid var(--border); color:var(--text); border-radius:7px; padding:9px 11px; font:inherit; }
  textarea { min-height:130px; resize:vertical; }
  input:focus, textarea:focus, select:focus { outline:none; border-color:var(--accent); }
  .row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  button { background:var(--accent); color:#fff; border:0; border-radius:7px; padding:10px 18px; font-size:14px; cursor:pointer; margin-top:14px; }
  button:disabled { opacity:.5; cursor:not-allowed; }
  .hint { font-size:12px; color:var(--muted); margin-top:8px; }
  .status { margin-top:12px; font-size:13px; min-height:20px; }
  .status.ok { color:var(--ok); } .status.err { color:var(--err); }
  .files { margin-top:4px; }
  .file { padding:7px 10px; border:1px solid var(--border); border-radius:7px; margin-bottom:6px; cursor:pointer; display:flex; gap:8px; align-items:center; }
  .file:hover { border-color:var(--accent); }
  .file .name { font-family:ui-monospace,Consolas,monospace; font-size:12.5px; }
  .file .tag { font-size:10.5px; padding:1px 7px; border-radius:99px; background:#223047; color:#9db8e8; }
  .file .tag.ai { background:#1f3a2b; color:#7fd1a3; }
  .file .tag.fail { background:#3a2020; color:#f0a9a5; }
  pre { background:#0d0f14; border:1px solid var(--border); border-radius:7px; padding:12px; overflow:auto; max-height:420px; font:12px/1.5 ui-monospace,Consolas,monospace; white-space:pre; }
  .plan { font-size:13px; }
  .plan b { color:var(--accent); }
  table { width:100%; border-collapse:collapse; margin-top:6px; font-size:12.5px; }
  td, th { border:1px solid var(--border); padding:5px 8px; text-align:left; }
  th { color:var(--muted); font-weight:500; }
</style>
</head>
<body>
<header>
  <h1>⚙ EmbedForge</h1>
  <span>嵌入式 AI 开发 Agent：描述需求，生成完整工程</span>
</header>
<main>
  <div class="grid">
    <section class="panel">
      <h2>需求描述</h2>
      <textarea id="req" placeholder="例如：STM32F103 读取 DHT11 温湿度，通过 I2C 在 OLED 上显示，串口打印日志"></textarea>
      <label>API 端点（OpenAI 兼容）</label>
      <input id="base" placeholder="https://api.deepseek.com/v1" />
      <div class="row">
        <div>
          <label>模型</label>
          <input id="model" placeholder="deepseek-chat" />
        </div>
        <div>
          <label>平台（可选）</label>
          <select id="platform">
            <option value="">自动推断</option>
            <option>stm32</option><option>esp32</option><option>arduino</option><option>generic-c</option>
          </select>
        </div>
      </div>
      <label>API Key（仅在本地服务上运行，不会外传）</label>
      <input id="key" type="password" placeholder="sk-..." />
      <button id="run">生成工程</button>
      <div class="hint">生成的文件会写入服务器工作目录的 generated/ 下；LLM 不可用时可用“仅骨架模式”。</div>
      <div class="status" id="status"></div>
    </section>
    <section class="panel">
      <h2>工程规划</h2>
      <div class="plan" id="plan"><span style="color:var(--muted)">提交需求后，这里会显示 AI 生成的工程规划。</span></div>
    </section>
  </div>
  <section class="panel" style="margin-top:16px">
    <h2>生成的文件</h2>
    <div class="files" id="files"><span style="color:var(--muted)">暂无</span></div>
    <pre id="code" style="margin-top:12px; display:none"></pre>
  </section>
</main>
<script>
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var runBtn = document.getElementById('run');
  var statusEl = document.getElementById('status');
  runBtn.addEventListener('click', async function(){
    var req = document.getElementById('req').value.trim();
    if (!req){ statusEl.className='status err'; statusEl.textContent='请先描述需求'; return; }
    runBtn.disabled = true;
    statusEl.className = 'status';
    statusEl.textContent = 'AI 正在规划工程结构…';
    try {
      var res = await fetch('/api/generate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          requirement: req,
          baseURL: document.getElementById('base').value.trim(),
          model: document.getElementById('model').value.trim(),
          apiKey: document.getElementById('key').value.trim(),
          platform: document.getElementById('platform').value
        })
      });
      var data = await res.json();
      if (!res.ok){ throw new Error(data.error || '生成失败'); }
      statusEl.className = 'status ok';
      statusEl.textContent = '完成：' + data.result.projectName + '（骨架 ' + data.result.skeletonCount + ' 个 / AI 生成 ' + data.result.aiGeneratedCount + ' 个）已写入 ' + data.result.outDir;
      renderPlan(data.plan);
      renderFiles(data.result.files);
    } catch (e){
      statusEl.className = 'status err';
      statusEl.textContent = '错误：' + e.message;
    } finally { runBtn.disabled = false; }
  });
  function renderPlan(plan){
    var el = document.getElementById('plan');
    var html = '<p><b>工程名：</b>' + esc(plan.projectName) + '　<b>平台：</b>' + esc(plan.platform) + '</p>';
    html += '<p><b>目标：</b>' + esc(plan.target) + '</p>';
    html += '<p><b>简介：</b>' + esc(plan.summary) + '</p>';
    if (plan.modules && plan.modules.length){ html += '<p><b>模块：</b>' + plan.modules.map(esc).join(' / ') + '</p>'; }
    if (plan.pinout && plan.pinout.length){
      html += '<table><tr><th>引脚</th><th>信号</th><th>说明</th></tr>';
      plan.pinout.forEach(function(p){ html += '<tr><td>' + esc(p.pin) + '</td><td>' + esc(p.signal) + '</td><td>' + esc(p.note || '-') + '</td></tr>'; });
      html += '</table>';
    }
    el.innerHTML = html;
  }
  function renderFiles(files){
    var el = document.getElementById('files');
    var codeEl = document.getElementById('code');
    codeEl.style.display = 'none';
    if (!files || !files.length){ el.innerHTML = '<span style="color:var(--muted)">暂无</span>'; return; }
    el.innerHTML = '';
    files.forEach(function(f){
      var div = document.createElement('div');
      div.className = 'file';
      var tag = f.status === 'ok' ? (f.source !== undefined ? '<span class="tag">' + esc(f.source) + '</span>' : '') : '<span class="tag fail">失败</span>';
      div.innerHTML = '<span class="name">' + esc(f.path) + '</span>' + tag;
      div.addEventListener('click', function(){
        if (f.status === 'error'){ codeEl.textContent = '生成失败：' + (f.error || '未知错误'); }
        else { codeEl.textContent = f.content; }
        codeEl.style.display = 'block';
      });
      el.appendChild(div);
    });
  }
</script>
</body>
</html>`;
