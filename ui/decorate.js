'use strict';
const {syllabify,isSyllable,hardBreak}=require("pengine");
const {ButtonPara}=require("./inlinebuttons");
const {Sentence}=require("./sentence");
const {snip}=require("./snip");
const decorateHeader=(decorations,header,textlen)=>{
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
const decorateBrace=(decorations,syl)=>{
	let bold=0,off=0,y=0;
	for (let j=0;j<syl.length;j++){
		if (syl[j][syl[j].length-1]=="{") {
			bold=off+syl[j].length;
		}
		if (syl[j].trim()=="}"){
			decorations.push([bold,off-bold,"nti"]);
		}
		off+=syl[j].length;
	}
}
const decorateHighlightword=(decorations,line,hlw)=>{
 	if (!hlw) return;
	hlw=hlw.substr(0,hlw.length-1)+".";
 	hlw=hlw.replace(/ṅ/g,'[ṃnṅ]');
 	hlw=hlw.replace(/[āa]/g,'[āa]');
 	hlw=hlw.replace(/[ūu]/g,'[ūu]');
 	hlw=hlw.replace(/[īi]/g,'[īi]');
	const regex=new RegExp(hlw,"gi");
	line.replace(regex,(m,idx)=>decorations.push([idx,m.length,"highlightword"]));
}
const extractInlinenote=(text,inlinenotes)=>{
	return text.replace(/ \^(\d+)/g,(m,n,idx)=>{
		inlinenotes.push([idx,n]);
		return " ";
	});
}
const decorateLine=({h,x0,text,notes,pts,highlightword,store,nline})=>{
	const decorations=[],linediv=[],notepos=[];
	let sentence=[],markers=[];
	let syl_i=0,yinc=0,y=0,off=0,j=0,nsnip=0;
	let prevclass='',str='',ch='',marker='',paranum='';
	const mheader=text.match(/^([a-z\d\.\-]+)\|/);
	if (mheader) {
		text=text.substr(mheader[0].length);
		paranum=decorateHeader(decorations,mheader[1],text.length);
	}
	pts=Object.assign({},pts);
	text=hardBreak(text);
	text=extractInlinenote(text,notepos);

	const syl=syllabify(text);	
	decorateBrace(decorations,syl);
	decorateHighlightword(decorations,text,highlightword);
	
	const snippet=snip(text,decorations);
	let nsyl=syl[0].length, ii=0;
	while(j<=text.length){
		if (!nsyl) {
			if (isSyllable(syl[syl_i]))yinc++
			if( syl_i+1<syl.length) nsyl=syl[++syl_i].length;
		}
		if (nsnip<snippet.length&&snippet[nsnip][0]==j) {
			if(str)sentence.push({y,end:yinc,class:prevclass,str});
			prevclass=snippet[nsnip][1];
			if (!prevclass) prevclass='';
			nsnip++;str='';
		}
		if (pts[yinc]) {
			markers.push({str:pts[yinc],y:yinc,class:"pb"});
			delete pts[yinc];
		}
		if (ii<notepos.length && j>=notepos[ii][0]) {
			markers.push({str:notepos[ii][1],y:yinc,class:"$InlineNoteButton"});
			ii++;
		}
		if (str=='') {
			off=j;
			y=yinc;
		}
		ch=text[j];
		if (ch=="\n") { //hardbreak			
			if (str) sentence.push({y,end:yinc,class:prevclass,str});
			linediv.push(h(Sentence,{props:{markers,notes,data:sentence,x0}}));
			markers=[];
			y=yinc;
			ch='';str='';sentence=[];markers=[];
		} else if (ch=="{"||ch=="}") {
			ch='';
		}
		if (j<text.length) str+=ch;
		j++;nsyl--;
	}
	if (str) {
		sentence.push({y,end:yinc,class:prevclass,str});
		linediv.push(h(Sentence,{props:{markers,notes,x0,data:sentence}}));
	}
	if (paranum) {
		linediv.unshift(h(ButtonPara,{props:{paranum,store}}))
	}
	return linediv;
}
module.exports={decorateLine};