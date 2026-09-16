/** EmbedForge Web UI v0.7 — ZCode 风格 Agent 界面：左配置 / 中对话 / 右代码预览 / 底部终端 */
export const UI_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EmbedForge — 嵌入式 AI 开发 Agent</title>
<style>
  :root{
    --bg:#1e1e2e; --bg2:#181825; --bg3:#313244; --bg-hover:#45475a;
    --text:#cdd6f4; --muted:#7f849c; --border:#313244;
    --accent:#89b4fa; --accent2:#74c7ec; --green:#a6e3a1; --red:#f38ba8;
    --yellow:#f9e2af; --purple:#cba6f7; --orange:#fab387;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);height:100vh;display:flex;flex-direction:column;overflow:hidden;font-size:13px;}

  /* ===== 顶栏 ===== */
  .topbar{height:42px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 14px;gap:12px;flex-shrink:0;}
  .topbar .logo{font-weight:700;font-size:15px;color:var(--accent);letter-spacing:0.3px;}
  .topbar .logo span{color:var(--muted);font-weight:400;font-size:11px;margin-left:6px;}
  .topbar .spacer{flex:1;}
  .topbar .sess-info{font-size:11.5px;color:var(--muted);}
  .topbar .sess-info .pill{background:var(--bg3);color:var(--accent2);padding:2px 8px;border-radius:10px;font-size:10.5px;margin:0 4px;}
  .btn-mini{background:transparent;border:1px solid var(--border);color:var(--muted);padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11.5px;}
  .btn-mini:hover{border-color:var(--accent);color:var(--text);}

  /* ===== 主区域三栏 ===== */
  .main{flex:1;display:flex;overflow:hidden;min-height:0;}

  /* 左栏：配置 */
  .sidebar{width:260px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
  .sidebar .section{padding:12px 14px;border-bottom:1px solid var(--border);}
  .sidebar .section-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;}
  .sidebar label{display:block;font-size:11.5px;color:var(--muted);margin:6px 0 3px;}
  .sidebar input,.sidebar select{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:6px 8px;border-radius:5px;font-size:12px;outline:none;}
  .sidebar input:focus,.sidebar select:focus{border-color:var(--accent);}
  .sidebar input[type=file]{padding:4px;font-size:11px;color:var(--muted);}
  .att-list{margin-top:6px;display:flex;flex-direction:column;gap:4px;}
  .att{display:flex;align-items:center;gap:6px;background:var(--bg);padding:4px 8px;border-radius:4px;font-size:11px;}
  .att .n{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .att .rm{background:none;border:none;color:var(--red);cursor:pointer;font-size:11px;padding:0 2px;}
  .hint{font-size:10.5px;color:var(--muted);margin-top:6px;line-height:1.5;}

  /* Skills */
  .skills-list{max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;margin-top:4px;}
  .skill-item{display:flex;align-items:flex-start;gap:6px;padding:4px 6px;border-radius:4px;cursor:pointer;font-size:11px;}
  .skill-item:hover{background:var(--bg-hover);}
  .skill-item input{margin-top:2px;flex-shrink:0;width:auto;}
  .skill-name{color:var(--text);font-weight:600;font-size:11px;}
  .skill-desc{color:var(--muted);font-size:10px;line-height:1.3;margin-top:1px;}
  .skills-list.disabled .skill-item{opacity:0.35;pointer-events:none;}
  .no-skills-row{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:11px;color:var(--yellow);cursor:pointer;}

  /* ===== 中栏：对话 ===== */
  .chat-col{flex:1;display:flex;flex-direction:column;min-width:0;background:var(--bg);}
  .chat-history{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;}
  .welcome{text-align:center;padding:40px 20px;color:var(--muted);}
  .welcome .big{font-size:36px;margin-bottom:10px;}
  .welcome h3{color:var(--text);font-size:15px;margin-bottom:8px;}
  .welcome p{font-size:12.5px;line-height:1.7;}
  .welcome .examples{margin-top:16px;display:flex;flex-direction:column;gap:6px;align-items:center;}
  .welcome .ex{background:var(--bg2);border:1px solid var(--border);padding:6px 14px;border-radius:14px;font-size:11.5px;cursor:pointer;color:var(--accent2);}
  .welcome .ex:hover{border-color:var(--accent);}

  .turn{display:flex;flex-direction:column;gap:4px;max-width:85%;}
  .turn.user{align-self:flex-end;align-items:flex-end;}
  .turn.ai{align-self:flex-start;align-items:flex-start;}
  .bubble{padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.6;word-break:break-word;}
  .turn.user .bubble{background:var(--accent);color:var(--bg2);border-bottom-right-radius:3px;}
  .turn.ai .bubble{background:var(--bg2);border:1px solid var(--border);border-bottom-left-radius:3px;}
  .turn.ai .bubble .meta{font-size:11px;color:var(--muted);margin-bottom:4px;}
  .turn.ai .bubble .summary{color:var(--text);}
  .tag-ok{color:var(--green);font-weight:600;}
  .tag-fail{color:var(--red);font-weight:600;}

  /* 工具调用步骤卡片 */
  .steps{margin-top:8px;display:flex;flex-direction:column;gap:4px;}
  .step{display:flex;align-items:center;gap:8px;font-size:11.5px;padding:5px 10px;background:var(--bg);border-radius:6px;border:1px solid var(--border);cursor:pointer;}
  .step:hover{border-color:var(--accent);}
  .step .icon{font-size:13px;flex-shrink:0;}
  .step .label{color:var(--text);font-weight:600;flex-shrink:0;}
  .step .detail{color:var(--muted);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .step .badge{background:var(--bg3);color:var(--accent2);padding:1px 7px;border-radius:8px;font-size:10px;flex-shrink:0;}
  .step .badge.ok{color:var(--green);}
  .step .badge.fail{color:var(--red);}
  .step-expand{display:none;font-size:11px;color:var(--muted);padding:6px 10px;background:var(--bg);border-radius:0 0 6px 6px;margin-top:-4px;border:1px solid var(--border);border-top:none;line-height:1.6;}
  .step-expand.open{display:block;}

  .typing{display:flex;gap:4px;padding:10px 14px;}
  .typing span{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:blink 1.2s infinite;}
  .typing span:nth-child(2){animation-delay:0.2s;}
  .typing span:nth-child(3){animation-delay:0.4s;}
  @keyframes blink{0%,60%,100%{opacity:0.3;}30%{opacity:1;}}

  /* 输入区 */
  .chat-input-area{padding:12px 20px 14px;border-top:1px solid var(--border);background:var(--bg2);flex-shrink:0;}
  .chat-input-row{display:flex;gap:8px;align-items:flex-end;}
  .chat-input-row textarea{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:9px 12px;border-radius:8px;font-size:13px;font-family:inherit;resize:none;outline:none;min-height:42px;max-height:120px;line-height:1.5;}
  .chat-input-row textarea:focus{border-color:var(--accent);}
  .send-btn{background:var(--accent);color:var(--bg2);border:none;padding:9px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;flex-shrink:0;}
  .send-btn:hover{background:var(--accent2);}
  .send-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .input-hint{font-size:10.5px;color:var(--muted);margin-top:5px;}

  /* ===== 右栏：文件树 + 代码预览 ===== */
  .code-col{width:420px;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;min-width:0;}
  .file-tree{max-height:35%;overflow-y:auto;border-bottom:1px solid var(--border);flex-shrink:0;}
  .file-tree-header{padding:8px 12px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;background:var(--bg2);position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;}
  .file-tree-header .count{color:var(--accent2);font-weight:400;}
  .file-node{padding:4px 12px 4px 12px;font-size:11.5px;cursor:pointer;display:flex;align-items:center;gap:6px;}
  .file-node:hover{background:var(--bg-hover);}
  .file-node.active{background:var(--bg3);}
  .file-node .icon{flex-shrink:0;font-size:12px;}
  .file-node .path{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Consolas','Monaco',monospace;font-size:11px;}
  .file-node .tag{font-size:9.5px;padding:1px 6px;border-radius:8px;flex-shrink:0;}
  .file-node .tag.ok{background:rgba(166,227,161,0.15);color:var(--green);}
  .file-node .tag.fail{background:rgba(243,139,168,0.15);color:var(--red);}
  .file-node .tag.tpl{background:rgba(137,180,250,0.15);color:var(--accent);}
  .dir-node{padding:4px 12px;font-size:11px;color:var(--muted);font-weight:600;display:flex;align-items:center;gap:5px;}

  /* 代码预览标签页 */
  .tabs-bar{display:flex;align-items:center;background:var(--bg);border-bottom:1px solid var(--border);overflow-x:auto;flex-shrink:0;min-height:32px;}
  .tab{display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:11.5px;cursor:pointer;border-right:1px solid var(--border);white-space:nowrap;color:var(--muted);font-family:'Consolas','Monaco',monospace;}
  .tab:hover{background:var(--bg-hover);}
  .tab.active{background:var(--bg2);color:var(--text);border-bottom:2px solid var(--accent);}
  .tab .close{color:var(--muted);font-size:13px;padding:0 2px;border-radius:3px;}
  .tab .close:hover{color:var(--red);background:var(--bg-hover);}
  .code-empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12.5px;text-align:center;padding:20px;}
  .code-viewer{flex:1;overflow:auto;display:flex;font-family:'Consolas','Monaco','Courier New',monospace;font-size:12px;line-height:1.6;min-height:0;}
  .code-lines{padding:10px 0;color:var(--muted);text-align:right;user-select:none;flex-shrink:0;border-right:1px solid var(--border);background:var(--bg);}
  .code-lines div{padding:0 10px;min-width:36px;}
  .code-content{padding:10px 14px;white-space:pre;flex:1;color:var(--text);overflow-x:auto;}
  .code-content .kw{color:var(--purple);}
  .code-content .type{color:var(--accent);}
  .code-content .str{color:var(--green);}
  .code-content .num{color:var(--orange);}
  .code-content .com{color:var(--muted);font-style:italic;}
  .code-content .pre{color:var(--yellow);}

  /* ===== 底部终端 ===== */
  .terminal{background:var(--bg2);border-top:1px solid var(--border);flex-shrink:0;transition:height 0.2s;}
  .terminal-header{padding:6px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;font-size:11.5px;color:var(--muted);border-bottom:1px solid var(--border);}
  .terminal-header:hover{color:var(--text);}
  .terminal-header .title{font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:0.5px;font-size:11px;}
  .terminal-header .spacer{flex:1;}
  .terminal-header .clear-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:11px;padding:2px 6px;border-radius:4px;}
  .terminal-header .clear-btn:hover{color:var(--red);}
  .terminal-body{height:140px;overflow-y:auto;padding:8px 14px;font-family:'Consolas','Monaco',monospace;font-size:11.5px;line-height:1.7;}
  .terminal-body.collapsed{display:none;}
  .term-line{display:flex;gap:8px;align-items:baseline;}
  .term-time{color:var(--muted);font-size:10px;flex-shrink:0;}
  .term-tag{padding:1px 7px;border-radius:8px;font-size:10px;font-weight:600;flex-shrink:0;}
  .term-tag.info{background:rgba(137,180,250,0.15);color:var(--accent);}
  .term-tag.ok{background:rgba(166,227,161,0.15);color:var(--green);}
  .term-tag.warn{background:rgba(249,226,175,0.15);color:var(--yellow);}
  .term-tag.err{background:rgba(243,139,168,0.15);color:var(--red);}
  .term-msg{color:var(--text);word-break:break-word;}
  .term-msg.muted{color:var(--muted);}

  /* 滚动条 */
  ::-webkit-scrollbar{width:8px;height:8px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:var(--bg-hover);}
</style>
</head>
<body>

<!-- 顶栏 -->
<div class="topbar">
  <div class="logo">⚡ EmbedForge <span>嵌入式 AI 开发 Agent</span></div>
  <div class="spacer"></div>
  <div class="sess-info" id="sessLabel">新会话</div>
  <button class="btn-mini" id="newSessBtn">＋ 新会话</button>
</div>

<!-- 主区域 -->
<div class="main">

  <!-- 左栏：配置 -->
  <div class="sidebar">
    <div class="section">
      <div class="section-title">模型配置</div>
      <label>API 端点</label>
      <input id="base" placeholder="https://api.deepseek.com/v1" />
      <label>模型</label>
      <input id="model" placeholder="deepseek-chat" />
      <label>API Key（仅本地）</label>
      <input id="key" type="password" placeholder="sk-..." />
      <label>平台（留空自动推断）</label>
      <select id="platform">
        <option value="">自动推断</option>
        <option>stm32</option><option>esp32</option><option>arduino</option>
        <option>pico</option><option>avr</option><option>micropython</option>
        <option>zephyr</option><option>generic-c</option>
      </select>
      <label>构建系统（STM32 支持四种）</label>
      <select id="buildSystem">
        <option value="make">Makefile (arm-none-eabi-gcc)</option>
        <option value="cmake">CMake</option>
        <option value="keil">Keil MDK (.uvprojx)</option>
        <option value="platformio">PlatformIO</option>
      </select>
    </div>

    <div class="section">
      <div class="section-title">附件</div>
      <input type="file" id="attachInput" multiple accept=".txt,.md,.c,.h,.cpp,.hpp,.py,.ini,.json,.yaml,.yml,.toml,.cfg,.csv,.log,.ioc,.png,.jpg,.jpeg,.webp,.gif" />
      <div class="att-list" id="attList"></div>
      <div class="hint">文本读入上下文；图片按多模态发送（需视觉模型），单张 ≤5MB。</div>
    </div>

    <div class="section">
      <div class="section-title">专家技能</div>
      <label class="no-skills-row"><input type="checkbox" id="noSkills"> 全部禁用（小项目省 token）</label>
      <div class="skills-list" id="skillsList">加载中...</div>
    </div>
  </div>

  <!-- 中栏：对话 -->
  <div class="chat-col">
    <div class="chat-history" id="chatHistory">
      <div class="welcome">
        <div class="big">🛠️</div>
        <h3>描述你的嵌入式开发需求</h3>
        <p>AI 会自动规划工程、生成代码、审查并写入文件。<br/>生成后可继续说迭代需求，AI 会记住当前工程。</p>
        <div class="examples">
          <div class="ex" data-ex="STM32F103 读 DHT11 温湿度，I2C OLED 显示，按键切换页面">📋 STM32 DHT11 + OLED + 按键</div>
          <div class="ex" data-ex="ESP32 连接 WiFi，通过 MQTT 上报传感器数据">📡 ESP32 WiFi + MQTT</div>
          <div class="ex" data-ex="Arduino Uno 控制舵机，超声波测距，超过距离报警">🤖 Arduino 舵机 + 超声波</div>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <div class="chat-input-row">
        <textarea id="reqInput" placeholder="输入需求，Enter 发送，Shift+Enter 换行…"></textarea>
        <button class="send-btn" id="sendBtn">生成</button>
      </div>
      <div class="input-hint">同一会话自动保留上下文记忆；骨架+驱动已模板化，AI 仅生成应用层代码。</div>
    </div>
  </div>

  <!-- 右栏：文件树 + 代码预览 -->
  <div class="code-col">
    <div class="file-tree">
      <div class="file-tree-header">工程文件 <span class="count" id="fileCount">—</span></div>
      <div id="fileTreeBody"><div style="padding:16px 12px;color:var(--muted);font-size:11.5px;">生成后显示工程文件结构</div></div>
    </div>
    <div class="tabs-bar" id="tabsBar"></div>
    <div class="code-empty" id="codeEmpty">点击左侧文件查看代码内容</div>
    <div class="code-viewer" id="codeViewer" style="display:none;">
      <div class="code-lines" id="codeLines"></div>
      <div class="code-content" id="codeContent"></div>
    </div>
  </div>
</div>

<!-- 底部终端 -->
<div class="terminal" id="terminal">
  <div class="terminal-header" id="termHeader">
    <span class="title">▸ 终端日志</span>
    <span id="termCount" style="color:var(--muted);font-size:10.5px;">0 条</span>
    <div class="spacer"></div>
    <button class="clear-btn" id="termClear">清空</button>
  </div>
  <div class="terminal-body" id="termBody"></div>
</div>

<script>
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

var state = {
  sessionId: null,
  turns: [],
  latestPlan: null,
  latestResult: null,
  selected: -1,
  attachments: [],
  sending: false,
  openTabs: [],      // 已打开的文件路径
  activeTab: null,   // 当前激活的文件路径
};

var historyEl = document.getElementById('chatHistory');
var reqInput = document.getElementById('reqInput');
var sendBtn = document.getElementById('sendBtn');

/* ===== 终端日志 ===== */
var termBody = document.getElementById('termBody');
var termCount = 0;
function termLog(msg, tag){
  tag = tag || 'info';
  var now = new Date();
  var t = now.toTimeString().slice(0,8);
  var div = document.createElement('div');
  div.className = 'term-line';
  div.innerHTML = '<span class="term-time">'+t+'</span><span class="term-tag '+tag+'">'+tag.toUpperCase()+'</span><span class="term-msg">'+esc(msg)+'</span>';
  termBody.appendChild(div);
  termCount++;
  document.getElementById('termCount').textContent = termCount + ' 条';
  termBody.scrollTop = termBody.scrollHeight;
}
document.getElementById('termHeader').addEventListener('click', function(e){
  if(e.target.id === 'termClear') return;
  termBody.classList.toggle('collapsed');
});
document.getElementById('termClear').addEventListener('click', function(e){
  e.stopPropagation();
  termBody.innerHTML = '';
  termCount = 0;
  document.getElementById('termCount').textContent = '0 条';
});

/* ===== 附件 ===== */
document.getElementById('attachInput').addEventListener('change', function(e){
  var files = Array.prototype.slice.call(e.target.files || []);
  files.forEach(function(f){
    var isImg = /^image\\//.test(f.type);
    var reader = new FileReader();
    reader.onload = function(){
      state.attachments.push({ name:f.name, kind: isImg ? 'image' : 'text', content: reader.result });
      renderAttachments();
      termLog('附件已加载: ' + f.name + ' (' + (isImg?'图片':'文本') + ')', 'info');
    };
    if(isImg) reader.readAsDataURL(f); else reader.readAsText(f);
  });
  e.target.value = '';
});
function renderAttachments(){
  var el = document.getElementById('attList');
  el.innerHTML = '';
  state.attachments.forEach(function(a, i){
    var div = document.createElement('div');
    div.className = 'att';
    div.innerHTML = '<div class="n">'+esc(a.name)+'</div>';
    var rm = document.createElement('button');
    rm.className='rm'; rm.textContent='×';
    rm.addEventListener('click', function(){ state.attachments.splice(i,1); renderAttachments(); });
    div.appendChild(rm);
    el.appendChild(div);
  });
}

/* ===== 专家技能 ===== */
function loadSkills(){
  fetch('/api/skills').then(function(r){ return r.json(); }).then(function(d){
    var list = document.getElementById('skillsList');
    if(!d.skills || !d.skills.length){ list.innerHTML = '<div style="padding:6px;color:var(--muted);font-size:11px;">无可用技能</div>'; return; }
    list.innerHTML = '';
    d.skills.forEach(function(sk){
      var label = document.createElement('label');
      label.className = 'skill-item';
      label.innerHTML = '<input type="checkbox" class="skill-cb" value="'+esc(sk.name)+'" checked>'
        + '<div><span class="skill-name">'+esc(sk.name)+'</span>'
        + '<div class="skill-desc">'+esc(sk.description||'')+'</div></div>';
      list.appendChild(label);
    });
  }).catch(function(){ document.getElementById('skillsList').innerHTML = '<div style="padding:6px;color:var(--red);font-size:11px;">加载失败</div>'; });
}
document.getElementById('noSkills').addEventListener('change', function(e){
  var list = document.getElementById('skillsList');
  if(e.target.checked){ list.classList.add('disabled'); termLog('已禁用所有专家技能', 'warn'); }
  else { list.classList.remove('disabled'); termLog('已启用专家技能自动匹配', 'info'); }
});
loadSkills();
function getSelectedSkills(){
  if(document.getElementById('noSkills').checked) return [];
  var cbs = document.querySelectorAll('.skill-cb:checked');
  var arr = [];
  cbs.forEach(function(cb){ arr.push(cb.value); });
  return arr;
}

/* ===== 新会话 ===== */
document.getElementById('newSessBtn').addEventListener('click', function(){
  if(state.sending) return;
  state.sessionId=null; state.turns=[]; state.latestPlan=null; state.latestResult=null;
  state.selected=-1; state.openTabs=[]; state.activeTab=null;
  document.getElementById('sessLabel').textContent='新会话';
  renderFileTree(); renderTabs(); renderHistory();
  termLog('已开启新会话', 'info');
});

/* ===== 示例点击 ===== */
document.addEventListener('click', function(e){
  if(e.target.classList.contains('ex')){
    reqInput.value = e.target.getAttribute('data-ex');
    reqInput.focus();
  }
});

/* ===== 发送 ===== */
function send(){
  if(state.sending) return;
  var req = reqInput.value.trim();
  if(!req){ reqInput.focus(); return; }
  state.sending = true;
  sendBtn.disabled = true;
  sendBtn.textContent = '生成中…';
  renderHistory(true);
  termLog('收到需求: ' + req, 'info');

  fetch('/api/generate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      requirement: req,
      baseURL: document.getElementById('base').value.trim(),
      model: document.getElementById('model').value.trim(),
      apiKey: document.getElementById('key').value.trim(),
      platform: document.getElementById('platform').value,
      buildSystem: document.getElementById('buildSystem').value,
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
        termLog('生成失败: ' + (res.data.error || '未知错误'), 'err');
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

      // 终端输出步骤
      var plan = res.data.plan;
      var result = res.data.result;
      termLog('规划完成: ' + plan.projectName + ' (' + plan.platform + ' / ' + plan.target + ')', 'ok');
      termLog('文件生成: 模板骨架 ' + result.skeletonCount + ' 个 + AI 生成 ' + result.aiGeneratedCount + ' 个', 'ok');
      if(result.failedFiles && result.failedFiles.length){
        result.failedFiles.forEach(function(f){ termLog('文件失败: ' + f.path + ' - ' + (f.error||'未知'), 'err'); });
      }
      if(res.data.review){
        var rv = res.data.review;
        if(rv.issues && rv.issues.length){
          termLog('代码审查: 发现 ' + rv.issues.length + ' 个问题，自动修复 ' + (rv.fixedFiles?rv.fixedFiles.length:0) + ' 个文件', 'warn');
        } else {
          termLog('代码审查: 未发现问题', 'ok');
        }
      }
      termLog('工程已写入: ./generated/' + plan.projectName, 'ok');

      renderHistory();
      renderFileTree();
      // 自动打开第一个 AI 生成的文件
      if(result.files && result.files.length){
        var firstAi = result.files.find(function(f){ return f.status === 'ok' && f.content && f.path.indexOf('Core/Src/app') >= 0; });
        if(firstAi) openFile(firstAi.path);
      }
    })
    .catch(function(e){
      state.sending = false;
      sendBtn.disabled = false;
      sendBtn.textContent = '生成';
      termLog('请求异常: ' + e.message, 'err');
      alert('请求异常：' + e.message);
      renderHistory();
    });
}
sendBtn.addEventListener('click', send);
reqInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
});

