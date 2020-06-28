'use strict';
require("./ui/main");
require("./ui/nav");
require("./ui/dictionary");

const {ptsstore,dictstore}=require("./store");
const {open,parseCAP,packintarr}=require("pengine");
const quicklinks=[
'dn2_156','sn5_421','an1_59','mn1_273'
]
new Vue({
	//store,
	el:"#app",
	state:Vuex.mapState(['cap'])
	,mounted(){
		open("cs0m",db=>{
			const cap=parseCAP("cnd_1",db);
			ptsstore.dispatch("setCap",cap);

			const history=ptsstore.getters.history;
			quicklinks.forEach(link=>{
				const cap=parseCAP(link,db);
				cap&&history.push(cap);
			});
			ptsstore.commit("history",history);
		});
		/*	
		open("sc0ped",db=>{
			db.payload=db.payload.split("\n");
			db.extra.headwordx0=packintarr.unpack3(db.extra.headwordx0);
			const cap=parseCAP("C_136",db);
			dictstore.commit("updateCap",cap); //no display, for user guide
			//dictstore.commit("setCap",cap);  //display 	
		})
		*/
	}
});
