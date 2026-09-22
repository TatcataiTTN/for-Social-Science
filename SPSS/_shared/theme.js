// Theme switcher (dark/light/pink/blue/green). Không backend — chỉ lưu lựa chọn
// trong localStorage của trình duyệt người xem (per-viewer, không đồng bộ giữa thiết bị).
(function(){
  function apply(theme){
    if(!theme || theme === 'dark'){ document.documentElement.removeAttribute('data-theme'); theme = 'dark'; }
    else { document.documentElement.setAttribute('data-theme', theme); }
    document.querySelectorAll('.theme-menu button').forEach(function(b){
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }
  function current(){
    try { return localStorage.getItem('spss-theme') || 'dark'; } catch(e){ return 'dark'; }
  }
  window.setSiteTheme = function(theme){
    try { localStorage.setItem('spss-theme', theme); } catch(e){}
    apply(theme);
    document.querySelectorAll('.themesw[open]').forEach(function(d){ d.removeAttribute('open'); });
  };
  function init(){
    apply(current());
    document.querySelectorAll('.theme-menu button').forEach(function(b){
      b.addEventListener('click', function(){ window.setSiteTheme(b.dataset.theme); });
    });
    document.addEventListener('click', function(e){
      document.querySelectorAll('.themesw[open]').forEach(function(d){
        if(!d.contains(e.target)) d.removeAttribute('open');
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
