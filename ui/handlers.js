const {mainstore}=require("./store");
const stylehandlers={
	nti:(event)=>{
		mainstore.dispatch("setHighlight",event.target.innerText);
	}
}

module.exports={stylehandlers};