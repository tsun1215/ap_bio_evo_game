var tutIndex = 0;
var continue_tut = true;

function runTutorial(){
    switch(tutIndex){
        case 0:
            showDialog("Many a year ago, <br/> \
                Long before humans did travel to and fro, <br/> \
                Critters did wander about, <br/> \
                Hoping to avoid a drought.", true);
            break;
        case 1:
            showDialog("Some fared better than others, <br/> \
                While others did lose their brothers. <br/> \
                Different conditions abound, <br/> \
                Many did fall to the ground.", true);
            break;
        case 2:
            // mouse left
            showDialog("A single click displays population information <br/>\
                Double clicks to pick up for transportation. <br/>\
                Scroll while selected for a different size group to move, <br/>\
                Click on your destination to approve.", false); 
            continue_tut = false;           
            break;
        case 3:
            // move right
            showDialog("A click, I say, you click to flick the map about, <br/> \
                        Click right and drag to move the map about.", false);
            continue_tut = false; 
            break;
        case 4:
            // map move 
            showDialog("move tutorial", false);
            break;
        case 5:
            // traits
            showDialog("traits tutorial", false);
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            showDialog("In this world, misfortune is norm and none are untouched. <br/> \
                Every so often, Mother Nature\’s fury strikes and leaves all crushed <br/> \
                A variety of forces can cause quite the stir <br/> \
                That will fell even the mightiest conifer.", false);
            setTimeout(function(){
                currentDisaster = 12;
                mapArr.disasterRun();
                setTimeout(function(){                
                    showDialog("<strong>A natural disaster has occured!</strong> <br/>The surrounding environment has changed.");
                }, 1000);
            }, 2000);            
            break;
        case 9:
            break;
        case 10:
            break;
    }
    tutIndex++;
}
// times pass, carrying, ice, global, nat dis, immi, emm, shit dies, geo isolation