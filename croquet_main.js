class MyModel extends Croquet.Model {

    init() {
        // should contain background, timers, etc. Publish changes, update views.
        // on the change we should re-render aframe.
        this.count = 1200;
        this.keepCounting = true;
        this.subscribe("timer", "changed", this.timerUpdate); 
        this.future(1000).tick2();
        

        this.value = "";

        this.color = "black";
        this.subscribe("background", "change", this.colorUpdate); 

        this.subscribe("counter", "reset", this.resetCounter);
        // this.future(1000).tick();
        this.subscribe("textspace", "submit", this.submitText);

    }

    timerUpdate() {
        if (this.count === 0) {
            alert('time is up!')
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
        console.log("inside of tick 2");
        console.log("Current count: " + this.count);
        this.count--; 
        this.publish("timer", "changed"); 
        if (this.keepCounting) {
            this.future(1000).tick2();
        }
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

        this.subscribe("timer", "changed", this.timerChange); 

        // countDisplay.onclick = event => this.counterReset();
        // this.subscribe("counter", "changed", this.counterChanged);
        // this.counterChanged();

        // try console logging
        // make sure the submit event is when the user clicks ok on the prompt

        text_input2.onclick = event => this.updateColor(); 
        console.log("ok this was submitted");
        this.subscribe("background", "newcolor", this.updateColor);
    }

    timerChange() {
        // this.publish("timer", "changed", package_timer.getAttribute('value')); 
        package_timer.textContent = this.model.count; 
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