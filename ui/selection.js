const getselection=()=>{
	const sel=document.getSelection();
	const b=sel.baseNode, e=sel.extentNode;
	const boff=sel.baseOffset, eoff=sel.extentOffset;
	if (!b||!e||!b.data)return;
	if (b==e) {
		return b.data.substring(boff,eoff);
	}
	let t=b.data.substr(boff);

	let n=b.parentElement.nextSibling;
	while (n && n!==e.parentElement) {
		if (t[t.length-1]!=='-') t+=' ';
		t+=n.textContent;
		n=n.nextSibling;
	}
	if (t[t.length-1]!=='-') t+=' ';
	t+=e.data.substr(0,eoff);
	return t;
}

module.exports={getselection};