const {dictstore}=require("./store");
const {parseCAP}=require("pengine");
let headword='';
const renderDictionaryLine=(h,text)=>{
	const children=[];
	let lastidx=0;
	headword=headword||"";
	
	if (text[0]=="㊔") {
		const title=dictstore.getters.cap.stringify();
		const m=text.match(/[\d]+-/);
		headword=text.substr(2+m[0].length);
		return [h("div",{class:"entry",attrs:{title}},headword)];
	}

	text.replace(/[@\^]\[(.+?)\]/g,(m,m1,idx)=>{
		const s=text.substring(lastidx,idx);
		if (s) children.push( h("span",s));
		lastidx=idx+m.length;
		if (m[0]=="^") {
			children.push(h(CardButton,{props:{word:m1}}));
		} else {
			children.push(h("citation",{props:{label:m1,headword}}));			
		}
	})
	children.push( h("span", text.substr(lastidx)));

	return children;
}
const CardButton=Vue.extend({
	props:{
		word:{type:String}

	},
	methods:{
		close(){
			this.showcard=false;
		},
		opencard(event){
			const db=dictstore.getters.cap.db;
			const headwords=db.payload;
			const w=event.target.innerText.replace(/[\*˚\-]/,'');
			let at=bsearch(headwords,w);
			if (at<0)return;

			while (at>0) {
				if (headwords[at-1]==w) at--;
				else break;
			}

			const headwordx0=db.extra.headwordx0;
			const cap=parseCAP(headwordx0[at],db);

			const self=this;
		 	readlines(cap.db,cap.x0-cap.x,cap._w,(texts)=>{
		 		self.texts=texts;
		 		self.showcard=true;
		 	})
		}
	},
	data(){
		return {texts:[],showcard:false}
	},
	render(h){
		if (this.showcard) {
			return h(NestedCard,{props:{depth:1,texts:this.texts,close:this.close}})
		} else {
			const words=this.word.split(/([ ,])/);
			const children=words.map(w=>{
				return w.match(/[ ,]/)?h("span",w):
			    h("a",{attrs:{href:"#"},on:{click:this.opencard}},w)
			})
			return h("span",children);
		}
	}
})
module.exports={renderDictionaryLine}