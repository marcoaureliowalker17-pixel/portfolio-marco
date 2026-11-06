/* PORTFÓLIO MARCO — CONFIGURAÇÕES EDITÁVEIS */
const CONFIG = {
  instagram: '', // Exemplo: 'https://www.instagram.com/seu_perfil/'
  behance: '',   // Exemplo: 'https://www.behance.net/seu_perfil'
  email: '',     // Exemplo: 'seuemail@dominio.com'
  whatsapp: ''   // Exemplo: '5545999999999' (somente números, com DDI)
};

const PROJECTS = {
  revenda: {
    title: 'Revenda de Crédito | Edição para redes sociais',
    meta: 'Vídeo comercial • 3min25s • 1080 × 1920 (9:16) • 60 fps',
    description: 'Trabalho de edição de vídeo vertical para comunicação comercial nas redes sociais. Apresentação direta e legendas com palavras-chave destacadas para facilitar a leitura e reforçar a mensagem.',
    tags: ['Social media', 'Vídeo vertical', 'Legendas', 'Conteúdo comercial'],
    link: 'https://www.instagram.com/p/DehSM8RNq4f/',
    player: 'instagram'
  },
  gameplay: {
    title: 'AQUELE TRIO CRIMINOSO! ft. Piople e Cafeína | Gameplay',
    meta: 'Gameplay • League of Legends • 8min07s • 1280 × 720 (16:9)',
    description: 'Gameplay de League of Legends para meu próprio canal, com Piople e Cafeína. Um projeto de vídeo de entretenimento com momentos da partida, participação dos amigos e edição voltada ao público gamer.',
    tags: ['Gameplay', 'League of Legends', 'YouTube', 'Canal próprio'],
    link: 'videos/aquele-trio-criminoso.mp4',
    poster: 'assets/trio-criminoso.webp',
    player: 'local'
  },
  youtube: {
    title: 'Projeto para YouTube | Portfólio de edição',
    meta: 'Projeto audiovisual • YouTube',
    description: 'Projeto de edição para YouTube incluído na seleção de trabalhos do portfólio. Para evitar bloqueios de incorporação da plataforma, esta página exibe a thumbnail oficial do vídeo com acesso direto ao conteúdo original.',
    tags: ['YouTube', 'Edição de vídeo', 'Audiovisual'],
    link: 'https://www.youtube.com/watch?v=YpMTyFLAQr8',
    poster: 'assets/youtube.webp',
    player: 'external'
  }
};

