const guide=`　PTS reader with PED 
DoubleClick a word or select partially to check dictionary

Pāḷi Diacritic keys (Velthius compatible)
  aa=ā | .n=zn=ṇ | "n=qn=;n=ṅ | ~n=,n=wn=ñ

Data Source:
Pali English Dictionary, maintained by suttacentral.
PTS  Tipitaka, input by Dhammakaya Foundation, 
All datafile included are released under Creative Commons Zero.

Source code and issue report: https://github.com/dhamma/ptsed/
Abbriviations:
`.split(/\n/);
const abbrs={
	mv:"MahaVagga",'vb1~vb2':"SuttaVibhaṅga",
cv:"CūḷaVagga", pvr:'Parivāra', 
'dn1~dn3':'DīghaNikaya','mn1~mn3':'MajjhimaNikaya',
'sn1~sn5':'SaṃyuttaNikaya' , 'an1~an5':'AṅguttaraNikaya',
kp:'KhuddaKapāṭha', dhp:'DhammaPada', ud:'Udāna', iti:'ItiVuttaka' ,
snp:'SuttaNipāta',
vv:'VimānaVatthu', pv:'PetaVatthu', thag:'Theragātha(Theri)',
'ja1~ja6':'Jātaka' , mnd:'MahāNiddesa', cnd:'CūḷaNiddesa',
'ps1~ps2':'PaṭiSambhidāMagga', ap:'TherāPadāna', bv:'BuddhaVaṃsa', cp:'CariyāPiṭaka',       
mil:'MilindaPañha', vism:'VisuddhiMagga',
ds:'DhammaSaṅgaṇī', vb:'Vibhaṅga', dt:'DhātuKathā' ,
pp:'PuggalaPaññatti', kv:'KathāVatthu', 'ya1~ya2':'Yamaka', 'pt1~pt2':'Paṭṭhāna'} 


Vue.component("UserGuide",{
	render(h){
		const abbriviations=[];
		const children=guide.map(line=>h("div",line));
		
		for (var i in abbrs) {
			abbriviations.push(h("span",{class:"abbr"},i+" "));
			abbriviations.push(h("span",abbrs[i]+", "));
		}
		children.push(h("div",abbriviations));
		return h("div",{},children);
	}
})