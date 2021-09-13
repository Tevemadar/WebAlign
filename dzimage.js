const DZI={
    async load(url){
        let base=url.substring(0,url.lastIndexOf("."))+"_files/";
        let xml=new DOMParser().parseFromString(await fetch(url).then(response=>response.text()),"text/xml");
        let image=xml.documentElement;
        let tilesize=parseInt(image.getAttribute("TileSize"));
        let overlap=parseInt(image.getAttribute("Overlap"));
        let format=image.getAttribute("Format");
        let size=image.getElementsByTagName("Size").item(0);
        let width=parseInt(size.getAttribute("Width"));
        let height=parseInt(size.getAttribute("Height"));
        let max=Math.max(width,height);
        let maxlevel=0;
        while(max>1){
            maxlevel++;
            max=(max+1)>>1;
        }
        return{
            width,height,tilesize,overlap,format,base,maxlevel
        };
    },
    async getimage(dzi,targetwidth,targetheight){
        let {width,height,tilesize,overlap,format,base,maxlevel}=dzi;
        while(width>targetwidth*2 && height>targetheight*2){
            maxlevel--;
            width=(width+1)>>1;
            height=(height+1)>>1;
        }
        let fullcanvas=document.createElement("canvas");
        let ctx=fullcanvas.getContext("2d");
        fullcanvas.width=width;
        fullcanvas.height=height;
        let xtiles=Math.ceil(width/tilesize);
        let ytiles=Math.ceil(height/tilesize);
        let loads=[];
        for(let x=0;x<xtiles;x++)
            for(let y=0;y<ytiles;y++)
                loads.push(new Promise((resolve,reject)=>{
                    let tile=document.createElement("img");
                    tile.onerror=reject;
                    tile.onload=()=>{
                        ctx.drawImage(tile,x*tilesize-(x===0?0:overlap),y*tilesize-(y===0?0:overlap));
                        resolve();
                    };
                    tile.src=base+maxlevel+"/"+x+"_"+y+"."+format;
                }));
        await Promise.all(loads);
        let targetcanvas=document.createElement("canvas");
        targetcanvas.width=targetwidth;
        targetcanvas.height=targetheight;
        ctx=targetcanvas.getContext("2d");
        ctx.drawImage(fullcanvas,0,0,targetwidth,targetheight);
        return targetcanvas;
    },
    async fit(dzi,width,height){
        let x=0,y=0;
        let w=width,h=height;
        if(w/h<dzi.width/dzi.height){
            h=Math.floor(w*dzi.height/dzi.width);
            y=(height-h)/2;
        }else{
            w=Math.floor(h*dzi.width/dzi.height);
            x=(width-w)/2;
        }
        return{
            image:await DZI.getimage(dzi,w,h),
            x,y,w,h
        };
    }
};