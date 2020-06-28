const chmap=[
	[/aa/g,'ā'], [/ii/g, 'ī'], 	[/uu/g, 'ū'],
	[/[z\.]t/g, 'ṭ'],	[/[z\.]d/g, 'ḍ'],
	[/[z\.]n/g, 'ṇ'],	[/["q;]n/g, 'ṅ'],	[/[~w,]n/g, 'ñ'],
	[/[z\.]m/g, "ṃ"],	[/["q;]m/g, "ṁ"],
	[/[z\.]l/g,'ḷ'],   

	[/A[Aa]/g,'Ā'], [/I[Ii]/g, 'Ī'], 	[/U[Uu]/g, 'Ū'],
	[/[Z\.]T/g, 'Ṭ'],	[/[Z\.]D/g, 'Ḍ'],
	[/[Z\.]N/g, 'Ṇ'],	[/["Q;]N/g, 'Ṅ'],	[/[~W,]N/g, 'Ñ'],
	[/[Z\.]M/g, "Ṃ"],	[/["Q;]M/g, "Ṁ"],
	[/[Z\.]L/g,'Ḷ'],    
]
const chmapsanksrit=[
 	[/[w,]l/g, 'ḹ'],   
	[/[z\.]r/g,'ṛ'],    [/[w,]r/g, 'ṝ'],
	[/[z\.]s/g,'ṣ'],    [/[w,]s/g, 'ś'],
	[/[z\.]h/g,'ḥ'],
	[/[W,]L/g, 'Ḹ'],   
	[/[Z\.]R/g,'Ṛ'],    [/[W,]R/g, 'Ṝ'],
	[/[Z\.]S/g,'Ṣ'],    [/[W,]S/g, 'Ś'],
	[/[Z\.]H/g,'Ḥ'],
]

function toUni(input,sanskrit) {
	if(!input || input == '') return input;
	chmap.forEach( m=> input=input.replace(m[0],m[1]));	
	if (sanskrit)chmapsanksrit.forEach( m=> input=input.replace(m[0],m[1]));	
	return input;
}

function oninput(inputele){
	const s=toUni(inputele.value);
	if (s!==inputele.value) {
		const sel=inputele.selectionStart;
		inputele.value=s;
		inputele.setSelectionRange(sel,sel);
	}
}

module.exports=oninput;