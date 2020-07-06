'use strict';
const {parseCAP}=require("pengine");
const {parsePTS}=require("../cs0/ptsvolpg");
const pts=(db,addr)=>{
	return parsePTS(addr);
}

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
const qnum=(db,book,nos)=>{
	nos=parseInt(nos);
	const addr=tocstart[book];
	if (!addr)return null;
	const ans=db.gettocancestor(addr[0]);
	const t=ans[ans.length-1];
	const d=t.d+1;
	return findNos(t.cur+1,nos,db.toc,d,addr[1]);
}
const qnum2=(db,book,nos2)=>{
	const addr=tocstart[book];
	if (!addr)return null;
	const nos=nos2.split(".");

	const cur=qnum(db,book,nos[0]);
	if (!cur)return;

	const T=db.toc;
	const d=T[cur].d+1
	return findNos(cur+1, nos[1], db.toc, d ,addr[2]);
}

const anum=(db,book,nos)=>{
	return parseCAP("an"+book+"_"+nos);
}
const tocstart={d:['dn1_x0',3],m:['mn1_x0',4],s:['sn1_x0',3,5],j:['ja1_x2',4]};

const patterns=[
	[/^a([123456789][01]?)\.(\d+)$/i,anum],
	[/^([dmj])(\d+)$/i,qnum],
	[/^s(\d+\.\d+)$/i,qnum2],
	[/^(\w+\d*,\d+)$/i,pts],
];

const parseAddress=(str,db)=>{
	for (var i=0;i<patterns.length;i++) {
		const pat=patterns[i];
		const m=str.match(pat[0]);
		if (!m) continue;
		const leaf=pat[1](db,m[1],m[2]);
		if (leaf) {
			return isNaN(leaf)?leaf:db.toc[leaf].l;
		}
		else break;
	}
	return parseCAP(str,db);
}
module.exports={parseAddress};