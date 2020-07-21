const {stylehandlers}=require("./handlers");
const {ButtonDef}=require("./inlinebuttons");
const {syllabify,isSyllable}=require("pengine");
//render null tag, break span

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
const spanwithmarkers=({h,span,on,children,markers,notes,x0})=>{
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
				children.push( h(BTN,{props:{x0,str:M.str,y:yinc,notes}}));
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

const Sentence=Vue.extend({
	props:{
		x0:{type:Number,required:true},
		data:{type:Array,required:true},
		markers:{type:Array,required:true},
		notes:{type:Object}
	},
	methods:{
		onenter(){
			this.showmarker=!this.showmarker;
		}
	},
	data(){
		return {showmarker:true}
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
				spanwithmarkers({h,span,on,children,markers,notes,x0});
			} else {
				children.push( h("span",{class:span.class,on,
					attrs:{y:span.y}},span.str));				
			}
		});

		const bhb=h(ButtonHardBreak,{props:{hasmarker:!!markers.length,
								onenter:this.onenter}});
		children.unshift(bhb);	

		return h("div",{class:"sentence"},children);
	}
})
module.exports={Sentence}