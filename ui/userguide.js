const {renderDictionaryLine}=require("./dictionaryline");
const guide=`　
　
Computer Aided Pariyatti ver.2020
DoubleClick a word to check dictionary

Pāḷi Diacritic keys (Velthius compatible)
  aa=ā | .n=zn=ṇ | "n=qn=;n=ṅ | ~n=,n=wn=ñ

Data Source:
Pali English Dictionary, maintained by suttacentral.

Datafiles are released under Creative Commons Zero.

Source code and issue report: https://github.com/dhamma/cap20/

d(nos)            , d16=Mahāparinibbānasuttaṃ
m(nos)            , m26=Pāsarāsisuttaṃ
s(saṃyutta).(nos) , s56.11=Dhammacakkappavattana
a(nipāta).(nos)   , a2.21=Sunikkhittassa 
j(jātaka)         , j6=Devadhammajātakaṃ
vv(vatthu).(gatha), vv51.2=Maṇḍūkohaṃ(gatha 858)

`.split(/\n/);

const testptslink=`
	@[Vin.iii.3]


`
const abbrs={
mv:"MahaVagga",cv:"CūḷaVagga", pj:"Pārājika",pc:"Pācittiya",pvr:'Parivāra', 
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
		
		const rendered=testptslink.split(/\n/).map(
			line=>h("div",renderDictionaryLine(h,line))
		)
		//for (var i in abbrs) {
		//	abbriviations.push(h("span",{class:"abbr"},i+" "));
		//	abbriviations.push(h("span",abbrs[i]+", "));
		//}
		children.push(h("div",rendered));
		
		return h("div",{},children);
	}
})