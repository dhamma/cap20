const {addresshinterstore}=require("./store");
const S=addresshinterstore;
const AddressHinter=Vue.extend({

	render(h){
		return h("div",{},"help of "+S.getters.prefix);
	}
})
module.exports={AddressHinter};