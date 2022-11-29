class MyModel extends Croquet.Model {

    init() {
        this.count = 0;
        // default value of the text area space
        this.value = "";
        this.subscribe("counter", "reset", this.resetCounter);
        this.future(1000).tick();
        this.subscribe("textspace", "submit", this.submitText);
        // Q: increase time to reduce MaxCallStack Exceeded errors? 
        // this.future(1000).update();
    }

    // Submits text 
    submitText(data) {
        //this.value = text_input.value; 
        this.value = data;
        this.publish("textspace", "changed", text_input.value);
    }

    resetCounter() {
        this.count = 0;
        this.publish("counter", "changed");
    }

    tick() {
        this.count++;
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

        submit_text.onclick = event => this.textSubmit();
        this.subscribe("textspace", "changed", this.textChanged);
        this.textChanged();

        countDisplay.onclick = event => this.counterReset();
        this.subscribe("counter", "changed", this.counterChanged);
        this.counterChanged();
    }

    textSubmit() {
        // don't update model externally 
        // this.model.value = text_input.value;
        this.publish("textspace", "submit", text_input.value);
    }

    textChanged() {
        text_home.textContent = this.model.value; 
    }

    counterReset() {
        this.publish("counter", "reset");
    }

    counterChanged() {
        countDisplay.textContent = this.model.count;
    }

}

Croquet.Session.join({
  appId: "edu.uw.eamart34.microverse",
  apiKey: "1y1miau7hBNEcNrFi12jufjfzqsA5jexyKc1L32nx",
  name: "hello_world",
  password: "none",
  model: MyModel,
  view: MyView});