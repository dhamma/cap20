'use strict';
const {syllabify,isSyllable}=require("pengine");
const {inlinenotebtn}=require("./inlinebuttons");

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
		const m=header.match(/([\d\.]+)/)[1];
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

const addspan=({children,str,prevclass,y,h})=>{
	//if (prevclass&&prevclass.indexOf("~")>-1) {
	//	const links=prevclass.split(/ +/).filter(item=>item);
	//	prevclass='';
	//} 
	if (str) children.push(h('span',{attrs:{y},class:prevclass},str));
	return prevclass;
}

const addmarker=({children,str,y,h,cls})=>{
	children.push(h('span',{attrs:{y},class:cls}," ["+str+"]"));
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
const decorateLine=({h,x0,text,notes,pts,highlightword})=>{
	const decorations=[],children=[];
	let syl_i=0,yinc=0,y=0,off=0,j=0,nsnip=0;
	let prevclass='',str='',ch='',marker='';
	const mheader=text.match(/^([a-z\d\.]+)\|/);
	let paranum='';

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
			addspan({h,children,str,prevclass,y});
			str='';
			prevclass=snippet[nsnip][1];
			if (!prevclass) prevclass='';
			nsnip++;
		}
		if (pts[yinc]) {
			if (str) {
				addspan({h,children,str,prevclass,y});
				str='';
			}
			addmarker({h,children,str:pts[yinc],y:yinc,cls:"pb"});
			delete pts[yinc];
		}

		if (str=='') {
			off=j;
			y=yinc;
		}
		ch=text[j];
		if (ch=="{"||ch=="}") ch='';
		if (ch=="^"){
			let num=j+1;
			const m=text.substr(j+1).match(/(\d+)/);
			j+=m[1].length;
			addspan({h,children,str,prevclass,y});
			prevclass='';
			const props={};
			let btns=inlinenotebtn({h,nid:m[1],note:notes[x0+"_"+m[1]],props});
			for (let k=0;k<btns.length;k++){
				children.push(btns[k]);
			}
			ch='';
			str='';
		}

		//if (y==marker){ //marking backlink source pos
		//	children.push(h('span',{attrs:{y},class:'marker'}));
		//	marker=-1;
		//}
		if (j<text.length) str+=ch;
		j++;
		sycnt--;
	}
	addspan({h,children,str,y,prevclass});

	if (paranum) children.unshift(h("span",paranum+"."))
	return children;
}
module.exports={decorateLine};