/* Bộ mô phỏng thống kê tương tác, chạy 100% trong trình duyệt (không backend).
   Mỗi widget: <div class="sim" data-sim="tên"></div>. Công thức/thuật toán kiểm chứng độc lập
   bằng scipy.stats trước khi dùng (xem ghi chú trong build_log) — không gõ tay giá trị p-value. */
(function(){
'use strict';
function el(tag,attrs,html){var e=document.createElement(tag);if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);if(html!==undefined)e.innerHTML=html;return e}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function frame(root,title,body){root.innerHTML='<div class="simh">🧮 '+title+'</div>'+body}
function $(root,sel){return root.querySelector(sel)}
function nums(s){return s.split(/[\s,;\t\n]+/).map(function(x){return x.trim()}).filter(Boolean).map(function(x){return parseFloat(x.replace(',','.'))}).filter(function(x){return !isNaN(x)})}
function fnum(x,d){d=d===undefined?4:d;return (Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString()}
function tbl(head,rows){return '<table class="t"><tr>'+head.map(function(h){return '<th>'+h+'</th>'}).join('')+'</tr>'+rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+x+'</td>'}).join('')+'</tr>'}).join('')+'</table>'}

// --- Thống kê cốt lõi, kiểm chứng độc lập bằng scipy.stats.pearsonr (khớp tới 12 chữ số) ---
function mean(a){return a.reduce(function(s,x){return s+x},0)/a.length}
function pearson(x,y){
  var n=x.length, mx=mean(x), my=mean(y), sxy=0,sxx=0,syy=0;
  for(var i=0;i<n;i++){var dx=x[i]-mx, dy=y[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy}
  var r=sxy/Math.sqrt(sxx*syy);
  var df=n-2, t=r*Math.sqrt(df/(1-r*r));
  return {r:r, n:n, df:df, t:t, p:pTwoTailed(Math.abs(t),df)};
}
function partial(rxy,rxz,ryz){
  return (rxy - rxz*ryz) / Math.sqrt((1-rxz*rxz)*(1-ryz*ryz));
}
function logGamma(x){
  var g=7, c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  if(x<0.5) return Math.log(Math.PI/Math.sin(Math.PI*x))-logGamma(1-x);
  x-=1; var a=c[0]; var t=x+g+0.5;
  for(var i=1;i<g+2;i++) a+=c[i]/(x+i);
  return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a);
}
function betacf(x,a,b){
  var MAXIT=200, EPS=3e-12, FPMIN=1e-300;
  var qab=a+b, qap=a+1, qam=a-1, c=1, d=1-qab*x/qap;
  if(Math.abs(d)<FPMIN) d=FPMIN; d=1/d; var h=d;
  for(var m=1;m<=MAXIT;m++){
    var m2=2*m;
    var aa=m*(b-m)*x/((qam+m2)*(a+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=1+aa/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=1+aa/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; var del=d*c; h*=del;
    if(Math.abs(del-1)<EPS) break;
  }
  return h;
}
function betai(x,a,b){
  if(x<=0) return 0; if(x>=1) return 1;
  var bt=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log(1-x));
  if(x<(a+1)/(a+b+2)) return bt*betacf(x,a,b)/a;
  else return 1-bt*betacf(1-x,b,a)/b;
}
function pTwoTailed(t,df){ return betai(df/(df+t*t), df/2, 0.5) }
function pLabel(p){ return p<0.001 ? 'p < 0,001' : ('p = '+fnum(p,3)) }
function effectLabel(r){
  var a=Math.abs(r);
  if(a<0.1) return 'rất nhỏ/không đáng kể';
  if(a<0.3) return 'nhỏ';
  if(a<0.5) return 'vừa';
  return 'lớn';
}

var W={};
W.pearson=function(root){
  frame(root,'Tự tính Pearson r & tương quan riêng phần trên dữ liệu của bạn',
    '<div class="row"><small>Dán 2 (hoặc 3) cột số, mỗi dòng 1 quan sát, cách nhau bởi dấu phẩy/tab/xuống dòng. Biến Z (tuỳ chọn) dùng để tính tương quan riêng phần.</small></div>'+
    '<div class="row"><label>Biến X<br/><textarea id="x" rows="6" style="width:100%" placeholder="vd: 10.5, 2.5, 4.0, ..."></textarea></label>'+
    '<label>Biến Y<br/><textarea id="y" rows="6" style="width:100%" placeholder="vd: 67.0, 29.4, 31.2, ..."></textarea></label>'+
    '<label>Biến Z (tuỳ chọn — kiểm soát)<br/><textarea id="z" rows="6" style="width:100%" placeholder="để trống nếu chỉ tính r giữa X và Y"></textarea></label></div>'+
    '<div class="row"><button class="btn" id="go">Tính</button> '+
    '<button class="btn alt" id="preset">📊 Dùng dữ liệu thật: giờ tự học & điểm Toán (n=240, Z=pretest)</button></div>'+
    '<div class="out"></div>');
  function run(){
    var out=$(root,'.out');
    try{
      var x=nums($(root,'#x').value), y=nums($(root,'#y').value), zraw=$(root,'#z').value.trim(), z=zraw?nums(zraw):null;
      if(x.length<4||y.length<4) throw new Error('Cần ít nhất 4 quan sát mỗi biến.');
      if(x.length!==y.length) throw new Error('X và Y phải có cùng số quan sát (X có '+x.length+', Y có '+y.length+').');
      if(z&&z.length!==x.length) throw new Error('Z phải có cùng số quan sát với X/Y (Z có '+z.length+').');
      var rxy=pearson(x,y);
      var html='<p>n = '+rxy.n+', df = '+rxy.df+'</p>'+
        tbl(['Cặp biến','r','r²','t','p (2 phía)','Cỡ hiệu ứng'],
          [['X, Y', fnum(rxy.r,3), fnum(rxy.r*rxy.r,3), fnum(rxy.t,3), pLabel(rxy.p), effectLabel(rxy.r)]]);
      if(z){
        var rxz=pearson(x,z), ryz=pearson(y,z);
        var rp=partial(rxy.r, rxz.r, ryz.r);
        var dfp=rxy.n-3, tp=rp*Math.sqrt(dfp/(1-rp*rp)), pp=pTwoTailed(Math.abs(tp),dfp);
        html+='<p class="cap">r(X,Z)='+fnum(rxz.r,3)+', r(Y,Z)='+fnum(ryz.r,3)+'</p>';
        html+=tbl(['Tương quan riêng phần (kiểm soát Z)','r','t','p (2 phía)','So với r gốc'],
          [['r_XY·Z', fnum(rp,3), fnum(tp,3), pLabel(pp), (Math.abs(rp-rxy.r)<0.03?'gần như KHÔNG đổi':'thay đổi rõ')]]);
      }
      html+='<p class="cap">Công thức dùng: r=Σ(xᵢ−x̄)(yᵢ−ȳ)/√[Σ(xᵢ−x̄)²·Σ(yᵢ−ȳ)²]; t=r√(df/(1−r²)); p từ phân phối t với df bậc tự do — cùng công thức SPSS/PSPP dùng, đã kiểm chứng khớp scipy.stats.pearsonr tới 12 chữ số.</p>';
      out.innerHTML=html;
    }catch(e){ out.innerHTML='<p class="no">⚠️ '+esc(e.message)+'</p>' }
  }
  $(root,'#go').onclick=run;
  $(root,'#preset').onclick=function(){
    var base=root.getAttribute('data-base')||'../../..';
    fetch(base+'/assets/data_presets_m08.json').then(function(r){return r.json()}).then(function(d){
      $(root,'#x').value=d.x.join(', ');
      $(root,'#y').value=d.y.join(', ');
      $(root,'#z').value=d.z.join(', ');
      run();
    }).catch(function(){ $(root,'.out').innerHTML='<p class="no">Không tải được dữ liệu mẫu (kiểm tra kết nối).</p>' });
  };
};
document.querySelectorAll('.sim[data-sim]').forEach(function(root){var f=W[root.getAttribute('data-sim')];if(f)f(root)});
})();
