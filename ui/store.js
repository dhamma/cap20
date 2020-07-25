'use strict';
const {readlines,parseCAP,palialpha}=require("pengine");
const {getnotes}=require("./notes");
const {PTSinRange}=require("../../cs0/ptsvolpg");
const _state0 = {
  name:"mainstore",
  keep:false,
  history:[],
  cap:null,
  texts:[],
  highlightword:''
} 
const _state1 = {
  name:"auxstore",
  cap:null,
  texts:[],
  history:[],
  keep:false,
  highlightword:'',
  displayfrom:0,
  displayline:0,
} 
const _state2={
  name:"dictstore",
  cap:null,
  texts:[],
	history:[],
  displayfrom:0,
  displayline:0,
}
const mutations = {
 updateCap: (state, newcap) => state.cap=newcap
  ,history: (state,history)=>state.history=history
  ,keep:(state,keep)=>state.keep=keep
 ,updateTexts: (state,texts) =>state.texts=texts
 ,highlightword:(state,hlw)=>state.highlightword=hlw
 ,displayline:(state,displayline)=>state.displayline=displayline
 ,displayfrom:(state,displayfrom)=>state.displayfrom=displayfrom
}

const getters = {
 cap: state => state.cap
 ,name:state=>state.name
 ,history:state=>(state.cap&&state.cap.db.toc)?state.history:[]
 ,highlightword:state=>state.highlightword
 ,capstr:state=> state.cap?state.cap.stringify():''
 ,texts: state=>state.texts
 ,notes: state=>getnotes(state.texts)
 ,backlinks:state=>{
    if (!state.cap || !state.cap.db)return [];
    const links=state.cap.db.getbacklinks(state.cap.stringify())||[];
    return links.map(link=>{
      return [ parseCAP(link[0]), link[1] ,link[0]];
    })
 }
 ,pts: state=>{
    if (!state.cap)return {};
    return PTSinRange(state.cap.db,state.displayfrom,state.displayline);
  }
}
const actions = {
 setCap: ({commit,state},cap)=>{
 	if (typeof cap=="string" || typeof cap=="number") {
 		cap=parseCAP(cap);
 	}
 	if (!cap) return;
	if (state.keep&&state.cap) {
		const history=state.history.map(i=>i);
		history.push(state.cap);
		commit( "history", history);
		commit( "keep", false);
	}
  let from=cap.x0-cap.x,nline=cap._w;
  if (cap.db.name.substr(0,3)=="cs0"){
    if (cap.y||cap.z) {
      from=cap.x0, nline=1;
    } else if (cap.x) {
      const n=cap.nextp();
      from=cap.x0,nline=cap._w-cap.x+n._w;
    }
  }
  readlines(cap.db,from,nline,(texts)=>{
      commit("displayfrom",from);
      commit("displayline",nline);
      commit("updateCap",cap)
      commit("updateTexts",texts);
    })
  }
 ,setHighlight:({commit,state},hlw)=>{
  //remove non pali characters
 	const regex=new RegExp("["+palialpha+" ,]","gi");
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
const mainstore = new Vuex.Store({
 state:_state0,
 getters, mutations, actions
})

const auxstore = new Vuex.Store({
 state:_state1,
 getters, mutations, actions
})

const dictstore = new Vuex.Store({
 state:_state2,
 getters, mutations, actions
})
const addresshinterstore = new Vuex.Store({
  state:{
    prefix:'',
  },
  mutations:{
     prefix: (state, newprefix) => state.prefix=newprefix
  },
  getters:{
    prefix: state => state.prefix
  },
  actions :{
    setAddress: ({commit,state},address)=>{
      commit("prefix", address.replace(/[,_.].*/,''));
    }
  }
})

const stores={mainstore,auxstore,dictstore};
module.exports={mainstore,auxstore,dictstore,addresshinterstore,stores}