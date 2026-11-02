// Offline: fichas da importação com site cujo domínio não partilha nada com o nome da empresa (candidatas a site errado).
const fs=require('fs'),path=require('path');const F=require('./ficha');
const ler=f=>fs.readFileSync(path.join(__dirname,f),'utf8').split('\n').filter(Boolean).map(l=>{try{return JSON.parse(l);}catch(_){return null;}}).filter(Boolean);
const ret=new Set(ler('corrigidas.jsonl').filter(x=>x.acao==='retirada').map(x=>+x.id));
const ins=ler('inseridas.jsonl').filter(x=>!ret.has(+x.id)&&x.website);
const LEG=/^(LDA|LIMITADA|SA|UNIP|SOCIEDADE|SOC|CONSTRUCOES|CONSTRUCAO|CIVIL|OBRAS|PUBLICAS|COMERCIO|SERVICOS|INSTALACOES|ENGENHARIA|FILHOS|IRMAOS|E|DE|DA|DO|DOS|DAS)$/;
const toks=n=>F.N(n).split(' ').filter(t=>t.length>=3&&!LEG.test(t));
const sus=[];
for(const x of ins){let d='';try{d=new URL(x.website).hostname.replace(/^www\./,'').split('.')[0].toUpperCase().replace(/[^A-Z0-9]/g,'');}catch(_){continue;}
 const ts=toks(x.name);const inic=F.N(x.name).split(' ').filter(t=>t.length).map(t=>t[0]).join('');
 const ok=ts.some(t=>d.includes(t)||t.includes(d)||(t.length>=5&&d.includes(t.slice(0,5))))||(d.length>=3&&inic.includes(d));
 if(!ok)sus.push({id:x.id,name:x.name,site:x.website,dist:x.distrito});}
fs.writeFileSync(path.join(__dirname,'sites-suspeitos.json'),JSON.stringify(sus,null,1));
console.log('com site:',ins.length,'| domínio sem nada em comum com o nome:',sus.length);
let s=7;const rnd=()=>(s=(s*1664525+1013904223)>>>0)/2**32;const a=sus.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
for(const x of a.slice(0,45))console.log(x.id,x.name.slice(0,44).padEnd(44),x.site);
