'use strict';
const {getancestor}=require("./tocpopup");
const {stores}=require("../store");
const {parseAddress}=require("../parseaddress");
const breadcrumb=Vue.extend({
	props:['cap','openpopup'],
	data(){
		return {depth:0}
	},
	render(h){
		if (!this.cap || !this.cap.db.toc)return;
		const ancestor=getancestor(this.cap);
		const ancestorspan=ancestor.map((item,idx)=>{
			let t=item.t;
			let title='';
			const at=t.indexOf("|");
			if (at>-1) {
				title=t.substr(0,at);
				t=t.substr(at+1);
			}
			if (t=="-") return null;
			return h("span",{class:"tocitem",
				on:{click:this.openpopup},
				attrs:{title,depth:item.d}},((item.d>1)?"／":"")+t);
		}).filter(item=>item);

		return h("span",{class:"breadcrumb"},ancestorspan);
	}
});
Vue.component("CapNav",{
	props:{
		thestore:{type:String,required:true}
	},
	methods:{
		goback:function(evt){this.store.dispatch("restore",
			parseInt(evt.target.attributes.idx.value))},
		prevp:function(){this.store.dispatch("prevp")},
		nextp:function(){this.store.dispatch("nextp")},
		oninput:function(event){
			if (event.target.value!==this.address) {
				this.address=event.target.value;
				this.$refs.address.classList.remove("error");
				const cap=parseAddress(event.target.value,this.cap.db);
				if (!cap) {
					if (event.target.value) this.$refs.address.classList.add("error");
					return;
				}				
			}

			if (event.key=="Enter"){
				const cap=parseAddress(event.target.value,this.cap.db);
				if (cap) this.store.dispatch("setCap",cap)
			}
		},
		openpopup:function(event){
			this.popupitemdepth=parseInt(event.target.attributes.depth.value);
			this.showpopup=true;
		},
		onselecttocitem:function(addr){
			this.showpopup=false;
			this.store.dispatch("setCap",addr);
		}
	},
	data(){
		const store=stores[this.thestore];
		return {store,showpopup:false,popupitemdepth:0,address:''};
	},
	computed:{
		cap:function(){return this.store.getters.cap},
		capstr:function(){return this.store.getters.capstr},
		history:function(){return this.store.getters.history}
	},
	components:{'breadcrumb':breadcrumb},
	template:`
	<div class="cardnav">
	<div class="floatright">
		<span v-for="(item,idx) in history">
			<button @click="goback" :idx="idx">{{item.stringify()}}</button>
		</span>
		<button @click="prevp">‹</button>
		<input  class="cap" ref="address" 
			v-bind:value="capstr" @keyup="oninput"></input>
		<button @click="nextp">›</button>
	</div>
	<breadcrumb :cap="cap"  :openpopup="openpopup"/>

	<tocitempopup v-if="showpopup" :cap="cap" 
	:depth="popupitemdepth" :onselecttocitem="onselecttocitem"/>
	</div>
	`
})