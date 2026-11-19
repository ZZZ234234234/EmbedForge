/** EmbedForge Web UI v0.9 — DSH 风格：左项目工程区（会话+文件树） / 中对话 / 右可折叠配置 */
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

  /* ===== 主区域：左项目区 / 中对话 / 右代码 ===== */
  .main{flex:1;display:flex;overflow:hidden;min-height:0;}

  /* 左栏：项目工程区（会话列表 + 工程文件树），常驻 */
  .project-pane{width:250px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;min-width:0;}
  .pane-head{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid var(--border);flex-shrink:0;}
  .pane-head .t{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
  .pane-head .spacer{flex:1;}
  .icon-btn{background:none;border:none;color:var(--muted);cursor:pointer;padding:2px 5px;border-radius:4px;font-size:13px;line-height:1;}
  .icon-btn:hover{background:var(--bg-hover);color:var(--text);}

  .project-scroll{flex:1;overflow-y:auto;min-height:0;}
  .proj-block{border-bottom:1px solid var(--border);}
  .proj-block-head{display:flex;align-items:center;gap:6px;padding:7px 12px;cursor:pointer;user-select:none;}
  .proj-block-head:hover{background:var(--bg-hover);}
  .proj-block-head .name{flex:1;font-size:11.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .proj-block-head .badge{background:var(--bg3);color:var(--accent2);padding:1px 6px;border-radius:8px;font-size:10px;flex-shrink:0;}
  .proj-block-body{padding:0 6px 8px;}
  .proj-block.collapsed .proj-block-body{display:none;}

  /* 会话条目 */
  .sess-item{padding:5px 8px;border-radius:5px;cursor:pointer;font-size:11.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.5;}
  .sess-item:hover{background:var(--bg-hover);color:var(--text);}
  .sess-item.active{background:var(--bg3);color:var(--text);font-weight:600;}
  .sess-item .meta{font-size:10px;color:var(--muted);display:block;}

  /* 工程文件树 */
  .tree-empty{padding:14px 12px;color:var(--muted);font-size:11px;line-height:1.6;}
  .dir-node{padding:4px 8px;font-size:11px;color:var(--accent2);font-weight:600;cursor:pointer;user-select:none;display:flex;align-items:center;gap:5px;}
  .dir-node:hover{background:var(--bg-hover);border-radius:4px;}
  .dir-node .caret{color:var(--muted);font-size:9px;width:8px;flex-shrink:0;}
  .file-node{display:flex;align-items:center;gap:5px;padding:3px 8px 3px 20px;border-radius:4px;cursor:pointer;font-size:11px;color:var(--muted);}
  .file-node:hover{background:var(--bg-hover);color:var(--text);}
  .file-node.active{background:var(--bg3);color:var(--text);}
  .file-node .icon{flex-shrink:0;font-size:10px;}
  .file-node .path{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .file-node .tag{font-size:9px;padding:0 4px;border-radius:6px;flex-shrink:0;}
  .file-node .tag.ok{background:rgba(166,227,161,0.15);color:var(--green);}
  .file-node .tag.fail{background:rgba(243,139,168,0.15);color:var(--red);}

  /* 右栏：配置（可折叠） */
  .sidebar{width:260px;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;transition:width .15s ease;}
  .sidebar.collapsed{width:0;border-left:none;overflow:hidden;}
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
  .chat-history{flex:1;overflow-y:auto;padding:18px 26px;display:flex;flex-direction:column;gap:16px;}
  .welcome{text-align:center;padding:40px 20px;color:var(--muted);}
  .welcome .big{font-size:36px;margin-bottom:10px;}
  .welcome h3{color:var(--text);font-size:15px;margin-bottom:8px;}
  .welcome p{font-size:12.5px;line-height:1.7;}
  .welcome .examples{margin-top:16px;display:flex;flex-direction:column;gap:6px;align-items:center;}
  .welcome .ex{background:var(--bg2);border:1px solid var(--border);padding:6px 14px;border-radius:14px;font-size:11.5px;cursor:pointer;color:var(--accent2);}
  .welcome .ex:hover{border-color:var(--accent);}

  .turn{display:flex;flex-direction:column;gap:4px;max-width:78%;}
  .turn.user{align-self:flex-end;align-items:flex-end;}
  .turn.ai{align-self:flex-start;align-items:flex-start;}
  .bubble{padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.6;word-break:break-word;}
  .turn.user .bubble{background:var(--accent);color:var(--bg2);border-bottom-right-radius:3px;}
  .turn.ai .bubble{background:var(--bg2);border:1px solid var(--border);border-bottom-left-radius:3px;}
  .turn.ai .bubble .meta{font-size:11px;color:var(--muted);margin-bottom:5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .turn.ai .bubble .summary{color:var(--text);}
  .turn .who{font-size:10.5px;color:var(--muted);padding:0 4px;letter-spacing:0.2px;}
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
  .code-head{display:flex;align-items:center;gap:4px;border-bottom:1px solid var(--border);background:var(--bg3);flex-shrink:0;}
  .code-head .tabs-bar{flex:1;border-bottom:none;background:transparent;}
  .code-head .icon-btn{flex-shrink:0;margin-right:6px;font-size:12px;}
  .code-col{width:520px;min-width:280px;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;}
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

  /* ===== 响应式 =====
     优先级：对话区必须始终可读。空间不足时依次收缩侧栏，再把代码面板转为浮层，
     不再挤占对话宽度（早期实现固定宽三栏，1024 下对话区只剩 205px 不可用）。 */
  @media (max-width:1500px){
    .project-pane{width:220px;}
    .sidebar{width:240px;}
    .code-col{width:460px;}
  }
  @media (max-width:1320px){
    .project-pane{width:200px;}
    .sidebar{width:230px;}
    .code-col{width:400px;}
  }
  /* 小于 1180：代码面板改绝对定位浮层，不参与宽度分配 */
  @media (max-width:1180px){
    .main{position:relative;}
    .project-pane{width:190px;}
    .sidebar{width:220px;}
    .code-col{position:absolute;right:0;top:0;bottom:0;width:min(560px,72vw);z-index:30;box-shadow:-8px 0 24px rgba(0,0,0,0.5);border-left:1px solid var(--bg-hover);}
  }
  /* 小于 980：配置面板也改浮层，默认收起 */
  @media (max-width:980px){
    .sidebar{position:absolute;right:0;top:0;bottom:0;z-index:40;box-shadow:-8px 0 24px rgba(0,0,0,0.45);}
    .code-col{width:min(520px,80vw);z-index:35;}
    .turn{max-width:90%;}
  }
  /* 小于 760：项目区改浮层 */
  @media (max-width:760px){
    .project-pane{position:absolute;left:0;top:0;bottom:0;z-index:45;width:220px;box-shadow:8px 0 24px rgba(0,0,0,0.45);}
    .turn{max-width:94%;}
  }

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
  <button class="icon-btn" id="projToggle" title="收起/展开项目区">☰</button>
  <div class="logo">⚡ EmbedForge <span>嵌入式 AI 开发 Agent</span></div>
  <div class="spacer"></div>
  <div class="sess-info" id="sessLabel">新会话</div>
  <button class="btn-mini" id="newSessBtn">＋ 新会话</button>
  <button class="btn-mini" id="cfgToggle" title="模型与附件配置">⚙ 配置</button>
</div>

<!-- 主区域 -->
<div class="main">

  <!-- 左栏：项目工程区（会话 + 文件树） -->
  <div class="project-pane" id="projectPane">
    <div class="pane-head">
      <span class="t">项目工程</span>
      <span class="spacer"></span>
      <button class="icon-btn" id="refreshSessions" title="刷新本地会话">⟳</button>
    </div>
    <div class="project-scroll">
      <div class="proj-block" id="sessBlock">
        <div class="proj-block-head" data-toggle="sessBlock">
          <span class="caret">▾</span>
          <span class="name">本地会话</span>
          <span class="badge" id="sessCount">0</span>
        </div>
        <div class="proj-block-body">
          <div id="sessList"><div class="tree-empty">暂无历史会话</div></div>
        </div>
      </div>
      <div class="proj-block" id="fileBlock">
        <div class="proj-block-head" data-toggle="fileBlock">
          <span class="caret">▾</span>
          <span class="name">工程文件</span>
          <span class="badge" id="fileCount">—</span>
        </div>
        <div class="proj-block-body">
          <div id="fileTreeBody"><div class="tree-empty">生成后显示工程文件结构</div></div>
        </div>
      </div>
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

  <!-- 代码预览（紧贴对话区右侧，点文件后显示） -->
  <div class="code-col" id="codeCol" style="display:none;">
    <div class="code-head">
      <div class="tabs-bar" id="tabsBar"></div>
      <button class="icon-btn" id="closeCodeBtn" title="关闭代码面板">✕</button>
    </div>
    <div class="code-empty" id="codeEmpty">点击左侧文件查看代码内容</div>
    <div class="code-viewer" id="codeViewer" style="display:none;">
      <div class="code-lines" id="codeLines"></div>
      <div class="code-content" id="codeContent"></div>
    </div>
  </div>
  <!-- 最右：配置面板（可折叠） -->
  <div class="sidebar" id="cfgPane">
    <div class="section">
      <div class="section-title">模型配置</div>
      <label>API 端点</label>
      <input id="base" placeholder="https://api.deepseek.com/v1" />
      <label>模型</label>
      <input id="model" placeholder="deepseek-chat" />
      <label>API Key（仅本地）</label>
      <input id="key" type="password" placeholder="sk-..." />
      <label>上下文窗口（token）</label>
      <input id="contextTokens" type="number" min="4000" step="1000" placeholder="128000" />
      <label>平台（留空自动推断）</label>
      <select id="platform">
        <option value="">自动推断</option>
        <option>stm32</option><option>esp32</option><option>arduino</option>
        <option>pico</option><option>avr</option><option>micropython</option>
        <option>zephyr</option><option>generic-c</option>
      </select>
      <label class="no-skills-row"><input type="checkbox" id="verifyChk"> 生成后编译验证（需本地工具链）</label>
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

/* ===== 面板折叠与切换 ===== */
document.getElementById('cfgToggle').addEventListener('click', function(){
  var cfg = document.getElementById('cfgPane');
  var willOpen = cfg.classList.contains('collapsed');
  cfg.classList.toggle('collapsed');
  cfg.dataset.userToggled = '1';
  // 窄屏展开配置时收起代码浮层，保证同一时刻只有一个浮层
  if(willOpen && window.innerWidth <= 1180 && state.openTabs.length){
    state.openTabs = [];
    state.activeTab = null;
    renderTabs();
    renderCode();
  }
});
document.getElementById('projToggle').addEventListener('click', function(){
  var p = document.getElementById('projectPane');
  p.style.display = (p.style.display === 'none') ? 'flex' : 'none';
});

/* 窄屏默认收起配置浮层，避免开屏遮住对话区 */
function applyResponsiveDefaults(){
  var cfg = document.getElementById('cfgPane');
  if(!cfg || cfg.dataset.userToggled) return;
  if(window.innerWidth <= 980) cfg.classList.add('collapsed');
  else cfg.classList.remove('collapsed');
}
/**
 * 窄屏浮层互斥：<=1180 时代码面板与配置面板都是绝对定位浮层，
 * 同时展开会把对话区整个盖住。保证任何时刻至多一个浮层可见。
 */
function enforceSingleOverlay(){
  if(window.innerWidth > 1180) return;
  var cfg = document.getElementById('cfgPane');
  if(!cfg) return;
  if(state.openTabs.length > 0 && !cfg.classList.contains('collapsed')){
    cfg.classList.add('collapsed');
  }
}
function onViewportChange(){
  applyResponsiveDefaults();
  enforceSingleOverlay();
}
window.addEventListener('resize', onViewportChange);
applyResponsiveDefaults();

/* 关闭代码面板（窄屏浮层时尤其需要） */
document.getElementById('closeCodeBtn').addEventListener('click', function(){
  state.openTabs = [];
  state.activeTab = null;
  renderTabs();
  renderCode();
  renderFileTree();
  termLog('已关闭代码面板', 'info');
});

document.addEventListener('click', function(e){
  var head = e.target.closest ? e.target.closest('[data-toggle]') : null;
  if(!head) return;
  var block = document.getElementById(head.getAttribute('data-toggle'));
  if(!block) return;
  block.classList.toggle('collapsed');
  var caret = head.querySelector('.caret');
  if(caret) caret.textContent = block.classList.contains('collapsed') ? '▸' : '▾';
});

/* ===== 本地会话列表 ===== */
/**
 * 加载本地会话列表。
 * 注意：首次在页面刚加载时发出的 fetch 可能拿到空结果（服务端会话目录刚被创建），
 * 因此失败或空结果会按退避重试几次，避免界面一直显示"暂无历史会话"。
 */
var _sessRetry = 0;
function loadSessions(retry){
  retry = retry || 0;
  fetch('/api/sessions', { cache: 'no-store' })
    .then(function(r){
      if(!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d){
      var list = document.getElementById('sessList');
      if(!list) return;
      var arr = (d && d.sessions) || [];
      document.getElementById('sessCount').textContent = arr.length;
      if(!arr.length){
        list.innerHTML = '<div class="tree-empty">暂无历史会话</div>';
        // 首次加载为空时重试一次，排除启动竞态导致的假空
        if(retry < 2){
          setTimeout(function(){ loadSessions(retry + 1); }, 600 * (retry + 1));
        }
        return;
      }
      var html = '';
      arr.forEach(function(s){
        var active = state.sessionId === s.id ? ' active' : '';
        var turns = (s.turns === undefined) ? '' : s.turns + ' 轮';
        var last = s.lastRequirement || s.id;
        var proj = s.projectName ? esc(s.projectName) + ' · ' : '';
        html += '<div class="sess-item'+active+'" data-sid="'+esc(s.id)+'" title="'+esc(proj + last)+'">'
          + esc(last.length > 26 ? last.slice(0,26) + '…' : last)
          + '<span class="meta">'+proj+esc(s.id)+(turns?' · '+turns:'')+'</span></div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.sess-item').forEach(function(el){
        el.addEventListener('click', function(){ resumeSession(el.getAttribute('data-sid')); });
      });
    }).catch(function(err){
      var list = document.getElementById('sessList');
      if(list) list.innerHTML = '<div class="tree-empty">会话列表加载失败：' + esc(err.message) + '</div>';
      if(retry < 2){
        setTimeout(function(){ loadSessions(retry + 1); }, 800 * (retry + 1));
      }
    });
}

/** 续接一个本地会话：拉取历史，恢复对话记录 */
function resumeSession(sid){
  if(state.sending || !sid) return;
  fetch('/api/session?id=' + encodeURIComponent(sid))
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d || d.error){ termLog('会话读取失败: ' + ((d&&d.error)||'未知'), 'warn'); return; }
      state.sessionId = sid;
      // 字段名必须与 renderHistory 读取的一致（requirement / planSummary / files），
      // 否则历史气泡会渲染成 undefined
      state.turns = (d.turns || []).map(function(t){
        return { requirement: t.requirement, planSummary: t.planSummary, files: t.files || [], at: t.at };
      });
      state.latestPlan = null;
      // 用上一轮源码快照恢复文件树，续接后仍可浏览历史工程
      state.latestResult = (d.snapshotFiles && d.snapshotFiles.length)
        ? { files: d.snapshotFiles }
        : null;
      state.selected = state.turns.length - 1;
      state.openTabs = [];
      state.activeTab = null;
      if(d.contextTokens){
        document.getElementById('contextTokens').value = d.contextTokens;
      }
      if(d.lastVerify){
        state.latestResult = state.latestResult || { files: [] };
        state.latestResult.verify = d.lastVerify;
      }
      document.getElementById('sessLabel').innerHTML =
        '会话 <span class="pill">'+esc(sid)+'</span> · 第 '+state.turns.length+' 轮';
      renderHistory(); renderFileTree(); renderTabs(); renderCode(); loadSessions();
      termLog('已恢复会话 ' + sid + '（' + state.turns.length + ' 轮历史'
        + (state.latestResult ? '，含 ' + state.latestResult.files.length + ' 个源码快照' : '') + '）', 'ok');
    })
    .catch(function(){ termLog('会话读取失败', 'warn'); });
}
document.getElementById('refreshSessions').addEventListener('click', function(){
  loadSessions();
  termLog('已刷新会话列表', 'info');
});

/* 首屏加载：等 DOM 就绪后再拉会话与技能，避免启动竞态拿到空列表 */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ loadSessions(); });
} else {
  loadSessions();
}

