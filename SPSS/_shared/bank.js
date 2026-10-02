/* Ngân hàng câu hỏi: lọc theo chủ đề/nguồn, phân trang, chấm ngay + giải thích,
   làm lại từng câu/toàn bộ, xáo trộn, tiến độ lưu localStorage (riêng máy người học, không gửi server). */
(function(){
var root=document.getElementById('bank');if(!root)return;
var D=JSON.parse(document.getElementById('bank-data').textContent);
var KEY='bank:'+D.module;
var state={ans:{},topic:'all',origin:'all',page:0,onlyWrong:false,order:D.items.map(function(_,i){return i}),size:12};
try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.ans)state.ans=s.ans}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify({ans:state.ans}))}catch(e){}}
var topics=[];D.items.forEach(function(i){if(topics.indexOf(i.topic)<0)topics.push(i.topic)});
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!==undefined)e.textContent=txt;return e}
function stats(){var n=D.items.length,a=0,c=0;D.items.forEach(function(it){var v=state.ans[it.id];if(v!==undefined){a++;if(v===it.correct)c++}});return {n:n,a:a,c:c}}
function filtered(){return state.order.map(function(i){return D.items[i]}).filter(function(it){
  if(state.origin!=='all'&&it.origin!==state.origin)return false;if(state.topic!=='all'&&it.topic!==state.topic)return false;
  if(state.onlyWrong){var v=state.ans[it.id];return v!==undefined&&v!==it.correct}return true})}
function render(){
  root.innerHTML='';var st=stats();
  var top=el('div','sim');top.innerHTML='<div class="simh">📚 Ngân hàng câu hỏi — '+D.moduleTitle+'</div>';
  var row=el('div','row');
  function sel(lbl,opts,val,cb){var l=el('label');l.appendChild(document.createTextNode(lbl+' '));var s=el('select');opts.forEach(function(o){var op=el('option',null,o[1]);op.value=o[0];if(o[0]===val)op.selected=true;s.appendChild(op)});s.onchange=function(){cb(s.value)};l.appendChild(s);row.appendChild(l)}
  sel('Nguồn:',[['all','Tất cả'],['goc','Câu gốc/kiểm chứng ('+D.items.filter(function(i){return i.origin==='goc'}).length+')'],['bo_sung','Bổ sung mới ('+D.items.filter(function(i){return i.origin!=='goc'}).length+')']],state.origin,function(v){state.origin=v;state.page=0;render()});
  sel('Chủ đề:',[['all','Tất cả ('+D.items.length+')']].concat(topics.map(function(t){return [t,t+' ('+D.items.filter(function(i){return i.topic===t}).length+')']})),state.topic,function(v){state.topic=v;state.page=0;render()});
  var lw=el('label');var cb=el('input');cb.type='checkbox';cb.checked=state.onlyWrong;cb.onchange=function(){state.onlyWrong=cb.checked;state.page=0;render()};lw.appendChild(cb);lw.appendChild(document.createTextNode(' chỉ câu đã làm sai'));row.appendChild(lw);
  top.appendChild(row);
  var row2=el('div','row');
  var b1=el('button','btn alt','🔀 Xáo trộn thứ tự');b1.type='button';b1.onclick=function(){var o=state.order.slice();for(var i=o.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=o[i];o[i]=o[j];o[j]=t}state.order=o;state.page=0;render()};
  var b3=el('button','btn alt','⟲ Về thứ tự gốc');b3.type='button';b3.onclick=function(){state.order=D.items.map(function(_,i){return i});state.page=0;render()};
  var b2=el('button','btn','↺ Làm lại toàn bộ (xoá kết quả đã lưu)');b2.type='button';b2.onclick=function(){if(confirm('Xoá toàn bộ kết quả đã làm trong ngân hàng này và làm lại từ đầu?')){state.ans={};save();state.page=0;render()}};
  row2.appendChild(b1);row2.appendChild(b3);row2.appendChild(b2);top.appendChild(row2);
  var p=el('div','quiz-score','Tiến độ: đã làm '+st.a+'/'+st.n+' câu · đúng '+st.c+' · sai '+(st.a-st.c)+(st.a?' · tỉ lệ đúng '+Math.round(100*st.c/st.a)+'%':''));top.appendChild(p);
  root.appendChild(top);
  renderList();
}
function renderList(){
  var list=filtered(),pages=Math.max(1,Math.ceil(list.length/state.size));if(state.page>=pages)state.page=pages-1;
  var info=el('p','cap','Hiển thị '+list.length+' câu — trang '+(state.page+1)+'/'+pages);root.appendChild(info);
  list.slice(state.page*state.size,(state.page+1)*state.size).forEach(function(it){
    var box=el('div','qitem');box.id=it.id;
    var head=el('div');head.innerHTML='<span class="tag">'+it.id+'</span><span class="tag">'+it.topic+'</span>';box.appendChild(head);
    var sr=el('div',null,(it.origin==='goc'?'📎 ':'➕ Bổ sung · ')+it.src);sr.style.fontSize='.78rem';sr.style.color='var(--muted)';sr.style.margin='4px 0';box.appendChild(sr);
    var t=el('div',null,it.q);t.style.fontWeight='700';t.style.margin='6px 0';box.appendChild(t);
    var ex=el('div','explain');var chosen=state.ans[it.id];
    function showResult(c){
      var opts=box.querySelectorAll('.opt');[].forEach.call(opts,function(o){o.dataset.done='1'});
      opts[c].classList.add(c===it.correct?'correct':'wrong');if(c!==it.correct)opts[it.correct].classList.add('correct');
      ex.innerHTML='';var h=el('div',null,c===it.correct?'✅ Chính xác!':'❌ Chưa đúng.');h.style.fontWeight='800';ex.appendChild(h);ex.appendChild(document.createTextNode(it.explain));ex.classList.add('show')
    }
    it.opts.forEach(function(o,oi){var b=el('button','opt',o);b.type='button';b.onclick=function(){if(b.dataset.done)return;state.ans[it.id]=oi;save();showResult(oi);refreshStats()};box.appendChild(b)});
    box.appendChild(ex);
    var rb=el('button','btn alt','↺ Làm lại câu này');rb.type='button';rb.style.marginTop='8px';rb.onclick=function(){delete state.ans[it.id];save();render()};box.appendChild(rb);
    root.appendChild(box);
    if(chosen!==undefined)showResult(chosen);
  });
  var nav=el('div','row');
  var pv=el('button','btn alt','◀ Trang trước');pv.type='button';pv.disabled=state.page===0;pv.onclick=function(){state.page--;render();window.scrollTo(0,0)};
  var nx=el('button','btn alt','Trang sau ▶');nx.type='button';nx.disabled=state.page>=pages-1;nx.onclick=function(){state.page++;render();window.scrollTo(0,0)};
  nav.appendChild(pv);nav.appendChild(nx);root.appendChild(nav);
}
function refreshStats(){var st=stats();var p=root.querySelector('.quiz-score');if(p)p.textContent='Tiến độ: đã làm '+st.a+'/'+st.n+' câu · đúng '+st.c+' · sai '+(st.a-st.c)+(st.a?' · tỉ lệ đúng '+Math.round(100*st.c/st.a)+'%':'')}
render();
})();
