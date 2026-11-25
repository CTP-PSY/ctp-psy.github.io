(function(){
  "use strict";

  /* ---------- Theme: all 52 CTPVerse Dashboard themes ---------- */
  var themeSelect = document.getElementById('themeSelect');
  var THEME_KEY = 'ctp-psy-theme';
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', themeSelect.value);
    try{ localStorage.setItem(THEME_KEY, themeSelect.value); }catch(e){}
  }
  var currentTheme = document.documentElement.getAttribute('data-theme');
  if(currentTheme){
    for(var i=0;i<themeSelect.options.length;i++){
      if(themeSelect.options[i].value===currentTheme){ themeSelect.value=currentTheme; break; }
    }
  }
  themeSelect.addEventListener('change', applyTheme);
  themeSelect.addEventListener('input', applyTheme);

  /* ---------- Width: Nuke / Full toggle button, left of the theme picker —
     the head bootstrap already applied the width (?width= param, then the
     shared ctp-width key), so this only syncs the button and toggles. ---------- */
  var widthBtn = document.getElementById('widthToggle');
  function syncWidthBtn(){
    var isFull = document.documentElement.getAttribute('data-width') === 'full';
    widthBtn.textContent = isFull ? 'WIDTH: Full' : 'WIDTH: Nuke';
    widthBtn.setAttribute('aria-pressed', isFull ? 'true' : 'false');
  }
  syncWidthBtn();
  widthBtn.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-width') || 'nuke';
    var next = current === 'full' ? 'nuke' : 'full';
    document.documentElement.setAttribute('data-width', next);
    try{ localStorage.setItem('ctp-width', next); }catch(e){}
    syncWidthBtn();
  });

  /* ---------- Internal channel data ----------
     One internal data source drives the left menu, the Radio Wall and
     the player. It is not displayed on the page. */
  var DIRECTORY = {
    network: "CTP-PSY",
    description: "Global psytrance community portal — psytrance only",
    channels: [
      { id:"ctp-01", name:"Psytrancelicious", genre:"Psytrance / Techno-Spiritual",
        stream_url:"https://stream.laut.fm/psytrancelicious", format:"audio/mpeg",
        laut_slug:"psytrancelicious",
        blurb:"The portal's flagship psytrance channel — continuous techno-spiritual radio." },
      { id:"ctp-02", name:"Full-On Psy", genre:"Full-On / Peak-time",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Full-on drive at peak time — the dancefloor at full power." },
      { id:"ctp-03", name:"Progressive Psy", genre:"Progressive / Hypnotic",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Progressive psytrance — long builds, hypnotic grooves, deep flow." },
      { id:"ctp-04", name:"Darkpsy & Forest", genre:"Darkpsy / Forest",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Night-time frequencies — darkpsy and forest for the deep hours." },
      { id:"ctp-05", name:"Goa Classics", genre:"Goa / Old-school",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Goa trance roots — the old-school sound that started it all." },
      { id:"ctp-06", name:"Psybient & Chill", genre:"Psybient / Downtempo",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Psybient drift — downtempo for the chill-out and the come-down." },
      { id:"ctp-07", name:"Hi-Tech", genre:"Hi-Tech / Twilight",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Hi-tech pressure — fast, twisted twilight frequencies." },
      { id:"ctp-08", name:"Twilight Psy", genre:"Twilight / Night",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Twilight zone — the edge between full-on and dark." },
      { id:"ctp-09", name:"Suomi & Zenonesque", genre:"Suomi / Zenonesque",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Suomi freeform and zenonesque — the freakier end of the spectrum." },
      { id:"ctp-10", name:"Sunrise & Morning", genre:"Morning / Sunrise",
        stream_url:"", format:"audio/mpeg", laut_slug:"",
        blurb:"Morning psytrance — sunrise sounds for the hours after the night." }
    ]
  };

  function byId(id){ return document.getElementById(id); }
  function channelById(id){
    for (var i=0;i<DIRECTORY.channels.length;i++) if (DIRECTORY.channels[i].id===id) return DIRECTORY.channels[i];
    return null;
  }

  /* ---------- Build the left channel menu ---------- */
  var chanMenu = byId('chanMenu');
  DIRECTORY.channels.forEach(function(ch){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chan-btn'; b.dataset.channel = ch.id;
    b.setAttribute('aria-label', 'Load ' + ch.name + ' into the player');
    var dot = document.createElement('span');
    dot.className = ch.stream_url ? 'live-dot' : 'pend-dot'; dot.setAttribute('aria-hidden','true');
    var txt = document.createElement('span');
    var nm = document.createElement('span'); nm.className='nm'; nm.textContent = ch.name;
    var gn = document.createElement('span'); gn.className='gn'; gn.textContent = ch.genre;
    txt.appendChild(nm); txt.appendChild(gn);
    b.appendChild(dot); b.appendChild(txt);
    b.addEventListener('click', function(){ loadChannel(ch.id, true); });
    chanMenu.appendChild(b);
  });

  /* ---------- Build the Radio Wall ---------- */
  var wall = byId('chanWall');
  DIRECTORY.channels.forEach(function(ch){
    var card = document.createElement('button');
    card.type = 'button'; card.className = 'chan-card'; card.dataset.channel = ch.id;
    card.setAttribute('aria-label', 'Open the player for ' + ch.name);
    var cn = document.createElement('span'); cn.className='cn'; cn.textContent = ch.name;
    var cg = document.createElement('span'); cg.className='cg'; cg.textContent = ch.genre;
    var cb = document.createElement('span'); cb.className='cg'; cb.textContent = ch.blurb;
    var cs = document.createElement('span');
    cs.className = 'cs ' + (ch.stream_url ? 'cs-live' : 'cs-pend');
    cs.textContent = ch.stream_url ? '● Live stream — open player' : '○ Coming soon';
    card.appendChild(cn); card.appendChild(cg); card.appendChild(cb); card.appendChild(cs);
    card.addEventListener('click', function(){ loadChannel(ch.id, true); });
    wall.appendChild(card);
  });

  /* ---------- The player is the CTP Music module (laut.fm widget) ----------
     The old custom <audio> player is gone — one player only. Clicking a
     channel in the left menu, the Radio Wall, or a Listen Live button
     switches the widget to that channel's laut.fm station (if it has one)
     and scrolls the module into view. Channels with no stream yet do
     nothing but highlight. */
  function loadChannel(id, autoplay){
    var ch = channelById(id);
    if (!ch) return;
    var nodes = document.querySelectorAll('[data-channel]');
    for (var i=0;i<nodes.length;i++) nodes[i].classList.toggle('active', nodes[i].dataset.channel === id);
    if (ch.laut_slug && window.CTPMusicLoad){
      window.CTPMusicLoad(ch.laut_slug);
      var mod = document.getElementById('ctp-music');
      if (mod) mod.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }

  /* Listen Live / featured buttons */
  var jump = document.querySelectorAll('[data-play-channel]');
  for (var j=0;j<jump.length;j++){
    jump[j].addEventListener('click', function(){ loadChannel(this.dataset.playChannel, true); });
  }

  /* ---------- Community poll (this session only) ---------- */
  var pollCounts = { "Full-On":0, "Progressive":0, "Darkpsy":0, "Goa":0, "Forest":0, "Hi-Tech":0 };
  var voted = false;
  byId('pollForm').addEventListener('submit', function(e){
    e.preventDefault();
    var msg = byId('pollMsg');
    var sel = document.querySelector('input[name="subgenre"]:checked');
    if (!sel){ msg.textContent = 'Pick a subgenre first.'; return; }
    if (voted){ msg.textContent = 'You already voted in this session.'; return; }
    voted = true;
    pollCounts[sel.value] += 1;
    var total = 0, k;
    for (k in pollCounts) total += pollCounts[k];
    var res = byId('pollResults');
    res.innerHTML = ''; res.hidden = false;
    for (k in pollCounts){
      var pct = total ? Math.round(pollCounts[k] / total * 100) : 0;
      var row = document.createElement('div'); row.className = 'poll-row';
      var head = document.createElement('div'); head.className = 'pr-head';
      var name = document.createElement('span'); name.textContent = k + (sel.value === k ? ' — your vote' : '');
      var pc = document.createElement('span'); pc.textContent = pct + '%';
      head.appendChild(name); head.appendChild(pc);
      var bar = document.createElement('div'); bar.className = 'poll-bar';
      var fill = document.createElement('i'); fill.style.width = pct + '%';
      bar.appendChild(fill);
      row.appendChild(head); row.appendChild(bar);
      res.appendChild(row);
    }
    msg.textContent = 'Vote counted — thanks.';
    var inputs = document.querySelectorAll('input[name="subgenre"]');
    for (var i=0;i<inputs.length;i++) inputs[i].disabled = true;
  });

})();
