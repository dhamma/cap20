const {bsearch,open}=require("pengine");
const {suggestedBreak,listCandidate}=require("paliword");
const breakcompound=(dictdb,w)=>{
	const headwords=window.palilexicon=dictdb.payload;
	const headwordx0=dictdb.extra.headwordx0;
	w=w.replace(/ṃ(\S)/g,"ṅ$1");
	const candidates=listCandidate(w);
	const suggested=suggestedBreak(w,candidates);
	const out=[];
	suggested.map(s=>{
		const candidate=candidates[s[1]];
		if (!candidate) {
			out.push({headword:s[0],x0:-1});
			return;
		};
		const w=palilexicon[candidate[0]];
		let at=candidate[0]
		while (at>0){
			if (headwords[at-1].substr(0,w.length)==w) at--;
			else break;
		}
		const headword=palilexicon[at].replace(/[@\+].+/,'');
		out.push({headword,x0:headwordx0[at]});
	})
	out.compound=true;
	return out;
}
const listcandidate=(dictdb,prefix)=>{
	if (!prefix.trim()){
		return [];
	}
	const headwords=dictdb.payload;
	const headwordx0=dictdb.extra.headwordx0;
	let at=bsearch(headwords,prefix,true);
	const MAXITEM=100;
	const candidates=[];
	while (at>0){
		if (headwords[at-1].substr(0,prefix.length)==prefix) at--;
		else break;
	}
	while (at<headwords.length) {
		if (headwords[at].substr(0,prefix.length)==prefix) {
			candidates.push({headword:headwords[at], x0:headwordx0[at]});
			if (candidates.length>=MAXITEM) break;
			at++;
		} else {
			break;
		}
	}
	if (candidates.length==0) return breakcompound(dictdb,prefix);
	return candidates;
}

module.exports={listcandidate}