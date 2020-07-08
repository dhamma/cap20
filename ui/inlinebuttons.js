'use strict';
const {mainstore,auxstore,stores}=require("./store")
const {parseCAP}=require("pengine");
const {getRefBook}=require("../../cs0/ptsvolpg");

const ButtonPara=Vue.extend({
	methods:{
		click(evt){
			const ele=evt.target;
			const targetstore=stores[ele.attributes.showin.value];
			const addr=getRefBook(this.store.getters.cap.bk)+"_"+ele.innerText;
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
	let p=0;
	const btns=[];
	if (note) {
		note.trim().replace(/#(.+?);/g,(m,addr)=>{
			//const tcap=parseCAP(matlabel(addr));
			//const label=makecanonref(tcap);
			//highlight the source range when button is click
			//const quotecap=getsourcequote(addr,tcap,cap);
			//const _props=Object.assign({addr,label,
			//	command:this.command,
			//	displayline:-1,quotecap,forwardlink},props);			
			//btns.push(h('forwardlink',{props:_props}));
			btns.push(h('button',addr));
		})
		if (!btns.length){
			const _props=Object.assign({id:nid,note},props);
			//btns.push(h('notebutton',{props:_props}));
			btns.push(h('button',{},note));
		}
	}
	return btns;
}

module.exports={inlinenotebuttons,ButtonPara};