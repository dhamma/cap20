'use strict';
const {mainstore,auxstore,stores}=require("./store")
const {parseCAP}=require("pengine");

const oppositeStore=store=>(store==mainstore)?auxstore:mainstore;
const capTitle=cap=>{
	if (!cap.db.toc)return '';
	const ancestors=cap.db.gettocancestor(cap.stringify());
	const arr=ancestors.map((item,idx)=>{
		let t=item.t;
		let title='';
		const at=t.indexOf("|");
		if (at>-1) {
			title=t.substr(0,at);
			t=t.substr(at+1);
		}

		return (t=="-")?null:t;
	}).filter(item=>item);
	return arr.join("/");
}

const ButtonRef=Vue.extend({
	methods:{
		click(evt){
			const attrs=evt.target.attributes;
			const targetstore=stores[attrs.showin.value];
			const db=attrs.db?attrs.db.value:null;
			targetstore.dispatch("setCap",parseCAP(attrs.addr.value,db));
		}
	},
	props:{
		store:{required:true},
		db:{type:String},
		label:{type:String,required:true},
		addr:{type:String,required:true}
	},
	render(h){
		const showin=oppositeStore(this.store).getters.name;
		return h("button",{on:{click:this.click}
			,attrs:{showin,db:this.db,addr:this.addr}},this.label);
	}
})

const inlinenotebuttons=({h,store,cap,nid,note,forwardlink,props})=>{
	let p=0,str='',prev=0;
	const children=[];

	const click=ele=>{
		const addr=ele.target.attributes.addr.value;
		store.dispatch("keep");
		oppositeStore(store).dispatch("setCap",addr);
	}
	const show=(note.indexOf("-")>-1);
	note.trim().replace(/\(?#(.+?);\)?/g,(m,addr,idx)=>{
		//const tcap=parseCAP(matlabel(addr));
		str=note.substring(prev,idx);
		str&&children.push(h('span',{},str));
		const label=addr.replace(/_.+/,'');
		//highlight the source range when button is click
		//const quotecap=getsourcequote(addr,tcap,cap);
		//const _props=Object.assign({addr,label,
		//	command:this.command,
		//	displayline:-1,quotecap,forwardlink},props);	
		const cap=parseCAP(addr);
		const title=capTitle(cap);		
		children.push(h('span',{on:{click},
			attrs:{title,addr},class:'forwardlink'},label));
		prev=idx+m.length;
	})
	str=note.substr(prev).trim();
	str&&children.push(h('span',{class:'inlinenote'},str));
	
	return children;
}

const InlineNoteButton=Vue.extend({
	props:{
		str:{type:String,required:true},
		y:{type:Number},
		x0:{type:Number},
		store:{type:Object,required:true},
		notes:{type:Object}
	},
	render(h){
		const note=this.notes[this.x0+"_"+this.str];
		//return h("span",{class:"inlinenote"}," "+str+" ");

		let btns=inlinenotebuttons({h,store:this.store,nid:this.str,note});

		return h("span",{class:"inlinenote"},btns);
	}
})
const BacklinkButton=Vue.extend({
	props:{
		str:{type:String,required:true},
		y:{type:Number},
		x0:{type:Number},
		zlen:{type:Number},
		store:{type:Object,required:true},
	},
	methods:{
		click(){
			this.store.dispatch("keep");
			oppositeStore(this.store).dispatch("setCap",this.str);
		}
	},
	render(h){
		const label=this.str.replace(/_.+/,'');
		return h("span",{class:"backlink",
			attrs:{title:capTitle(parseCAP(this.str) )},
			on:{click:this.click}},label);
	}
})
const ButtonDef={InlineNoteButton,BacklinkButton};
module.exports={ButtonDef,ButtonRef,capTitle};