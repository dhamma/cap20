const {ptsstore}=require("../store");
const {patterns,setBookMapping}=require("../ped-cite-pat");
const transpos=pts=>{
	const cites=pts.split(/[ ;]/);
	const out=[];
	let knownbk='';
	setBookMapping('snp',ptsstore.getters.cap.db.extra['snp']);
	setBookMapping('thag',ptsstore.getters.cap.db.extra['thag']);
	setBookMapping('thig',ptsstore.getters.cap.db.extra['thig']);
	setBookMapping('dhp',ptsstore.getters.cap.db.extra['dhp']);
	cites.forEach((cite,idx)=>{
		let ok=false;
		for (pat of patterns){
			const after=cite.replace(pat[0],pat[1]);
			if (after!==cite) {
				knownbk=after.substr(0,after.indexOf("_")-1);
				out.push(after);
				ok=true;
				break;
			} else if (knownbk&&idx) {
				cite.replace(/([iv]{1,3})\.(\d+)/,(m,vol,p)=>{
					out.push( knownbk+Latin[vol]+"_"+p);
					ok=true;
				});
			}
		}
		if (!ok) out.push(cite);
	});

	return out;
}

Vue.component("citation",{
	props:{
		label:{type:String},
		headword:{type:String}
	},
	methods:{
		gopts(){
			ptsstore.dispatch("setHighlight",this.headword.toLowerCase());
			ptsstore.dispatch("setCap",event.target.innerText);
		}
	},
	render(h){
		const oricites=this.label.split(/[ ;]/);
		const ptscites=transpos(this.label);

		const children=ptscites.map((cite,idx)=>{
			if (oricites[idx]!==cite){
				return h("span",{class:"citation",on:{click:this.gopts}},cite+" ")
			} else {
				return h("span",{},cite);
			}
		});
		return h("span",children);
	}
})
