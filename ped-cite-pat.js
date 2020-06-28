const Latin={
	i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9,x:10
}
const mappings={};
const setBookMapping=(bk,mapping)=>{
	mappings[bk]=mapping;
}
const patterns=[
	[/Vin\.i\.(\d+)/, (m,p)=> "mv_"+p],
	[/Vin\.ii\.(\d+)/, (m,p)=> "cv_"+p],
	[/Vin\.iii\.(\d+)/, (m,p)=> "vb1_"+p],
	[/Vin\.iv\.(\d+)/, (m,p)=> "vb2_"+p],
	[/Vin\.v\.(\d+)/, (m,p)=> "pvr_"+p],
	[/([DMSA]N)\.([iv]{1,3})\.(\d+)/,
	 (m,nky,vol,p)=> nky.toLowerCase()+Latin[vol]+"_"+p],
	[/Ja\.([iv]{1,3})\.(\d+)/, (m,vol,p)=> "ja"+Latin[vol]+"_"+p],
	[/(Iti|Kp|Mnd|Ud|Vb)\.(\d+)/, (m,bk,p)=> bk.toLowerCase()+"_"+p],

	[/(DN-a)\.([i]{1,3})\.(\d+)/, (m,nky,vol,p)=> "dn-a_"+p],

	[/([MSA]N-a)\.([iv]{1,3})\.(\d+)/,
	 (m,nky,vol,p)=> nky.toLowerCase()+Latin[vol]+"_"+p],
	[/(Iti|Kp|Vv|Snp|Mnd|Ud|Vb|Pv)-a\.(\d+)/, (m,bk,p)=> bk.toLowerCase()+"-a_"+p],
	[/(Mil|Vism)\.(\d+)/, (m,bk,p)=> bk.toLowerCase()+"_"+p],
	[/(Dhp-a)\.([iv]{1,3})\.(\d+)/, (m,nky,vol,p)=> "dhp-a"+Latin[vol]+"_"+p],
	[/(Dhs-a)\.(\d+)/, (m,nky,vol,p)=> "ds-a_"+p],

	[/Snp\.p\. ?(\d+)/,(m,p)=>"snp_"+p],
	[/(Snp|Thag|Thig|Dhp)\.(\d+)/, (m,bk,q)=> {
		bk=bk.toLowerCase();
		let startpage=0,obk='';
		if (bk=="thig") {
			startpage=122;
			obk='Thig.';
		} 
		const mapping=mappings[bk];
		let p=0;
		q=parseInt(q);
		for (var i=0;i<mapping.length;i++) {
			if (mapping[i]>q) {
				p=i+startpage;
				break;
			}
		}
		if (obk=="Thig.") bk='thag';
		return bk+"_"+ p+"("+obk+q+")";
	}],
	//[/Dhs\.(\d+)/, (m,p)=> "ds_"+p],  not page number
]

module.exports={patterns,setBookMapping}