/* ===== 新会话 ===== */
document.getElementById('newSessBtn').addEventListener('click', function(){
  if(state.sending) return;
  state.sessionId=null; state.turns=[]; state.latestPlan=null; state.latestResult=null;
  state.selected=-1; state.openTabs=[]; state.activeTab=null;
  document.getElementById('sessLabel').textContent='新会话';
  renderFileTree(); renderTabs(); renderCode(); renderHistory(); loadSessions();
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
      contextTokens: Number(document.getElementById('contextTokens').value) || undefined,
      verify: document.getElementById('verifyChk').checked,
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
    html += '<div class="turn user"><div class="who">你 · 第 '+(i+1)+' 轮</div>'
      + '<div class="bubble">'+esc(t.requirement)+'</div></div>';
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
      // 编译验证结果
      var v = r.verify;
      if(v){
        if(!v.attempted){
          stepsHtml += '<div class="step"><span class="icon">🔧</span><span class="label">编译验证</span>'
            + '<span class="detail">未执行：'+esc(v.reason||'工具链不可用')+'</span></div>';
        } else if(v.ok){
          var sz = (v.artifactSize!=null) ? ('，产物 '+v.artifactSize+' 字节') : '';
          stepsHtml += '<div class="step"><span class="icon">✅</span><span class="label">编译验证</span>'
            + '<span class="detail">通过（'+esc(v.command)+'，'+(v.elapsedMs/1000).toFixed(1)+'s'+sz+'）</span>'
            + '<span class="badge ok">PASS</span></div>';
        } else {
          stepsHtml += '<div class="step"><span class="icon">❌</span><span class="label">编译验证</span>'
            + '<span class="detail">失败（'+esc(v.command)+'，退出码 '+v.exitCode+'）</span>'
            + '<span class="badge fail" style="background:rgba(243,139,168,0.15);color:var(--red);">FAIL</span></div>';
          var errLines = String(v.output||'').split(/\r?\n/).filter(function(l){
            return /error|错误|undefined reference|No such file|fatal/i.test(l);
          }).slice(0,6);
          if(errLines.length){
            stepsHtml += '<div class="step-expand" style="display:block;border-color:var(--red);color:var(--red);">'
              + errLines.map(function(l){ return esc(l.trim()); }).join('<br/>') + '</div>';
          }
        }
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
/** 打开文件：显示代码面板（窄屏为浮层，只允许一个浮层可见） */
function openFile(path){
  var result = state.latestResult;
  if(!result || !result.files){
    termLog('当前没有可预览的工程文件：请先续接一个包含工程快照的会话，或重新生成', 'warn');
    return;
  }
  var f = result.files.find(function(x){ return x.path === path; });
  if(!f) return;
  if(f.status !== 'ok' || !f.content){
    termLog('无法预览: ' + path + ' (生成失败或无内容)', 'warn');
    return;
  }
  if(state.openTabs.indexOf(path) < 0) state.openTabs.push(path);
  state.activeTab = path;
  // 窄屏时代码面板是浮层：自动收起配置浮层，避免两层叠加遮住对话
  if(window.innerWidth <= 1180){
    var cfg = document.getElementById('cfgPane');
    if(cfg && !cfg.classList.contains('collapsed')) cfg.classList.add('collapsed');
  }
  document.getElementById('codeCol').style.display = 'flex';
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
  var col = document.getElementById('codeCol');
  var empty = document.getElementById('codeEmpty');
  var viewer = document.getElementById('codeViewer');
  // 没有打开任何标签时整体隐藏代码面板，把宽度让给对话区
  if(!state.openTabs.length){
    col.style.display = 'none';
    return;
  }
  col.style.display = 'flex';
  if(!state.activeTab){
    empty.style.display = 'flex';
    viewer.style.display = 'none';
    return;
  }
  var result = state.latestResult;
  var f = result && result.files ? result.files.find(function(x){ return x.path === state.activeTab; }) : null;
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

/**
 * C 源码高亮（一次性分词，不链式替换）。
 *
 * 早期实现是对已插入 <span> 的整段文本反复跑正则，后一轮会命中前一轮插入的标签属性，
 * 例如把注释结束符吃成带标签属性的乱码。这里改为先扫描切 token，
 * 再对普通代码片段做关键字替换，注释/字符串内部不再二次处理。
 */
var C_KEYWORDS = ['void','int','char','float','double','unsigned','signed','short','long','uint8_t','uint16_t','uint32_t','uint64_t','int8_t','int16_t','int32_t','size_t','bool','static','const','volatile','extern','inline','struct','union','enum','typedef','return','if','else','for','while','switch','case','default','break','continue','do','goto','sizeof','NULL','true','false'];
var C_TYPES = ['GPIO_InitTypeDef','TIM_HandleTypeDef','I2C_HandleTypeDef','SPI_HandleTypeDef','UART_HandleTypeDef','USART_HandleTypeDef','ADC_HandleTypeDef','DMA_HandleTypeDef','DHT11_HandleTypeDef','SSD1306_HandleTypeDef','Button_HandleTypeDef','LedPwm_HandleTypeDef','GPIO_PinState','HAL_StatusTypeDef','GPIO_TypeDef','IRQn_Type'];

function highlightPlain(seg){
  // 只处理纯代码片段：先转义，再套标签，顺序固定，互不干扰
  var s = esc(seg);
  // 预处理指令（行首 #include / #define ...）
  s = s.replace(/(^\\s*#\\s*\\w+)/gm, '<span class="pre">$1</span>');
  // 数字
  s = s.replace(/\\b(0[xX][0-9a-fA-F]+|\\d+(?:\\.\\d+)?(?:[uUlLfF]+)?)\\b/g, '<span class="num">$1</span>');
  // 类型（先于关键字，避免被关键字规则切开）
  var parts = s.split(/(<span class="(?:pre|num|com|str)">[\\s\\S]*?<\\/span>)/);
  for (var i = 0; i < parts.length; i += 2) {
    var chunk = parts[i];
    if (!chunk) continue;
    C_TYPES.forEach(function(t){
      chunk = chunk.replace(new RegExp('\\\\b' + t + '\\\\b', 'g'), '<span class="type">' + t + '</span>');
    });
    C_KEYWORDS.forEach(function(kw){
      // 跳过已被 type 包住的内容：用占位保护
      chunk = chunk.replace(new RegExp('\\\\b' + kw + '\\\\b', 'g'), '<span class="kw">' + kw + '</span>');
    });
    parts[i] = chunk;
  }
  return parts.join('');
}

function highlightC(code){
  var out = '';
  var i = 0;
  var n = code.length;
  while (i < n) {
    // 块注释
    if (code[i] === '/' && code[i + 1] === '*') {
      var endB = code.indexOf('*/', i + 2);
      endB = (endB < 0) ? n : endB + 2;
      out += '<span class="com">' + esc(code.slice(i, endB)) + '</span>';
      i = endB;
      continue;
    }
    // 行注释
    if (code[i] === '/' && code[i + 1] === '/') {
      var endL = code.indexOf('\\n', i);
      if (endL < 0) endL = n;
      out += '<span class="com">' + esc(code.slice(i, endL)) + '</span>';
      i = endL;
      continue;
    }
    // 字符串 / 字符字面量
    if (code[i] === '"' || code[i] === "'") {
      var q = code[i];
      var j = i + 1;
      while (j < n) {
        if (code[j] === '\\\\') { j += 2; continue; }
        if (code[j] === q) { j++; break; }
        j++;
      }
      out += '<span class="str">' + esc(code.slice(i, j)) + '</span>';
      i = j;
      continue;
    }
    // 普通代码：累积到下一个特殊起点
    var k = i;
    while (k < n) {
      var two = code.substr(k, 2);
      if (two === '/*' || two === '//') break;
      if (code[k] === '"' || code[k] === "'") break;
      k++;
    }
    out += highlightPlain(code.slice(i, k));
    i = k;
  }
  return out;
}

// 暴露给 onclick
window.openFile = openFile;
window.closeTab = closeTab;

termLog('EmbedForge Web Agent 已就绪', 'ok');
termLog('提示: 填写 API Key 后输入需求即可生成工程；生成的文件可在右侧预览', 'info');
</script>
</body>
</html>`;
