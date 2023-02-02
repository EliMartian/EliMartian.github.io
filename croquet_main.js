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
        
        this.booleanGate = true;
        this.subscribe("gate", "submit", this.gateUpdate);

        this.value = "";

        this.color = "black";
        this.subscribe("background", "change", this.colorUpdate); 

        this.subscribe("counter", "reset", this.resetCounter);
        // this.future(1000).tick();
        this.subscribe("textspace", "submit", this.submitText);

        this.playerPos = "0 3 0";
        this.subscribe("room", "playermoved", this.playerMove);

        console.log("GITHUB VERSION NOT WORKING??? GITHUB WHY")
        // try having a bunch of random player spheres, then have it choose one of the random ones 
        // to indicate? 
        // believe it's an issue with the shared sphere
        // could also just will a new sphere into existence every time the player moves. 

        let currPos = cam.getAttribute("position")
        console.log("Wokring currPos: ")
        console.log(currPos["x"])
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        console.log(stringCurrPos)
        this.future(1000).tick3(stringCurrPos);

    }

    playerMove() { 
        console.log("trying to move the players pink sphere")
        console.log("here's the data")
        let playerSphere = document.getElementById('playerlocation');

        let currPos = this.playerPos; 
        console.log("THIS IS THE PLAYER's POSITION")
        console.log(this.playerPos); 

        console.log("ok, we are now moving that pink sphere playerlocation to the following location: "); 
        let rN = Math.floor((Math.random() * 10)); 
        let strBuilder = 'playerlocation' + rN;
        let pL = document.getElementById(strBuilder);
        pL.setAttribute('position', this.playerPos)

        let ascene = document.getElementById('overall_scene');
        ascene.setAttribute("background", "color: " + pL.getAttribute("color")); 
    }

    reloadRoom() {
        this.count = 1201; 
        this.keepCounting = true; 
        this.booleanGate = true;
        //this.color = "black";
        this.colorUpdate("black"); 
        this.resetGate(); 
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
        // actually moves gate
        console.log('data from bool gate: ');
        console.log(data);

        if (data != 'default') {
            let boolgate = document.getElementById('boolgate');
            this.booleanGate = true; 

            let inputArray = data.split(' ');
            let catchParen1 = inputArray[1].split('(')
            inputArray[1] = catchParen1[1];
            let catchParen2 = inputArray[3].split(')')
            inputArray[3] = catchParen2[0]
            console.log("length of input: " + inputArray.length)
            // let openGate = true; 
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
            
            console.log("ok about to see if bool gate should open, here's its value"); 
            console.log(this.booleanGate)
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
            // alert('time is up!')
            this.keepCounting = false; 
        }
        let minutes = Math.floor(this.count / 60); 
        let seconds = this.count % 60; 
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let actualTimer = document.getElementById('package_timer');
        actualTimer.setAttribute('value', `${minutes}: ${seconds}`);
    }

    // Submits text 
    submitText(data) {
        //this.value = text_input.value; 
        this.value = data;
        this.publish("textspace", "changed", text_input2.value);
    }
 
    colorUpdate(data) {
        let ascene = document.getElementById('overall_scene');
        ascene.setAttribute("background", "color: " + data); 
        // this.publish("background", "newcolor", true_universe_color.getAttribute('value')); 
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

    tick3(data) {
        console.log("inside of tick3")
        console.log(data); 
        console.log(this.playerPos)
        if (data != this.playerPos) {
            this.playerPos = data; 
            this.publish("room", "playermoved")
            console.log("PLAYER MOVED PLAYER MOVED! GOTTEM")
        }
        let currPos = cam.getAttribute("position");
        let stringCurrPos = currPos["x"] + " " + currPos["y"] + " " + currPos["z"];
        this.future(1000).tick3(stringCurrPos)
    }

    // tick() {
    //     this.count--;
    //     this.publish("counter", "changed");
    //     this.future(1000).tick();
    // }

    // my version of tick to update the textContent 
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

        // this.subscribe("room", "playermoved", this.movePlayer); 


        this.subscribe("timer", "changed", this.timerChange); 

        rB.onclick = event => this.resetRoom();

        
        boolean_submit.onclick = event => this.updateGate();
        // this.subscribe("gate", "submit", this.updateGate);

        // countDisplay.onclick = event => this.counterReset();
        // this.subscribe("counter", "changed", this.counterChanged);
        // this.counterChanged();

        // try console logging
        // make sure the submit event is when the user clicks ok on the prompt

        text_input2.onclick = event => this.updateColor(); 
        this.subscribe("background", "newcolor", this.updateColor);
    }

    movePlayer() { 
        console.log("Finally got to Attempted to move the player")
    }

    resetRoom() {
        this.publish("universe", "reload")
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