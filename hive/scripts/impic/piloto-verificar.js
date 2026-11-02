const fs=require('fs');const path=require('path');const {q}=require('./db');
(async()=>{
 const L=fs.readFileSync(path.join(__dirname,'piloto-inseridas.jsonl'),'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
 const ids=L.map(x=>x.id);
 const r=await q("SELECT id::int id,name,status,sector,sectors,city,confidence,created_by,(coalesce(alvara,'')<>'') alv,(coalesce(email,'')<>'') em,(coalesce(phone,'')<>'') tel,(coalesce(website,'')<>'') web,tags FROM companies WHERE id = ANY($1) ORDER BY id",[ids]);
 for(const x of r)console.log(x.id,x.status,String(x.name).slice(0,42).padEnd(42),String(x.sectors).slice(0,38).padEnd(38),String(x.city).padEnd(22),'conf',x.confidence,'alv',+x.alv,'em',+x.em,'tel',+x.tel,'web',+x.web,String(x.tags));
 const fecha=new Set();for(const x of L)for(const f of x.fecha)fecha.add(f);
 console.log('\nfichas na BD:',r.length,'de',ids.length,'| canais < 2:',r.filter(x=>(+x.alv)+(+x.em)+(+x.tel)+(+x.web)<2).length,'| lacunas fechadas a ≤ 10 km (únicas):',fecha.size);
 const pop=new Map(JSON.parse(fs.readFileSync(path.join(__dirname,'gap-matriz.json'),'utf8')).map(m=>[m.nome,m.pop]));
 const f20=[...fecha].filter(k=>pop.get(k.split(': ')[0])>=20000);console.log('em concelhos ≥ 20 mil hab.:',f20.length);
 console.log([...fecha].sort().join(' | '));
})().catch(e=>{console.error(e.message.slice(0,300));process.exit(1);});
