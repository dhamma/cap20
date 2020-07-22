const {isSyllable,parseCAP}=require("pengine");

const decoHeader=(decorations,header,textlen)=>{
	let paranum=null;
	let headerstyle='';
	headerstyle=header;
	const p=parseFloat(headerstyle);
	if (!isNaN(p)){
		const m=header.match(/([\d\.\-]+)/)[1];
		paranum=m;
		headerstyle=headerstyle.substr(m.length);
	}
	if (headerstyle) decorations.push([0,textlen,headerstyle]);
	return paranum;
}
const decoYZ=(decorations,cap,syl)=>{
	if (!(cap.y || cap.z))return;
	let off=0,yinc=0,start=0;

	for (let j=0;j<syl.length;j++){
		off+=syl[j].length;
		if (cap.y==yinc&&start==0) {
			start=off;
		}
		if (cap.y+cap.z==yinc) {
			decorations.push([start,off-start,"highlightyz"]);
			break; 
		}
		if (isSyllable(syl[j])) yinc++;

	}

}
const decoBrace=(decorations,syl)=>{
	let bold=0,off=0,y=0;
	for (let j=0;j<syl.length;j++){
		// syl[n]=="}{" is possible
		if (syl[j].trim()[0]=="}"){
			decorations.push([bold,off-bold,"nti"]);
		}
		if (syl[j][syl[j].length-1]=="{") {
			bold=off+syl[j].length;
		}
		off+=syl[j].length;
	}
}
const decoHLWord=(decorations,line,hlw)=>{
 	if (!hlw) return;
	hlw=hlw.substr(0,hlw.length-1)+".";
 	hlw=hlw.replace(/ṅ/g,'[ṃnṅ]');
 	hlw=hlw.replace(/[āa]/g,'[āa]');
 	hlw=hlw.replace(/[ūu]/g,'[ūu]');
 	hlw=hlw.replace(/[īi]/g,'[īi]');
	const regex=new RegExp(hlw,"gi");

	line.replace(regex,(m,idx)=>{
		decorations.push([idx,m.length,"highlightword"]);
	})
}

module.exports={decoHLWord,decoBrace,decoHeader,decoYZ};