/* ===== 渲染对话历史 ===== */
function renderHistory(showTyping){
  if(state.turns.length === 0 && !showTyping){
    historyEl.innerHTML = '<div class="welcome"><div class="big">🛠️</div><h3>描述你的嵌入式开发需求</h3><p>AI 会自动规划工程、生成代码、审查并写入文件。<br/>生成后可继续说迭代需求，AI 会记住当前工程。</p><div class="examples"><div class="ex" data-ex="STM32F103 读 DHT11 温湿度，I2C OLED 显示，按键切换页面">📋 STM32 DHT11 + OLED + 按键</div><div class="ex" data-ex="ESP32 连接 WiFi，通过 MQTT 上报传感器数据">📡 ESP32 WiFi + MQTT</div><div class="ex" data-ex="Arduino Uno 控制舵机，超声波测距，超过距离报警">🤖 Arduino 舵机 + 超声波</div></div></div>';
    return;
  }
  var html = '';
  state.turns.forEach(function(t, i){
    html += '<div class="turn user"><div class="bubble">'+esc(t.requirement)+'</div></div>';
    var failCount = 0;
    if(i === state.turns.length-1 && state.latestResult){
      failCount = state.latestResult.failedFiles ? state.latestResult.failedFiles.length : 0;
    }
    var statusTag = failCount > 0
      ? '<span class="tag-fail">✗ '+failCount+' 个文件失败</span>'
      : '<span class="tag-ok">✓ 生成完成</span>';

    // 工具调用步骤卡片
    var stepsHtml = '';
    if(i === state.turns.length-1 && state.latestPlan && state.latestResult){
      var p = state.latestPlan, r = state.latestResult;
      var drv = (p.drivers && p.drivers.length) ? p.drivers.join(', ') : '无';
      stepsHtml = '<div class="steps">'
        + '<div class="step" onclick="this.nextElementSibling.classList.toggle(\\'open\\')"><span class="icon">📋</span><span class="label">规划</span><span class="detail">'+esc(p.projectName)+' · '+esc(p.platform)+' · '+esc(p.target)+'</span></div>'
        + '<div class="step-expand">简介: '+esc(p.summary)+'<br/>模块: '+esc((p.modules||[]).join(' / '))+'<br/>外设驱动: '+esc(drv)+'<br/>AI 生成文件: '+esc((p.files||[]).join(', '))+'</div>'
        + '<div class="step" onclick="this.nextElementSibling.classList.toggle(\\'open\\')"><span class="icon">📄</span><span class="label">生成</span><span class="detail">模板 '+r.skeletonCount+' + AI '+r.aiGeneratedCount+' 个</span><span class="badge ok">'+r.files.length+' 总文件</span></div>'
        + '<div class="step-expand">骨架模板（不调 LLM）: '+r.skeletonCount+' 个<br/>AI 生成（调 LLM）: '+r.aiGeneratedCount+' 个<br/>失败: '+(r.failedFiles?r.failedFiles.length:0)+' 个</div>';
      if(r.failedFiles && r.failedFiles.length){
        r.failedFiles.forEach(function(f){
          stepsHtml += '<div class="step-expand" style="display:block;border-color:var(--red);color:var(--red);">✗ '+esc(f.path)+': '+esc(f.error||'未知')+'</div>';
        });
      }
      stepsHtml += '</div>';
    }

    html += '<div class="turn ai"><div class="bubble">'
      + '<div class="meta">第 '+(i+1)+' 轮 · '+statusTag+'</div>'
      + '<div class="summary">'+esc(t.planSummary || '(无规划摘要)')+'</div>'
      + stepsHtml
      + '</div></div>';
  });
  if(showTyping){
    html += '<div class="turn ai"><div class="typing"><span></span><span></span><span></span></div></div>';
  }
  historyEl.innerHTML = html;
  historyEl.scrollTop = historyEl.scrollHeight;
}

