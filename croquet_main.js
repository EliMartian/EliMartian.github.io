// Hello World site using Croquet

// Q: Still console logging an error here despite importing Croquet in the HTML
// class MyModel extends Croquet.Model {

//     init() {
//         console.log("hello world croquet")
//         // document.getElementById("flipStyles").addEventListener("click", toggleStyle); 
//         // this.count = 0;
//         // this.subscribe("counter", "reset", this.resetCounter);
//         // this.future(1000).tick();
//     }


//     // resetCounter() {
//     //     // this.count = 0;
//     //     // this.publish("counter", "changed");
//     // }

//     // tick() {
//     //     this.count++;
//     //     this.publish("counter", "changed");
//     //     this.future(1000).tick();
//     // }

// }

// MyModel.register("MyModel");

// class MyView extends Croquet.View {

//     constructor(model) {
//         super(model);
//         this.model = model;
//         // Q: Need to use Croquet Subscribe / Publish events to accomplish this?
//         flipStyles.onclick = event => this.toggleStyle();
//         // this.subscribe("counter", "changed", this.counterChanged);
//         // this.counterChanged();
//     }

//     toggleStyle() {
//         let img = document.querySelector("img"); 
//         console.log(img);
//         img.classList.toggle('toggle'); 
//     }

//     // counterReset() {
//     //     this.publish("counter", "reset");
//     // }

//     // counterChanged() {
//     //     countDisplay.textContent = this.model.count;
//     // }

// }

// class MyModel extends Croquet.Model {

//     init() {
//         this.count = 0;
//         this.subscribe("counter", "reset", this.resetCounter);
//         this.future(1000).tick();
//     }

//     resetCounter() {
//         this.count = 0;
//         this.publish("counter", "changed");
//     }

//     tick() {
//         this.count++;
//         this.publish("counter", "changed");
//         this.future(1000).tick();
//     }

// }

// MyModel.register("MyModel");

// class MyView extends Croquet.View {

//     constructor(model) {
//         super(model);
//         this.model = model;
//         countDisplay.onclick = event => this.counterReset();
//         this.subscribe("counter", "changed", this.counterChanged);
//         this.counterChanged();
//     }

//     counterReset() {
//         this.publish("counter", "reset");
//     }

//     counterChanged() {
//         countDisplay.textContent = this.model.count;
//     }

// }

// Croquet Tutorial 1
// Hello World 
// Croquet Corporation 
// 2021

class MyModel extends Croquet.Model {

    init() {
        this.count = 0;
        this.subscribe("counter", "reset", this.resetCounter);
        this.future(1000).tick();
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

}

MyModel.register("MyModel");

class MyView extends Croquet.View {

    constructor(model) {
        super(model);
        this.model = model;
        countDisplay.onclick = event => this.counterReset();
        this.subscribe("counter", "changed", this.counterChanged);
        this.counterChanged();
    }

    counterReset() {
        this.publish("counter", "reset");
    }

    counterChanged() {
        countDisplay.textContent = this.model.count;
    }

}

// Q: Users are not able to join a session by using the appId
Croquet.Session.join({
  appId: "edu.uw.eamart34.microverse",
  apiKey: "1y1miau7hBNEcNrFi12jufjfzqsA5jexyKc1L32nx",
  name: "hello_world",
  password: "none",
  model: MyModel,
  view: MyView});