class MyModel extends Croquet.Model {

    init() {
        // should contain background, timers, etc. Publish changes, update views.
        // on the change we should re-render aframe.
        this.count = 1200;
        this.value = "";

        // UNCOMMENT
        // this.color = "black";
        // this.subscribe("background", "change", this.colorUpdate); 

        this.subscribe("counter", "reset", this.resetCounter);
        this.future(1000).tick();
        this.subscribe("textspace", "submit", this.submitText);

    }

    // Submits text 
    submitText(data) {
        //this.value = text_input.value; 
        this.value = data;
        this.publish("textspace", "changed", text_input2.value);
    }

    // UNCOMMENT 
    // colorUpdate(data) {
    //     let ascene = document.getElementById('overall_scene');
    //     ascene.setAttribute("background", "color: " + data); 
    //     this.publish("background", "newcolor", true_universe_color.value); 
    // }

    resetCounter() {
        this.count = 0;
        this.publish("counter", "changed");
    }

    tick() {
        this.count--;
        this.publish("counter", "changed");
        this.future(1000).tick();
    }

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


        textBox2.onclick = event => this.textSubmit();
        this.subscribe("textspace", "changed", this.textChanged);
        this.textChanged();

        // countDisplay.onclick = event => this.counterReset();
        // this.subscribe("counter", "changed", this.counterChanged);
        // this.counterChanged();

        // UNCOMMENT
        // text_input2.onclick = event => this.updateColor(); 
        // this.subscribe("background", "newcolor", this.updateColor);
        // this.updateColor(); 
    }

    textSubmit() {
        // don't update model externally 
        // this.model.value = text_input.value;
        this.publish("textspace", "submit", text_input2.value);
    }

    // UNCOMMENT
    // updateColor() {
    //     this.publish("background", "change", true_universe_color.value); 
    // }

    textChanged() {
        text_input2.textContent = this.model.value; 
    }

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