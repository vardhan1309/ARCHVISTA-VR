

const $=s=>document.querySelector(s),canvas=$('#view'),scene=new THREE.Scene();scene.background=new THREE.Color('#b8c0bd');scene.fog=new THREE.Fog('#b8c0bd',90,230);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,350);camera.position.set(65,49,76);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.13;
const orbit=new OrbitControls(camera,canvas);orbit.target.set(0,9,0);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.49;orbit.minDistance=14;orbit.maxDistance=155;
scene.add(new THREE.HemisphereLight('#fff0d9','#716456',2.05));const sun=new THREE.DirectionalLight('#ffe0bd',3.1);sun.position.set(-48,75,42);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-90;sun.shadow.camera.right=90;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;scene.add(sun);const fill=new THREE.DirectionalLight('#c6dedb',.8);fill.position.set(55,28,-45);scene.add(fill);
const groundMat=new THREE.MeshStandardMaterial({color:'#a99a7c',roughness:1}),plaster=new THREE.MeshStandardMaterial({color:'#e0d3b8',roughness:.9}),stone=new THREE.MeshStandardMaterial({color:'#9d6048',roughness:.88}),brick=new THREE.MeshStandardMaterial({color:'#a65f42',roughness:.92}),wood=new THREE.MeshStandardMaterial({color:'#684833',roughness:.85}),wood2=new THREE.MeshStandardMaterial({color:'#a77850',roughness:.8}),roofMat=new THREE.MeshStandardMaterial({color:'#a95836',roughness:.85}),glass=new THREE.MeshStandardMaterial({color:'#66877e',roughness:.3,metalness:.12}),dark=new THREE.MeshStandardMaterial({color:'#302e29',roughness:.9}),leaf=new THREE.MeshStandardMaterial({color:'#426b4b',roughness:.9});
const site=new THREE.Group();scene.add(site);const building=new THREE.Group();site.add(building);
function box(p,x,y,z,w,h,d,m,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;p.add(o);return o}
function sphere(p,x,y,z,r,m){const o=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o}
function arch(p,x,y,z,w,h,depth,wallMat=plaster){const r=w*.36,spring=h*.55,s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h);s.lineTo(-w/2,h);s.closePath();const hole=new THREE.Path();hole.moveTo(-r,.12);hole.lineTo(r,.12);hole.lineTo(r,spring);hole.absarc(0,spring,r,0,Math.PI,false);hole.lineTo(-r,.12);s.holes.push(hole);const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:28}),wallMat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;p.add(mesh);const ring=new THREE.Mesh(new THREE.TorusGeometry(r+.025,.12,12,44,Math.PI),stone);ring.position.set(x,y+spring,z+depth+.035);p.add(ring);box(p,x-r-.07,y+spring/2,z+depth+.04,.22,spring,.24,stone);box(p,x+r+.07,y+spring/2,z+depth+.04,.22,spring,.24,stone)}
const W=54,D=70,INNER_W=20,INNER_D=36,LEVEL=4.25,BASE=-4.6,TOP=4*LEVEL;
box(site,0,-5.15,0,100,.35,112,groundMat,false);
// basement excavation plinth and retaining walls; lower floor remains part of same building model.
const basement=new THREE.Group();building.add(basement);box(basement,0,BASE-.22,0,W,.44,D,dark);
for(const x of [-W/2,W/2])box(basement,x,BASE+1.9,0,.55,4,D,stone);
for(const z of [-D/2,D/2])box(basement,0,BASE+1.9,z,W,4,.55,stone);
box(basement,0,BASE+3.85,0,W,.35,D,stone);
for(let i=0;i<8;i++){const x=-22+i*6.2;box(basement,x,BASE+1.4,-D/2+.5,4.5,2.5,.2,wood);box(basement,x,BASE+2.75,-D/2+.65,4.1,.22,.2,wood2)}
// one connected floor plate with a central open-to-sky atrium; all wings are structurally joined.
const floorGroups=[];
for(let level=0;level<4;level++){const y=level*LEVEL,g=new THREE.Group();building.add(g);floorGroups.push(g);
 // floor slab is a single ring-shaped plate with four connected wings.
 box(g,0,y-.18,-(D-INNER_D)/4,W,.36,(D-INNER_D)/2,stone);
 box(g,0,y-.18,(D-INNER_D)/4,W,.36,(D-INNER_D)/2,stone);
 box(g,-(W-INNER_W)/4,y-.18,0,(W-INNER_W)/2,.36,INNER_D,stone);
 box(g,(W-INNER_W)/4,y-.18,0,(W-INNER_W)/2,.36,INNER_D,stone);
 // continuous outer walls and inner atrium gallery walls are cut into repeated arched bays.
 const frontZ=D/2,backZ=-D/2;
 for(let i=0;i<11;i++){const x=-W/2+2.5+i*5;arch(g,x,y,frontZ-0.48,4.5,LEVEL-.12,.48,level===0?plaster:plaster);arch(g,x,y,backZ,4.5,LEVEL-.12,.48,plaster)}
 for(let side of [-1,1])for(let i=0;i<14;i++){const z=-D/2+2.6+i*4.8;arch(g,side*(W/2-.48),y,z,4.25,LEVEL-.12,.48,plaster); }
 // gallery railings facing the central atrium.
 for(let side of [-1,1]){box(g,side*(INNER_W/2),y+1.05,0,.18,2,INNER_D,stone);box(g,side*(INNER_W/2),y+1.85,0,.22,.16,INNER_D,wood2);for(let z=-INNER_D/2;z<=INNER_D/2;z+=2.2)box(g,side*(INNER_W/2),y+.95,z,.1,1.7,.1,wood2)}
 for(let end of [-1,1]){box(g,0,y+1.05,end*(INNER_D/2),INNER_W,2,.16,stone);box(g,0,y+1.85,end*(INNER_D/2),INNER_W,.16,.22,wood2)}
 // stall modules occupy the full perimeter galleries on all floors, not just facade decoration.
 for(let side of [-1,1])for(let i=0;i<10;i++){const x=side*(INNER_W/2+5.8),z=-D/2+5+i*6.1;const counter=box(g,x,y+.72,z,3.1,1.35,3.2,wood);box(g,x,y+1.45,z,3.25,.16,3.3,wood2);for(let k=0;k<9;k++)sphere(g,x-1.1+(k%5)*.52,y+1.68,z-.65+Math.floor(k/5)*.65,.22,new THREE.MeshStandardMaterial({color:['#c94e32','#e2b33b','#71924a','#b75b4c'][k%4],roughness:.8}));box(g,x,y+2.55,z,3.15,.12,3.2,level%2?roofMat:wood2)}
 for(let side of [-1,1])for(let i=0;i<5;i++){const z=side*(INNER_D/2+6.5),x=-W/2+7+i*10;box(g,x,y+.7,z,3.5,1.25,3,wood);box(g,x,y+1.38,z,3.6,.14,3.1,wood2);for(let k=0;k<6;k++)sphere(g,x-.9+(k%3)*.85,y+1.6,z-.5+Math.floor(k/3)*.7,.22,new THREE.MeshStandardMaterial({color:['#c94e32','#e2b33b','#71924a'][k%3]}))}
 // floor band, projecting verandah and stone cornice.
 box(g,0,y+LEVEL-.13,frontZ,W+.9,.28,.9,brick);box(g,0,y+LEVEL-.13,backZ,W+.9,.28,.9,brick);
 for(let side of [-1,1])box(g,side*(W/2),y+LEVEL-.13,0,.9,.28,D,brick);
}
// prominent continuous corner piers and horizontal floor bands bind the floors into one building.
for(let level=0;level<4;level++){const y=level*LEVEL;for(let x of [-W/2,W/2])for(let z of [-D/2,D/2]){box(building,x,y+LEVEL/2,z,1.15,LEVEL,1.15,brick)}box(building,0,y+LEVEL-.12,D/2+.08,W+1,.34,.8,roofMat)}
// central ceremonial entrance: broad stone portal, larger arch, bilingual-style sign plaque.
arch(building,0,0,D/2+.1,13,LEVEL*1.2,.75,plaster);box(building,0,LEVEL*1.28,D/2+.88,17,.75,.32,plaster);box(building,0,LEVEL*1.28,D/2+1.08,14,.38,.08,wood); 
// roof pavilion: pitched terracotta roof over connected wings, steel/timber trusses and clerestory.
const roofY=TOP+.35;box(building,0,roofY,D/2-1,W+3,.45,5,wood);box(building,0,roofY,-D/2+1,W+3,.45,5,wood);box(building,0,roofY,0,INNER_W+5,.4,D+3,wood);
for(let x=-W/2-1;x<=W/2+1;x+=6){const post=box(building,x,TOP+2.0,0,.22,3.5,.22,dark);const beam=box(building,x,TOP+3.7,0,.2,.2,D+3,wood2);beam.castShadow=true}
for(let z=-D/2;z<=D/2;z+=8){const beam=box(building,0,TOP+3.65,z,W+3,.22,.22,dark);beam.castShadow=true}
const roofLeft=box(building,-W/4,TOP+4.5,0,W/2+2,.25,D+6,roofMat);roofLeft.rotation.z=-.11;const roofRight=box(building,W/4,TOP+4.5,0,W/2+2,.25,D+6,roofMat);roofRight.rotation.z=.11;
for(let side of [-1,1])for(let i=0;i<10;i++){const x=-W/2+3+i*5.3;box(building,x,TOP+4.15,side*(D/2+1),.16,.2,2.5,wood2)}
// green atrium garden, trees, vines and seating within the unified block.
for(let i=0;i<8;i++){const x=-7+i*2,z=(i%2?1:-1)*12;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.22,3,9),wood);trunk.position.set(x,1.5,z);building.add(trunk);for(let j=0;j<7;j++)sphere(building,x+Math.sin(j*2)*.8,3+Math.cos(j*1.7)*.5,z+Math.cos(j*2)*.8,.75,leaf)}
for(let side of [-1,1])for(let i=0;i<7;i++){const z=-27+i*8,x=side*31;const planter=box(site,x,.35,z,3,.7,3,stone);for(let k=0;k<5;k++)sphere(site,x+(Math.random()-.5)*2,1,z+(Math.random()-.5)*2,.3,leaf)}
// miniature visitors distributed on each occupied level for scale and market life.
const people=[];function person(parent,x,y,z,color){const g=new THREE.Group();g.position.set(x,y,z);const skin=new THREE.MeshStandardMaterial({color:'#a96f50'}),shirt=new THREE.MeshStandardMaterial({color}),pants=new THREE.MeshStandardMaterial({color:'#3c403a'});const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.2,.5,4,8),shirt);torso.position.y=1.05;g.add(torso);sphere(g,0,1.55,0,.15,skin);const legs=[];for(let s of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.4,3,6),pants);leg.position.set(s*.12,.4,0);g.add(leg);legs.push(leg)}parent.add(g);people.push({g,legs,phase:Math.random()*6})}
for(let level=0;level<4;level++)for(let i=0;i<22;i++)person(floorGroups[level],-23+(i%11)*4.5,level*LEVEL,-26+Math.floor(i/11)*46,['#a9543e','#d0a25e','#567765','#73516e','#d7d0bd'][i%5]);
// basement car/service/storage bays and ramp
for(let i=0;i<8;i++){box(basement,-22+i*6.2,BASE+1.05,8,4.4,.22,9,wood);box(basement,-22+i*6.2,BASE+1.7,8,4.2,1.1,.12,wood2)}
const ramp=box(site,35,-2.2,22,10,.18,24,groundMat);ramp.rotation.x=-.12;
// floor controls show selected floor isolated; SHOW WHOLE MODEL restores the complete unified mass.
let selected='all',walking=false,keys={};function setLevel(value){selected=value;const n=value==='all'?null:Number(value);floorGroups.forEach((g,i)=>g.visible=n===null||i===n);basement.visible=n===null||n===-1;$('#zone').textContent=value==='all'?'COMPLETE BUILDING · BASEMENT + 4 FLOORS':value==='-1'?'BASEMENT LEVEL · B1':['GROUND FLOOR · 00','FIRST FLOOR · 01','SECOND FLOOR · 02','THIRD FLOOR · 03'][n];$('#title').textContent=value==='all'?'Poorna Market · Complete Model':value==='-1'?'Basement · Services & Storage':['Ground Floor · Public Market','First Floor · Trading Gallery','Second Floor · Trading Gallery','Third Floor · Food & Community'][n];$('#description').textContent=value==='all'?'One connected building with a basement and four floors above ground, a central atrium, continuous arched facades, internal galleries and vendor spaces.':value==='-1'?'Below-grade basement level for service access, storage, loading and building support spaces.':['Main public market floor with a monumental entrance arch, continuous shop arcade and central atrium.','Upper trading level with connected galleries, arched openings and vendor counters.','Upper trading level with perimeter shops and views into the central atrium.','Top occupied floor with market uses beneath the pitched roof structure.'][n];document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',b.dataset.level===String(value)));if(value!=='all'){const y=n===-1?BASE+1:n*LEVEL+2;orbit.target.set(0,y,0);camera.position.set(65,y+35,76);orbit.update()}else{orbit.target.set(0,8,0);camera.position.set(65,49,76);orbit.update()}}
document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>setLevel(b.dataset.level));$('#enter').onclick=()=>$('#intro').classList.add('hide');$('#home').onclick=()=>$('#intro').classList.remove('hide');
$('#walk').onclick=()=>{walking=true;orbit.enabled=false;$('#walk').classList.add('active');$('#orbit').classList.remove('active');camera.position.set(0,1.7,28);camera.lookAt(0,1.7,0);$('#description').textContent='Walk mode: use W A S D or arrow keys to explore the central market atrium.'};$('#orbit').onclick=()=>{walking=false;orbit.enabled=true;$('#orbit').classList.add('active');$('#walk').classList.remove('active');setLevel(selected)};
$('#lighting').onclick=()=>{const dusk=scene.background.getHexString()==='b8c0bd';scene.background.set(dusk?'#202a32':'#b8c0bd');scene.fog.color.copy(scene.background);sun.intensity=dusk?.75:3.1;fill.intensity=dusk?.35:.8;renderer.toneMappingExposure=dusk?.9:1.13;$('#lighting').classList.toggle('active',dusk)};
$('#vr').onclick=async()=>{if(!navigator.xr){$('#description').textContent='Open this website in Meta Quest Browser over HTTPS to use immersive VR.';return}try{const session=await navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']});renderer.xr.enabled=true;await renderer.xr.setSession(session)}catch(e){$('#description').textContent='VR could not start. Check Meta Quest Browser permissions.'}};
addEventListener('keydown',e=>keys[e.code]=true);addEventListener('keyup',e=>keys[e.code]=false);const clock=new THREE.Clock();function animate(){const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;if(walking){const d=new THREE.Vector3();if(keys.KeyW||keys.ArrowUp)d.z-=1;if(keys.KeyS||keys.ArrowDown)d.z+=1;if(keys.KeyA||keys.ArrowLeft)d.x-=1;if(keys.KeyD||keys.ArrowRight)d.x+=1;d.normalize().multiplyScalar(7*dt);camera.position.add(d);camera.position.x=THREE.MathUtils.clamp(camera.position.x,-INNER_W/2+1,INNER_W/2-1);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-INNER_D/2+1,INNER_D/2-1)}orbit.update();people.forEach(p=>p.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*2+p.phase+i*Math.PI)*.12));renderer.render(scene,camera);requestAnimationFrame(animate)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
