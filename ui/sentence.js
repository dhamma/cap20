const {stylehandlers}=require("./handlers");
const {ButtonDef}=require("./inlinebuttons");
const {syllabify,isSyllable,regPaliword,bsearch}=require("pengine");
//render null tag, break span
const knowntokens=require("../knowntokens");

const ButtonHardBreak=Vue.extend({
	props:{
		hasmarker:{type:Boolean,required:true},
		onenter:{type:Function,required:true}
	},
	methods:{
		onmouseenter(){
			clearTimeout(this.timer);
			this.timer=setTimeout(function(){
				this.onenter();
			}.bind(this),300);
		}
	},
	data(){
		return {timer:0}
	},
	render(h){
		const has=this.hasmarker?" has":"";
		return h("span",{on:{mouseenter:this.onmouseenter},
		class:"buttonhardbreak"+has},"▾");//⏷
	}
});
const spanwithmarkers=({h,span,store,on,children,markers,notes,x0})=>{
	const syl=syllabify(span.str);
	let yinc=span.y,str='';
	let mi=0;
	let M=markers[mi];
	for (var i=0;i<syl.length;i++) {
		while (M&&M.y==yinc) {
			str&&children.push(h("span",{attrs:{y:yinc},class:span.class,on},str));
			if (M.class[0]=="$") {
				const BTN=ButtonDef[M.class.substr(1)];
				if (!BTN) {
					console.error("button type not found",M.class);
				}
				children.push( h(BTN,{props:{store,x0,str:M.str,y:yinc,notes}}));
			} else {
				children.push(h("span",{class:M.class},M.str));
			}
			M=(++mi<markers.length)?markers[mi]:null;
			str='';
		}
		if (isSyllable(syl[i]))yinc++;
		str+=syl[i];
	}
	str&&children.push(h("span",{attrs:{y:yinc},class:span.class,on},str));
}

const splitwords=({h,span,on})=>{
	const spans=[];
	const hastoken=tk=>{
		return bsearch(knowntokens,tk.toLowerCase())>=0;
	}
	const arr=span.str.split(regPaliword)
		.map(tk=>hastoken(tk)?h("span",{class:"knowntoken"},
			[h("ruby",{},[ h("rb",tk),h("rt","中")])] )
		:tk);

	return h("span",{class:span.class,on,
					attrs:{y:span.y}},arr);
}
const Sentence=Vue.extend({
	props:{
		x0:{type:Number,required:true},
		data:{type:Array,required:true},
		markers:{type:Array,required:true},
		store:{type:Object,required:true},
		notes:{type:Object}
	},
	methods:{
		onenter(){
			this.showmarker=!this.showmarker;
		}
	},
	data(){
		return {showmarker:false}
	},
	render(h){
		const children=[];
		let mi=0, markers=this.markers,x0=this.x0;
		this.data.forEach(span=>{
			const y=span.y,end=span.end;
			const clss=span.class.split(" ");
			const on={}, notes=this.notes;
			clss.forEach(cls=>{
				const click=stylehandlers[cls]||null;
				if (click) on.click=click; //overwrite
			});
			if (markers.length && this.showmarker) {
				spanwithmarkers({h,store:this.store
					,span,on,children,markers,notes,x0});
			} else {
				children.push(h("span",{on},span.str));
				//children.push( splitwords({h,span,on}));				
			}
		});

		const bhb=h(ButtonHardBreak,{props:{hasmarker:!!markers.length,
								onenter:this.onenter}});
		children.unshift(bhb);
		const linenote=this.notes[this.x0];
		if (this.showmarker && linenote ) {
			children.push(h('span',{class:"linenote"},linenote));
		}

		return h("div",{class:"sentence"},children);
	}
})
module.exports={Sentence}