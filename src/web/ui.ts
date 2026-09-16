/** EmbedForge Web UI（三栏：配置 / 聊天对话流 / 工程详情） */
export const UI_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>EmbedForge · 嵌入式 AI 开发 Agent</title>
<style>
  :root { --bg:#0f1115; --panel:#171a21; --panel2:#1d212b; --border:#262b36; --text:#e6e9ef; --muted:#8b93a3; --accent:#4f8cff; --accent2:#3a6fd4; --ok:#3fb96f; --err:#e5534b; --user:#2b4a8a; }
  * { box-sizing:border-box; }
  html,body { height:100%; margin:0; }
  body { background:var(--bg); color:var(--text); font:14px/1.6 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif; display:flex; flex-direction:column; }
  header { padding:12px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  header h1 { margin:0; font-size:16px; }
  header .sess { margin-left:auto; font-size:12px; color:var(--muted); display:flex; align-items:center; gap:8px; }
  header .pill { background:#223047; color:#9db8e8; border-radius:99px; padding:2px 10px; font-family:ui-monospace,Consolas,monospace; }
  main { flex:1; display:grid; grid-template-columns:280px 1fr 380px; gap:0; min-height:0; }
  @media (max-width:1100px){ main{grid-template-columns:240px 1fr;} .detail{display:none;} }
  .col { display:flex; flex-direction:column; min-height:0; border-right:1px solid var(--border); }
  .col:last-child { border-right:none; }
  .col-title { padding:10px 14px; font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); border-bottom:1px solid var(--border); }

  /* ===== 左栏：配置 ===== */
  .config { padding:12px 14px; overflow-y:auto; flex:1; }
  .config label { display:block; font-size:12px; color:var(--muted); margin:10px 0 4px; }
  .config input, .config textarea, .config select { width:100%; background:#0d0f14; border:1px solid var(--border); color:var(--text); border-radius:7px; padding:8px 10px; font:inherit; }
  .config input:focus, .config select:focus { outline:none; border-color:var(--accent); }
  .config .hint { font-size:11px; color:var(--muted); margin-top:6px; line-height:1.5; }
  .att-list { margin-top:6px; }
  .att { display:flex; align-items:center; gap:8px; padding:5px 8px; border:1px solid var(--border); border-radius:6px; margin-top:5px; font-size:12px; }
  .att img { width:30px; height:30px; object-fit:cover; border-radius:4px; border:1px solid var(--border); }
  .att .meta { flex:1; min-width:0; }
  .att .meta .n { font-family:ui-monospace,Consolas,monospace; font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .att .rm { color:var(--err); cursor:pointer; border:0; background:none; margin:0; padding:2px 6px; font-size:12px; }
  .btn { background:var(--accent); color:#fff; border:0; border-radius:7px; padding:9px 16px; font-size:13px; cursor:pointer; width:100%; margin-top:12px; }
  .btn:hover { background:var(--accent2); }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .btn-ghost { background:transparent; border:1px solid var(--border); color:var(--muted); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; width:100%; margin-top:8px; }
  .btn-ghost:hover { border-color:var(--accent); color:var(--text); }
  .skills-section { margin-top:16px; border-top:1px solid var(--border); padding-top:12px; }
  .skills-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .skills-header label { font-size:12px; color:var(--text); font-weight:600; }
  .no-skills-label { font-weight:400 !important; color:var(--muted) !important; font-size:11.5px !important; cursor:pointer; }
  .skills-list { max-height:220px; overflow-y:auto; display:flex; flex-direction:column; gap:4px; }
  .skill-item { display:flex; align-items:flex-start; gap:6px; padding:5px 7px; border-radius:5px; cursor:pointer; font-size:11.5px; }
  .skill-item:hover { background:var(--bg-hover); }
  .skill-item input { margin-top:2px; flex-shrink:0; }
  .skill-name { color:var(--text); font-weight:600; white-space:nowrap; }
  .skill-desc { color:var(--muted); font-size:10.5px; line-height:1.4; }
  .skills-list.disabled .skill-item { opacity:0.4; pointer-events:none; }

  /* ===== 中栏：聊天 ===== */
  .chat { display:flex; flex-direction:column; min-height:0; background:var(--bg); }
  .chat-history { flex:1; overflow-y:auto; padding:20px 24px; display:flex; flex-direction:column; gap:14px; }
  .turn { display:flex; flex-direction:column; gap:6px; max-width:85%; }
  .turn.user { align-self:flex-end; align-items:flex-end; }
  .turn.ai { align-self:flex-start; align-items:stretch; }
  .bubble { padding:10px 14px; border-radius:12px; font-size:13.5px; line-height:1.6; word-break:break-word; }
  .turn.user .bubble { background:var(--user); color:#fff; border-bottom-right-radius:4px; }
  .turn.ai .bubble { background:var(--panel); border:1px solid var(--border); border-bottom-left-radius:4px; cursor:pointer; transition:border-color .15s; }
  .turn.ai .bubble:hover { border-color:var(--accent); }
  .turn.ai.selected .bubble { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
  .bubble .meta { font-size:11px; color:var(--muted); margin-bottom:4px; display:flex; gap:10px; align-items:center; }
  .bubble .summary { color:var(--text); }
  .bubble .files-line { font-size:11.5px; color:var(--muted); margin-top:6px; font-family:ui-monospace,Consolas,monospace; }
  .tag-ok { color:var(--ok); } .tag-fail { color:var(--err); }
  .typing { align-self:flex-start; display:flex; gap:4px; padding:12px 16px; }
  .typing span { width:7px; height:7px; border-radius:50%; background:var(--muted); animation:blink 1.2s infinite; }
  .typing span:nth-child(2){ animation-delay:.2s; } .typing span:nth-child(3){ animation-delay:.4s; }
  @keyframes blink { 0%,60%,100%{opacity:.3;} 30%{opacity:1;} }
  .chat-input-area { border-top:1px solid var(--border); padding:12px 16px; background:var(--panel); }
  .chat-input-row { display:flex; gap:10px; align-items:flex-end; }
  .chat-input-row textarea { flex:1; background:#0d0f14; border:1px solid var(--border); color:var(--text); border-radius:8px; padding:10px 12px; font:inherit; resize:none; min-height:44px; max-height:160px; line-height:1.5; }
  .chat-input-row textarea:focus { outline:none; border-color:var(--accent); }
  .send-btn { background:var(--accent); color:#fff; border:0; border-radius:8px; padding:10px 20px; font-size:13px; cursor:pointer; white-space:nowrap; }
  .send-btn:hover { background:var(--accent2); }
  .send-btn:disabled { opacity:.5; cursor:not-allowed; }
  .input-hint { font-size:11px; color:var(--muted); margin-top:6px; }

  /* ===== 右栏：详情 ===== */
  .detail { overflow-y:auto; padding:14px 16px; }
  .detail .empty { color:var(--muted); font-size:13px; padding:20px 0; text-align:center; }
  .detail h3 { margin:0 0 8px; font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
  .plan-block { background:var(--panel); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:14px; font-size:12.5px; }
  .plan-block .row { margin:4px 0; }
  .plan-block .k { color:var(--muted); display:inline-block; min-width:52px; }
  .plan-block .v { color:var(--text); }
  .plan-block b { color:var(--accent); }
  table { width:100%; border-collapse:collapse; margin-top:6px; font-size:12px; }
  td, th { border:1px solid var(--border); padding:4px 7px; text-align:left; }
  th { color:var(--muted); font-weight:500; background:var(--panel2); }
  .file-list { margin-top:6px; }
  .file { padding:7px 10px; border:1px solid var(--border); border-radius:6px; margin-bottom:5px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-size:12px; font-family:ui-monospace,Consolas,monospace; }
  .file:hover { border-color:var(--accent); background:var(--panel); }
  .file .tag { font-size:10px; padding:1px 7px; border-radius:99px; }
  .file .tag.ok { background:#1f3a2b; color:#7fd1a3; }
  .file .tag.fail { background:#3a2020; color:#f0a9a5; }
  .file .tag.hist { background:#2a2d36; color:var(--muted); }
  pre.code { background:#0d0f14; border:1px solid var(--border); border-radius:8px; padding:12px; overflow:auto; max-height:380px; font:11.5px/1.5 ui-monospace,Consolas,monospace; white-space:pre; margin-top:8px; }
  .welcome { text-align:center; padding:40px 20px; color:var(--muted); }
  .welcome .big { font-size:36px; margin-bottom:10px; }
</style>
</head>
<body>
<header>
  <h1>⚙ EmbedForge</h1>
  <span style="color:var(--muted);font-size:12px;">嵌入式 AI 开发 Agent · 多轮对话</span>
  <div class="sess">
    <span id="sessLabel">新会话</span>
    <button class="btn-ghost" id="newSessBtn" style="width:auto;margin:0;padding:4px 12px;">开启新会话</button>
  </div>
</header>
<main>
  <!-- 左栏：配置 -->
  <div class="col">
    <div class="col-title">模型与配置</div>
    <div class="config">
      <label>API 端点（OpenAI 兼容）</label>
      <input id="base" placeholder="https://api.deepseek.com/v1" />
      <label>模型</label>
      <input id="model" placeholder="deepseek-chat" />
      <label>平台（可选，留空自动推断）</label>
      <select id="platform">
        <option value="">自动推断</option>
        <option>stm32</option><option>esp32</option><option>arduino</option><option>pico</option><option>avr</option><option>micropython</option><option>zephyr</option><option>generic-c</option>
      </select>
      <label>API Key（仅本地，不上传）</label>
      <input id="key" type="password" placeholder="sk-..." />

      <label style="margin-top:14px;">附件（数据手册/代码/原理图，可多选）</label>
      <input type="file" id="attachInput" multiple accept=".txt,.md,.c,.h,.cpp,.hpp,.py,.ini,.json,.yaml,.yml,.toml,.cfg,.csv,.log,.ioc,.png,.jpg,.jpeg,.webp,.gif" />
      <div class="att-list" id="attList"></div>
      <div class="hint">文本直接读入上下文；图片按多模态发送（需视觉模型如 gpt-4o/qwen-vl），单张 ≤5MB。</div>

      <button class="btn-ghost" id="clearAttachBtn">清空附件</button>

      <div class="skills-section">
        <div class="skills-header">
          <label>专家技能（勾选启用，小项目可全禁用省 token）</label>
          <label class="no-skills-label"><input type="checkbox" id="noSkills"> 全部禁用</label>
        </div>
        <div id="skillsList" class="skills-list">加载中...</div>
      </div>
    </div>
  </div>

  <!-- 中栏：聊天 -->
  <div class="col chat">
    <div class="chat-history" id="chatHistory">
      <div class="welcome">
        <div class="big">🛠️</div>
        <div style="font-size:15px;color:var(--text);margin-bottom:6px;">描述你的嵌入式开发需求</div>
        <div style="font-size:12.5px;">例如：<i>STM32F103 读 DHT11，I2C OLED 显示</i><br/>生成后可继续说：<i>把 LED 改成 PWM 呼吸灯</i>，AI 会记住当前工程。</div>
      </div>
    </div>
    <div class="chat-input-area">
      <div class="chat-input-row">
        <textarea id="reqInput" placeholder="输入需求，Enter 发送，Shift+Enter 换行…"></textarea>
        <button class="send-btn" id="sendBtn">生成</button>
      </div>
      <div class="input-hint">同一会话内自动保留上下文记忆；点「开启新会话」清空。</div>
    </div>
  </div>

  <!-- 右栏：详情 -->
  <div class="col detail" id="detailCol">
    <div class="empty">点击左侧对话中的 AI 回复，查看该轮的工程规划与文件详情。</div>
  </div>
</main>

<script>
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

var state = {
  sessionId: null,
  turns: [],          // 历史轮次 [{requirement, planSummary, files, at}]
  latestPlan: null,   // 最新一轮完整 plan
  latestResult: null, // 最新一轮完整 result
  selected: -1,       // 选中的轮次索引
  attachments: [],
  sending: false,
};

var historyEl = document.getElementById('chatHistory');
var detailEl = document.getElementById('detailCol');
var reqInput = document.getElementById('reqInput');
var sendBtn = document.getElementById('sendBtn');

// ===== 附件 =====
document.getElementById('attachInput').addEventListener('change', function(e){
  var files = Array.prototype.slice.call(e.target.files || []);
  files.forEach(function(f){
    var isImg = /^image\\//.test(f.type);
    var reader = new FileReader();
    reader.onload = function(){
      state.attachments.push({ name:f.name, kind: isImg ? 'image' : 'text', content: reader.result });
      renderAttachments();
    };
    if (isImg) reader.readAsDataURL(f); else reader.readAsText(f);
  });
  e.target.value = '';
});
document.getElementById('clearAttachBtn').addEventListener('click', function(){ state.attachments=[]; renderAttachments(); });

/* ===== 专家技能加载与选择 ===== */
function loadSkills(){
  fetch('/api/skills').then(function(r){ return r.json(); }).then(function(d){
    var list = document.getElementById('skillsList');
    if(!d.skills || !d.skills.length){ list.innerHTML = '无可用技能'; return; }
    list.innerHTML = '';
    d.skills.forEach(function(sk){
      var label = document.createElement('label');
      label.className = 'skill-item';
      label.innerHTML = '<input type="checkbox" class="skill-cb" value="'+esc(sk.name)+'" checked>'
        + '<div><span class="skill-name">'+esc(sk.name)+'</span>'
        + '<div class="skill-desc">'+esc(sk.description||'')+'</div></div>';
      list.appendChild(label);
    });
  }).catch(function(){ document.getElementById('skillsList').innerHTML = '加载失败'; });
}
document.getElementById('noSkills').addEventListener('change', function(e){
  var list = document.getElementById('skillsList');
  if(e.target.checked){ list.classList.add('disabled'); }
  else { list.classList.remove('disabled'); }
});
loadSkills();

function getSelectedSkills(){
  if(document.getElementById('noSkills').checked) return [];
  var cbs = document.querySelectorAll('.skill-cb:checked');
  var arr = [];
  cbs.forEach(function(cb){ arr.push(cb.value); });
  return arr;
}
function renderAttachments(){
  var el = document.getElementById('attList');
  el.innerHTML = '';
  state.attachments.forEach(function(a, i){
    var div = document.createElement('div');
    div.className = 'att';
    var thumb = a.kind === 'image' ? '<img src="'+a.content+'" alt=""/>' : '';
    div.innerHTML = thumb + '<div class="meta"><div class="n">'+esc(a.name)+'</div><div style="color:var(--muted);font-size:10.5px;">'+(a.kind==='image'?'图片':'文本')+'</div></div>';
    var rm = document.createElement('button');
    rm.className='rm'; rm.textContent='移除';
    rm.addEventListener('click', function(){ state.attachments.splice(i,1); renderAttachments(); });
    div.appendChild(rm);
    el.appendChild(div);
  });
}

// ===== 新会话 =====
document.getElementById('newSessBtn').addEventListener('click', function(){
  if(state.sending) return;
  state.sessionId=null; state.turns=[]; state.latestPlan=null; state.latestResult=null; state.selected=-1;
  document.getElementById('sessLabel').textContent='新会话';
  renderHistory(); renderDetail();
});

// ===== 发送 =====
function send(){
  if(state.sending) return;
  var req = reqInput.value.trim();
  if(!req){ reqInput.focus(); return; }
  state.sending = true;
  sendBtn.disabled = true;
  sendBtn.textContent = '生成中…';
  renderHistory(true); // 显示 typing

  fetch('/api/generate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      requirement: req,
      baseURL: document.getElementById('base').value.trim(),
      model: document.getElementById('model').value.trim(),
      apiKey: document.getElementById('key').value.trim(),
      platform: document.getElementById('platform').value,
      attachments: state.attachments,
      sessionId: state.sessionId,
      skills: getSelectedSkills(),
      noSkills: document.getElementById('noSkills').checked
    })
  }).then(function(r){ return r.json().then(function(d){ return {ok:r.ok, data:d}; }); })
    .then(function(res){
      state.sending = false;
      sendBtn.disabled = false;
      sendBtn.textContent = '生成';
      if(!res.ok){
        alert('生成失败：' + (res.data.error || '未知错误'));
        renderHistory();
        return;
      }
      state.sessionId = res.data.session.id;
      state.turns = res.data.session.turns || [];
      state.latestPlan = res.data.plan;
      state.latestResult = res.data.result;
      state.selected = state.turns.length - 1;
      document.getElementById('sessLabel').innerHTML = '会话 <span class="pill">'+esc(state.sessionId)+'</span> · 第 '+state.turns.length+' 轮';
      reqInput.value = '';
      renderHistory();
      renderDetail();
    })
    .catch(function(e){
      state.sending = false;
      sendBtn.disabled = false;
      sendBtn.textContent = '生成';
      alert('请求异常：' + e.message);
      renderHistory();
    });
}
sendBtn.addEventListener('click', send);
reqInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
});

// ===== 渲染对话历史 =====
function renderHistory(showTyping){
  if(state.turns.length === 0 && !showTyping){
    historyEl.innerHTML = '<div class="welcome"><div class="big">🛠️</div><div style="font-size:15px;color:var(--text);margin-bottom:6px;">描述你的嵌入式开发需求</div><div style="font-size:12.5px;">例如：<i>STM32F103 读 DHT11，I2C OLED 显示</i><br/>生成后可继续说：<i>把 LED 改成 PWM 呼吸灯</i>，AI 会记住当前工程。</div></div>';
    return;
  }
  var html = '';
  state.turns.forEach(function(t, i){
    // 用户消息
    html += '<div class="turn user"><div class="bubble">'+esc(t.requirement)+'</div></div>';
    // AI 消息
    var failCount = 0;
    if(i === state.turns.length-1 && state.latestResult){
      failCount = state.latestResult.failedFiles ? state.latestResult.failedFiles.length : 0;
    }
    var statusTag = failCount > 0
      ? '<span class="tag-fail">'+failCount+' 个文件失败</span>'
      : '<span class="tag-ok">✓ 生成完成</span>';
    var filesLine = (t.files && t.files.length)
      ? '<div class="files-line">📄 ' + t.files.length + ' 个文件：' + esc(t.files.slice(0,3).join(', ')) + (t.files.length>3?' …':'') + '</div>'
      : '';
    html += '<div class="turn ai '+(state.selected===i?'selected':'')+'" data-idx="'+i+'">'
      + '<div class="bubble">'
      + '<div class="meta">第 '+(i+1)+' 轮 · '+statusTag+'</div>'
      + '<div class="summary">'+esc(t.planSummary || '(无规划摘要)')+'</div>'
      + filesLine
      + '</div></div>';
  });
  if(showTyping){
    html += '<div class="typing"><span></span><span></span><span></span></div>';
  }
  historyEl.innerHTML = html;
  // 绑定点击
  historyEl.querySelectorAll('.turn.ai').forEach(function(el){
    el.addEventListener('click', function(){
      state.selected = parseInt(el.getAttribute('data-idx'),10);
      renderHistory(); renderDetail();
    });
  });
  historyEl.scrollTop = historyEl.scrollHeight;
}

// ===== 渲染右栏详情 =====
function renderDetail(){
  if(state.selected < 0 || state.selected >= state.turns.length){
    detailEl.innerHTML = '<div class="empty">点击左侧对话中的 AI 回复，查看该轮的工程规划与文件详情。</div>';
    return;
  }
  var i = state.selected;
  var t = state.turns[i];
  var isLatest = (i === state.turns.length - 1);
  var plan = isLatest ? state.latestPlan : null;
  var result = isLatest ? state.latestResult : null;

  var html = '<h3>工程规划（第 '+(i+1)+' 轮）</h3>';
  if(plan){
    html += '<div class="plan-block">'
      + '<div class="row"><span class="k">工程名</span><span class="v"><b>'+esc(plan.projectName)+'</b></span></div>'
      + '<div class="row"><span class="k">平台</span><span class="v">'+esc(plan.platform)+'</span></div>'
      + '<div class="row"><span class="k">目标</span><span class="v">'+esc(plan.target)+'</span></div>'
      + '<div class="row"><span class="k">简介</span><span class="v">'+esc(plan.summary)+'</span></div>';
    if(plan.modules && plan.modules.length){
      html += '<div class="row"><span class="k">模块</span><span class="v">'+plan.modules.map(esc).join(' / ')+'</span></div>';
    }
    if(plan.pinout && plan.pinout.length){
      html += '<table><tr><th>引脚</th><th>信号</th><th>说明</th></tr>';
      plan.pinout.forEach(function(p){ html += '<tr><td>'+esc(p.pin)+'</td><td>'+esc(p.signal)+'</td><td>'+esc(p.note||'-')+'</td></tr>'; });
      html += '</table>';
    }
    html += '</div>';
  } else {
    html += '<div class="plan-block"><div class="row"><span class="k">摘要</span><span class="v">'+esc(t.planSummary||'-')+'</span></div>'
      + '<div class="row" style="color:var(--muted);font-size:11.5px;margin-top:6px;">（历史轮次仅保存摘要，完整引脚表与文件内容请查看最新一轮）</div></div>';
  }

  // 文件列表
  html += '<h3>生成的文件</h3><div class="file-list">';
  if(result && result.files && result.files.length){
    result.files.forEach(function(f, fi){
      var tag = f.status === 'ok' ? '<span class="tag ok">OK</span>' : '<span class="tag fail">失败</span>';
      html += '<div class="file" data-fi="'+fi+'"><span>'+esc(f.path)+'</span>'+tag+'</div>';
    });
  } else if(t.files && t.files.length){
    t.files.forEach(function(p){
      html += '<div class="file"><span>'+esc(p)+'</span><span class="tag hist">历史</span></div>';
    });
  } else {
    html += '<div style="color:var(--muted);font-size:12.5px;padding:8px 0;">无文件记录</div>';
  }
  html += '</div>';
  html += '<pre class="code" id="codeView" style="display:none;"></pre>';

  detailEl.innerHTML = html;

  // 绑定文件点击（仅最新轮有内容）
  if(result){
    detailEl.querySelectorAll('.file[data-fi]').forEach(function(el){
      el.addEventListener('click', function(){
        var fi = parseInt(el.getAttribute('data-fi'),10);
        var f = result.files[fi];
        var cv = document.getElementById('codeView');
        cv.style.display = 'block';
        cv.textContent = f.status === 'error' ? ('生成失败：' + (f.error || '未知错误')) : (f.content || '(空文件)');
        cv.scrollIntoView({behavior:'smooth', block:'nearest'});
      });
    });
  }
}

// 初始渲染
renderHistory();
</script>
</body>
</html>`;