/* ===== 文件树 ===== */
function renderFileTree(){
  var body = document.getElementById('fileTreeBody');
  var result = state.latestResult;
  if(!result || !result.files || !result.files.length){
    body.innerHTML = '<div style="padding:16px 12px;color:var(--muted);font-size:11.5px;">生成后显示工程文件结构</div>';
    document.getElementById('fileCount').textContent = '—';
    return;
  }
  document.getElementById('fileCount').textContent = result.files.length + ' 个';

  // 按目录分组
  var dirs = {};
  result.files.forEach(function(f){
    var parts = f.path.split('/');
    var dir = parts.length > 1 ? parts.slice(0,-1).join('/') : '(根)';
    if(!dirs[dir]) dirs[dir] = [];
    dirs[dir].push(f);
  });

  var html = '';
  Object.keys(dirs).sort().forEach(function(dir){
    html += '<div class="dir-node">📁 '+esc(dir)+'</div>';
    dirs[dir].forEach(function(f){
      var icon = /\\.(c|cpp)$/.test(f.path) ? '🔧' : /\\.h$/.test(f.path) ? '📐' : /\\.(md|txt)$/.test(f.path) ? '📝' : /Makefile|\\.mk$/.test(f.path) ? '⚙️' : /\\.ld$/.test(f.path) ? '🔗' : /\\.s$/.test(f.path) ? '📜' : '📄';
      var tag = f.status === 'ok' ? '<span class="tag ok">OK</span>' : '<span class="tag fail">失败</span>';
      var isActive = state.activeTab === f.path ? ' active' : '';
      var fname = f.path.split('/').pop();
      html += '<div class="file-node'+isActive+'" data-path="'+esc(f.path)+'">'
        + '<span class="icon">'+icon+'</span>'
        + '<span class="path" title="'+esc(f.path)+'">'+esc(fname)+'</span>'
        + tag + '</div>';
    });
  });
  body.innerHTML = html;

  // 绑定点击
  body.querySelectorAll('.file-node').forEach(function(el){
    el.addEventListener('click', function(){
      openFile(el.getAttribute('data-path'));
    });
  });
}

