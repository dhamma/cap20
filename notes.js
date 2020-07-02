const {NOTESEP}=require("pengine");
const getnotes=rawtext=>{
	const notes={};
	let notestext='';
	rawtext.map((item,idx)=>{
		const at2=item[1].indexOf(NOTESEP);
		const x0=item[0];
		if (at2>0) {
			notestext=item[1].substr(at2+3);
		} else return ;
		const ns=notestext.split(/(\d+)\^/).filter(item=>item);
		for (var i=0;i<ns.length>>1;i++) {
			notes[x0+"_"+ns[i*2]]=ns[i*2+1];
		}
	})
	return notes;
}
module.exports={getnotes};