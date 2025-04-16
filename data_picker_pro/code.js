console.clear()

console.log("plugin invoked")

function getPosition(node){
    const absolutePosition = node.absoluteTransform[0][2]; // X position
    const absoluteYPosition = node.absoluteTransform[1][2]; // Y position
    return {
        name: node.name,
        x: absolutePosition,
        y: absoluteYPosition,
    };
}

function getTextDetails(node){
    if (node.type==="TEXT"){
        return {
            name: node.name,
            characters:node.characters,
            lineheight:node.lineHeight,
            textDecoration:node.textDecoration,
            fontSize: node.fontSize,
            fontFamily: node.fontName.family,
            fontWeight: node.fontName.style,
            lineHeight: node.lineHeight,
            letterSpacing: node.letterSpacing,
            fills:node.fills[0],
            color:node.fills[0].color,
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

 function frameComponent(){
    //   ############ The below is to get the data of selected components ####################
    const selection = figma.currentPage.selection
    var details={}
    for (var selected of selection){
        var frame = selected
        if (frame.type=="FRAME"){
            // cof - component of a frame
            for (var cof of frame.children){
                details[`${cof.type} ${cof.id}`]={}
                details[`${cof.type} ${cof.id}`].position=getPosition(cof)
                details[`fill_value[${cof.fills['0'].type}]`]=cof.fills['0']
                getTextDetails(cof)==null?null:details[`${cof.type} ${cof.id}`].textDetails=getTextDetails(cof)
                getVectorNodeDetails(cof)==null?null:details[`${cof.type} ${cof.id}`].vectorNodeDetails=getVectorNodeDetails(cof)    
            }   
        }
        else{
            console.log("not a frame")
        }    
    }
    console.log("overall collected details: ",details)
    
    figma.closePlugin("End of frame plugin")
}

function switchBetweenEditors(){
    if (figma.editorType === 'figma'){
        console.log("figma mode")
        frameComponent();
    }
    else if (figma.editorType === 'dev'){
        console.log("dev mode")
        codeGenerator();
    }    
}

function getProperties(component){
    // console.log(component.type)
    var details={}
    details[`${component.type} ${component.id}`]={}
    details[`${component.type} ${component.id}`].position=getPosition(component)
    details[`fill_value[${component.fills['0']}]`]=component.fills['0']
    getTextDetails(component)==null?null:details[`${component.type} ${component.id}`].textDetails=getTextDetails(component)
    getVectorNodeDetails(component)==null?null:details[`${component.type} ${component.id}`].vectorNodeDetails=getVectorNodeDetails(component)    
    return details
}
function getChilds(child){
    
    var component={}
    if(child.children!=null){
        for(var childs of child.children)
            component[`${childs.type} ${childs.id}`]=getChilds(childs)
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
    for (var each of selection){
        console.log(getChilds(each))
        
    }
}
traverse()
figma.closePlugin("plugin gracefully closed")