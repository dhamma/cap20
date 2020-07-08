'use strict';
const {dictstore}=require("./store");
const {parseCAP,readlines}=require("pengine");
const inputpali=require("./inputpali");
const bus=require("./eventbus");
const {listcandidate}=require("./candidate")
const {renderDictionaryLine}=require("./dictionaryline");
require("./citation");
require("./userguide");

let searchtimer=0,blurtimer;
const NestedCard=Vue.extend({
	props:{
		texts:{type:Array},
		depth:{type:Number},
		close:{type:Function}
	},
	updated(){
		const ele=document.getElementsByClassName("ped-container")[0];
		const arr=document.getElementsByClassName("highlightx0");
		if (arr.length) {
			ele.scrollTop=arr[0].offsetTop-200;
		} else {
			ele.scrollTop=0;
		}
	},
	render(h){
		const children=this.texts.map(item=>{
			const rendered=renderDictionaryLine(h,item[1]);
			const x0=item[0];
			const capx0=dictstore.getters.cap.x0;
			return h("div",{class:(x0==capx0)?"highlightx0":"linediv_dict"},rendered)
		});
		return h("div",{class:this.depth?"card":""},
			[
			 this.close?h("button",{class:"floatright",on:{click:this.close}},"✖"):null,
			 h("div",children)
			]
		);
	}
})

const Candidates=Vue.extend({
	props:{
		selectCandidate:{type:Function},
		candidates:{type:Array}
	},
	render(h){
		const ele=this.candidates.compound?"span":"div";
		const extra=this.candidates.compound?"-":"";
		const len=this.candidates.length-1;
		const children=this.candidates.map((c,idx)=>{
			const cls=(c.x0>0)?"dictword":"notdictword";
			return h(ele,{attrs:{x0:c.x0},
				class:cls,on:{click:this.selectCandidate}}
				,c.headword+(idx<len?extra:''));
		})
		return h("div",children);
	}
})
const DictionaryPanel=Vue.extend({
	store:dictstore,
	methods:{
		oninput(event){
			inputpali(event.target);
			this.prefix=event.target.value;
			this.candidates=listcandidate(dictstore.getters.cap.db,this.prefix);
			if (event.key=="Enter" &&this.candidates.length) {
				this.goto(this.candidates[0].x0);
				this.$refs.hw.blur();
			} else {
				this.showcandidate=true;
			}
		},
		onblur(){
			blurtimer=setTimeout( function (){
				this.showcandidate=false
			}.bind(this),500);
		},
		onfocus(){
			clearTimeout(blurtimer);
			this.showcandidate=true;
		},
		goto(x0){
			if (x0<0)return;
			const newcap=parseCAP(x0 ,dictstore.getters.cap.db);
			dictstore.dispatch("setCap", newcap);
			this.capstr=newcap.stringify();
		},
		selectCandidate(event){
			const x0=parseInt(event.target.attributes.x0.value);
			this.goto(x0);
			this.$refs.hw.focus();
		},
	},
	mounted(){
		bus.$on('settofind',t=>{
			this.prefix=t.toLowerCase();
			if (!this.prefix)return;
			this.candidates=listcandidate(dictstore.getters.cap.db,this.prefix);
			this.showcandidate=true;
			if ((this.candidates.length &&this.candidates.compound)
			 || this.candidates.length==1
			 || this.candidates[0].headword==t){
				this.goto(this.candidates[0].x0);
			}
			clearTimeout(blurtimer);
		})
	},
	data(){
		return {prefix:'',capstr:'', candidates:[],showcandidate:false}
	},
	components:{
		Candidates:Candidates
	},
	//
	template:`
	<div class="dictpanel floatright">
		<input ref="hw" class="headword" v-bind:value="prefix" 
			@blur="onblur" @focus="onfocus"
			@keyup="oninput"></input>
		
		<div v-if="showcandidate" class="candidates">
			<Candidates :candidates="candidates" :selectCandidate="selectCandidate"/>
		</div>
	</div>
	`
})
Vue.component("DictionaryContainer",{
  functional:true,
  render(h) { //eslint-disable-line
  		const texts=dictstore.getters.texts;
  		return  h("div",{class:"dictionarytext"},
 				[h(DictionaryPanel),
 				texts.length?
 				h(NestedCard,{props:{texts}}):h("UserGuide")
 				]
 			)
	}
});