/* ===== 代码预览标签页 ===== */
function openFile(path){
  var result = state.latestResult;
  if(!result || !result.files) return;
  var f = result.files.find(function(x){ return x.path === path; });
  if(!f) return;
  if(f.status !== 'ok' || !f.content){
    termLog('无法预览: ' + path + ' (生成失败或无内容)', 'warn');
    return;
  }
  if(state.openTabs.indexOf(path) < 0) state.openTabs.push(path);
  state.activeTab = path;
  renderTabs();
  renderCode();
  renderFileTree();
}

function closeTab(path, e){
  e.stopPropagation();
  var idx = state.openTabs.indexOf(path);
  if(idx >= 0) state.openTabs.splice(idx,1);
  if(state.activeTab === path){
    state.activeTab = state.openTabs.length ? state.openTabs[state.openTabs.length-1] : null;
  }
  renderTabs();
  renderCode();
  renderFileTree();
}

function renderTabs(){
  var bar = document.getElementById('tabsBar');
  if(!state.openTabs.length){
    bar.innerHTML = '';
    return;
  }
  var html = '';
  state.openTabs.forEach(function(path){
    var fname = path.split('/').pop();
    var isActive = state.activeTab === path ? ' active' : '';
    html += '<div class="tab'+isActive+'" data-path="'+esc(path)+'">'
      + '<span>'+esc(fname)+'</span>'
      + '<span class="close" onclick="closeTab(\\''+esc(path)+'\\', event)">×</span>'
      + '</div>';
  });
  bar.innerHTML = html;
  bar.querySelectorAll('.tab').forEach(function(el){
    el.addEventListener('click', function(){
      state.activeTab = el.getAttribute('data-path');
      renderTabs(); renderCode(); renderFileTree();
    });
  });
}

