let start=Date.now();
importScripts("inflater.js","derle.js");
let name=location.search.substring(1);
let xhr=new XMLHttpRequest();
xhr.open("GET",name+".json",false);
xhr.responseType="json";
xhr.send();
let json=xhr.response;
for(let label of json.labels)
    if(label.hasOwnProperty("rgb")){
        let rgb=parseInt(label.rgb,16);
        label.r=rgb>>16;
        label.g=(rgb>>8)&255;
        label.b=rgb&255;
    }
console.log(Date.now()-start,"Got json");
xhr=new XMLHttpRequest();
xhr.open("GET",name+".pack",false);
xhr.responseType="arraybuffer";
xhr.send();
let pack=xhr.response;
console.log(Date.now()-start,"Got pack");
let data=new Uint8Array(pack);
console.log(Date.now()-start,"Size:",data.length);
data=inflate(data);
console.log(Date.now()-start,"Inflated:",data.length);
data=derle(data,json.encoding);
console.log(Date.now()-start,"Decoded:",data.length);
json.blob=data.buffer;
postMessage(json,[json.blob]);