console.clear()
figma.showUI(__html__);
figma.ui.resize(900,900)
const Device=[
    {width:412,height:917,deviceType:"Android Compact"},
    {width:700,height:840,deviceType:"Android Medium"},
    {width:393,height:852,deviceType:"iPhone 16"},
    {width:402,height:874,deviceType:"iPhone 16 pro"},
]

function getPosition(node){
    const absolutePosition = node.absoluteTransform[0][2]; // X position
    const absoluteYPosition = node.absoluteTransform[1][2]; // Y position
    
    return {
        name: node.name,
        width:node.width,
        height:node.height, 
        x: absolutePosition,
        y: absoluteYPosition,
    };
}

function getTextDetails(node){
    if (node.type==="TEXT"){
const obj={}
    obj.name= node.name,
    obj.characters=node.characters,
    obj.lineheight=node.lineHeight,
    obj.textDecoration=node.textDecoration,
    obj.fontSize= node.fontSize,
    obj.fontFamily= node.fontName.family,
    obj.fontWeight= node.fontName.style,
    obj.lineHeight= node.lineHeight,
    obj.letterSpacing= node.letterSpacing,
    obj.fills=node.fills[0],
    obj.color=node.fills[0].color,
    obj.shadow=node.effects,
    obj.width=node.width,
    obj.height=node.height,
    obj.rotation=node.rotation,
    obj.strokes=node.strokes
        return obj
    }
    else {
        return null
    }
}

function getVectorNodeDetails(node){
    if (node.type==="VECTOR"){
        return {
            name: node.name,
            fontSize: node.fontSize,
            lineHeight: node.lineHeight,
            letterSpacing: node.letterSpacing,
            fills:node.fills[0],
            shadow:node.effects,
            width:node.width,
            height:node.height,
            rotation:node.rotation,
            strokes:node.strokes
        }
    }
    else {
        return null
    }
}
function getProperties(component){
    // console.log(component.type)
    var details={}
    details[`${component.type} id:${component.id}`]={}
    details[`${component.type} id:${component.id}`].position=getPosition(component)
    details[`fill_value`]=component.fills['0']
    getTextDetails(component)==null?null:details[`${component.type} id:${component.id}`].textDetails=getTextDetails(component)
    getVectorNodeDetails(component)==null?null:[`${component.type} id:${component.id}`].vectorNodeDetails=getVectorNodeDetails(component)    
    return details
}
function getChilds(child){
    var component={}
    if(child.children!=null){
        for(var childs of child.children)
            component[`${childs.type} id:${childs.id}`]=getChilds(childs)
    }
    else{
        if (child.type=="FRAME"){
            component[`${child.type} id: ${child.id}`]="cannot get properties for a frame"    
        }     
        else{component[`${child.type} id: ${child.id}`]=getProperties(child)}
    }
    return component
}
function traverse(){
    const selection = figma.currentPage.selection
    var allComponents={}
    for (var each of selection){
        const deviceType=Device.find(obj=>{ if(obj.height==each.height&&obj.width==each.width) return obj.deviceType})
        console.log("selection:\t",each,"width and height: ",each.height," X ",each.width,"\n","device type recived: ",deviceType)
        
        var width=0
        var height=0
        if (deviceType!=null){
            console.log("in true block")
            width=deviceType.width
            height=deviceType.height
        }
        else{
            width=each.width
            height=each.height
            console.log("in false block")
        }
        console.log(width,height)
        allComponents[`${deviceType!=null?deviceType.deviceType:"custom_frame"} ${each.type} ${each.name} of dimensions (${width} X ${height})`]=getChilds(each)  
    }
    return allComponents
}
// traverse()
async function makepost(payload){
    console.log("function invoked")
    const url="http://localhost:9000/figma";
    
    try{
        console.log("in try")
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "Access-Control-Allow-Origin":"*"
                // "Authorization":"Token",
            },
            body:JSON.stringify(payload)
        });
        if (!response.ok){
            throw new Error("HTTP error")
        }
    }catch(error){
        console.log("error caught: ",error)
    }
    
}

const payload={
    data:traverse(),
    message:"Unit of representation of co-ordinates:(PXELS); The X axis limit is the Width of the frame and the Y axis limit is the Height of the frame; The right top corner has the co-ordinates(W,0),the left bottom corner has (0,H) and the right bottom corner has(W,H)"
}
makepost(payload).finally(()=>figma.closePlugin("gracefully completed"))

figma.ui.postMessage({type:"hello",message:payload})
// figma.closePlugin("gracefully closed")