function renderCode(){
  var empty = document.getElementById('codeEmpty');
  var viewer = document.getElementById('codeViewer');
  if(!state.activeTab){
    empty.style.display = 'flex';
    viewer.style.display = 'none';
    return;
  }
  var result = state.latestResult;
  var f = result.files.find(function(x){ return x.path === state.activeTab; });
  if(!f || !f.content){
    empty.style.display = 'flex';
    viewer.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  viewer.style.display = 'flex';

  var lines = f.content.split('\\n');
  var lineHtml = '';
  for(var i=1;i<=lines.length;i++){ lineHtml += '<div>'+i+'</div>'; }
  document.getElementById('codeLines').innerHTML = lineHtml;

  // 简单 C 语法高亮
  var highlighted = highlightC(f.content);
  document.getElementById('codeContent').innerHTML = highlighted;
}

/* 简单 C 语法高亮 */
function highlightC(code){
  var escaped = esc(code);
  // 注释
  escaped = escaped.replace(/(\\/\\/[^\\n]*)/g, '<span class="com">$1</span>');
  escaped = escaped.replace(/(\\/\\*[\\s\\S]*?\\*\\/)/g, '<span class="com">$1</span>');
  // 字符串
  escaped = escaped.replace(/("[^"\\n]*")/g, '<span class="str">$1</span>');
  // 预处理
  escaped = escaped.replace(/(^#\\w+)/gm, '<span class="pre">$1</span>');
  // 关键字
  var kws = ['void','int','char','float','double','uint8_t','uint16_t','uint32_t','int8_t','int16_t','int32_t','static','const','volatile','extern','inline','struct','enum','typedef','return','if','else','for','while','switch','case','break','continue','default','do','sizeof','NULL','true','false','bool'];
  kws.forEach(function(kw){
    var re = new RegExp('\\\\b'+kw+'\\\\b','g');
    escaped = escaped.replace(re, '<span class="kw">'+kw+'</span>');
  });
  // 类型
  var types = ['GPIO_InitTypeDef','TIM_HandleTypeDef','I2C_HandleTypeDef','SPI_HandleTypeDef','UART_HandleTypeDef','DHT11_HandleTypeDef','SSD1306_HandleTypeDef','Button_HandleTypeDef','LedPwm_HandleTypeDef','GPIO_PinState','HAL_StatusTypeDef'];
  types.forEach(function(t){
    var re = new RegExp('\\\\b'+t+'\\\\b','g');
    escaped = escaped.replace(re, '<span class="type">'+t+'</span>');
  });
  // 数字
  escaped = escaped.replace(/\\b(0x[0-9a-fA-F]+|\\d+\\.?\\d*(?:UL|u|l|f)?)\\b/g, '<span class="num">$1</span>');
  return escaped;
}

// 暴露给 onclick
window.openFile = openFile;
window.closeTab = closeTab;

termLog('EmbedForge Web Agent 已就绪', 'ok');
termLog('提示: 填写 API Key 后输入需求即可生成工程；生成的文件可在右侧预览', 'info');
</script>
</body>
</html>`;
