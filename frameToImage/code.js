console.clear()

function sleep(ms){
    return new Promise(resolve=> setTimeout(resolve,ms))
}

async function makepost(payload){
    const url="http://localhost:9000/binary_data";
    // console.log("in try",typeof(payload),payload)
    var i=0;
    var bodydata={}
    for (var byte of payload){
        i=i+1
        console.log(byte)
        var string=Array.from(byte).join(",")    
        bodydata[`frame${i}`]={data:string}
    }
    
    console.log(bodydata)
    var data={data:bodydata}

    // var blob=new Blob([payload],{type:'application/octet-stream'})
    
    try{
        
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "Access-Control-Allow-Origin":"*"
                // "Authorization":"Token",
            },
            body:JSON.stringify(data),
        });
        sleep(300)
    
        if (!response.ok){
            throw new Error("HTTP error")
        }
        else{
            console.log(response)
        }
    }catch(error){
        console.log("error caught: ",error)
    }finally{
        figma.closePlugin("plugin closed gracefully")
    }
    
}

async function toBytes(){
    var selection=figma.currentPage.selection
    var array=[]
    for (var selection of selection)
        
        if (selection.type=='FRAME'){
            console.log("true block",selection.type)
            var imageBytes
            try{
                imageBytes=await selection.exportAsync({format:'PNG'})
                await sleep(300)
            }
            catch(error){console.log(error)}
            console.log(imageBytes.length)
            array.push(imageBytes)
            
        } 
    console.log(array)   
    makepost(array)
}
toBytes()
// figma.closePlugin("plugin closed gracefully")