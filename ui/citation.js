const {mainstore}=require("./store");
const {patterns,setBookMapping}=require("../ped-cite-pat");
const {parsePTS,parseAddress}=require("../parseaddress");
const {parsePEDCite}=require("../../sc0/citeparser");
Vue.component("citation",{
	props:{
		label:{type:String},
		headword:{type:String}
	},
	methods:{
		click(){
			/*
			let cap=parsePTS(this.label);
			if (typeof cap=="string") {
				cap=parseAddress(cap);
			}
			*/
			const cite=parsePEDCite(this.label);
			const cap=parseAddress(cite);
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
