/* ARCHVISTA VR — static GitHub Pages prototype. No backend, no telemetry. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const demo={"title":"Poorna Market — Linked Sample Experiences","description":"Five connected sample 360° viewpoints for street and interior exploration. Illustrative locations; not a measured redevelopment plan.","scenes":[{"id":"arrival","name":"Arrival Court","zone":"street","chapter":"Urban Arrival","info":"Sample arrival panorama. This is not the actual Poorna Market redevelopment.","image":"assets/arrival-court.jpg","x":12,"y":78,"hotspots":[{"id":"a1","target":"walkway","label":"Side Entrance Walkway","yaw":35,"pitch":-7},{"id":"a2","target":"market","label":"Fresh Produce Market","yaw":65,"pitch":-6}]},{"id":"walkway","name":"Side Entrance Walkway","zone":"street","chapter":"Pedestrian Access","info":"Sample street-level walkway, linked to the arrival and fresh market.","image":"assets/side-entrance-walkway.jpg","x":26,"y":62,"hotspots":[{"id":"b1","target":"arrival","label":"Return to Arrival","yaw":-50,"pitch":-6},{"id":"b2","target":"market","label":"Fresh Produce Market","yaw":30,"pitch":-5}]},{"id":"market","name":"Fresh Produce Market","zone":"interior","chapter":"Market Interiors","info":"Sample produce market panorama. Actual Enscape design render to be added later.","image":"assets/fresh-produce-market.jpg","x":48,"y":48,"hotspots":[{"id":"c1","target":"walkway","label":"Side Entrance","yaw":-40,"pitch":-5},{"id":"c2","target":"community","label":"Community Interior","yaw":42,"pitch":-5},{"id":"c3","target":"lounge","label":"Lounge Interior","yaw":77,"pitch":-6}]},{"id":"community","name":"Community / Craft Interior","zone":"interior","chapter":"Community","info":"Sample indoor community/craft space for demonstrating room links.","image":"assets/community-craft-interior.jpg","x":70,"y":32,"hotspots":[{"id":"d1","target":"market","label":"Fresh Produce","yaw":-45,"pitch":-6},{"id":"d2","target":"lounge","label":"Lounge Interior","yaw":39,"pitch":-5}]},{"id":"lounge","name":"Lounge Interior","zone":"interior","chapter":"Interior Experience","info":"Sample lounge panorama; not a final market space or architectural design.","image":"assets/lounge-interior.jpg","x":82,"y":56,"hotspots":[{"id":"e1","target":"market","label":"Fresh Produce","yaw":-65,"pitch":-5},{"id":"e2","target":"community","label":"Community Interior","yaw":-25,"pitch":-5}]}]};
let project=structuredClone(demo),currentId='arrival',editingId='arrival',objectUrls=new Map(),menuVisible=false,exploreMode='free',sceneFilter='all',mapFilter='all';
const scene=id=>project.scenes.find(s=>s.id===id), safeText=v=>String(v??'');
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').classList.remove('show'),3600)}
function showPage(name){$$('.page').forEach(p=>p.classList.toggle('active',p.id===name));$$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===name));if(name==='editor')renderEditor();if(name==='viewer'){renderScene();requestAnimationFrame(()=>requestAnimationFrame(resizePanoramaCanvas));}}
function resizePanoramaCanvas(){const sc=$('#vrScene');if(!sc||!sc.renderer)return;const canvas=sc.canvas||sc.querySelector('canvas'),host=sc.parentElement;const w=Math.max(1,host?.clientWidth||0),h=Math.max(1,host?.clientHeight||0);if(w<10||h<10)return;if(sc.resize)sc.resize();else sc.renderer.setSize(w,h,false);if(canvas){canvas.style.width='100%';canvas.style.height='100%'}}
function renderProjects(){const grid=$('#projectGrid');grid.replaceChildren();const card=el('article','project-card');const image=el('img');image.src=project.scenes[0]?.image||'assets/atrium.jpg';image.alt='Tour preview';card.append(image);const body=el('div','card-content');body.append(el('div','card-tag','360° • VR ENABLED'),el('h3','',project.title),el('p','',`${project.scenes.length} viewpoints · street + interior · sample imagery`));const btn=el('button','card-open','Explore Poorna Market ↗');btn.onclick=()=>showPage('viewer');body.append(btn);card.append(body);grid.append(card);}
let teleportBusy=false;async function selectScene(id){const destination=scene(id);if(!destination||teleportBusy)return;if(id===currentId){renderMiniMap();return;}teleportBusy=true;const vr=$('#vrScene').is('vr-mode'),fade=$('#teleportFade');if(!vr)fade.classList.add('active');const image=new Image();image.src=destination.image;try{await Promise.race([image.decode(),new Promise(resolve=>setTimeout(resolve,2500))])}catch(e){}await new Promise(resolve=>setTimeout(resolve,vr?50:210));currentId=id;renderScene();if(!vr){setTimeout(()=>fade.classList.remove('active'),80)}teleportBusy=false;}
function renderScene(){const s=scene(currentId)||project.scenes[0];if(!s)return;currentId=s.id;$('#projectTitle').textContent=project.title;$('#roomTitle').textContent=`${s.name} · ${project.scenes.indexOf(s)+1} / ${project.scenes.length} · SAMPLE PANORAMA`;$('#modeIndicator').textContent=exploreMode==='guided'?'GUIDED WALKTHROUGH':'FREE EXPLORATION';$('#chapterLabel').textContent=`${s.chapter||'MARKET EXPERIENCE'} / ${project.scenes.indexOf(s)+1} OF ${project.scenes.length}`.toUpperCase();$('#chapterText').textContent=s.info||'Explore the market viewpoint.';$('.chapter-panel').classList.toggle('guided',exploreMode==='guided');$('.explore-tools').style.display=exploreMode==='free'?'flex':'none';const sky=$('#sky');if(sky.getAttribute('src')!==s.image)sky.setAttribute('src',s.image);const bar=$('#sceneBar');bar.replaceChildren();project.scenes.filter(item=>exploreMode==='guided'||sceneFilter==='all'||(item.zone||'street')===sceneFilter).forEach((item,i)=>{const b=el('button','scene-pill'+(item.id===s.id?' selected':''),`${String(i+1).padStart(2,'0')}  ${item.name}`);b.onclick=()=>selectScene(item.id);bar.append(b)});renderWorldHotspots();renderVRMenu();renderMiniMap();renderVRMiniMap();}
function renderMiniMap(){const pins=$('#miniMapPins');if(!pins)return;pins.replaceChildren();project.scenes.forEach((s,i)=>{const b=el('button','mini-pin '+(s.zone||'street')+(s.id===currentId?' current':''),String(i+1));b.style.left=Math.min(92,Math.max(8,Number(s.x)||45))+'%';b.style.top=Math.min(90,Math.max(8,Number(s.y)||45))+'%';b.title='Teleport to '+s.name;b.setAttribute('aria-label',b.title);b.onclick=()=>selectScene(s.id);pins.append(b)});$('#miniLocation').textContent=scene(currentId)?.name||'Unknown';}
function renderVRMiniMap(){
 const root=$('#vrMiniMap');if(!root)return;
 root.replaceChildren();if(!$('#vrScene')?.is('vr-mode'))return;
 const bg=document.createElement('a-entity');
 bg.setObject3D('mesh',new THREE.Mesh(new THREE.PlaneGeometry(.84,.66),new THREE.MeshBasicMaterial({color:'#132f3b',transparent:true,opacity:.95,side:THREE.DoubleSide})));
 root.append(bg);
 const title=document.createElement('a-entity');title.setAttribute('position','0 .263 .02');
 title.setObject3D('mesh',makeCanvasPlane('MARKET MAP (DEMO)',.75,.07,'#1a4450'));root.append(title);
 project.scenes.forEach((s,i)=>{
  const x=(Math.min(92,Math.max(8,Number(s.x)||45))/100-.5)*.70;
  const y=(.5-Math.min(90,Math.max(8,Number(s.y)||45))/100)*.33;
  const pin=document.createElement('a-entity');pin.classList.add('vr-control');
  pin.setAttribute('position',x.toFixed(3)+' '+y.toFixed(3)+' .025');
  const color=s.id===currentId?'#78d7c4':s.zone==='interior'?'#a4586f':'#377b89';
  const mesh=new THREE.Mesh(new THREE.CircleGeometry(s.id===currentId?.038:.029,24),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
  pin.setObject3D('mesh',mesh);pin.addEventListener('click',()=>selectScene(s.id));root.append(pin);
 });
 const foot=document.createElement('a-entity');foot.setAttribute('position','0 -.275 .022');
 foot.setObject3D('mesh',makeCanvasPlane(scene(currentId)?.name||'Location',.75,.09,'#1a4450'));root.append(foot);
}
function positionVRMiniMap(){const root=$('#vrMiniMap'),camera=$('#camera')?.object3D;if(!root||!camera)return;const at=new THREE.Vector3(),rot=new THREE.Quaternion();camera.getWorldPosition(at);camera.getWorldQuaternion(rot);root.object3D.position.copy(at).add(new THREE.Vector3(-.72,-.45,-1.65).applyQuaternion(rot));root.object3D.quaternion.copy(rot);root.setAttribute('visible','true');}
function pos(yaw,pitch,r=8){const ya=yaw*Math.PI/180,pi=pitch*Math.PI/180;return `${(r*Math.sin(ya)*Math.cos(pi)).toFixed(3)} ${(r*Math.sin(pi)).toFixed(3)} ${(-r*Math.cos(ya)*Math.cos(pi)).toFixed(3)}`}

function makeCanvasPlane(label,width,height,bg='#24505a',fg='#ffffff'){
 const canvas=document.createElement('canvas');
 canvas.width=1024;canvas.height=256;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(5,5,1014,246,28);ctx.fill();
 ctx.strokeStyle='#78d7c4';ctx.lineWidth=5;ctx.stroke();
 ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';
 const str=String(label||'').slice(0,45);
 let size=76;ctx.font='600 '+size+'px Arial,sans-serif';
 while(ctx.measureText(str).width>900&&size>32){size-=3;ctx.font='600 '+size+'px Arial,sans-serif'}
 ctx.fillText(str,512,130,900);
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
 mesh.userData.disposeCanvasTexture=()=>{mesh.geometry.dispose();texture.dispose();material.dispose()};
 return mesh;
}
function worldButton(parent,position,label,onClick,{cls='hotspot',width=1.4,background='#123744',height=.42}={}){
 const node=document.createElement('a-entity');node.classList.add(cls);
 node.setAttribute('position',position);
 node.setObject3D('mesh',makeCanvasPlane(label,width,height,background));
 if(cls==='hotspot')node.setAttribute('billboard','');
 node.addEventListener('click',onClick);
 node.addEventListener('mouseenter',()=>node.object3D.getObjectByProperty('type','Mesh')?.material?.color?.set('#b5fff0'));
 node.addEventListener('mouseleave',()=>node.object3D.getObjectByProperty('type','Mesh')?.material?.color?.set('#ffffff'));
 parent.append(node);return node;
}
function renderWorldHotspots(){
 const root=$('#sceneHotspots');root.replaceChildren();const s=scene(currentId);
 (s?.hotspots||[]).forEach(h=>{if(!scene(h.target))return;
 worldButton(root,pos(Number(h.yaw),Number(h.pitch)),h.label||scene(h.target).name,()=>selectScene(h.target));
 });
}
if(window.AFRAME&&!AFRAME.components.billboard){
 AFRAME.registerComponent('billboard',{tick(){const cam=this.el.sceneEl.camera;
  if(cam&&this.el.object3D)this.el.object3D.lookAt(cam.getWorldPosition(new THREE.Vector3()));
 }});
}
let vrMenuPage='home',vrScenePage=0;
function renderVRMenu(){
 const root=$('#vrMenu');root.replaceChildren();if(!menuVisible)return;
 let items;
 if(vrMenuPage==='scenes'){
  const pageSize=3,maxPage=Math.max(0,Math.ceil(project.scenes.length/pageSize)-1);
  vrScenePage=Math.min(vrScenePage,maxPage);
  const shown=project.scenes.slice(vrScenePage*pageSize,vrScenePage*pageSize+pageSize);
  items=shown.map(item=>({label:item.name,action:()=>{selectScene(item.id);toggleVRMenu(false)}}));
  items.push({label:`More locations (${vrScenePage+1}/${maxPage+1})`,action:()=>{vrScenePage=(vrScenePage+1)%(maxPage+1);renderVRMenu()}});
  items.push({label:'Back to menu',action:()=>{vrMenuPage='home';renderVRMenu()}});
 }else{
  items=[
   {label:'Next viewpoint',action:()=>{stepTour(1);toggleVRMenu(false)}},
   {label:'Previous viewpoint',action:()=>{stepTour(-1);toggleVRMenu(false)}},
   {label:'Choose location',action:()=>{vrScenePage=0;vrMenuPage='scenes';renderVRMenu()}},
   {label:exploreMode==='guided'?'Explore freely':'Guided walkthrough',action:()=>{setExploreMode(exploreMode==='guided'?'free':'guided',false);renderVRMenu()}},
   {label:'Close menu',action:()=>toggleVRMenu(false)}
  ];
 }
 const w=1.75,rowHeight=.32,panelHeight=items.length*.35+.26;
 const panel=document.createElement('a-entity');
 panel.setAttribute('geometry',`primitive: plane; width: ${w+.22}; height: ${panelHeight}`);
 panel.setAttribute('material','color:#102531;shader:flat;opacity:.95;side:double');
 panel.setAttribute('position','0 0 -0.018');root.append(panel);
 items.forEach((item,i)=>{
  const y=((items.length-1)/2-i)*.35;
  worldButton(root,`0 ${y.toFixed(3)} 0.014`,item.label,item.action,{cls:'vr-control',width:w,background:'#24505a',height:.30});
 });
}
function toggleVRMenu(visible=!menuVisible){
 menuVisible=visible;
 const menu=$('#vrMenu');menu.setAttribute('visible',visible);
 if(visible){
  const camera=$('#camera').object3D;
  const worldPos=new THREE.Vector3(),direction=new THREE.Vector3(),rotation=new THREE.Quaternion();
  camera.getWorldPosition(worldPos);camera.getWorldDirection(direction);camera.getWorldQuaternion(rotation);
  // Place a compact panel in front of the current headset direction.
  const object=menu.object3D;
  object.position.copy(worldPos).addScaledVector(direction,2.2);
  object.quaternion.copy(rotation);
  vrMenuPage='home';
 }
 renderVRMenu();
 notify(visible?'VR menu ready — point and trigger to select':'VR menu closed');
}
function drawPlan(){const pins=$('#planPins'),list=$('#planSceneList');pins.replaceChildren();list.replaceChildren();project.scenes.forEach((s,i)=>{const btn=el('button','plan-pin '+(s.zone||'street')+(s.id===currentId?' active':''),String(i+1));btn.style.left=`${Math.min(92,Math.max(8,s.x??(20+i*15)))}%`;btn.style.top=`${Math.min(90,Math.max(8,s.y??(25+i*14)))}%`;btn.title=s.name;btn.style.display=mapFilter!=='all'&&(s.zone||'street')!==mapFilter?'none':'';btn.onclick=()=>{selectScene(s.id);closeFloor()};pins.append(btn);const row=el('button',(s.id===currentId?'active ':'')+(mapFilter!=='all'&&(s.zone||'street')!==mapFilter?'hidden-filter':''),`${String(i+1).padStart(2,'0')}  [${s.zone||'street'}] ${s.name} ↗`);row.onclick=()=>{selectScene(s.id);closeFloor()};list.append(row)})}
function openFloor(){drawPlan();$('#floorModal').classList.remove('hidden')}function closeFloor(){$('#floorModal').classList.add('hidden')}
function editSelect(id){editingId=id;renderEditor()}
function renderEditor(){if(!scene(editingId))editingId=project.scenes[0]?.id;const s=scene(editingId);if(!s)return;$('#sceneCount').textContent=String(project.scenes.length).padStart(2,'0');const list=$('#editorSceneList');list.replaceChildren();project.scenes.forEach(item=>{const row=el('button','edit-scene'+(item.id===editingId?' active':''));const img=el('img');img.src=item.image;img.alt='';row.append(img,el('span','',item.name));row.onclick=()=>editSelect(item.id);list.append(row)});$('#editorImage').style.backgroundImage=`url(${JSON.stringify(s.image)})`;$('#editRoomName').textContent=s.name;$('#sceneNameInput').value=s.name;$('#sceneImageInput').value=s.image.startsWith('blob:')?'(local preview — export cannot embed this image)':s.image;const dest=$('#hotspotDestination');dest.replaceChildren();project.scenes.filter(z=>z.id!==editingId).forEach(item=>{const o=el('option','',item.name);o.value=item.id;dest.append(o)});$('#hotspotList').replaceChildren();s.hotspots.forEach(h=>{const row=el('div','hotspot-row');row.append(el('span','',`${h.label} → ${scene(h.target)?.name||'Missing scene'}`));const del=el('button','','Remove');del.onclick=()=>{s.hotspots=s.hotspots.filter(z=>z.id!==h.id);renderEditor()};row.append(del);$('#hotspotList').append(row)})}
function saveScene(){const s=scene(editingId);s.name=$('#sceneNameInput').value.trim()||s.name;const img=$('#sceneImageInput').value.trim();if(img&&!img.startsWith('(local preview'))s.image=img;renderEditor();renderProjects();notify('Scene updated in browser. Export JSON to save configuration.')}
function addHotspot(){const s=scene(editingId),target=$('#hotspotDestination').value;if(!target)return notify('Create at least two scenes to add a hotspot');s.hotspots.push({id:'hotspot-'+Date.now(),target,label:$('#hotspotLabel').value.trim()||`Go to ${scene(target).name}`,yaw:Number($('#hotspotYaw').value)||0,pitch:Number($('#hotspotPitch').value)||0});renderEditor();notify('Hotspot added. Preview the tour to verify direction.')}
function exportData(){// Blob previews are not portable. Export image paths as placeholders to avoid falsely promising persisted assets.
const copy=structuredClone(project);copy.scenes.forEach(s=>{if(s.image.startsWith('blob:'))s.image=`assets/${s.id}.jpg`});const a=el('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(copy,null,2)],{type:'application/json'}));a.download='archvista-tour.json';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);notify('JSON exported. Upload referenced images to your GitHub repository separately.')}
function validate(data){if(!data||typeof data.title!=='string'||!Array.isArray(data.scenes)||!data.scenes.length||data.scenes.length>100)throw Error('Invalid project');const ids=new Set();for(const s of data.scenes){if(typeof s.id!=='string'||!s.id||ids.has(s.id)||typeof s.name!=='string'||typeof s.image!=='string'||!Array.isArray(s.hotspots))throw Error('Invalid scene structure');ids.add(s.id)}for(const s of data.scenes){if(!s.hotspots.every(h=>typeof h.target==='string'&&ids.has(h.target)&&Number.isFinite(Number(h.yaw))&&Number.isFinite(Number(h.pitch))))throw Error('Invalid hotspot destinations');if(!/^(assets\/|https:\/\/)/.test(s.image))throw Error('Only local assets/ or HTTPS image URLs are allowed')}return data}
async function loadJson(file){try{const loaded=validate(JSON.parse(await file.text()));objectUrls.forEach(url=>URL.revokeObjectURL(url));objectUrls.clear();project=loaded;editingId=currentId=project.scenes[0].id;renderProjects();renderEditor();notify('Tour configuration imported')}catch(e){notify('Import failed: '+e.message)}}
async function loadImage(file){if(!file||!file.type.startsWith('image/'))return notify('Select a JPEG, PNG or WebP image');const img=new Image();const url=URL.createObjectURL(file);const dims=await new Promise(resolve=>{img.onload=()=>resolve([img.naturalWidth,img.naturalHeight]);img.onerror=()=>resolve(null);img.src=url});if(!dims){URL.revokeObjectURL(url);return notify('Cannot read image')}if(Math.abs(dims[0]/dims[1]-2)>.15){URL.revokeObjectURL(url);return notify('Use a mono 360° equirectangular image with an approximately 2:1 aspect ratio')}const id='scene-'+Date.now();project.scenes.push({id,name:file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '),image:url,x:45,y:45,hotspots:[]});objectUrls.set(id,url);editSelect(id);notify('Local preview loaded. Commit image file to GitHub for permanent hosting.')}
function setExploreMode(mode,open=true){exploreMode=mode;sceneFilter='all';if(open)showPage('viewer');else renderScene();notify(mode==='guided'?'Guided walkthrough: use Next Stop':'Free exploration: choose any location')}function stepTour(delta){const idx=project.scenes.findIndex(s=>s.id===currentId);const next=Math.max(0,Math.min(project.scenes.length-1,idx+delta));selectScene(project.scenes[next].id)}function setSceneFilter(value){sceneFilter=value;$$('.filter-chip').forEach(b=>b.classList.toggle('selected',b.id===(value==='all'?'allFilter':value==='street'?'streetFilter':value==='interior'?'interiorFilter':'facilitiesFilter')));renderScene()}function beginVR(){const sc=$('#vrScene');if(!window.AFRAME||!sc?.enterVR){notify('360 viewer is not initialized. Check A-Frame network loading.');return;}if(!navigator.xr){notify('Immersive VR requires Meta Quest Browser over HTTPS. Desktop still supports 360 viewing.');return;}try{resizePanoramaCanvas();const result=sc.enterVR();if(result?.catch)result.catch(e=>notify('Cannot enter VR: '+(e?.message||'Open in Quest Browser.')));}catch(e){notify('VR entry failed: '+e.message)}}
function init(){renderProjects();$('#startGuided').onclick=()=>{currentId=project.scenes[0].id;setExploreMode('guided')};$('#startFree').onclick=()=>setExploreMode('free');$('#toggleMode').onclick=()=>setExploreMode(exploreMode==='free'?'guided':'free',false);$('#prevStop').onclick=()=>stepTour(-1);$('#nextStop').onclick=()=>stepTour(1);[['allFilter','all'],['streetFilter','street'],['interiorFilter','interior'],['facilitiesFilter','facilities']].forEach(([id,val])=>$('#'+id).onclick=()=>setSceneFilter(val));$$('[data-map-filter]').forEach(b=>b.onclick=()=>{mapFilter=b.dataset.mapFilter;$$('[data-map-filter]').forEach(x=>x.classList.toggle('active',x===b));drawPlan()});$('.nav').forEach(b=>b.onclick=()=>showPage(b.dataset.page));$('#createProject').onclick=()=>{if(!confirm('Replace the current in-browser tour with a blank project? Export any changes first.'))return;project={title:'New Architectural Tour',description:'',scenes:[{id:'scene1',name:'First viewpoint',image:'assets/arrival-court.jpg',x:45,y:45,hotspots:[]}]};editingId=currentId='scene1';renderProjects();showPage('editor')};$('#featuredOpen').onclick=()=>setExploreMode('guided');$('#backDashboard').onclick=()=>showPage('dashboard');$('#planBtn').onclick=openFloor;$('#expandMiniMap').onclick=openFloor;$('#closeFloor').onclick=closeFloor;$('.modal-backdrop').onclick=closeFloor;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFloor()});$('#saveScene').onclick=saveScene;$('#addHotspot').onclick=addHotspot;$('#previewTour').onclick=()=>{currentId=editingId;showPage('viewer')};$('#exportJson').onclick=exportData;$('#importJson').onclick=()=>$('#jsonFile').click();$('#jsonFile').onchange=e=>e.target.files[0]&&loadJson(e.target.files[0]);$('#imageFile').onchange=e=>e.target.files[0]&&loadImage(e.target.files[0]);$('#enterVR').addEventListener('click',e=>{e.preventDefault();beginVR()});const sc=$('#vrScene');sc.addEventListener('loaded',()=>{if($('#viewer').classList.contains('active'))resizePanoramaCanvas()});sc.addEventListener('enter-vr',()=>{$('#cursor').setAttribute('visible','false');menuVisible=false;toggleVRMenu(true);positionVRMiniMap();renderVRMiniMap()});sc.addEventListener('exit-vr',()=>{toggleVRMenu(false);$('#vrMiniMap').setAttribute('visible','false')});['abuttondown','xbuttondown','thumbstickdown'].forEach(evt=>{$('#leftHand').addEventListener(evt,()=>toggleVRMenu());$('#rightHand').addEventListener(evt,()=>toggleVRMenu())});renderEditor();renderScene()}
async function bootstrap(){try{const response=await fetch('tour.json',{cache:'no-store'});if(response.ok){const data=validate(await response.json());project=data;editingId=currentId=data.scenes[0].id}}catch(e){console.warn('Using bundled demo tour:',e.message)}init()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);else bootstrap();
