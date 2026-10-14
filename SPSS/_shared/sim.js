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
// --- Hàm gamma không đầy đủ (regularized incomplete gamma), dùng cho p-value chi-square và F ---
// Thuật toán chuẩn Numerical Recipes (gser/gcf) — kiểm chứng khớp scipy.stats.chi2/f tới ~4-5 chữ số thập phân.
function gammaSer(a,x){
  var ap=a, sum=1/a, del=sum;
  for(var n=1;n<=500;n++){ ap+=1; del*=x/ap; sum+=del; if(Math.abs(del)<Math.abs(sum)*3e-16) break }
  return sum*Math.exp(-x+a*Math.log(x)-logGamma(a));
}
function gammaCf(a,x){
  var FPMIN=1e-300, EPS=3e-16;
  var b=x+1-a, c=1/FPMIN, d=1/b, h=d;
  for(var i=1;i<=500;i++){
    var an=-i*(i-a); b+=2;
    d=an*d+b; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=b+an/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; var del=d*c; h*=del;
    if(Math.abs(del-1)<EPS) break;
  }
  return Math.exp(-x+a*Math.log(x)-logGamma(a))*h;
}
function gammaIncP(a,x){ if(x<0||a<=0) return NaN; if(x===0) return 0; return x<a+1 ? gammaSer(a,x) : 1-gammaCf(a,x) }
function chiSqP(chi2,df){ return 1-gammaIncP(df/2, chi2/2) }
function fP(F,d1,d2){ if(F<=0) return 1; var x=d1*F/(d1*F+d2); return 1-betai(x,d1/2,d2/2) }
function pLabel(p){ return p<0.001 ? 'p < 0,001' : ('p = '+fnum(p,3)) }
function sd(a){ var m=mean(a); return Math.sqrt(a.reduce(function(s,x){return s+(x-m)*(x-m)},0)/(a.length-1)) }
function effectLabel(r){
  var a=Math.abs(r);
  if(a<0.1) return 'rất nhỏ/không đáng kể';
  if(a<0.3) return 'nhỏ';
  if(a<0.5) return 'vừa';
  return 'lớn';
}
function dLabel(d){ // ngưỡng Cohen's d (Cohen 1988), khác hẳn ngưỡng r ở effectLabel()
  var a=Math.abs(d);
  if(a<0.2) return 'rất nhỏ';
  if(a<0.5) return 'nhỏ';
  if(a<0.8) return 'vừa';
  return 'lớn';
}
function etaRatio(x,y){
  var groups={}; var gm=mean(y), ssT=0, ssB=0;
  for(var i=0;i<y.length;i++) ssT+=(y[i]-gm)*(y[i]-gm);
  x.forEach(function(v,i){ (groups[v]=groups[v]||[]).push(y[i]) });
  Object.keys(groups).forEach(function(k){ var g=groups[k], mg=mean(g); ssB+=g.length*(mg-gm)*(mg-gm) });
  return Math.sqrt(ssT>0 ? ssB/ssT : 0);
}