function showToast(message) {
  let el=document.querySelector('.status-toast');
  if(!el){el=document.createElement('div');el.className='status-toast';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=message;el.hidden=false;
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout=setTimeout(()=>{el.hidden=true},3000);
}

function initMobileMenu(){
  const btn=document.querySelector('.menu-toggle'); const side=document.querySelector('.sidebar');
  if(!btn||!side)return;
  btn.addEventListener('click',()=>{const next=!side.classList.contains('open');side.classList.toggle('open',next);btn.setAttribute('aria-expanded',String(next))});
  side.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{side.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
  document.addEventListener('click',ev=>{if(!side.contains(ev.target)&&!btn.contains(ev.target)){side.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
}

function initHome(){
  const tabs=document.querySelectorAll('[data-tab]'); const cards=document.querySelectorAll('.video-card'); const chips=document.querySelectorAll('[data-filter]');
  const counter=document.getElementById('section-count');const title=document.getElementById('section-title');const empty=document.getElementById('no-results');
  let selectedFilter='todos';
  const sections={inicio:'Destaques',videos:'Vídeos',shorts:'Shorts',gameplays:'Gameplays'};
  function apply(){
    const raw=decodeURIComponent(location.hash.replace('#',''));
    const tab=sections[raw]?raw:'videos';
    tabs.forEach(a=>{const active=a.dataset.tab===tab;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    document.querySelectorAll('[data-menu]').forEach(a=>a.classList.toggle('active',a.dataset.menu===tab));
    title.textContent=sections[tab];let shown=0,works=0;
    cards.forEach(card=>{
      const cats=card.dataset.category.split(' ');const matchesTab=tab==='inicio'||tab==='videos'||tab==='shorts'&&cats.includes('shorts')||tab==='gameplays'&&cats.includes('gameplays');
      const matchesFilter=selectedFilter==='todos'||cats.includes(selectedFilter);
      const isVisible=matchesTab&&matchesFilter;
      card.hidden=!isVisible;if(isVisible){shown++;if(card.dataset.published==='true')works++}
    });
    empty.hidden=shown!==0;counter.textContent=works===1?'1 trabalho':works+' trabalhos';
  }
  chips.forEach(chip=>chip.addEventListener('click',()=>{selectedFilter=chip.dataset.filter;chips.forEach(c=>{const active=c===chip;c.classList.toggle('active',active);c.setAttribute('aria-pressed',String(active))});apply()}));
  document.querySelectorAll('.reset-filters').forEach(b=>b.addEventListener('click',()=>{selectedFilter='todos';chips.forEach(c=>{const active=c.dataset.filter==='todos';c.classList.toggle('active',active);c.setAttribute('aria-pressed',String(active))});if(location.hash==='#gameplays')location.hash='#videos';else apply()}));
  window.addEventListener('hashchange',()=>{selectedFilter='todos';chips.forEach(c=>{const active=c.dataset.filter==='todos';c.classList.toggle('active',active);c.setAttribute('aria-pressed',String(active))});apply()});
  apply();
}

function initWatch(){
  const params=new URLSearchParams(location.search); const id=params.get('projeto')||'revenda';const item=PROJECTS[id];
  if(!item){document.getElementById('watch-title').textContent='Projeto não encontrado';document.getElementById('player-container').textContent='Volte ao canal para escolher um trabalho.';return;}
  document.title=item.title+' — Marco de Pantufas';document.getElementById('watch-title').textContent=item.title;document.getElementById('watch-meta').textContent=item.meta;
  document.getElementById('watch-description-text').textContent=item.description;
  const link=document.getElementById('external-video');link.href=item.link;
  const tags=document.getElementById('watch-tags');item.tags.forEach(t=>{const el=document.createElement('span');el.textContent=t;tags.appendChild(el)});
  const area=document.getElementById('player-container');area.textContent='';
  if(item.player==='local'){
    area.classList.add('local');
    const player=document.createElement('video');
    player.controls=true;player.preload='metadata';player.playsInline=true;
    player.poster=item.poster;player.setAttribute('aria-label',item.title);
    const source=document.createElement('source');source.src=item.link;source.type='video/mp4';
    player.appendChild(source);area.appendChild(player);
    link.textContent='Baixar vídeo em MP4 ↓';link.removeAttribute('target');
    link.setAttribute('download','AQUELE TRIO CRIMINOSO - Piople e Cafeína.mp4');
    const note=document.createElement('p');note.className='player-fallback';
    note.textContent='Reprodução diretamente do arquivo do portfólio. Se preferir, use o botão para baixar o MP4.';
    area.appendChild(note);
  }else if(item.player==='external'){
    area.classList.add('external');
    const cover=document.createElement('a');
    cover.href=item.link;cover.target='_blank';cover.rel='noopener noreferrer';cover.className='external-poster';cover.setAttribute('aria-label','Abrir vídeo original no YouTube');
    const img=document.createElement('img');img.src=item.poster;img.alt=item.title;
    const overlay=document.createElement('span');overlay.className='external-overlay';overlay.innerHTML='<span class="external-play">▶</span><span class="external-text">Assistir no YouTube</span>';
    cover.append(img,overlay);area.appendChild(cover);
    const note=document.createElement('p');note.className='player-fallback';
    note.innerHTML='Este projeto abre diretamente no YouTube para evitar erros de incorporação do player.';
    area.appendChild(note);
  }else{
    const frame=document.createElement('iframe');frame.setAttribute('allowfullscreen','');frame.setAttribute('loading','lazy');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    area.classList.add('vertical');frame.src='https://www.instagram.com/p/DehSM8RNq4f/embed/';frame.title='Revenda de Crédito no Instagram';frame.setAttribute('allow','fullscreen; picture-in-picture');
    area.appendChild(frame);
    const note=document.createElement('p');note.className='player-fallback';note.append('Se a plataforma bloquear o player, ');
    const original=document.createElement('a');original.href=item.link;original.target='_blank';original.rel='noopener noreferrer';original.textContent='assista ao vídeo original ↗';note.appendChild(original);area.appendChild(note);
  }
}

function initAbout(){
  const grid=document.getElementById('contact-grid');
  const defs=[
    {label:'Instagram',icon:'◎',key:'instagram',hint:'Adicionar link do Instagram'},
    {label:'Behance',icon:'Bē',key:'behance',hint:'Adicionar link do Behance'},
    {label:'E-mail',icon:'✉',key:'email',hint:'Adicionar e-mail profissional'},
    {label:'WhatsApp',icon:'◉',key:'whatsapp',hint:'Adicionar número de WhatsApp'}
  ];
  defs.forEach(d=>{
    const value=CONFIG[d.key].trim();const href=d.key==='email'?'mailto:'+value:d.key==='whatsapp'?'https://wa.me/'+value.replace(/\D/g,''):value;
    const a=document.createElement(value?'a':'div');a.className='contact-item'+(value?'':' unconfigured');
    if(value){a.href=href;if(d.key!=='email'){a.target='_blank';a.rel='noopener noreferrer'}}
    const icon=document.createElement('span');icon.className='contact-icon';icon.textContent=d.icon;
    const copy=document.createElement('span');copy.className='contact-text';const strong=document.createElement('strong');strong.textContent=d.label;
    const small=document.createElement('small');small.textContent=value||(d.hint+' (configurar)');copy.append(strong,small);a.append(icon,copy);grid.appendChild(a)
  });
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
    const val=b.dataset.copy;
    try{await navigator.clipboard.writeText(val);showToast('Nome de perfil copiado: '+val)}
    catch(e){showToast('Nome de perfil: '+val)}
  }));
}

initMobileMenu();
if(document.body.dataset.page==='home')initHome();
if(document.body.dataset.page==='project')initWatch();
if(document.body.dataset.page==='about')initAbout();
