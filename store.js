'use strict';
const {readlines,parseCAP,palialpha}=require("pengine")
const _state = {
  keep:false,
  history:[],
  cap:null,
  texts:[],
  highlightword:''
} 
const _state2={
	cap:null,
	texts:[],
	history:[]
}
const mutations = {
 updateCap: (state, newcap) => state.cap=newcap
  ,history: (state,history)=>state.history=history
  ,keep:(state,keep)=>state.keep=keep
 ,updateTexts: (state,texts) =>state.texts=texts
 ,highlightword:(state,hlw)=>state.highlightword=hlw
}

const getters = {
 cap: state => state.cap
 ,history:state=>state.history
 ,highlightword:state=>state.highlightword
 ,capstr:state=> state.cap?state.cap.stringify():''
 ,texts: state=>state.texts
}
const actions = {
 setCap: ({commit,state},cap)=>{
 	if (typeof cap=="string" || typeof cap=="number") {
 		cap=parseCAP(cap,state.cap.db);
 	}
 	if (!cap) return;
	if (state.keep&&state.cap) {
		const history=state.history.map(i=>i);
		history.push(state.cap);
		commit( "history", history);
		commit( "keep", false);
	}
 	readlines(cap.db,cap.x0-cap.x,cap._w,(texts)=>{
 		commit("updateCap",cap)
 		commit("updateTexts",texts);
 	})
 }
 ,setHighlight:({commit,state},hlw)=>{
 	const regex=new RegExp("["+palialpha+"]","gi");
 	let s='';
 	hlw.replace(regex,(m)=>s+=m);
 	commit("highlightword",s);
 }
 ,keep:({commit,state})=>{
 	if (typeof state.keep!=='undefined') {
 		commit("keep",true);
 	}
 }
 ,restore:({commit,state,dispatch},n)=>{
 	if (n>state.history.length-1 || n<0)return;
 	const cap=state.history.splice(n,1);
 	commit("keep",false);
 	commit("history",state.history);
 	dispatch("setCap",cap[0]);
 }
 ,nextp: ({dispatch,state,commit}) => {
 	const newcap=state.cap.nextp();
 	commit("keep",false);
 	dispatch("setCap",newcap);
 }
 ,prevp: ({dispatch,state,commit}) => {
 	const newcap=state.cap.prevp();
	
 	commit("keep",false);
 	dispatch("setCap",newcap);
 }
}
const ptsstore = new Vuex.Store({
 state:_state,
 getters, mutations, actions
})

const dictstore = new Vuex.Store({
 state:_state2,
 getters, mutations, actions
})
module.exports={ptsstore,dictstore}