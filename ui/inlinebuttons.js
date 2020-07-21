'use strict';
const {mainstore,auxstore,stores}=require("./store")
const {parseCAP}=require("pengine");
const {getRefBook}=require("../../cs0/ptsvolpg");

const ButtonPara=Vue.extend({
	methods:{
		click(evt){
			const ele=evt.target;
			const targetstore=stores[ele.attributes.showin.value];

			let _=ele.innerText;
			_=_.replace(/-.*/,'');
			const m=_.match(/(\d+)\.(\d+)/);
			if (m) _=m[2]+'g'+m[1];

			const addr=getRefBook(this.store.getters.cap.bk)+"_"+_;
			targetstore.dispatch("setCap",parseCAP(addr));
		}
	},
	props:{
		store:{required:true},
		paranum:{type:String,required:true}
	},
	render(h){
		const showin=(this.store==mainstore)?"auxstore":"mainstore";
		return h("button",{on:{click:this.click},attrs:{showin}},this.paranum);
	}
})
const inlinenotebuttons=({h,cap,nid,note,forwardlink,props})=>{
	let p=0,str='',prev=0;
	const children=[];

	const show=(note.indexOf("-")>-1);
	note.trim().replace(/\(?#(.+?);\)?/g,(m,addr,idx)=>{
		//const tcap=parseCAP(matlabel(addr));
		str=note.substring(prev,idx);
		str&&children.push(h('span',{},str));
		const label=addr;
		//highlight the source range when button is click
		//const quotecap=getsourcequote(addr,tcap,cap);
		//const _props=Object.assign({addr,label,
		//	command:this.command,
		//	displayline:-1,quotecap,forwardlink},props);	
		if(show){
			console.log(label,str)
		}		
		children.push(h('span',{class:'forwardlink'},label));
		prev=idx+m.length;
	})
	str=note.substr(prev);
	str&&children.push(h('span',{class:'inlinenote'},str));
	
	return children;
}

const InlineNoteButton=Vue.extend({
	props:{
		str:{type:String,required:true},
		y:{type:Number},
		x0:{type:Number},
		notes:{type:Object}
	},
	render(h){
		const note=this.notes[this.x0+"_"+this.str];
		//return h("span",{class:"inlinenote"}," "+str+" ");

		let btns=inlinenotebuttons({h,nid:this.str,note});

		return h("span",{class:"inlinenote"},btns);
	}
})
const BacklinkButton=Vue.extend({
	props:{
		str:{type:String,required:true},
		y:{type:Number},
		x0:{type:Number},
		zlen:{type:Number}
	},
	methods:{
		click(){
			auxstore.dispatch("setCap",this.str);
		}
	},
	render(h){
		const label=this.str.replace(/_.+/,'');
		return h("span",{class:"backlink",on:{click:this.click}},label);
	}
})
const ButtonDef={InlineNoteButton,BacklinkButton};
module.exports={ButtonDef,ButtonPara};