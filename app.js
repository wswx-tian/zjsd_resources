(() => {
  'use strict';
  const paths={
    network:'<path d="m5 5 14-1 1 15-15 1Zm0 0 15 14M19 4 5 20"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="20" cy="19" r="2"/><circle cx="5" cy="20" r="2"/><circle cx="12" cy="12" r="2.5"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16M15 5v16"/>',
    layers:'<path d="m12 3 10 6-10 6L2 9Zm-9 11 9 5 9-5M3 18l9 5 9-5"/>',
    warehouse:'<path d="M3 21V8l9-5 9 5v13ZM8 21V11h8v10M8 15h8M8 18h8M1 21h22"/>',
    box:'<path d="m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5M12 12v10M7.5 4.5l9 5"/>',
    truck:'<path d="M2 5h12v12H2ZM14 9h4l4 4v4h-8M14 13h8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    users:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 4 5v2"/>',
    pin:'<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/>',
    search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
    refresh:'<path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5"/>',
    expand:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
    'arrow-right':'<path d="M4 12h16m-5-5 5 5-5 5"/>',
    activity:'<path d="M2 13h5l3-8 4 14 3-7h5"/>',
    alert:'<path d="m12 3 10 18H2ZM12 9v5M12 17v.1"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
    focus:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>',
    external:'<path d="M14 3h7v7m0-7L10 14M9 3H3v18h18v-6"/>',
    shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-5 10 3 3 7-7"/>',
    radio:'<path d="M12 13v8M8 21h8M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/><circle cx="12" cy="12" r="2"/>',
    medical:'<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5Z"/>',
    check:'<path d="m5 12 4 4L20 5"/>',
    van:'<path d="M3 6h14l4 6v7H3ZM4 11h16M8 6v5M14 6v5"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>',
    plane:'<path d="m3 10 7 2 5 9 3-1-2-8 5-5a2 2 0 0 0-3-3l-5 5-8-2Z"/>',
    road:'<path d="m8 3-5 18M16 3l5 18M12 3v4m0 3v4m0 3v4"/>'
  };
  const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[n]||paths.network}</svg>`;
  const icons=()=>$$('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const D=window.RESOURCE_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=n=>new Intl.NumberFormat('zh-CN').format(Number(n)||0),
    district=id=>D.districts.find(d=>d.id===id),
    typeMeta={warehouse:{label:'仓储网点',color:'#65ddc3',icon:'warehouse'},transport:{label:'运输站场',color:'#77a9f1',icon:'truck'},team:{label:'救援队伍',color:'#bda4ee',icon:'users'},equipment:{label:'应急装备',color:'#e4b76e',icon:'radio'}};
  D.nodes=[...D.warehouses,...D.transport,...D.teamSummary.areas,...D.equipment];
  D.materials.forEach((m,i)=>m.rowId=i);
  const state={district:'all',search:'',view:'map',ledger:'all',page:1,pageSize:50,warehousePage:1,warehousePageSize:8,layers:new Set(['warehouse']),basemap:'satellite',selected:null};
  const materialsByWarehouse=new Map(),warehouseById=new Map(D.warehouses.map(w=>[w.id,w]));
  D.materials.forEach(m=>{if(!materialsByWarehouse.has(m.warehouseId))materialsByWarehouse.set(m.warehouseId,[]);materialsByWarehouse.get(m.warehouseId).push(m);m.district=warehouseById.get(m.warehouseId)?.district||'';m.searchText=`${m.name} ${m.spec} ${m.category} ${m.unit} ${warehouseById.get(m.warehouseId)?.name||''} ${warehouseById.get(m.warehouseId)?.admin||''}`.toLocaleLowerCase();});
  let map,markers,boundaryLayer,basemapLayer,warehouseLinkRenderer,warehouseFlowGroup,renderTimer,toastTimer,ledgerReturnFocus,drawerReturnFocus;
  const warehouseRank={'市级':0,'县级':1,'乡镇级':2,'村级':3};
  const pointLevelColors={
    warehouse:{'市级':'#1e3a8a','县级':'#2563eb','乡镇级':'#60a5fa','村级':'#dcebff'},
    transport:{'市级':'#0b3f75','县级':'#0c77c9','乡镇级':'#35a9f2','村级':'#b9e3ff'},
    equipment:{'市级':'#9a3412','县级':'#d9480f','乡镇级':'#f59f00','村级':'#ffe066'}
  };
  const warehouseLevelColors=pointLevelColors.warehouse;
  function resourcePointLevel(n){
    if(n.type==='warehouse'){
      if(warehouseRank[n.level]!==undefined)return n.level;
      const locality=[n.name,n.organization,n.admin,n.address].filter(Boolean).join('');
      if(/村委会|村民委员会|[\u3400-\u9fff]{1,8}村(?:[一二三四五六七八九十0-9]?组|委)/.test(locality))return '村级';
      if(/(?:街道|镇|乡)/.test(locality))return '乡镇级';
      if(/市本级|市直/.test(locality)||/^(?:四川省)?绵阳市$/.test(String(n.admin||'')))return '市级';
      return '县级';
    }
    if(n.type==='transport'){
      const name=String(n.name||'');
      if(/绵阳.*(?:总站|公交集团|公共交通集团|交通集团)|市本级/.test(name))return '市级';
      return /(?:街道|镇|乡)/.test(name)?'乡镇级':'县级';
    }
    if(n.type==='equipment'){
      const locality=[n.admin,n.organization,n.address].filter(Boolean).join('');
      if(/市本级|市直/.test(locality)||/^(?:四川省)?绵阳市$/.test(String(n.admin||'')))return '市级';
      if(/村委会|村民委员会|[\u3400-\u9fff]{1,8}村(?:[一二三四五六七八九十0-9]?组|委)/.test(locality))return '村级';
      if(/(?:街道|镇|乡)/.test(locality))return '乡镇级';
      return '县级';
    }
    return '县级';
  }
  function resourcePointRank(n){return warehouseRank[resourcePointLevel(n)]??1;}
  function resourcePointColor(n){return pointLevelColors[n.type]?.[resourcePointLevel(n)]||typeMeta[n.type].color;}
  const cityGeometry=window.CITY_GEOJSON?.features?.find(f=>f.properties?.name==='绵阳市')?.geometry;
  function pointInRing(lng,lat,ring){
    let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      const [xi,yi]=ring[i],[xj,yj]=ring[j],cross=(lng-xi)*(yj-yi)-(lat-yi)*(xj-xi);
      if(Math.abs(cross)<1e-9&&lng>=Math.min(xi,xj)-1e-9&&lng<=Math.max(xi,xj)+1e-9&&lat>=Math.min(yi,yj)-1e-9&&lat<=Math.max(yi,yj)+1e-9)return true;
      if((yi>lat)!==(yj>lat)&&lng<(xj-xi)*(lat-yi)/(yj-yi)+xi)inside=!inside;
    }
    return inside;
  }
  function insideMianyang(latlng){
    if(!cityGeometry||!Array.isArray(latlng)||latlng.length<2)return false;
    const [lat,lng]=latlng,polygons=cityGeometry.type==='Polygon'?[cityGeometry.coordinates]:cityGeometry.coordinates;
    return polygons.some(rings=>pointInRing(lng,lat,rings[0])&&!rings.slice(1).some(ring=>pointInRing(lng,lat,ring)));
  }
  const districtGeometries=new Map(D.districts.map(d=>[d.id,window.CITY_GEOJSON?.features?.find(f=>f.properties?.name===d.name)?.geometry]).filter(([,geometry])=>geometry));
  function insideDistrict(latlng,districtId){
    const geometry=districtGeometries.get(districtId);if(!geometry||!Array.isArray(latlng)||latlng.length<2)return false;
    const [lat,lng]=latlng,polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
    return polygons.some(rings=>pointInRing(lng,lat,rings[0])&&!rings.slice(1).some(ring=>pointInRing(lng,lat,ring)));
  }
  const cityResourceNodes=new WeakSet(D.nodes.filter(n=>n.district!=='unknown'&&n.latlng&&insideMianyang(n.latlng)&&insideDistrict(n.latlng,n.district)));
  const normalizeWarehouseText=v=>String(v||'').replace(/\s+/g,'').replace(/四川省|绵阳市|涪城区|游仙区|安州区|江油市|三台县|盐亭县|梓潼县|北川羌族自治县|北川县|平武县|科技城新区|高新区|经开区|仙海区/g,'');
  const warehouseTownAliases=n=>[n.name,n.admin,n.organization,n.address].filter(Boolean).flatMap(v=>[...normalizeWarehouseText(v).matchAll(/[\u3400-\u9fff]{2,18}?(?:街道|镇|乡)/g)].map(m=>m[0].replace(/镇镇$/,'镇').replace(/^(?:号|第)/,''))).filter((v,i,a)=>v.length>=2&&a.indexOf(v)===i);
  function mapDistance(a,b){const y=(a.latlng[0]-b.latlng[0])*111,x=(a.latlng[1]-b.latlng[1])*95;return x*x+y*y;}
  function nearestWarehouse(candidates,child){return candidates.reduce((best,parent)=>!best||mapDistance(parent,child)<mapDistance(best,child)?parent:best,null);}
  function warehouseLinkInsideDistrict(parent,child){
    if(!parent||!child||parent.district==='unknown'||parent.district!==child.district||!insideDistrict(parent.latlng,parent.district)||!insideDistrict(child.latlng,child.district))return false;
    const steps=Math.max(2,Math.ceil(Math.sqrt(mapDistance(parent,child))/1.5));
    for(let i=1;i<steps;i++){const t=i/steps,point=[parent.latlng[0]+(child.latlng[0]-parent.latlng[0])*t,parent.latlng[1]+(child.latlng[1]-parent.latlng[1])*t];if(!insideDistrict(point,parent.district))return false;}
    return true;
  }
  function namedTownParent(child,candidates){
    const text=normalizeWarehouseText([child.name,child.admin,child.organization,child.address].filter(Boolean).join(''));
    let matches=candidates.flatMap(parent=>warehouseTownAliases(parent).filter(alias=>text.includes(alias)).map(alias=>({parent,alias})));
    if(!matches.length)return null;
    const longest=Math.max(...matches.map(x=>x.alias.length));matches=matches.filter(x=>x.alias.length===longest);
    return matches.reduce((best,match)=>!best||mapDistance(match.parent,child)<mapDistance(best.parent,child)?match:best,null)?.parent||null;
  }
  function buildWarehouseLinks(){
    const rows=D.warehouses.filter(n=>n.district!=='unknown'&&cityResourceNodes.has(n)),links=[],city=rows.filter(n=>resourcePointRank(n)===0),county=rows.filter(n=>resourcePointRank(n)===1),town=rows.filter(n=>resourcePointRank(n)===2),village=rows.filter(n=>resourcePointRank(n)===3);
    for(const child of county){const local=city.filter(p=>p.district===child.district),parent=nearestWarehouse(local,child);if(warehouseLinkInsideDistrict(parent,child))links.push([parent,child]);}
    for(const child of town){const local=county.filter(p=>p.district===child.district),parent=nearestWarehouse(local,child);if(warehouseLinkInsideDistrict(parent,child))links.push([parent,child]);}
    for(const child of village){const local=town.filter(p=>p.district===child.district),parent=namedTownParent(child,local)||nearestWarehouse(local,child);if(warehouseLinkInsideDistrict(parent,child))links.push([parent,child]);}
    return links;
  }
  const warehouseLinks=buildWarehouseLinks();

  function allResources(){return D.nodes.filter(n=>state.district==='all'||n.district===state.district);}
  function matchingMaterials(){
    const q=state.search.toLocaleLowerCase();
    return D.materials.filter(m=>{
      if(state.district!=='all'&&m.district!==state.district)return false;
      if(!q)return true;
      return m.searchText.includes(q);
    });
  }
  function nodeMatches(n){
    if(state.district!=='all'&&n.district!==state.district)return false;
    if(!state.search)return true;
    const q=state.search.toLocaleLowerCase();
    if(`${n.name} ${n.admin} ${n.address} ${n.category} ${n.equipmentType} ${n.organization} ${n.skill} ${n.mode} ${n.purpose}`.toLocaleLowerCase().includes(q))return true;
    if(n.type==='warehouse')return (materialsByWarehouse.get(n.id)||[]).some(m=>`${m.name} ${m.spec} ${m.category} ${m.unit}`.toLocaleLowerCase().includes(q));
    return false;
  }
  function visibleNodes(){return allResources().filter(nodeMatches);}
  function teamCountFor(list=visibleNodes()){
    if(state.district==='all'&&!state.search)return D.teamSummary.total;
    return list.filter(n=>n.type==='team').reduce((sum,n)=>sum+(Number(n.teamCount)||0),0);
  }
  function teamCountForDistrict(id){return D.teamSummary.areas.filter(n=>n.level==='district'&&n.district===id).reduce((sum,n)=>sum+(Number(n.teamCount)||0),0);}
  function fmtMaybe(value,unit=''){return value===null||value===undefined||value===''?'未提供':`${number(value)}${unit}`;}
  function resourceAbility(n){
    if(n.type==='warehouse')return `${materialsByWarehouse.get(n.id)?.length||0} 条物资明细${n.capacity?` · 库容 ${esc(n.capacity)}`:''}`;
    if(n.type==='transport')return [n.category,n.mode,n.capacity&&`吞吐 ${n.capacity}`,n.area&&`面积 ${n.area}`,n.responsible&&`负责人 ${n.responsible}`,n.phone&&`电话 ${n.phone}`,n.purpose].filter(Boolean).map(esc).join(' · ')||'站场信息';
    if(n.type==='team')return n.teamCount===null?'辖区数量未提供':`${number(n.teamCount)} 支救援队伍`;
    return [n.equipmentType||n.name,n.quantity!==null&&n.quantity!==undefined&&`${number(n.quantity)} ${esc(n.unit)}`].filter(Boolean).join(' · ');
  }
  function setCounts(){
    for(const type of Object.keys(typeMeta))$(`#map-count-${type}`).textContent=number(type==='team'?D.teamSummary.total:D.nodes.filter(n=>n.type===type).length);
  }
  function renderKpis(){
    const ns=visibleNodes(),ms=matchingMaterials(),wh=ns.filter(n=>n.type==='warehouse'),transport=ns.filter(n=>n.type==='transport'),equipment=ns.filter(n=>n.type==='equipment'),teams=teamCountFor(ns),equipmentUnits=new Set(equipment.map(n=>n.unit).filter(Boolean)).size;
    const values=[
      {label:'应急仓储网点',value:wh.length,unit:'个',icon:'warehouse',color:'var(--cyan)'},
      {label:'应急物资明细',value:ms.length,unit:'条',icon:'box',color:'var(--magenta)'},
      {label:'应急队伍数量',value:teams,unit:'支',icon:'users',color:'var(--purple)'},
      {label:'交通运输机构',value:transport.length,unit:'个',icon:'truck',color:'var(--blue)'},
      {label:'应急装备记录',value:equipment.length,unit:'条',icon:'radio',color:'var(--amber)'}
    ];
    $('#kpis').innerHTML=values.map(k=>`<div class="kpi" style="--kpi-color:${k.color}"><span class="kpi-symbol">${icon(k.icon)}</span><span class="kpi-content"><span class="kpi-label">${k.label}</span><span class="kpi-value">${number(k.value)}<small>${k.unit}</small></span></span></div>`).join('');
  }
  function renderWarehouses(){
    const list=visibleNodes().filter(n=>n.type==='warehouse');
    const levels=[...new Set(D.warehouses.map(n=>n.level).filter(Boolean))];
    $('#network-tiers').style.gridTemplateColumns=`repeat(${Math.max(1,levels.length)},minmax(0,1fr))`;
    $('#network-tiers').innerHTML=levels.map(level=>`<div class="tier"><strong>${number(list.filter(n=>n.level===level).length)}</strong><small>${esc(level)}</small></div>`).join('');
    $('#warehouse-count').textContent=`当前 ${number(list.length)} 个`;
    const rank={'市级':0,'县级':1,'乡镇级':2,'村级':3},sorted=[...list].sort((a,b)=>(rank[a.level]??9)-(rank[b.level]??9)||a.name.localeCompare(b.name,'zh-CN'));
    const pages=Math.max(1,Math.ceil(sorted.length/state.warehousePageSize));state.warehousePage=Math.min(state.warehousePage,pages);
    const start=(state.warehousePage-1)*state.warehousePageSize,shown=sorted.slice(start,start+state.warehousePageSize);
    $('#warehouse-list').innerHTML=shown.length?shown.map(n=>`<button class="warehouse-row" data-node="${esc(n.id)}" aria-label="查看${esc(n.name)}详情"><span class="warehouse-icon">${icon('warehouse')}</span><span class="warehouse-info"><strong>${esc(n.name)}</strong><small>${[district(n.district)?.short||n.admin,n.level||n.category].filter(Boolean).map(esc).join(' · ')}</small></span></button>`).join(''):'<p class="empty-state">当前筛选下没有仓储记录</p>';
    $('#warehouse-pagination').innerHTML=sorted.length?`<button class="outline-button" data-warehouse-page="prev" ${state.warehousePage<=1?'disabled':''}>上一页</button><span>第 ${number(state.warehousePage)} / ${number(pages)} 页</span><button class="outline-button" data-warehouse-page="next" ${state.warehousePage>=pages?'disabled':''}>下一页</button>`:'';
  }
  function renderMaterials(){
    const ms=matchingMaterials(),categories=new Map();
    ms.forEach(m=>categories.set(m.category||'品类未填',(categories.get(m.category||'品类未填')||0)+1));
    const sorted=[...categories].sort((a,b)=>b[1]-a[1]),max=sorted[0]?.[1]||1;
    $('#material-list').innerHTML=sorted.map(([name,count])=>`<div class="material-row"><span class="material-row-head"><span>${esc(name)}</span><strong>${number(count)}</strong></span><span class="material-track"><i style="width:${Math.max(3,count/max*100)}%"></i></span></div>`).join('')||'<p class="empty-state">当前筛选下没有物资明细</p>';
  }
  function renderResourcePanel(type){
    const list=visibleNodes().filter(n=>n.type===type),id=type==='transport'?'transport':'team';
    if(type==='transport'){
      const byType=new Map();list.forEach(n=>byType.set(n.category||'类型未填',(byType.get(n.category||'类型未填')||0)+1));
      $('#transport-summary').innerHTML=`<strong>${number(list.length)}</strong><span>个运输机构</span><small>${[...byType].map(([k,v])=>`${esc(k)} ${v}`).join(' · ')||'无匹配记录'}</small>`;
      $(`#${id}-list`).innerHTML=list.map(n=>`<button class="resource-row" data-node="${n.id}"><span><strong>${esc(n.name)}</strong><small>${esc(district(n.district)?.short||n.admin||'区县未归属')} · ${esc(n.mode||n.category||'')}</small></span><b>${icon('arrow-right')}</b></button>`).join('')||'<p class="empty-state">当前筛选下没有运输机构</p>';
    }else{
      const ranked=list.filter(n=>n.teamCount!==null).sort((a,b)=>b.teamCount-a.teamCount),total=teamCountFor(list);
      $('#team-summary').innerHTML=`<strong>${number(total)}</strong><span>支救援队伍</span><small>${state.district==='all'?'全市系统统计 · 按区域汇总':'当前区县统计'}</small>`;
      $(`#${id}-list`).innerHTML=ranked.map(n=>`<div class="resource-row static-row"><span><strong>${esc(n.name)}</strong><small>辖区统计</small></span><b>${number(n.teamCount)} 支</b></div>`).join('')||'<p class="empty-state">当前筛选下没有区域统计</p>';
    }
  }
  function renderEquipment(){
    const list=visibleNodes().filter(n=>n.type==='equipment'),groups=new Map();
    list.forEach(n=>{const key=n.equipmentType||n.name;if(!groups.has(key))groups.set(key,{rows:0,qty:new Map()});const g=groups.get(key);g.rows++;if(n.unit)g.qty.set(n.unit,(g.qty.get(n.unit)||0)+(Number(n.quantity)||0));});
    const qty=[...new Map(list.filter(n=>n.unit).map(n=>[n.unit,0])).keys()].map(unit=>`${number(list.filter(n=>n.unit===unit).reduce((s,n)=>s+(Number(n.quantity)||0),0))} ${esc(unit)}`).join(' · ');
    $('#equipment-summary').innerHTML=`<strong>${number(list.length)}</strong><span>条装备记录</span><small>${qty||'数量未提供'}</small>`;
    $('#equipment-list').innerHTML=[...groups].sort((a,b)=>b[1].rows-a[1].rows).map(([name,g])=>`<div class="resource-row static-row"><span><strong>${esc(name)}</strong><small>${number(g.rows)} 条记录 · ${[...g.qty].map(([u,q])=>`${number(q)} ${esc(u)}`).join(' · ')||'数量未填'}</small></span></div>`).join('')||'<p class="empty-state">当前筛选下没有装备记录</p>';
  }
  function currentLedgerRows(){
    const ns=visibleNodes(),ms=matchingMaterials();let list=[];
    if(state.ledger==='all')list=[...ns,...ms.map(m=>({...m,type:'material',id:`M${m.rowId}`}))];
    else if(state.ledger==='material')list=ms.map(m=>({...m,type:'material',id:`M${m.rowId}`}));
    else list=ns.filter(n=>n.type===state.ledger);
    return list;
  }
  function ledgerCells(r){
    const area=esc(district(r.district)?.name||r.admin||'未提供');
    if(r.type==='material'){
      const warehouse=warehouseById.get(r.warehouseId);
      return `<td>${esc(r.name)}<small>${esc(r.category||'品类未填')} · ${esc(r.spec||'未填规格')}</small></td><td>${area}</td><td>${number(r.quantity)} ${esc(r.unit||'单位未填')}</td><td>${esc(warehouse?.name||'')}</td><td><button class="text-button" data-material-row="${r.rowId}">明细 ${icon('arrow-right')}</button></td>`;
    }
    const detailCell=state.ledger==='team'?'':`<td><button class="text-button" data-node="${r.id}">详情 ${icon('arrow-right')}</button></td>`;
    return `<td>${esc(r.name)}<small>${esc(typeMeta[r.type].label)} · ${esc(r.id)}</small></td><td>${area}</td><td>${resourceAbility(r)}</td><td>${esc(r.address||r.organization||r.admin||'未提供')}</td>${detailCell}`;
  }
  function renderLedger(){
    if(state.view!=='list')return;
    const rows=currentLedgerRows(),pages=Math.max(1,Math.ceil(rows.length/state.pageSize));state.page=Math.min(state.page,pages);
    const headers=state.ledger==='material'?['物资名称','所属区县','数量','所属仓库','']:state.ledger==='team'?['资源名称','所属区县','资源信息','地址 / 管理单位']:['资源名称','所属区县','资源信息','地址 / 管理单位',''];
    $('#ledger-head').innerHTML=`<tr>${headers.map(x=>`<th>${x}</th>`).join('')}</tr>`;
    $('#ledger-result').textContent=`${state.district==='all'?'全市范围':district(state.district)?.name||'当前区域'} · 共 ${number(rows.length)} 条记录 · 每页 ${state.pageSize} 条`;
    const shown=rows.slice((state.page-1)*state.pageSize,state.page*state.pageSize);
    $('#ledger-rows').innerHTML=shown.map(r=>`<tr>${ledgerCells(r)}</tr>`).join('')||`<tr><td colspan="${state.ledger==='team'?4:5}" class="empty-state">没有匹配记录，请调整区域或关键词</td></tr>`;
    $('#ledger-pagination').innerHTML=`<button class="outline-button" data-page="prev" ${state.page<=1?'disabled':''}>上一页</button><span>第 ${number(state.page)} / ${number(pages)} 页</span><button class="outline-button" data-page="next" ${state.page>=pages?'disabled':''}>下一页</button>`;
    $$('[data-ledger]').forEach(b=>b.classList.toggle('active',b.dataset.ledger===state.ledger));
  }
  function render(){
    renderKpis();renderWarehouses();renderMaterials();renderResourcePanel('transport');renderResourcePanel('team');renderEquipment();renderLedger();
    $('#current-region').textContent=state.district==='all'?'全域资源网络':district(state.district)?.name||'未归属区县';
    $$('#map-layers button').forEach(b=>{const active=state.layers.has(b.dataset.layer);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    if(map)renderMap();
  }
  function boundaryStyle(f){
    const type=[...state.layers][0]||'warehouse',name=f.properties?.name,d=D.districts.find(x=>x.name===name),count=d?teamCountForDistrict(d.id):0;
    if(type==='team'&&d&&f.properties.level==='district'){
      const color=count>=200?'#d9c9ff':count>=100?'#7c5ce0':count>=50?'#315dc8':'#293f8f';
      const opacity=count>=200?.58:count>=100?.48:count>=50?.38:.3;
      return {color:'#a7d9d0',weight:1.15,opacity:.85,fillColor:color,fillOpacity:opacity};
    }
    return {color:'#72d5c0',weight:f.properties.level==='district'?1:1.6,opacity:.65,fillColor:'#3ed1ac',fillOpacity:.035};
  }
  function initMap(){
    map=L.map('map',{zoomControl:false,attributionControl:true,preferCanvas:true,zoomSnap:.25,minZoom:6,maxZoom:16}).setView([31.48,104.72],7.75);
    const linkPane=map.createPane('warehouseLinksPane');linkPane.style.zIndex='399';linkPane.style.pointerEvents='none';warehouseLinkRenderer=L.svg({pane:'warehouseLinksPane',padding:.5});
    markers=L.layerGroup().addTo(map);
    boundaryLayer=L.geoJSON(window.CITY_GEOJSON,{style:boundaryStyle,onEachFeature:(f,layer)=>{
      const d=D.districts.find(x=>x.name===f.properties.name);if(d){layer.on('click',()=>{if(!state.layers.has('team'))setDistrict(d.id);});layer.on('mouseover',e=>{const path=e.target.getElement();if(path)path.style.cursor=state.layers.has('team')?'default':'pointer';});layer.bindTooltip(d.name,{sticky:true});}
    }}).addTo(map);
    map.on('zoomend moveend',()=>{clearTimeout(renderTimer);renderTimer=setTimeout(renderMap,100);});
    setBasemap('satellite');fitScope();renderMap();
  }
  function setBasemap(mode){
    if(!map)return;state.basemap=mode;if(basemapLayer)map.removeLayer(basemapLayer);
    const attribution=mode==='satellite'?'Imagery © Esri':'© OpenStreetMap © CARTO';
    if(mode==='satellite'){
      const available=new Set(window.LOCAL_SATELLITE_TILES||[]);
      const LocalTiles=L.TileLayer.extend({getTileUrl(coords){const key=`${coords.z}-${coords.x}-${coords.y}`;return available.has(key)?`assets/tiles/${key}.jpg`:`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${coords.z}/${coords.y}/${coords.x}`;}});
      basemapLayer=new LocalTiles('',{maxZoom:17,attribution});
    }else basemapLayer=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{maxZoom:17,attribution,subdomains:'abcd'});
    basemapLayer.on('tileerror',()=>$('#offline-notice').hidden=false);basemapLayer.addTo(map);$('.map-panel').classList.toggle('simple',mode==='simple');
  }
  function fitScope(){
    if(!map)return;
    let list=state.district==='all'?D.nodes.filter(n=>n.latlng&&cityResourceNodes.has(n)):D.nodes.filter(n=>n.district===state.district&&n.latlng&&cityResourceNodes.has(n));
    if(!list.length){const geo=D.districts.find(d=>d.id===state.district);if(geo){const feature=window.CITY_GEOJSON.features.find(f=>f.properties.name===geo.name);if(feature)map.fitBounds(L.geoJSON(feature).getBounds(),{padding:[55,55],maxZoom:10.5});}return;}
    const b=L.latLngBounds(list.map(n=>n.latlng)),compact=window.innerWidth<700;
    const displayPixelWidth=Math.max(window.innerWidth,window.screen?.width||0)*window.devicePixelRatio;
    const cityMaxZoom=displayPixelWidth>=2400?9:8.2;
    map.fitBounds(b,{paddingTopLeft:[compact?25:45,state.district==='all'?(compact?145:110):105],paddingBottomRight:[compact?25:45,220],maxZoom:state.district==='all'?cityMaxZoom:11.5,animate:true,duration:.6});
  }
  function renderPointLegend(type){
    if(type==='warehouse')return '<span class="legend-title">仓库等级</span>'+Object.entries(warehouseLevelColors).map(([level,color])=>`<span><i class="legend-node" style="--legend-color:${color}"></i>${level}</span>`).join('')+'<span title="仅匹配同一区县的相邻层级仓点；坐标与台账区县不一致的记录暂不参与连线"><i class="legend-line"></i>同区上下级仓网</span><span id="visible-map-count" class="visible-map-count"></span>';
    if(type==='team')return '<span>辖区队伍数</span><span><i class="legend-swatch" style="--legend-color:#293f8f"></i>1–49</span><span><i class="legend-swatch" style="--legend-color:#315dc8"></i>50–99</span><span><i class="legend-swatch" style="--legend-color:#7c5ce0"></i>100–199</span><span><i class="legend-swatch" style="--legend-color:#d9c9ff"></i>200+</span><span id="visible-map-count" class="visible-map-count"></span>';
    const levels=[...new Set(visibleNodes().filter(n=>n.type===type&&cityResourceNodes.has(n)).map(resourcePointLevel))].sort((a,b)=>warehouseRank[a]-warehouseRank[b]);
    return '<span class="legend-title">点位等级</span>'+levels.map(level=>`<span><i class="legend-node" style="--legend-color:${pointLevelColors[type][level]}"></i>${level}</span>`).join('')+'<span id="visible-map-count" class="visible-map-count"></span>';
  }
  function renderMap(){
    if(!map||!markers)return;warehouseFlowGroup?.remove();warehouseFlowGroup=null;markers.clearLayers();
    const type=[...state.layers][0]||'warehouse',zoom=map.getZoom(),bounds=map.getBounds().pad(.08);
    boundaryLayer?.setStyle(boundaryStyle);
    boundaryLayer?.eachLayer(layer=>{const d=D.districts.find(x=>x.name===layer.feature?.properties?.name);if(d)layer.setTooltipContent(type==='team'?`${d.name} · ${number(teamCountForDistrict(d.id))} 支救援队伍`:`${d.name} · 点击查看资源`);});
    const all=visibleNodes().filter(n=>n.type===type&&n.latlng&&cityResourceNodes.has(n)&&bounds.contains(n.latlng));
    let shown=all;
    if(type==='warehouse'){
      // 市域初始视图已展示到乡镇级；缩小时收回乡镇，放大到街道尺度后再展示村级。
      const tier=zoom<7.1?1:zoom<11.2?2:3;
      shown=all.filter(n=>resourcePointRank(n)<=tier);
      if(zoom>=9.8&&zoom<12.6){
        const minGap=zoom<11.15?18:12,occupied=[];
        shown=[...shown].sort((a,b)=>(resourcePointRank(a)-resourcePointRank(b))||a.name.localeCompare(b.name,'zh-CN')).filter(n=>{const p=map.latLngToContainerPoint(n.latlng);if(occupied.some(q=>(q.x-p.x)**2+(q.y-p.y)**2<minGap*minGap))return false;occupied.push(p);return true;});
      }
      const activeIds=new Set(shown.map(n=>n.id));
      const flowPaths=[];
      warehouseLinks.forEach(([parent,child])=>{
        if(!cityResourceNodes.has(parent)||!cityResourceNodes.has(child)||!activeIds.has(child.id))return;
        const line=L.polyline([parent.latlng,child.latlng],{renderer:warehouseLinkRenderer,color:'#3d96ea',weight:zoom<9?1.7:1.3,opacity:zoom<9?.66:.58,interactive:false,className:'warehouse-network-link',warehouseParentId:parent.id,warehouseChildId:child.id}).addTo(markers);
        const path=line.getElement();if(path)flowPaths.push(path);
      });
      if(flowPaths.length){
        const svgNs='http://www.w3.org/2000/svg';warehouseFlowGroup=document.createElementNS(svgNs,'g');warehouseFlowGroup.setAttribute('class','warehouse-flow-pulses');
        flowPaths.forEach((path,index)=>{
          const pathId=`warehouse-flow-path-${index}`;path.setAttribute('id',pathId);
          const pulse=document.createElementNS(svgNs,'g');pulse.setAttribute('class','warehouse-flow-pulse');
          const motion=document.createElementNS(svgNs,'animateMotion');motion.setAttribute('dur',`${Math.max(3.6,Math.min(9,path.getTotalLength()/80))}s`);motion.setAttribute('repeatCount','indefinite');motion.setAttribute('calcMode','linear');
          const motionPath=document.createElementNS(svgNs,'mpath');motionPath.setAttribute('href',`#${pathId}`);motionPath.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',`#${pathId}`);motion.appendChild(motionPath);
          const halo=document.createElementNS(svgNs,'circle');halo.setAttribute('r','1.875');halo.setAttribute('class','warehouse-flow-halo');
          const core=document.createElementNS(svgNs,'circle');core.setAttribute('r','0.84375');core.setAttribute('class','warehouse-flow-core');
          pulse.append(motion,halo,core);warehouseFlowGroup.appendChild(pulse);
        });
        warehouseLinkRenderer._rootGroup.appendChild(warehouseFlowGroup);
      }
    }else if(zoom<10.5){
      // 仅压缩几乎重叠的点，避免全市视图因过度避让而看不到资源分布。
      const occupied=[],minGap=zoom<8.5?14:zoom<9.8?8:0;
      shown=minGap?[...all].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')).filter(n=>{const p=map.latLngToContainerPoint(n.latlng);if(occupied.some(q=>(q.x-p.x)**2+(q.y-p.y)**2<minGap*minGap))return false;occupied.push(p);return true;}):all;
    }
    for(const n of shown){
      const rank=resourcePointRank(n),size=rank===0?8.5:rank===1?7:rank===2?5.8:4.8,color=resourcePointColor(n);
      const point=L.circleMarker(n.latlng,{radius:size,color:'#f1fff9',weight:rank===0?1.6:1.1,fillColor:color,fillOpacity:1,opacity:1,className:'resource-point-marker'}).addTo(markers);
      point.resourceNode=n;
      point.on('click',()=>showNode(n.id));
      point.bindTooltip(esc(n.name)+' · '+esc(typeMeta[n.type].label)+(type==='warehouse'?(n.level?' · '+esc(resourcePointLevel(n)):' · 名称识别层级 '+esc(resourcePointLevel(n))):' · 识别层级 '+esc(resourcePointLevel(n))),{direction:'top',offset:[0,-4]});
    }
    $('#map-legend').innerHTML=renderPointLegend(type);
    $('#visible-map-count').textContent=type==='team'?`全市统计 ${number(teamCountFor(visibleNodes()))} 支`:'当前视野 '+number(shown.length)+' 个';
  }
  function closeDrawer(restoreFocus=true){const wasOpen=!$('#detail-drawer').hidden;$('#detail-drawer').hidden=true;state.selected=null;if(wasOpen&&restoreFocus&&drawerReturnFocus?.isConnected)drawerReturnFocus.focus({preventScroll:true});}
  function focusPanelControl(control,panel){const r=control.getBoundingClientRect();if(r.top<0||r.bottom>window.innerHeight)panel.scrollIntoView({block:'start',behavior:'instant'});control.focus({preventScroll:true});}
  function setView(view,type){
    const previous=state.view;if(view==='list'&&previous!=='list')ledgerReturnFocus=document.activeElement;
    state.view=view;if(type){state.ledger=type;state.page=1;}closeDrawer(false);$('#ledger').hidden=view!=='list';
    $$('.map-panel > :not(#ledger):not(#detail-drawer)').forEach(el=>el.inert=view==='list');
    $('#open-ledger').classList.toggle('active',view==='list');$('#open-ledger').setAttribute('aria-expanded',String(view==='list'));
    $('#open-ledger').title=view==='list'?'收起资源台账，返回地图':'打开资源台账';renderLedger();
    if(view==='list')focusPanelControl($('#close-ledger'),$('#ledger'));else if(previous==='list')(ledgerReturnFocus?.isConnected&&!ledgerReturnFocus.closest('[hidden]')?ledgerReturnFocus:$('#open-ledger')).focus({preventScroll:true});
  }
  function toggleLedger(){setView(state.view==='list'?'map':'list','all');}
  function setDistrict(id){state.district=id;state.warehousePage=1;$('#district-filter').value=id;closeDrawer(false);render();fitScope();}
  function returnHome(){state.district='all';state.search='';state.warehousePage=1;$('#district-filter').value='all';$('#search').value='';setView('map');render();fitScope();}
  function showNode(id){
    const n=D.nodes.find(x=>x.id===id);if(!n)return;if(state.view==='list')setView('map');state.selected=id;
    const d=district(n.district),drawer=$('#detail-drawer'),items=n.type==='warehouse'?(materialsByWarehouse.get(n.id)||[]):[];
    if(drawer.hidden)drawerReturnFocus=document.activeElement;
    let detail='';
    if(n.type==='warehouse')detail=`<section class="drawer-section"><h3>关联物资明细 <small>${number(items.length)} 条，沿用原计量单位</small></h3><div class="drawer-table-wrap"><table class="drawer-material-table"><thead><tr><th>物资名称 / 品类</th><th>规格</th><th>数量</th></tr></thead><tbody>${items.map(m=>`<tr><td>${esc(m.name)}<small>${esc(m.category)}</small></td><td>${esc(m.spec||'未填')}</td><td>${fmtMaybe(m.quantity)} ${esc(m.unit)}</td></tr>`).join('')||'<tr><td colspan="3">无关联物资明细</td></tr>'}</tbody></table></div></section>`;
    if(n.type==='team')detail=`<section class="drawer-section"><h3>区域数量统计</h3><div class="detail-row"><span>应急队伍数量</span><b>${n.teamCount===null?'未提供':`${number(n.teamCount)} 支`}</b></div></section>`;
    if(n.type==='transport')detail=`<section class="drawer-section"><h3>机构信息</h3>${[['站场类型',n.category],['运输方式',n.mode],['吞吐能力',n.capacity],['站场面积',n.area],['负责人',n.responsible],['联系电话',n.phone],['用途',n.purpose]].filter(x=>x[1]).map(([k,v])=>`<div class="detail-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')||'<p class="empty-state">表中未提供更多机构属性</p>'}</section>`;
    if(n.type==='equipment')detail=`<section class="drawer-section"><h3>装备信息</h3>${[['设备类型',n.equipmentType],['使用单位',n.organization],['数量',fmtMaybe(n.quantity,` ${n.unit||''}`)],['行政区划',n.admin]].filter(x=>x[1]).map(([k,v])=>`<div class="detail-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</section>`;
    const locationConflict=Boolean(n.latlng&&n.district!=='unknown'&&!insideDistrict(n.latlng,n.district));
    const locationRow=n.address?`<div class="detail-row"><span>地址</span><b>${esc(n.address)}</b></div>`:n.type==='transport'&&n.latlng?`<div class="detail-row"><span>坐标</span><b>${n.latlng[1]}, ${n.latlng[0]}</b></div>`:'';
    const locationNotice=locationConflict?'<div class="detail-row"><span>点位核验</span><b>来源坐标与台账区县不一致，已从地图点位和仓网连线中排除；地址及记录仍保留。</b></div>':'';
    drawer.innerHTML=`<div class="drawer-top"><span class="eyebrow">${esc(typeMeta[n.type].label)} / ${esc(n.id)}</span><button class="icon-button" data-close-drawer aria-label="关闭资源详情">${icon('close')}</button></div><h2>${esc(n.name)}</h2><div class="drawer-meta"><span>${esc(d?.name||n.admin||'区县未归属')}</span></div><section class="drawer-section"><h3>基础信息</h3><div class="detail-row"><span>行政区划</span><b>${esc(n.admin||d?.name||'未提供')}</b></div>${locationRow}${locationNotice}${n.organization?`<div class="detail-row"><span>管理 / 使用单位</span><b>${esc(n.organization)}</b></div>`:''}${n.category?`<div class="detail-row"><span>类别</span><b>${esc(n.category)}</b></div>`:''}${n.level?`<div class="detail-row"><span>仓库级别</span><b>${esc(n.level)}</b></div>`:''}${n.capacity&&n.type==='warehouse'?`<div class="detail-row"><span>仓库容积</span><b>${esc(n.capacity)}</b></div>`:''}</section>${detail}<div class="drawer-actions">${n.latlng&&cityResourceNodes.has(n)?`<button class="primary-button" data-locate="${n.id}">${icon('focus')}地图定位</button>`:''}${n.district?`<button class="outline-button" data-scope="${n.district}">查看区县资源</button>`:''}</div>`;
    drawer.hidden=false;drawer.scrollTop=0;renderMap();focusPanelControl(drawer.querySelector('[data-close-drawer]'),drawer);
  }
  function showMaterial(rowId){
    const m=D.materials[rowId];if(!m)return;const w=warehouseById.get(m.warehouseId);
    showModal(`${m.name} · 物资明细`,`<div class="modal-copy"><p><b>物资品类</b>：${esc(m.category||'未填')}</p><p><b>规格型号</b>：${esc(m.spec||'未填')}</p><p><b>数量</b>：${fmtMaybe(m.quantity)} ${esc(m.unit||'单位未填')}</p><p><b>所属仓库</b>：${esc(w?.name||'未匹配')}</p><p><b>仓库地址</b>：${esc(w?.address||'未提供')}</p></div>${w?`<button class="related-node" data-node="${w.id}"><strong>打开仓库详情</strong><span>查看关联物资与地图位置 ↗</span></button>`:''}`);
  }
  function showCluster(group){
    showModal(`${number(group.length)} 个资源点 · 同位置或邻近区域`,`<div class="cluster-list">${group.map(n=>`<button class="related-node" data-node="${n.id}"><strong>${esc(n.name)}</strong><span>${esc(typeMeta[n.type].label)} · ${esc(district(n.district)?.short||n.admin||'区县未归属')} ↗</span></button>`).join('')}</div>`);
  }
  function showModal(title,content){$('#modal-title').textContent=title;$('#modal-content').innerHTML=content;if(!$('#modal').open)$('#modal').showModal();}
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
  function exportCsv(){
    const list=currentLedgerRows(),head=['类型','名称','区县','地址 / 所属仓库','分类 / 规格','数量 / 信息','单位'];
    const rows=[head,...list.map(r=>r.type==='material'?['物资',r.name,district(r.district)?.name||r.admin||'',warehouseById.get(r.warehouseId)?.name||'',`${r.category||''} ${r.spec||''}`,r.quantity??'',r.unit||'']:[typeMeta[r.type].label,r.name,district(r.district)?.name||r.admin||'',r.address||r.organization||'',r.category||r.equipmentType||'',resourceAbility(r),''])];
    const cell=v=>{let s=String(v??'');if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`应急资源台账-${state.ledger}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`已导出 ${number(list.length)} 条记录`);
  }
  function bindEvents(){
    $('.brand').addEventListener('click',e=>{e.preventDefault();returnHome();});
    $('#open-ledger').addEventListener('click',toggleLedger);$('#close-ledger').addEventListener('click',()=>setView('map'));
    $('#district-filter').addEventListener('change',e=>setDistrict(e.target.value));
    $('#search').addEventListener('input',e=>{state.search=e.target.value.trim();state.page=1;state.warehousePage=1;closeDrawer(false);render();});
    $('#home-region').addEventListener('click',()=>setDistrict('all'));$('#reset-map').addEventListener('click',returnHome);
    $('#zoom-in').addEventListener('click',()=>map?.zoomIn());$('#zoom-out').addEventListener('click',()=>map?.zoomOut());
    $('#close-modal').addEventListener('click',()=>$('#modal').close());
    $('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}});
    $('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前浏览器不支持全屏，可使用 F11');}});
    $('#export').addEventListener('click',exportCsv);
    document.addEventListener('keydown',e=>{
      if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#modal').open){e.preventDefault();$('#search').focus();}
      if(e.key!=='Escape')return;
      if($('#modal').open){e.preventDefault();$('#modal').close();}else if(!$('#detail-drawer').hidden){e.preventDefault();closeDrawer();}else if(state.view==='list'){e.preventDefault();setView('map');}
    });
    document.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.ledger){state.ledger=b.dataset.ledger;state.page=1;renderLedger();}
      if(b.dataset.node){if($('#modal').open)$('#modal').close();showNode(b.dataset.node);}
      if(b.hasAttribute('data-close-drawer'))closeDrawer();
      if(b.dataset.district)setDistrict(b.dataset.district);
      if(b.dataset.scope){setDistrict(b.dataset.scope);setView('map');}
      if(b.dataset.locate){const n=D.nodes.find(x=>x.id===b.dataset.locate);setView('map');closeDrawer();if(n?.district&&state.district!==n.district)setDistrict(n.district);if(n?.latlng&&cityResourceNodes.has(n))map?.flyTo(n.latlng,14,{duration:.6});toast(`已定位：${n?.name||''}`);}
      if(b.dataset.layer){const t=b.dataset.layer;if(!typeMeta[t])return;state.layers.clear();state.layers.add(t);closeDrawer(false);render();}
      if(b.dataset.warehousePage){state.warehousePage+=b.dataset.warehousePage==='next'?1:-1;renderWarehouses();}
      if(b.dataset.materialCategory){state.search=b.dataset.materialCategory;$('#search').value=state.search;state.page=1;render();}
      if(b.dataset.materialRow!==undefined)showMaterial(Number(b.dataset.materialRow));
      if(b.dataset.page){state.page+=b.dataset.page==='next'?1:-1;renderLedger();}
    });
  }
  $('#district-filter').insertAdjacentHTML('beforeend',D.districts.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join(''));
  function updateClock(){$('#clock').textContent=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()).replace(' ','  ');}
  icons();bindEvents();setCounts();updateClock();setInterval(updateClock,1000);render();initMap();
  window.ResourceNetwork={state,visibleNodes,render,setDistrict,showNode,setView,closeDrawer,warehouseLinks,insideDistrict,warehouseLinkInsideDistrict,resourcePointLevel,resourcePointColor,isMappableNode:n=>cityResourceNodes.has(n),get mapLayers(){return markers;},get map(){return map;}};
})();
