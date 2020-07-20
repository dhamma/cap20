'use strict';
const {parseCAP,dbofbook}=require("pengine");
const {parsePTS}=require("../cs0/ptsvolpg");

const findNos=(from,nos,T,d,depth)=>{
	let cur=from;
	while (cur<T.length&&T[cur].d>=d){
		if (T[cur].d==depth) {
			let n=parseInt(T[cur].t);
			const at=T[cur].t.indexOf("|");
			if (at>0) n=parseInt(T[cur].t.substr(at+1));
			if (n>=nos) return cur;
		}
		cur++;
	}
	return null;
}
const dn_an_ja=(book,nos)=>{
	nos=parseInt(nos);
	let addr=tocstart[book];
	if (nos>520 &&book=="j") {
		addr=tocstart["j2"];
	}
	if (!addr)return null;
	const db=dbofbook("dn1");
	const n= qnum(db,addr[0],addr[1],nos);
	if (n) return db.toc[n].l;
}
const qnum=(db,tocstart, depth,nos)=>{
	const ans=db.gettocancestor(tocstart);
	const t=ans[ans.length-1];
	const d=t.d+1;
	const n=findNos(t.cur+1,nos,db.toc,d,depth);
	
	return n;
}
const sn=(samyutta,nos)=>{
	const db=dbofbook("sn1");
	const cur=qnum(db,'sn1_x0',3, samyutta);
	if (cur<1)return ;
	const T=db.toc;
	const d=T[cur].d+1
	const n=findNos(cur+1, nos, db.toc, d ,5);

	if (n) return db.toc[n].l;
}
//PTS vv(vatthu)#gatha 
//CSCD 連號 gatha
const vv=(vatthu,gatha)=>{
	//cannot use qnum, as vatthu cross vagga 
	const db=dbofbook("vv");
	const ans=db.gettocancestor("vv_x3");
	const t=ans[ans.length-1];
	const cur=findNos(t.cur+1,vatthu,db.toc,2,4); //find entire vv

	if (cur<1)return ;
	gatha=parseInt(gatha);//assuming one gatha per <p>
	const cap=parseCAP(db.toc[cur].l);
	return parseCAP(cap.x0 + gatha , db).stringify();
}

const pv=(vagga,vatthu,gatha)=>{
	console.log('pv');
	//cannot use qnum, as vatthu cross vagga 
	const db=dbofbook("pv");
	const cur=qnum(db,'pv_x2',3, vagga);

	if (cur<1)return ;

	const v=parseInt(cur)+parseInt(vatthu);

	gatha=parseInt(gatha);//assuming one gatha per <p>
	const cap=parseCAP(db.toc[v].l);
	return parseCAP(cap.x0 + gatha , db).stringify();
}


const an=(book,nos)=>{
	return parseCAP("an"+book+"_"+nos);
}
const kv=katha=>{
	const db=dbofbook("kv");
	const v=qnum(db,'kv_x2',4, parseInt(katha));
	if (v<1)return

	return parseCAP(db.toc[v].l).stringify(); 
}
const tocstart={d:['dn1_x0',3],m:['mn1_x0',4],
j:['ja1_x2',4],j2:['ja2_x2',4]};

const patterns=[
	[/^a([123456789][01]?)\.(\d+)$/i,an],
	[/^([dmj])(\d+)$/i,dn_an_ja],
	[/^s(\d+)\.(\d+)$/i,sn],
	[/^vv(\d+)\.(\d+)$/i,vv],
	[/^kv(\d+)$/i,kv],
	[/^pv(\d+)\.(\d+)\.(\d+)$/i,pv],
	[/^(\w+\d*,\d+)$/i,parsePTS],
];

const parseAddress=(str)=>{
	for (var i=0;i<patterns.length;i++) {
		const pat=patterns[i];
		const m=str.match(pat[0]);
		if (!m) continue;
		const leaf=pat[1](m[1],m[2],m[3]);
		if (leaf) return leaf; 
		else break;
	}
	return parseCAP(str);
}
module.exports={parseAddress};