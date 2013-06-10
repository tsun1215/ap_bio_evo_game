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
            sList[0].splitTo(700+500, 450+150, 10);            
            sList[0].splitTo(500, 350, 10);
            continue_tut = false;
            break;
        case 6:
            // Emmigration
            showDialog("On occasion, an organism leaves, traveling far to a land of new trees. <br/> \
                The reasons for leaving can be many, but usually it relieves, <br/> \
                Some sort of pressure on the previous habitat. <br/> \
                Whatever the reason, organisms leave all that. ", false);
            sList[0].splitTo(700+430, 450+150, 10);
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
            showDialog("A click, A click, to flick the map about, <br/> \
                Click right and drag but don't move out.", false);
            continue_tut = false;
            break;
        case 9:
            // map move 
            showDialog("Bad luck hits us all, strong, weak, short, or tall <br/> \
                Nature's fury is not benign, this, my friend, you will soon find <br/> \
                Split up! Separate! Try to adapt! <br/> \
                For disasters may trap and kill the inapt.", false);
            continue_tut = false; 
            // kill_count = 0;
            // killer = setInterval(function(){
            //     if(continue_tut){
                    
            //         setTimeout(function(){                
            //             showDialog("<strong>A natural disaster has occured!</strong> <br/>The surrounding environment has changed.");
            //             kill_count++
            //             if(kill_count>1){
            //                 clearInterval(killer);
            //             }
            //         }, 1000);
            //     }
            // }, 1000);
            break;
        case 10:
            currentDisaster = 11;
            mapArr.disasterRun();
            showDialog("<strong>A flood has occured!</strong> <br/> \
                The environment starts to warm, critters start to squirm, <br/> \
                Oceans begin to rise, land lovers meet their demise. <br/> \
                Some fail the test, success for the rest.", false);
            continue_tut = false; 
            break;
        case 11:
            currentDisaster = 12;
            mapArr.disasterRun();
            showDialog("<strong>A drought has occured!</strong> <br/> \
                Over time the water goes away, now its dry day to day, <br/> \
                The adapted survive, the inapt fry.", false);
            continue_tut = false;
            break;
        case 12:
            sList[Math.round(Math.random()*sList.length)].death();
            break;
        case 13:
            break;
        default:
            endTutorial();
            break;
    }
    tutIndex++;
}
// times pass, carrying, ice, global, nat dis, immi, emm, shit dies, geo isolation

function endTutorial(){
    showDialog("The tutorial is over, enjoy a new game! <br/> \
        View info: Single click <br/> \
        Move pop: Double click, scroll to select amount; click again to move <br/> \
        Move map: Right click, drag", true);
    continue_tut = false;
    tut_end = true;
    tutIndex = 0;
    initGame();
    disaster_rate = 0.05;
    level = Math.floor(Math.random()*10000)+1;
}