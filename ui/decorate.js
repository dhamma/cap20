'use strict';
const {syllabify,isSyllable,hardBreak}=require("pengine");

const {inlinenotebuttons,ButtonPara,ButtonHardBreak}=require("./inlinebuttons");
const {stylehandlers}=require("./handlers");
const snip=(str,decoration)=>{
	const arr=[];
	for (var i=0;i<decoration.length;i++) {
		const de=decoration[i];
		const p=de[0],len=de[1],deco=de[2];

		for (var j=p;j<p+len;j++){
			if (!arr[j]) arr[j]='';
			else arr[j]+=' ';
			arr[j]+=deco;
		}
		if (!arr[p+len]) arr[p+len]='';
		if (len==0 && deco) {
			arr[p]+=' '+deco+' ';
		}
	}
	const out=[];
	let prev='';
	for (var i=0;i<arr.length;i++){
		if (prev!==arr[i]) {
			if (typeof arr[i]!=="undefined") {
				out.push([i,arr[i]]);
			}
		}
		prev=arr[i];
	}
	return out;
}
const decorateHeader=(header,textlen,decorations)=>{
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
const decorateBrace=(syl,decorations)=>{
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

const addspan=({sentencediv,str,prevclass,y,h})=>{
	//if (prevclass&&prevclass.indexOf("~")>-1) {
	//	const links=prevclass.split(/ +/).filter(item=>item);
	//	prevclass='';
	//} 
	const clss=prevclass.split(" ");
	const on={}
	clss.forEach(cls=>{
		const click=stylehandlers[cls]||null;
		if (click) on.click=click; //overwrite
	});
	if (!str)return prevclass;

	let ele=h("span",{attrs:{y},on,class:prevclass},str);


	sentencediv.push(ele);
	return prevclass;
}
let prevmarker=''; //prevent multiple output of same marker
const addmarker=({sentencediv,str,y,h,cls})=>{
	if (prevmarker==str) return false;
	sentencediv.push(h('span',{attrs:{y},class:cls},str));
	prevmarker=str;
}
const addline=({h,sentencediv,linediv,y})=>{
	sentencediv.unshift(h(ButtonHardBreak,{y}));
	linediv.push( h("div",{class:"sentence"},sentencediv));
	sentencediv.length=0;
}

const decorateHighlightword=(line,hlw,decorations)=>{
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

const decorateLine=({h,x0,text,notes,pts,highlightword,store,nline})=>{
	const decorations=[],sentencediv=[],linediv=[];
	let syl_i=0,yinc=0,y=0,off=0,j=0,nsnip=0;
	let prevclass='',str='',ch='',marker='';
	const mheader=text.match(/^([a-z\d\.\-]+)\|/);
	let paranum='';

	text=hardBreak(text);

	if (nline==0) prevmarker=''; //first line, reset marker
	if (mheader) {
		text=text.substr(mheader[0].length);
		paranum=decorateHeader(mheader[1],text.length,decorations);
	}
	const syl=syllabify(text);
	
	decorateBrace(syl,decorations);
	decorateHighlightword(text,highlightword,decorations);
	const snippet=snip(text,decorations);
	let sycnt=syl[0].length;
	while(j<=text.length){
		if (!sycnt) {
			if (isSyllable(syl[syl_i]))yinc++
			if( syl_i+1<syl.length) sycnt=syl[++syl_i].length;
		}

		if (nsnip<snippet.length&&snippet[nsnip][0]==j) {
			addspan({h,sentencediv,str,prevclass,y});
			str='';
			prevclass=snippet[nsnip][1];
			if (!prevclass) prevclass='';
			nsnip++;
		}
		if (pts[yinc]) {
			if (prevmarker!==pts[yinc] && str) {
				addspan({h,sentencediv,str,prevclass,y});
				str='';
			}
			addmarker({h,sentencediv,str:pts[yinc],y:yinc,cls:"pb"});
			//delete pts[yinc];
		}

		if (str=='') {
			off=j;
			y=yinc;
		}
		ch=text[j];
		if (ch=="\n") { //hardbreak			
			if (str) addspan({h,sentencediv,str,prevclass,y,breaker:true});
			addline({h,sentencediv,linediv,y});
			y=yinc;ch='';str='';
		} else if (ch=="{"||ch=="}") {
			ch='';
		} else if (ch=="^"){
			let num=j+1;
			const m=text.substr(j+1).match(/(\d+)/);
			j+=m[1].length;
			addspan({h,sentencediv,str,prevclass,y});
			prevclass='';
			const props={};
			let btns=inlinenotebuttons({h,nid:m[1],note:notes[x0+"_"+m[1]],props});
			for (let k=0;k<btns.length;k++){
				sentencediv.push(btns[k]);
			}
			ch='';
			str='';
		}

		if (j<text.length) str+=ch;
		j++;
		sycnt--;
	}
	
	if (str) {
		addspan({h,sentencediv,str,y,prevclass});
		addline({h,sentencediv,linediv,y});
	}

	if (paranum) {
		linediv.unshift(h(ButtonPara,{props:{paranum,store}}))
	}
	return linediv;
}
module.exports={decorateLine};