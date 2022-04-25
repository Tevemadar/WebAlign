let start = Date.now();
importScripts("inflater.js");
let log = (...logs) => console.log(Date.now()-start,"Gray",...logs);
let name = location.search.substring(1);
let gray=Promise.all([
    fetch(name + ".json").then(response=>response.json()),
    fetch(name+".gray").then(response=>response.arrayBuffer())
]).then(result=>{
    log("json+gray download.");
    let [json,buf]=result;
    return inflate(new Uint8Array(buf),{approx:json.xdim*json.ydim*json.zdim,notrim:true});
});
let mask=fetch(name+".mask").then(response=>response.arrayBuffer()).then(buf=>inflate(new Uint8Array(buf)));
Promise.all([gray,mask]).then(result=>{
    let [{result:gray,length},mask]=result;
    log("gray+mask inflated.",gray.length,length,mask.length);
    let graypos=gray.length-length;
    gray.copyWithin(graypos,0,length);
    gray.fill(0,0,length);
    let pos=0;
    let maskpos=0;
    let zerophase=true;
    let codes=0;
    while(maskpos<mask.length){
        codes++;
        let run=0;
        let byte;
        do{
            byte=mask[maskpos++];
            run=run<<7;
            run+=byte & 0x7f;
        }while(byte&0x80);
        if(codes<20)log(run);
        if(!zerophase){
            gray.copyWithin(pos,graypos,graypos+run);
            gray.fill(0,graypos,graypos+run);
            graypos+=run;
        }
        pos+=run;
        zerophase=!zerophase;
    }
    log("gray ready",zerophase,graypos,maskpos,codes);
    postMessage(gray.buffer,[gray.buffer]);
});
