const {stores}=require("./store");
const bus=require("./eventbus");
const {getselection}=require("./selection");
const {NOTESEP}=require("pengine");
const {decorateLine}=require("./decorate");
const checkselection=function(event){
	const sel=getselection();
	if (!sel)return;
	const t=getselection().trim();
	if (t&&t.indexOf(" ")==-1) {
		this.dispatch("keep");
		bus.$emit("settofind",t);
	}
}
const renderline=(store,h,x0,text,nline)=>{
	const at=text.indexOf(NOTESEP);
	if (at>0) text=text.substr(0,at);
	let pts={};
	if (store.getters.pts && store.getters.pts[x0]) {
		pts=store.getters.pts[x0];
	}
	const highlightword=store.getters.highlightword;
	const notes=store.getters.notes||{};
	const decorated=decorateLine({h,x0,text,notes,pts,highlightword,store,nline});
	return h('div',{class:"linediv",attrs:{x0}},decorated);
}
Vue.component("maintext",{
	props:{
		thestore:{type:String,required:true}
	},
	data(){
		const store=stores[this.thestore];
		return {store};
	},
	updated(){
		const ele=document.getElementsByClassName("pts-container")[0];
		const arr=document.getElementsByClassName("highlight");
		if (!ele)return ;
		if (arr.length) {
			ele.scrollTop=arr[0].offsetTop;
		} else {
			ele.scrollTop=0;
		}
	},
	render(h) {
		const store=this.store;
		const backlinks=store.getters.backlinks;

  		const children=store.getters.texts.map((line,idx)=>renderline(store,h,line[0],line[1],idx))
 		return  h("div",{class:"maintext",
 			on:{mouseup:checkselection.bind(store)}},children);
	}
});