const {mainstore}=require("./store");
const {patterns,setBookMapping}=require("../ped-cite-pat");
const {parsePTS,parseAddress}=require("../parseaddress");

Vue.component("citation",{
	props:{
		label:{type:String},
		headword:{type:String}
	},
	methods:{
		click(){
			let cap=parsePTS(this.label);
			if (typeof cap=="string") {
				cap=parseAddress(cap);
			}
			mainstore.dispatch("setHighlight",this.headword.toLowerCase());
			mainstore.dispatch("setCap",cap);
		}
	},
	render(h){
		const oricites=this.label.split(/[ ;]/);
		
		const children=oricites.map((cite,idx)=>{
			return h("span",{class:"citation",on:{click:this.click}},cite+" ")
		});
		return h("span",children);
	}
})
