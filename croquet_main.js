class RoomModel extends Croquet.Model {

    init() {

        // NOTE: I would love to give you a live demo of the room's capabilities 
        // Feel free to ask me and I will walk you through the escape room!

        // ANSWERS TO CHALLENGES 1,2,3 (in respective order): 
        // if (apples >= 250) { println("Party!"); } else { println("Keep Harvesting!"); }
        // for (int i = 0; i < 4; i++) { println("go stairs"); }
        // while (time <= 10) { time++; }


        // Initialize the state of the room, starting with the countdown at 1200 seconds 
        // or 20 minutes to escape. 
        this.count = 1200;
        this.keepCounting = true;
        // subscribe different elements of room to different events, call the appropriate 
        // function once the event fires
        this.subscribe("timer", "changed", this.timerUpdate); 
        // keep counting down every second
        this.future(1000).tick2();

        this.reload = false;
        this.subscribe("universe", "reload", this.reloadRoom);
        
        this.booleanGate = false;
        this.subscribe("gate", "submit", this.gateUpdate);

        this.forStairs = false;
        this.subscribe("stairs", "submit", this.stairsUpdate);

        this.whileBridge = false;
        this.subscribe("bridge", "submit", this.bridgeUpdate);
        this.subscribe("drop", "update", this.bridgeDrop);

        this.value = "";
        this.dropBridge = false; 

        this.color = "black";
        this.subscribe("background", "change", this.colorUpdate); 

        this.subscribe("counter", "reset", this.resetCounter);
        this.subscribe("textspace", "submit", this.submitText);

        // Set player location
        this.playerPos = "0 3 0";

        // Update the current position of the camera (player) to be the x, y, z
        // keep track of the current position every second to monitor 
        // whether the player has escaped the confines of the room and needs to be reset
        let currPos = cam.getAttribute("position");
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        this.subscribe("room", "playermoved", this.playerMove);
        this.future(1000).tick3(stringCurrPos);
        

    }

    // Used to move the player position across 
    // each of the boxes in the stair challenge
    updatePlayerPosition(box) {
        if (box.getAttribute('id') == "box1") {
            box.setAttribute("position", "0 10 40");
            let stringCurrPos = "0 12 40";
            let camera = document.getElementById("cam");
            camera.setAttribute("position", stringCurrPos)
        } else if (box.getAttribute('id') == "box2") {
            box.setAttribute("position", "0 20 50");
            let stringCurrPos = "0 22 50";
            let camera = document.getElementById("cam");
            camera.setAttribute("position", stringCurrPos);
        } else if (box.getAttribute('id') == "box3") {
            box.setAttribute("position", "0 30 60");
            let stringCurrPos = "0 32 60";
            let camera = document.getElementById("cam");
            camera.setAttribute("position", stringCurrPos)
        } else if (box.getAttribute('id') == "box4") {
            box.setAttribute("position", "0 40 70");
            let stringCurrPos = "0 42 70";
            let camera = document.getElementById("cam");
            camera.setAttribute("position", stringCurrPos);
        }
    }

    // Updates the bridge challenge, checks the users input
    // array to the challenge, provides helpful hints to them via alerts 
    // as to where to check near. 
    bridgeUpdate(data) {
        if (data != 'default') {
            this.whileBridge = true; 
            let inputArray = data.split(' ');
            // Validate the users input to the while loop challenge
            // to make sure they solved it correctly. 
            for (let i = 0; i < inputArray.length; i++) {
                if (i == 0 && inputArray[i] != 'while') {
                    this.whileBridge = false; 
                    alert("Close, check near ^while");
                } else if (i == 1 && inputArray[i] != '(time') {
                    this.whileBridge = false; 
                    alert("Close, check near ^time");
                } else if (i == 2 && inputArray[i] != '<=') {
                    this.whileBridge = false; 
                    alert("Close, check near ^<=");
                } else if (i == 4 && inputArray[i] != '{') {
                    this.whileBridge = false; 
                    alert("Close, check near ^{");
                } else if (i == 5 && inputArray[i] != (('time++;') || ('time = time + 1;'))) {
                    this.whileBridge = false; 
                    alert("Close, check near ^time");
                } else if (i == 6 && inputArray[i] != '}') {
                    this.whileBridge = false; 
                    alert("Close, check near ^}");
                }
            }
            // If the user does solve the while-loop bridge challenge, proceed
            // and update the bridge as necessary
            if (this.whileBridge) {
                mainbridge.setAttribute('position', '10 40 120');
                // grab the time that the user passed in to keep the bridge 
                // up for before it drops into space
                let timeArray = inputArray[3].split(')'); 
                let userTime = timeArray[0]; 
                userTime = userTime * 1000; 
                let those = this; 

                setInterval(this.bridgeDrop, userTime);
                
                setTimeout(function() {
                    // fired once the time the user passed in is up
                    // then the bridge can no longer be crossed
                    those.dropBridge = true; 
                    those.commenceDropBridge(those); 
                }, userTime)
            }
        }
    }

    // drop the bridge once the time is up for the user to cross
    commenceDropBridge(those) {
        those.dropBridge = true; 
        setInterval(those.bridgeDrop, 1000); 
    }

    // Handles the dropping of the user if they try to cross
    // the bridge when the bridge is not active, 
    // it will drop them into space (try this out in game play!)
    bridgeDrop() {
        let currPos = cam.getAttribute("position");
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        let parsedLocation = stringCurrPos.split(" ");
        if (parsedLocation[2] > 91 && parsedLocation[2] < 145) { 
            let x = cam.getAttribute("position").x;
            let z = cam.getAttribute("position").z;
            let height = cam.getAttribute("position").y;
            height = height - 2.5;
            cam.setAttribute("position", x + " " + height + " " + z);
        }

        let x = mainbridge.getAttribute('position').x;
        let z = mainbridge.getAttribute('position').z;
        let height = mainbridge.getAttribute('position').y;
        height = height - 5;
        mainbridge.setAttribute("position", x + " " + height + " " + z);
    }

    // Used in the stairs challenge, validates the users 
    // input to the challenge, if they do not solve it, this
    // will give them hints in the console. 
    stairsUpdate(data) {
        if (data != 'default') {
            this.forStairs = true; 
            let inputArray = data.split(' ');
            let catchParen1 = inputArray[10].split('println("');
            inputArray[10] = catchParen1[1];
            let catchParen2 = inputArray[11].split('");');
            inputArray[11] = catchParen2[0];
            // Validate the user's input to the stairs challenge
            for (let i = 0; i < inputArray.length; i++) {
                if (i == 0 && inputArray[i] != 'for') {
                    this.forStairs = false; 
                    alert("Close, check near ^for");
                } else if (i == 1 && inputArray[i] != '(int') {
                    this.forStairs = false; 
                    alert("Close, check near ^int");
                } else if (i == 2 && inputArray[i] != 'i') {
                    alert("Close, check near ^loop variable");
                    this.forStairs = false; 
                } else if (i == 3 && inputArray[i] != '=') {
                    alert("Close, check near ^=");
                    this.forStairs = false; 
                } else if (i == 4 && inputArray[i] != '0;') {
                    alert("Close, check near ^0");
                    this.forStairs = false; 
                } else if (i == 5 && inputArray[i] != 'i') {
                    alert("Close, check near ^loop variable");
                    this.forStairs = false; 
                } else if (i == 6 && inputArray[i] != '<') {
                    alert("Close, check near ^<");
                    this.forStairs = false; 
                } else if (i == 7 && inputArray[i] != '4;') {
                    alert("Close, check near ^4");
                    this.forStairs = false; 
                } else if (i == 8 && inputArray[i] != 'i++)') {
                    alert("Close, check near ^loop variable");
                    this.forStairs = false; 
                } else if (i == 9 && inputArray[i] != '{') {
                    alert("Close, check near ^{");
                    this.forStairs = false; 
                } else if (i == 10 && inputArray[i] != 'go') {
                    alert("Close, check near ^go");
                    this.forStairs = false; 
                } else if (i == 11 && inputArray[i] != 'stairs') {
                    alert("Close, check near ^stairs");
                    this.forStairs = false; 
                } else if (i == 12 && inputArray[i] != '}') {
                    this.forStairs = false; 
                }
            }
            // Check for wrong number of input elements from the user
            if (inputArray.length != 13) {
                this.forStairs = false; 
                alert("Close, check the length of response");
            }
            
            
            // If the user did solve the Stairs challenge, update the stairs elements position
            if (this.forStairs == true) {
                let stair0 = document.getElementById("stair0");
                stair0.setAttribute("position", "0 0 30");

                let stair1 = document.getElementById("stair1");
                stair1.setAttribute("position", "0 10 40");

                let stair2 = document.getElementById("stair2");
                stair2.setAttribute("position", "0 20 50");

                let stair3 = document.querySelector("#stair3");
                stair3.setAttribute("position", "0 30 60");

                let stair4 = document.getElementById("stair4");
                stair4.setAttribute("position", "0 40 70");
            }
        }
    }

    // Update the player's colored sphere
    // icon that represents them in the VR escape room to other players
    // to show their location moving
    playerMove() { 
        let currPos = this.playerPos;
        this.playerlocation3 = currPos; 
        let ball = document.getElementById("playerlocation3");
        ball.setAttribute("position", this.playerlocation3);
    }

    // When the user clicks to reload the room, 
    // reset the room back to its default settings 
    reloadRoom() {
        // If time is 0, call the tick2 function to keep ticking and counting down
        if (this.count == 0) { 
             this.tick2();
        }
        this.count = 1201; 
        this.keepCounting = true; 
        this.booleanGate = false;
        this.forStairs = false; 
        this.whileBridge = false;
        this.colorUpdate("black"); 
        this.resetGate(); 
        this.resetStairs();
        mainbridge.setAttribute('position', '1000 -4000 120');
        this.dropBridge = false;       
    }

    // Put all stairs back in their default location (In a galaxy far far away....)
    resetStairs() {
        stair0.setAttribute("position", "50000 50000 50000"); 
        stair1.setAttribute("position", "50000 50000 50000"); 
        stair2.setAttribute("position", "50000 50000 50000"); 
        stair3.setAttribute("position", "50000 50000 50000"); 
        stair4.setAttribute("position", "50000 50000 50000"); 
    }

    // Move the gate back to in front of the first portion of the room
    resetGate() {
        let boolgate = document.getElementById('boolgate');
        boolgate.setAttribute('position', '0 1 5');
        let booleditor = document.getElementById('boolean_editor'); 
        booleditor.setAttribute('position', '-0.3 4.25 4.25');
        let boolsub = document.getElementById('boolean_submit'); 
        boolsub.setAttribute('position', '-0.75 0.8 4');
        let aapl = document.getElementById('apple'); 
        aapl.setAttribute('position', '2.5 2.5 4');
        let booleocheck = document.getElementById('booleo_check'); 
        booleocheck.setAttribute('position', '-1.5 2.5 4.75');
        let blackback = document.getElementById('black_background'); 
        blackback.setAttribute('position', '-1.5 2.5 4.85');
        let booleofooleo2 = document.getElementById('bool_submit');
        booleofooleo2.setAttribute('position', '-1.45 0.8 4.25');
    }

    // Check to see if the user solves the first portion 
    // of the escape room, if they do, then update the room. 
    // Otherwise, show them in the console where they should 
    // debug to figure out what is wrong with their input
    gateUpdate(data) {
        if (data != 'default') {
            let boolgate = document.getElementById('boolgate');
            this.booleanGate = true; 

            let inputArray = data.split(' ');
            let catchParen1 = inputArray[1].split('(');
            inputArray[1] = catchParen1[1];
            let catchParen2 = inputArray[3].split(')');
            inputArray[3] = catchParen2[0];
            for (let i = 0; i < inputArray.length; i++) {
                if (i == 0 && inputArray[i] != 'if') {
                    alert("Check near ^if");
                    this.booleanGate = false; 
                } else if (i == 1 && inputArray[i] != 'apples') {
                    alert("Check near ^apples");
                    this.booleanGate = false; 
                } else if (i == 2 && inputArray[i] != '>=') {
                    this.booleanGate = false; 
                    alert("Check near >=");
                } else if (i == 3 && inputArray[i] != '250') {
                    this.booleanGate = false; 
                    alert("Check near 250");
                } else if (i == 7 && inputArray[i] != 'else') {
                    this.booleanGate = false;
                    alert("Check near else");
                }
            }
            if (inputArray.length != 12) {
                this.booleanGate = false; 
                alert("Check overall length of input");
            }
            // update gate challenge to be removed if 
            // the players have solved the boolean gate challenge
            if (this.booleanGate) {
                boolgate.setAttribute('position', '0 -10 5');
                let booleditor = document.getElementById('boolean_editor'); 
                booleditor.setAttribute('position', '0 -10 5');
                let boolsub = document.getElementById('boolean_submit'); 
                let booleofooleo = document.getElementById('bool_submit'); 
                booleofooleo.setAttribute('position', '0 -10 5');
                boolsub.setAttribute('position', '0 -10 5');
                let aapl = document.getElementById('apple'); 
                aapl.setAttribute('position', '0 -10 5');
                let booleocheck = document.getElementById('booleo_check'); 
                booleocheck.setAttribute('position', '0 -10 5');
                let blackback = document.getElementById('black_background'); 
                blackback.setAttribute('position', '0 -10 5');
            }
        }
    }

    // Display the visual result of the timer in the room 
    timerUpdate() {
        if (this.count === 0) {
            this.keepCounting = false; 
        }
        let minutes = Math.floor(this.count / 60); 
        let seconds = this.count % 60; 
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let actualTimer = document.getElementById('package_timer');
        actualTimer.setAttribute('value', `${minutes}: ${seconds}`);
    }

    // Called when the user submits a text entry for processing
    submitText(data) {
        this.value = data;
        this.publish("textspace", "changed", text_input2.value);
    }
 
    // Updates the background color of the universe when an event
    // causes the color to change (ie escaping the room)
    colorUpdate(data) {
        let ascene = document.getElementById('overall_scene');
        ascene.setAttribute("background", "color: " + data); 
    }

    resetCounter() {
        this.count = 0;
        this.publish("counter", "changed");
    }

    // Decrements the timer down to 0, check to see
    // if it should continue counting first before continuing to 
    // recurively call itself
    tick2() {
        this.count--; 
        this.publish("timer", "changed"); 
        if (this.keepCounting) {
            this.future(1000).tick2();
        }
    }

    // Called to make the player "fall"
    // into empty space. 
    falling() {
        let x = cam.getAttribute("position").x;
        let z = cam.getAttribute("position").z;
        let height = cam.getAttribute("position").y;
        height = height - 2.5;
        cam.setAttribute("position", x + " " + height + " " + z);
    }

    // Called every second to check to see if the player 
    // has escaped the regular room to some place they should not be, or should be falling. 
    // Also checks to see if the player has escaped the room, ie solved all challenges and is
    // standing on the escape platform
    tick3(data) {
        let parsedLocation = data.split(" ");
        // Set falling locations based on players solving challenges and their physical location in the room
        // (ie they are not supposed to be in part of the room they have not unlocked yet)
        if (this.forStairs === false && ((parsedLocation[2] > 30) && (parsedLocation[2] < 73))) {
            this.falling();
        }
        if (this.whileBridge === false && parsedLocation[2] > 91 && parsedLocation[2] < 130) { 
            this.falling();
        }
        if (parsedLocation[1] < 0 || (parsedLocation[1] < 40 && this.whileBridge === false && parsedLocation[2] > 91 && parsedLocation[2] < 130)) {
            this.falling();
        }
        if (this.dropBridge && parsedLocation[2] > 91 && parsedLocation[2] < 130) {
            this.falling(); 
        }
        if ((parsedLocation[0] > 10 && parsedLocation[2] < 30) || (parsedLocation[0] < -10 && parsedLocation[2] < 30) || 
              (parsedLocation[2] < -8 && parsedLocation[2] < 30) || (parsedLocation[2] > 5 && this.booleanGate === false)) {
            cam.setAttribute("position", "0 2 0");
        }
        // if the user has solved all challenges and is standing on the winning platform
        if (this.whileBridge && this.forStairs && this.booleanGate && parsedLocation[2] > 132) {
            let clearable = setTimeout(function() {
                // Party time for the room
                alert("Congratulations!!! you solved all the challenges and escaped the room!");
                clearable.clearTimeout(); 
                clearable = null; 

            }, 10000)
            let colorArray = ["red", "blue", "green", "yellow", "pink", "purple", "cyan", "blue", "orange", "magenta", "turquoise"];
            let rN = Math.floor((Math.random() * 10)); 
            // Initialize rainbow colors!!!
            overall_scene.setAttribute('background', "color: " + colorArray[rN]); 
        }
        // Keeps track of player movement in the room 
        if (data != this.playerPos) {
            // update the player position to be the current data if out of date
            this.playerPos = data;
            this.publish("room", "playermoved");
        }
        let currPos = cam.getAttribute("position");
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        this.future(1000).tick3(stringCurrPos);
    }

    update() {
        this.publish("textspace", "submit");
        this.future(1000).update();
    }

}

