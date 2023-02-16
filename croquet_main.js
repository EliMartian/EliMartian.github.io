class MyModel extends Croquet.Model {

    init() {
        // should contain background, timers, etc. Publish changes, update views.
        // on the change we should re-render aframe.
        this.count = 1200;
        this.keepCounting = true;
        this.subscribe("timer", "changed", this.timerUpdate); 
        this.future(1000).tick2();

        this.reload = false;
        this.subscribe("universe", "reload", this.reloadRoom);
        
        this.booleanGate = false;
        this.subscribe("gate", "submit", this.gateUpdate);

        this.forStairs = false;
        this.subscribe("stairs", "submit", this.stairsUpdate);

        this.value = "";

        this.color = "black";
        this.subscribe("background", "change", this.colorUpdate); 

        this.subscribe("counter", "reset", this.resetCounter);
        // this.future(1000).tick();
        this.subscribe("textspace", "submit", this.submitText);

        this.playerPos = "0 3 0";
        this.playerlocation1 = "1000 10000 20000";
        this.playerlocation2 = "1000 10000 20000"; 
        this.playerlocation3 = "1000 10000 20000"; 
        this.playerlocation4 = "1000 10000 20000"; 
        this.playerlocation5 = "1000 10000 20000";
        this.playerlocation6 = "1000 10000 20000"; 
        this.playerlocation7 = "1000 10000 20000"; 
        this.playerlocation8 = "1000 10000 20000"; 
        this.playerlocation9 = "1000 10000 20000"; 
        // this.playerLocation2; 
        // this.playerLocation3;
        // this.playerLocation4; 
        // this.playerLocation5; 
        // this.playerLocation6; 
        // this.playerLocation7; 
        // this.playerLocation8; 
        // this.playerLocation9; 
        // also share the playerposition1-9 spheres in the model
        


        // try having a bunch of random player spheres, then have it choose one of the random ones 
        // to indicate? 
        // believe it's an issue with the shared sphere
        // could also just will a new sphere into existence every time the player moves. 

        // test
        let currPos = cam.getAttribute("position")
        // console.log("Wokring currPos: ")
        // console.log(currPos["x"])
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        // console.log(stringCurrPos)
        this.subscribe("room", "playermoved", this.playerMove);
        this.future(1000).tick3(stringCurrPos);
        

    }

    updatePlayerPosition(box) {
        console.log("INSIDE OF THE ONCLICK BOX FUNCTION")
        if (box.getAttribute('id') == "box1") {
            console.log("box one was successful")
            box.setAttribute("position", "0 10 40")
            let stringCurrPos = "0 12 40"
            let camera = document.getElementById("cam")
            camera.setAttribute("position", stringCurrPos)
        } else if (box.getAttribute('id') == "box2") {
            console.log("box two was successful")
            box.setAttribute("position", "0 20 50")
            let stringCurrPos = "0 22 50"
            let camera = document.getElementById("cam")
            camera.setAttribute("position", stringCurrPos)
        } else if (box.getAttribute('id') == "box3") {
            console.log("box 3 was successful")
            box.setAttribute("position", "0 30 60")
            let stringCurrPos = "0 32 60"
            let camera = document.getElementById("cam")
            camera.setAttribute("position", stringCurrPos)
        } else if (box.getAttribute('id') == "box4") {
            console.log("box 4 was successful")
            box.setAttribute("position", "0 40 70")
            let stringCurrPos = "0 42 70"
            let camera = document.getElementById("cam")
            camera.setAttribute("position", stringCurrPos)
        }
    }

    stairsUpdate(data) {
        if (data != 'default') {
            this.forStairs = true; 
            let inputArray = data.split(' ');
            console.log("INPUT ARRAY:")
            console.log(inputArray);
            let catchParen1 = inputArray[10].split('println("')
            console.log(catchParen1[1])
            inputArray[10] = catchParen1[1];
            let catchParen2 = inputArray[11].split('");')
            console.log(catchParen2)
            inputArray[11] = catchParen2[0]
            console.log("length of input: " + inputArray.length)
            for (let i = 0; i < inputArray.length; i++) {
                console.log(inputArray[i])
                if (i == 0 && inputArray[i] != 'for') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 1 && inputArray[i] != '(int') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 2 && inputArray[i] != 'i') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 3 && inputArray[i] != '=') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 4 && inputArray[i] != '0;') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 5 && inputArray[i] != 'i') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 6 && inputArray[i] != '<') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 7 && inputArray[i] != '4;') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 8 && inputArray[i] != 'i++)') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 9 && inputArray[i] != '{') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 10 && inputArray[i] != 'go') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 11 && inputArray[i] != 'stairs') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                } else if (i == 12 && inputArray[i] != '}') {
                    this.forStairs = false; 
                    console.log("THIS INDEX OF CHECK FAILED: " + i)
                }
            }
            // for (int i = 0; i < 4; i++) { println("go stairs"); }
            if (inputArray.length != 13) {
                this.forStairs = false; 
                console.log("THIS INDEX OF CHECK FAILED: length check")
            }
            
            console.log("ok about to see if FOR STAIRS should open, here's its value"); 
            console.log(this.forStairs)
            if (this.forStairs == true) {
                // simple feature so that when clicked the user teleports directly on top of the block
                // can expand to jumping function later
                // also add in the capability to only have some of the boxes from for loop load later on

                let stair0 = document.getElementById("stair0")
                console.log(stair0)
                stair0.setAttribute("position", "0 0 30");

                let stair1 = document.getElementById("stair1")
                console.log(stair1)
                stair1.setAttribute("position", "0 10 40");

                let stair2 = document.getElementById("stair2")
                console.log(stair2)
                stair2.setAttribute("position", "0 20 50");

                let stair3 = document.querySelector("#stair3")
                console.log(stair3)
                stair3.setAttribute("position", "0 30 60");

                let stair4 = document.getElementById("stair4") 
                console.log(stair4)
                stair4.setAttribute("position", "0 40 70");
            }
        }
    }

    playerMove() { 
        // console.log("trying to move the players pink sphere")
        // console.log("here's the data")
        console.log("Inside playerMove function")
        // let playerSphere = document.getElementById('playerlocation');

        let currPos = this.playerPos;
        console.log("THIS IS THE currPos POSITION")
        console.log(currPos); 
        this.playerlocation2 = currPos; 
        console.log("THIS IS THE playerlocation2 value")
        console.log(this.playerlocation2); 
        let ball = document.getElementById("playerlocation2")
        ball.setAttribute("position", this.playerlocation2);
        this.colorUpdate(ball.getAttribute("color"));
        

        // console.log("ok, we are now moving that pink sphere playerlocation to the following location: "); 
        // let rN = Math.floor((Math.random() * 10)); 
        // let strBuilder = "playerlocation" + rN;
        // console.log("Here's what strBuilder is: "); 
        // console.log(strBuilder)
        // let pL = document.getElementById(strBuilder);
        // pL.setAttribute('position', this.playerPos)

        // let ascene = document.getElementById('overall_scene');
        // ascene.setAttribute("background", "color: " + pL.getAttribute("color")); 
    }

    reloadRoom() {
        console.log("reloadRoom to the rescue!"); 
        console.log("Current this.count is: ")
        console.log(this.count); 
        this.count = 1201; 
        this.keepCounting = true; 
        this.booleanGate = false;
        this.forStairs = false; 
        //this.color = "black";
        this.colorUpdate("black"); 
        this.resetGate(); 
        this.resetStairs();
        // Investigate next time it drops down to 0
        // this.tick2()

    }

    resetStairs() {
        stair0.setAttribute("position", "50000 50000 50000"); 
        stair1.setAttribute("position", "50000 50000 50000"); 
        stair2.setAttribute("position", "50000 50000 50000"); 
        stair3.setAttribute("position", "50000 50000 50000"); 
        stair4.setAttribute("position", "50000 50000 50000"); 
    }

    resetGate() {
        let boolgate = document.getElementById('boolgate');
        boolgate.setAttribute('position', '0 1 5');
        let booleditor = document.getElementById('boolean_editor'); 
        booleditor.setAttribute('position', '-0.3 4.25 4.25');
        let boolsub = document.getElementById('boolean_submit'); 
        boolsub.setAttribute('position', '-0.3 4.5 4.25');
        let aapl = document.getElementById('apple'); 
        aapl.setAttribute('position', '2.5 2.5 4');
        let booleocheck = document.getElementById('booleo_check'); 
        booleocheck.setAttribute('position', '-1.5 2.5 4.75');
        let blackback = document.getElementById('black_background'); 
        blackback.setAttribute('position', '-1.5 2.5 4.85');
    }

    gateUpdate(data) {
        if (data != 'default') {
            let boolgate = document.getElementById('boolgate');
            this.booleanGate = true; 

            let inputArray = data.split(' ');
            let catchParen1 = inputArray[1].split('(')
            inputArray[1] = catchParen1[1];
            let catchParen2 = inputArray[3].split(')')
            inputArray[3] = catchParen2[0]
            console.log("length of input: " + inputArray.length)
            for (let i = 0; i < inputArray.length; i++) {
                console.log(inputArray[i])
                if (i == 0 && inputArray[i] != 'if') {
                    this.booleanGate = false; 
                } else if (i == 1 && inputArray[i] != 'apples') {
                    this.booleanGate = false; 
                } else if (i == 2 && inputArray[i] != '>=') {
                    this.booleanGate = false; 
                } else if (i == 3 && inputArray[i] != '250') {
                    this.booleanGate = false; 
                } else if (i == 7 && inputArray[i] != 'else') {
                    this.booleanGate = false; 
                }
            }
            if (inputArray.length != 11) {
                this.booleanGate = false; 
            }
            if (this.booleanGate == true) {
                boolgate.setAttribute('position', '0 -10 5')
                let booleditor = document.getElementById('boolean_editor'); 
                booleditor.setAttribute('position', '0 -10 5');
                let boolsub = document.getElementById('boolean_submit'); 
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

    submitText(data) {
        this.value = data;
        this.publish("textspace", "changed", text_input2.value);
    }
 
    colorUpdate(data) {
        let ascene = document.getElementById('overall_scene');
        ascene.setAttribute("background", "color: " + data); 
    }

    resetCounter() {
        this.count = 0;
        this.publish("counter", "changed");
    }

    tick2() {
        // console.log("inside of tick 2");
        // console.log("Current count: " + this.count);
        this.count--; 
        this.publish("timer", "changed"); 
        if (this.keepCounting) {
            this.future(1000).tick2();
        }
    }

    falling() {
        let x = cam.getAttribute("position").x;
        let z = cam.getAttribute("position").z;
        let height = cam.getAttribute("position").y;
        height = height - 2.5;
        cam.setAttribute("position", x + " " + height + " " + z);
    }

    tick3(data) {
        // console.log("inside of tick3")
        // console.log(data); 
        let parsedLocation = data.split(" ");
        if (this.forStairs === false && ((parsedLocation[2] > 30) && (parsedLocation[2] < 73))) {
            this.falling();
        }
        if (parsedLocation[1] < 0) {
            this.falling();
        }
        if ((parsedLocation[0] > 10 && parsedLocation[2] < 30) || (parsedLocation[0] < -10 && parsedLocation[2] < 30) || (parsedLocation[2] < -8 && parsedLocation[2] < 30) || (parsedLocation[2] > 5 && this.booleanGate === false)) {
            // console.log("Aghhhh! Out of bounds get back in there")
            /* 



            // NEED TO UNCOMMENT FOR USERS AND RESEARCH PURPOSES WHEN NOT TESTING
            
            





            */
            cam.setAttribute("position", "0 2 0");
        }
        // console.log(this.playerPos)
        if (data != this.playerPos) {
            this.playerPos = data; 
            this.publish("room", "playermoved")
            this.publish("background", "change", "pink")
            console.log("PLAYER MOVED PLAYER MOVED! GOTTEM")
        }
        let currPos = cam.getAttribute("position");
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        this.future(1000).tick3(stringCurrPos)
    }

    update() {
        this.publish("textspace", "submit");
        this.future(1000).update();
    }

}

MyModel.register("MyModel");

class MyView extends Croquet.View {

    constructor(model) {
        super(model);
        this.model = model;


        // textBox2.onclick = event => this.textSubmit();
        // this.subscribe("textspace", "changed", this.textChanged);
        // this.textChanged();

        
        // cam.addEventListener('componentchanged', function (evt) {
        //     console.log("inside thec check")
        //     if (evt.name === 'position') {
        //         console.log("player moved")
        //       // console.log('Entity has moved from', evt.oldData, 'to', evt.newData, '!');
        //     }
        //  });
        //  console.log("Allegedly added the event listener");

        // cam.onchange = event => this.movePlayer();
        // let camLoc = cam.getAttribute("position") 
        // let y_cor = camLoc["y"];
        // console.log("Cam Loc: ")
        
        // console.log(camLoc["y"]);

        // cam.onchange = event => this.movePlayer(); 
    //    camLoc.addEventListener('change', this.movePlayer);

        // this.subscribe("room", "playermoved"); 


        // this.subscribe("timer", "changed", this.timerChange); 

        rB.onclick = event => this.resetRoom();

        
        boolean_submit.onclick = event => this.updateGate();

        for_submit.onclick = event => this.updateStairs();
        loop_submit.onclick = event => this.updateStairs();
        // this.subscribe("gate", "submit", this.updateGate);

        // countDisplay.onclick = event => this.counterReset();
        // this.subscribe("counter", "changed", this.counterChanged);
        // this.counterChanged();

        // try console logging
        // make sure the submit event is when the user clicks ok on the prompt

        text_input2.onclick = event => this.updateColor(); 
        // don't believe to be working VVVVVV
        // this.subscribe("background", "newcolor", this.updateColor);
    }

    movePlayer() { 
        console.log("Finally got to Attempted to move the player")
    }

    resetRoom() {
        this.publish("universe", "reload")
    }

    updateStairs() {
        this.publish("stairs", "submit", forLoopInput.getAttribute('value'));
    }

    updateGate() {
        // have a reference to their input, by setting an a-text far away with that value
        console.log("This is the input from boolean gate: "); 
        console.log(boolGateInput.getAttribute('value'));
        this.publish("gate", "submit", boolGateInput.getAttribute('value'));
    }

    timerChange() {
        // this.publish("timer", "changed", package_timer.getAttribute('value')); 
        // package_timer.textContent = this.model.count; 
    }

    textSubmit() {
        // don't update model externally 
        
        // this.publish("textspace", "submit", text_input2.value);
    }

    // DONT BELIEVE TO BE WORKING

    updateColor() {
        console.log("This true universe color:");
        console.log(true_universe_color.getAttribute('value'));
        this.publish("background", "change", true_universe_color.getAttribute('value')); 
    }

    // textChanged() {
    //     text_input2.textContent = this.model.value; 
    // }

    // counterReset() {
    //     this.publish("counter", "reset");
    // }

    // counterChanged() {
    //     countDisplay.textContent = this.model.count;
    // }

}

Croquet.Session.join({
  appId: "edu.uw.eamart34.microverse",
  apiKey: "1y1miau7hBNEcNrFi12jufjfzqsA5jexyKc1L32nx",
  name: "hello_world",
  password: "none",
  model: MyModel,
  view: MyView});