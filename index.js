'use strict';
require("./ui/main");
require("./ui/nav");
require("./ui/dictionary");
require("./ui/popup");

const {mainstore,auxstore,dictstore}=require("./ui/store");
const {open,parseCAP,packintarr}=require("pengine");
const quicklinks=[
'dn2_218','sn5_1081','an2_20','mn1_273'
]
new Vue({
	//store,
	el:"#app",
	state:Vuex.mapState(['cap'])
	,mounted(){
		open("cs0m",db=>{
			//ja2a_x0 <p>{Vessantaraṃ}<p5.109>  not rendered
			//ja2a_x1  {Vessantaraṃ} not rendered
			//ja2a_x0 move backward , cannot move forward
			const cap=parseCAP("an2_34",db);
			mainstore.dispatch("setCap",cap);

			const history=mainstore.getters.history;
			quicklinks.forEach(link=>{
				const cap=parseCAP(link,db);
				cap&&history.push(cap);
			});
			mainstore.commit("history",history);
		});
		
		open("cs0a",db=>{
			const cap=parseCAP("dhp0a_x5",db);
			auxstore.dispatch("setCap",cap);
		});

		open("sc0ped",db=>{
			db.payload=db.payload.split("\n");
			db.extra.headwordx0=packintarr.unpack3(db.extra.headwordx0);
			const cap=parseCAP("C_136",db);
			dictstore.commit("updateCap",cap); //no display, for user guide
			//dictstore.dispatch("setCap",cap);  //display 	
		})
		
	}
});