RoomModel.register("RoomModel");

class MyView extends Croquet.View {

    constructor(model) {
        super(model);
        this.model = model;

        // Create click event listeners for updating room
        rB.onclick = event => this.resetRoom();
        boolean_submit.onclick = event => this.updateGate();
        bool_submit.onclick = event => this.updateGate();
        for_submit.onclick = event => this.updateStairs();
        loop_submit.onclick = event => this.updateStairs();
        bridge_submit.onclick = event => this.updateBridge(); 
        bridge_editor.onclick = event => this.updateBridge(); 
        text_input2.onclick = event => this.updateColor(); 
    }

    resetRoom() {
        this.publish("universe", "reload")
    }

    updateStairs() {
        this.publish("stairs", "submit", forLoopInput.getAttribute('value'));
    }

    updateBridge() {
        this.publish("bridge", "submit", bridgeInput.getAttribute('value')); 
    }

    updateGate() {
        this.publish("gate", "submit", boolGateInput.getAttribute('value'));
    }

    updateColor() {
        this.publish("background", "change", true_universe_color.getAttribute('value')); 
    }

}

// Croquet Info
Croquet.Session.join({
  appId: "edu.uw.eamart34.microverse",
  apiKey: "1y1miau7hBNEcNrFi12jufjfzqsA5jexyKc1L32nx",
  name: "vr_escape_room",
  password: "none",
  model: RoomModel,
  view: MyView});