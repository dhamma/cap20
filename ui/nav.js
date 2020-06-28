'use strict';
const {ptsstore}=require("../store");
Vue.component("CapNav",{
	methods:{
		goback:(evt)=>{ptsstore.dispatch("restore",
			parseInt(evt.target.attributes.idx.value))},
		prevp:()=>ptsstore.dispatch("prevp"),
		nextp:()=>ptsstore.dispatch("nextp"),
		onenter:(event)=>{
			ptsstore.dispatch("setCap",event.target.value)
		}
	},
	computed:{
		cap:()=>ptsstore.getters.capstr,
		history:()=>ptsstore.getters.history
	},
	template:`
	<div class="cardnav">
	<div class="floatright">
		<span v-for="(item,idx) in history">
			<button @click="goback" :idx="idx">{{item.stringify()}}</button>
		</span>
		<button @click="prevp">‹</button>
		<input  class="cap" v-bind:value="cap" @keyup.enter="onenter"></input>
		<button @click="nextp">›</button>
	</div>
	</div>
	`
})