const {ptsstore}=require("../store");
const bus=require("./eventbus");
const {getselection}=require("./selection");
const checkselection=(event)=>{
	const sel=getselection();
	if (!sel)return;
	const t=getselection().trim();
	if (t&&t.indexOf(" ")==-1) {
		ptsstore.dispatch("keep");
		bus.$emit("settofind",t);
	}

}
const renderline=(h,line)=>{
 	let hlw=ptsstore.getters.highlightword;
  	let prev=0;
  	const children=[];

 	if (hlw) {
	 	hlw=hlw.substr(0,hlw.length-1)+".";
 		hlw=hlw.replace(/ṅ/g,'[ṃnṅ]');
 		hlw=hlw.replace(/[āa]/g,'[āa]');
 		hlw=hlw.replace(/[ūu]/g,'[ūu]');
 		hlw=hlw.replace(/[īi]/g,'[īi]');
	  	const regex=new RegExp(hlw,"gi");
	  	
	  	line.replace(regex,(m,idx)=>{
	  		children.push(h('span', line.substring(prev,idx) ));
	  		children.push(h('span',{class:"highlight"} ,line.substr(idx,m.length) ));
	  		prev=idx+m.length;
	  	})
  	}

	children.push(h('span', line.substr(prev) ));

  	return h("div",children);
}
Vue.component("maintext",{
 // functional:true,
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
	render(h) { //eslint-disable-line
  		const children=ptsstore.getters.texts.map(line=>renderline(h,line[1]))

 		return  h("div",{class:"maintext",on:{mouseup:checkselection}},children);
	}
});