var tutIndex = 0;
var tut_end = false;
var continue_tut = true;
var shown_death = false;

function runTutorial(){
    switch(tutIndex){
        case 0:
            // Intro
            showDialog("Many a year ago, <br/> \
                Long before humans did travel to and fro, <br/> \
                Critters did wander about, <br/> \
                Hoping to avoid a drought.", true);
            continue_tut = false;
            tutorial_ticker += tut_speed-10;
            break;
        case 1:
            // Intro 2
            showDialog("Some fared better than others, <br/> \
                While others did lose their brothers. <br/> \
                Different conditions abound, <br/> \
                Many did fall to the ground.", true);
            continue_tut = false;
            break;
        case 2:
            // Time passes
            showDialog("As time continues to pass, critters breed and reproduce <br/> \
                Generation after generation also tends to introduce <br/> \
                Randomly created variation that helps some survive, <br/> \
                As a result, populations continue to thrive.", true);
            continue_tut = false;
            tutorial_ticker += tut_speed-10;
            break;
        case 3:
            // Time passes
            showDialog("Some individuals less suited to success, <br/> \
                Fall victim to the harsh conditions creating duress. <br/> \
                But the success of those mutations that benefit <br/> \
                Help keep the population up in spite of the unfit.", true);
            continue_tut = false;
            break;
        case 4:
            // Left click
            showDialog("A single click displays population information <br/> \
                Double clicks to pick up for transportation.  <br/> \
                Scroll while selected for a different size group to move, <br/> \
                Click on your destination to approve.", false);
            continue_tut = false;
            break;
        case 5:
            // Immigration
            showDialog("Every so often, a pioneer organism enters a new habitat, <br/> \
                It's what happens when they fall into a new lat. <br/> \
                Generation after generation attempt to survive, mutating along the way. <br/> \
                Some variations are successful while others pass away.", false);
            sList[0].splitTo(700+430, 450+150, 10);
            sList[0].splitTo(700+430, 450+150, 10);
            continue_tut = false;
            break;
        case 6:
            // Emmigration
            showDialog("On occasion, an organism leaves, traveling far to a land of new trees. <br/> \
                The reasons for leaving can be many, but usually it relieves, <br/> \
                Some sort of pressure on the previous habitat. <br/> \
                Whatever the reason, organisms leave all that. ", false);
            sList[0].splitTo(500, 350, 10);
            continue_tut = false;
            break;
        case 7:
            // Speciation 
            showDialog("Time and time again, organisms move to new locations. <br/> \
                Often their movement results in isolation <br/> \
                Individuals in each location fail to interact between populations. <br/> \
                If they evolve differently enough, they undergo speciation.", false); 
            sList[0].splitTo(700+430, 450+150, 10);
            continue_tut = false;           
            break;
        case 8:
            // dying
            showDialog("A click, I say, you click to flick the map about, <br/> \
                Click right and drag to move the map about.", false);
            continue_tut = false;
            break;
        case 9:
            // map move 
            showDialog("In this world, misfortune is norm and none are untouched. <br/> \
                Every so often, Mother Nature's fury strikes and leaves all crushed <br/> \
                A variety of forces can cause quite the stir <br/> \
                That will fell even the mightiest conifer.", false);
            continue_tut = false; 
            kill_count = 0;
            killer = setInterval(function(){
                if(continue_tut){
                    currentDisaster = 11;
                    mapArr.disasterRun();
                    continue_tut = false; 
                    setTimeout(function(){                
                        showDialog("<strong>A natural disaster has occured!</strong> <br/>The surrounding environment has changed.");
                        kill_count++
                        if(kill_count>1){
                            clearInterval(killer);
                        }
                    }, 1000);
                }
            }, 1000);
            break;
        default:
            endTutorial();
            break;
    }
    tutIndex++;
}
// times pass, carrying, ice, global, nat dis, immi, emm, shit dies, geo isolation

function endTutorial(){
    showDialog("The tutorial is over, enjoy a new game!", true);
    continue_tut = false;
    tut_end = true;
    tutIndex = 0;
    initGame();
    disaster_rate = 0.05;
    level = Math.floor(Math.random()*10000)+1;
}