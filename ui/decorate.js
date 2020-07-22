'use strict';
const {syllabify,isSyllable,hardBreak}=require("pengine");
const {ButtonPara}=require("./inlinebuttons");
const {Sentence}=require("./sentence");
const {snip}=require("./snip");
const {decoHeader,decoBrace,decoHLWord,decoYZ}=require("./decoration");
const extractInlinenote=(text,inlinenotes)=>{
	return text.replace(/ \^(\d+)/g,(m,n,idx)=>{
		inlinenotes.push([idx,n]);
		return " ";
	});
}
const backlink2marker=backlinks=>{
	const blmarkers=[];
	backlinks.forEach(item=>{
		const cap=item[0];
		const origaddr=item[1];
		const pos=cap.y+cap.z;
		if (!blmarkers[pos]) blmarkers[pos]=[];
		blmarkers[pos].push( cap.z+"|"+origaddr );
	})
	return blmarkers;
}
const decorateLine=({h,x0,text,notes,pts,highlightword,store,nline,backlinks})=>{
	const decorations=[],linediv=[],notepos=[];
	let sentence=[],markers=[];
	let syl_i=0,yinc=0,y=0,off=0,j=0,nsnip=0;
	let prevclass='',str='',ch='',marker='',paranum='';
	const mheader=text.match(/^([a-z\d\.\-]+)\|/);
	if (mheader) {
		text=text.substr(mheader[0].length);
		paranum=decoHeader(decorations,mheader[1],text.length);
	}
	pts=Object.assign({},pts);
	text=hardBreak(text);
	text=extractInlinenote(text,notepos);

	const syl=syllabify(text);
	decoYZ(decorations,store.getters.cap,syl);
	decoBrace(decorations,syl);
	decoHLWord(decorations,text,highlightword);

	const bls=backlink2marker(backlinks);

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
		if (bls[yinc]) {
			bls[yinc].forEach(linkstr=>{
				const arr=linkstr.split("|");
				markers.push({str:arr[1],y:yinc,class:"$BacklinkButton",zlen:parseInt(arr[0])});
			})
			delete bls[yinc];
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
			linediv.push(h(Sentence,{props:{markers,store,notes,data:sentence,x0}}));
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
		linediv.push(h(Sentence,{props:{store,markers,notes,x0,data:sentence}}));
	}
	if (paranum) {
		linediv.unshift(h(ButtonPara,{props:{paranum,store}}))
	}
	return linediv;
}
module.exports={decorateLine};