// --- Vẽ scatterplot SVG tương tác: điểm + đường hồi quy tuyến tính, hover xem toạ độ ---
function scatterSVG(x,y,extraLine){
  var n=x.length, w=460,h=280, ml=46,mr=14,mt=14,mb=34;
  var xmin=Math.min.apply(null,x), xmax=Math.max.apply(null,x);
  var ymin=Math.min.apply(null,y), ymax=Math.max.apply(null,y);
  var xr=(xmax-xmin)||1, yr=(ymax-ymin)||1;
  var px=xr*0.08, py=yr*0.08;
  xmin-=px; xmax+=px; ymin-=py; ymax+=py; xr=xmax-xmin; yr=ymax-ymin;
  function sx(v){ return ml + (v-xmin)/xr*(w-ml-mr) }
  function sy(v){ return h-mb - (v-ymin)/yr*(h-mt-mb) }
  var mx=mean(x), my=mean(y), sxy=0,sxx=0;
  for(var i=0;i<n;i++){ sxy+=(x[i]-mx)*(y[i]-my); sxx+=(x[i]-mx)*(x[i]-mx) }
  var b=sxx?sxy/sxx:0, a=my-b*mx;
  var pts='';
  for(i=0;i<n;i++){
    pts+='<circle class="pt" cx="'+sx(x[i]).toFixed(1)+'" cy="'+sy(y[i]).toFixed(1)+'" r="4"><title>x='+fnum(x[i],2)+', y='+fnum(y[i],2)+'</title></circle>';
  }
  var extra='';
  if(extraLine){ // mảng [[x,y],...] vẽ đường cong tuỳ ý (vd đường cong bậc 2 minh hoạ eta)
    extra='<polyline class="curve" points="'+extraLine.map(function(p){return sx(p[0]).toFixed(1)+','+sy(p[1]).toFixed(1)}).join(' ')+'"/>';
  }
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" style="max-width:480px;display:block;margin:10px auto" class="scatter-svg">'+
    '<line x1="'+ml+'" y1="'+(h-mb)+'" x2="'+(w-mr)+'" y2="'+(h-mb)+'" class="axis"/>'+
    '<line x1="'+ml+'" y1="'+mt+'" x2="'+ml+'" y2="'+(h-mb)+'" class="axis"/>'+
    '<line x1="'+sx(xmin+px).toFixed(1)+'" y1="'+sy(a+b*(xmin+px)).toFixed(1)+'" x2="'+sx(xmax-px).toFixed(1)+'" y2="'+sy(a+b*(xmax-px)).toFixed(1)+'" class="reg"/>'+
    extra+pts+
    '<text x="'+ml+'" y="'+(h-10)+'" class="axlabel">'+fnum(xmin+px,1)+'</text>'+
    '<text x="'+(w-mr)+'" y="'+(h-10)+'" class="axlabel" text-anchor="end">'+fnum(xmax-px,1)+'</text>'+
    '<text x="'+(ml-6)+'" y="'+(h-mb)+'" class="axlabel" text-anchor="end">'+fnum(ymin+py,1)+'</text>'+
    '<text x="'+(ml-6)+'" y="'+(mt+8)+'" class="axlabel" text-anchor="end">'+fnum(ymax-py,1)+'</text>'+
    '</svg>';
}
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296 } }

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
        scatterSVG(x,y)+
        '<p class="cap" style="text-align:center">Chấm = từng quan sát (di chuột xem toạ độ) · nét đứt = đường hồi quy tuyến tính tốt nhất</p>'+
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
W.curve=function(root){
  frame(root,'Vì sao Pearson r "bỏ sót" quan hệ phi tuyến — kéo thanh trượt để xem trực tiếp',
    '<div class="row"><label>Đỉnh hiệu suất rơi vào mức căng thẳng = <span id="pv">5</span><br/>'+
    '<input id="peak" type="range" min="2" max="9" step="0.5" value="5" style="width:100%"></label></div>'+
    '<div class="out"></div>');
  var rnd=mulberry32(42), noise=[], stress=[];
  for(var s=1;s<=10;s++) for(var k=0;k<6;k++){ stress.push(s); noise.push((rnd()-0.5)*3.2) }
  function run(){
    var peak=parseFloat($(root,'#peak').value); $(root,'#pv').textContent=peak;
    var perf=stress.map(function(x,i){ return 10 - 0.9*(x-peak)*(x-peak) + noise[i] });
    var rxy=pearson(stress,perf), eta=etaRatio(stress,perf);
    var curve=[]; for(var xx=1;xx<=10;xx+=0.25) curve.push([xx, 10-0.9*(xx-peak)*(xx-peak)]);
    $(root,'.out').innerHTML=
      scatterSVG(stress,perf,curve)+
      '<p class="cap" style="text-align:center">Nét đứt thẳng = hồi quy tuyến tính Pearson giả định · đường cong mảnh = quan hệ THẬT (parabol, đỉnh tại mức '+peak+')</p>'+
      tbl(['Chỉ số','Giá trị','Diễn giải'],[
        ['Pearson r (tuyến tính)', fnum(rxy.r,3), effectLabel(rxy.r)+' — đo quan hệ ĐƯỜNG THẲNG'],
        ['Eta η (phi tuyến)', fnum(eta,3), effectLabel(eta)+' — đo được cả quan hệ CONG']
      ])+
      '<p class="cap">Khi đỉnh ở giữa khoảng (~5-6): Pearson r gần 0 dù eta vẫn cao — minh hoạ đúng bài học Cohen et al. (tr.769): Pearson r có thể đánh giá THẤP một quan hệ phi tuyến rất thật. Kéo đỉnh về gần 2 hoặc 9 (lệch về một phía) để thấy r tăng lên — khi đó đoạn đường cong quan sát được gần giống một đường thẳng hơn.</p>';
  }
  $(root,'#peak').oninput=run; run();
};
W.ttest=function(root){
  frame(root,'Tự tính t-test độc lập &amp; bắt cặp trên dữ liệu của bạn',
    '<div class="row"><label><input type="radio" name="ttmode" value="ind" checked/> Độc lập (2 nhóm khác nhau)</label> '+
    '<label><input type="radio" name="ttmode" value="pair"/> Bắt cặp (cùng đối tượng, đo 2 lần)</label></div>'+
    '<div class="row"><label>Nhóm/Lần 1<br/><textarea id="a" rows="6" style="width:100%" placeholder="vd: 8.5, 10.2, ..."></textarea></label>'+
    '<label>Nhóm/Lần 2<br/><textarea id="b" rows="6" style="width:100%" placeholder="vd: 2.1, 3.4, ..."></textarea></label></div>'+
    '<div class="row"><button class="btn" id="go">Tính</button> '+
    '<button class="btn alt" id="preset">📊 Dùng dữ liệu thật: mức tăng điểm theo phương pháp (n=240)</button></div>'+
    '<div class="out"></div>');
  function run(){
    var out=$(root,'.out');
    try{
      var mode=root.querySelector('input[name=ttmode]:checked').value;
      var a=nums($(root,'#a').value), b=nums($(root,'#b').value);
      if(a.length<2||b.length<2) throw new Error('Cần ít nhất 2 quan sát mỗi nhóm.');
      var html;
      if(mode==='ind'){
        var n1=a.length,n2=b.length, m1=mean(a), m2=mean(b), s1=sd(a), s2=sd(b);
        var sp2=((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2), spooled=Math.sqrt(sp2);
        var se=Math.sqrt(sp2*(1/n1+1/n2));
        var df=n1+n2-2, t=(m1-m2)/se, p=pTwoTailed(Math.abs(t),df), d=(m1-m2)/spooled;
        html=tbl(['Nhóm','n','Mean','SD'],[['Nhóm 1',n1,fnum(m1,3),fnum(s1,3)],['Nhóm 2',n2,fnum(m2,3),fnum(s2,3)]])+
          '<p class="cap">SD gộp = √[((n1−1)s1²+(n2−1)s2²)/(n1+n2−2)] = '+fnum(spooled,4)+'</p>'+
          '<p class="cap">SE = SD_gộp×√(1/n1+1/n2) = '+fnum(se,4)+'</p>'+
          tbl(['t','df','p (2 phía)',"Cohen's d"],[[fnum(t,3),df,pLabel(p),fnum(Math.abs(d),3)+' ('+dLabel(d)+')']]);
      } else {
        if(a.length!==b.length) throw new Error('T-test bắt cặp cần Lần 1 và Lần 2 có CÙNG số quan sát (hiện '+a.length+' và '+b.length+').');
        var n=a.length, diffs=a.map(function(v,i){return v-b[i]});
        var md=mean(diffs), sdd=sd(diffs), se2=sdd/Math.sqrt(n);
        var df2=n-1, t2=md/se2, p2=pTwoTailed(Math.abs(t2),df2), d2=md/sdd;
        html=tbl(['','n','Mean','SD'],[['Lần 1',n,fnum(mean(a),3),fnum(sd(a),3)],['Lần 2',n,fnum(mean(b),3),fnum(sd(b),3)],['Hiệu (Lần1−Lần2)',n,fnum(md,3),fnum(sdd,3)]])+
          '<p class="cap">SE = SD_hiệu/√n = '+fnum(sdd,4)+'/√'+n+' = '+fnum(se2,4)+'</p>'+
          tbl(['t','df','p (2 phía)',"Cohen's d"],[[fnum(t2,3),df2,pLabel(p2),fnum(Math.abs(d2),3)+' ('+dLabel(d2)+')']]);
      }
      html+='<p class="cap">Công thức: t=(chênh lệch trung bình)/SE; p từ phân phối t với df bậc tự do — kiểm chứng khớp scipy.stats.ttest_ind/ttest_rel.</p>';
      out.innerHTML=html;
    }catch(e){ out.innerHTML='<p class="no">⚠️ '+esc(e.message)+'</p>' }
  }
  $(root,'#go').onclick=run;
  $(root,'#preset').onclick=function(){
    var base=root.getAttribute('data-base')||'../../..';
    fetch(base+'/assets/data_presets_m05.json').then(function(r){return r.json()}).then(function(d){
      root.querySelector('input[value=ind]').checked=true;
      $(root,'#a').value=d.group1.join(', ');
      $(root,'#b').value=d.group2.join(', ');
      run();
    }).catch(function(){ $(root,'.out').innerHTML='<p class="no">Không tải được dữ liệu mẫu (kiểm tra kết nối).</p>' });
  };
};
W.anova=function(root){
  frame(root,'Tự tính ANOVA một chiều (F-test) trên dữ liệu của bạn',
    '<div class="row"><small>Dán số liệu từng nhóm (tối đa 4 nhóm), để trống ô nào không dùng.</small></div>'+
    '<div class="row">'+
      '<label>Nhóm 1<br/><textarea id="g1" rows="5" style="width:100%"></textarea></label>'+
      '<label>Nhóm 2<br/><textarea id="g2" rows="5" style="width:100%"></textarea></label>'+
      '<label>Nhóm 3<br/><textarea id="g3" rows="5" style="width:100%"></textarea></label>'+
      '<label>Nhóm 4 (tuỳ chọn)<br/><textarea id="g4" rows="5" style="width:100%"></textarea></label>'+
    '</div>'+
    '<div class="row"><button class="btn" id="go">Tính</button> '+
    '<button class="btn alt" id="preset">📊 Dùng dữ liệu thật: điểm Toán theo 3 trường (n=240)</button></div>'+
    '<div class="out"></div>');
  function run(){
    var out=$(root,'.out');
    try{
      var groups=['g1','g2','g3','g4'].map(function(id){return nums($(root,'#'+id).value)}).filter(function(g){return g.length>=2});
      if(groups.length<2) throw new Error('Cần ít nhất 2 nhóm, mỗi nhóm ≥2 quan sát.');
      var all=[].concat.apply([],groups);
      var gm=mean(all), N=all.length, k=groups.length;
      var ssb=0, ssw=0;
      groups.forEach(function(g){
        var mg=mean(g);
        ssb+=g.length*(mg-gm)*(mg-gm);
        g.forEach(function(v){ ssw+=(v-mg)*(v-mg) });
      });
      var sst=ssb+ssw, dfb=k-1, dfw=N-k;
      var msb=ssb/dfb, msw=ssw/dfw, F=msb/msw, p=fP(F,dfb,dfw), eta2=ssb/sst;
      var rows=groups.map(function(g,i){return ['Nhóm '+(i+1),g.length,fnum(mean(g),3),fnum(sd(g),3)]});
      var html=tbl(['Nhóm','n','Mean','SD'],rows)+
        tbl(['Nguồn biến thiên','SS','df','MS','F','p'],[
          ['Giữa nhóm (Between)',fnum(ssb,3),dfb,fnum(msb,3),fnum(F,3),pLabel(p)],
          ['Trong nhóm (Within)',fnum(ssw,3),dfw,fnum(msw,3),'—','—'],
          ['Tổng (Total)',fnum(sst,3),N-1,'—','—','—']
        ])+
        '<p class="cap">η² = SSb/SSt = '+fnum(ssb,3)+'/'+fnum(sst,3)+' = '+fnum(eta2,4)+'</p>'+
        '<p class="cap">Công thức: F=MSb/MSw; p từ phân phối F với (dfb, dfw) bậc tự do — kiểm chứng khớp scipy.stats.f_oneway.</p>';
      out.innerHTML=html;
    }catch(e){ out.innerHTML='<p class="no">⚠️ '+esc(e.message)+'</p>' }
  }
  $(root,'#go').onclick=run;
  $(root,'#preset').onclick=function(){
    var base=root.getAttribute('data-base')||'../../..';
    fetch(base+'/assets/data_presets_m06.json').then(function(r){return r.json()}).then(function(d){
      d.groups.forEach(function(g,i){ if(i<4) $(root,'#g'+(i+1)).value=g.join(', ') });
      run();
    }).catch(function(){ $(root,'.out').innerHTML='<p class="no">Không tải được dữ liệu mẫu (kiểm tra kết nối).</p>' });
  };
};
W.chisq=function(root){
  frame(root,'Tự tính Chi-square kiểm định độc lập trên bảng chéo của bạn',
    '<div class="row"><small>Dán bảng số đếm, mỗi dòng 1 hàng, các cột cách nhau bởi dấu phẩy. VD bảng 2×2:<br/>63,58<br/>52,67</small></div>'+
    '<div class="row"><textarea id="tbl" rows="5" style="width:100%" placeholder="63,58&#10;52,67"></textarea></div>'+
    '<div class="row"><button class="btn" id="go">Tính</button> '+
    '<button class="btn alt" id="preset">📊 Dùng dữ liệu thật: Giới tính × Phương pháp (n=240)</button></div>'+
    '<div class="out"></div>');
  function parseTable(s){
    return s.split('\n').map(function(line){return line.trim()}).filter(Boolean).map(function(line){
      return line.split(/[,;\t]+/).map(function(x){return parseFloat(x.trim())}).filter(function(x){return !isNaN(x)});
    });
  }
  function run(){
    var out=$(root,'.out');
    try{
      var rows=parseTable($(root,'#tbl').value);
      if(rows.length<2) throw new Error('Cần ít nhất 2 hàng.');
      var ncol=rows[0].length;
      if(ncol<2) throw new Error('Cần ít nhất 2 cột.');
      rows.forEach(function(r){ if(r.length!==ncol) throw new Error('Mọi hàng phải có cùng số cột.') });
      var rowSums=rows.map(function(r){return r.reduce(function(s,x){return s+x},0)});
      var colSums=[]; for(var j=0;j<ncol;j++){ colSums.push(rows.reduce(function(s,r){return s+r[j]},0)) }
      var N=rowSums.reduce(function(s,x){return s+x},0);
      var df=(rows.length-1)*(ncol-1);
      var yates=(df===1); // Yates's continuity correction chỉ áp cho bảng 2×2, đúng quy ước SPSS mặc định
      var chi2=0, expRows=[];
      rows.forEach(function(r,i){
        var erow=[];
        r.forEach(function(o,j){
          var e=rowSums[i]*colSums[j]/N;
          erow.push(e);
          var diff=Math.abs(o-e);
          if(yates) diff=Math.max(0,diff-0.5);
          chi2+=(diff*diff)/e;
        });
        expRows.push(erow);
      });
      var p=chiSqP(chi2,df);
      var obsHtml=tbl(['Quan sát (O)'].concat(colSums.map(function(_,j){return 'Cột '+(j+1)})), rows.map(function(r,i){return ['Hàng '+(i+1)].concat(r)}));
      var expHtml=tbl(['Kỳ vọng (E)'].concat(colSums.map(function(_,j){return 'Cột '+(j+1)})), expRows.map(function(r,i){return ['Hàng '+(i+1)].concat(r.map(function(x){return fnum(x,2)}))}));
      var phi=Math.sqrt(chi2/N);
      var html=obsHtml+expHtml+
        '<p class="cap">χ² = Σ(O−E)²/E'+(yates?' (đã áp Yates\'s correction cho bảng 2×2)':'')+' = '+fnum(chi2,3)+', df = (hàng−1)×(cột−1) = '+df+'</p>'+
        tbl(['χ²','df','p','Phi/Cramér\'s V (xấp xỉ)'],[[fnum(chi2,3),df,pLabel(p),fnum(phi,3)]])+
        '<p class="cap">Công thức: E = (Tổng hàng×Tổng cột)/Tổng chung — kiểm chứng khớp scipy.stats.chi2_contingency.</p>';
      out.innerHTML=html;
    }catch(e){ out.innerHTML='<p class="no">⚠️ '+esc(e.message)+'</p>' }
  }
  $(root,'#go').onclick=run;
  $(root,'#preset').onclick=function(){
    var base=root.getAttribute('data-base')||'../../..';
    fetch(base+'/assets/data_presets_m07.json').then(function(r){return r.json()}).then(function(d){
      $(root,'#tbl').value=d.table.map(function(r){return r.join(',')}).join('\n');
      run();
    }).catch(function(){ $(root,'.out').innerHTML='<p class="no">Không tải được dữ liệu mẫu (kiểm tra kết nối).</p>' });
  };
};
W.regression=function(root){
  frame(root,'Tự tính hồi quy tuyến tính đơn biến trên dữ liệu của bạn',
    '<div class="row"><label>Biến độc lập X<br/><textarea id="x" rows="6" style="width:100%"></textarea></label>'+
    '<label>Biến phụ thuộc Y<br/><textarea id="y" rows="6" style="width:100%"></textarea></label></div>'+
    '<div class="row"><button class="btn" id="go">Tính</button> '+
    '<button class="btn alt" id="preset">📊 Dùng dữ liệu thật: giờ tự học → điểm Toán (n=240)</button></div>'+
    '<div class="out"></div>');
  function run(){
    var out=$(root,'.out');
    try{
      var x=nums($(root,'#x').value), y=nums($(root,'#y').value);
      if(x.length<4||y.length!==x.length) throw new Error('X và Y cần ≥4 quan sát, cùng số lượng (X có '+x.length+', Y có '+y.length+').');
      var n=x.length, mx=mean(x), my=mean(y), sxy=0,sxx=0,syy=0;
      for(var i=0;i<n;i++){ var dx=x[i]-mx, dy=y[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy }
      var b=sxy/sxx, a=my-b*mx, r2=(sxy*sxy)/(sxx*syy);
      var sse=0; for(i=0;i<n;i++){ var e=y[i]-(a+b*x[i]); sse+=e*e }
      var dfres=n-2, mse=sse/dfres, seB=Math.sqrt(mse/sxx);
      var t=b/seB, p=pTwoTailed(Math.abs(t),dfres);
      var html=scatterSVG(x,y)+
        '<p class="cap" style="text-align:center">Chấm = từng quan sát · nét đứt = đường hồi quy Ŷ=a+bX tốt nhất</p>'+
        tbl(['a (hệ số chặn)','b (hệ số góc)','R²','SE(b)','t','p'],
          [[fnum(a,3),fnum(b,3),fnum(r2,3),fnum(seB,4),fnum(t,3),pLabel(p)]])+
        '<p class="cap" style="text-align:center">Phương trình: Ŷ = '+fnum(a,3)+' + '+fnum(b,3)+'×X</p>'+
        '<p class="cap">Công thức: b=Σ(xᵢ−x̄)(yᵢ−ȳ)/Σ(xᵢ−x̄)²; a=ȳ−b×x̄; SE(b)=√(MSE/Σ(xᵢ−x̄)²); t=b/SE(b) — kiểm chứng khớp statsmodels.OLS.</p>';
      out.innerHTML=html;
    }catch(e){ out.innerHTML='<p class="no">⚠️ '+esc(e.message)+'</p>' }
  }
  $(root,'#go').onclick=run;
  $(root,'#preset').onclick=function(){
    var base=root.getAttribute('data-base')||'../../..';
    fetch(base+'/assets/data_presets_m08.json').then(function(r){return r.json()}).then(function(d){
      $(root,'#x').value=d.x.join(', ');
      $(root,'#y').value=d.y.join(', ');
      run();
    }).catch(function(){ $(root,'.out').innerHTML='<p class="no">Không tải được dữ liệu mẫu (kiểm tra kết nối).</p>' });
  };
};
document.querySelectorAll('.sim[data-sim]').forEach(function(root){var f=W[root.getAttribute('data-sim')];if(f)f(root)});
})();
