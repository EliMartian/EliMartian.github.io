AFRAME.registerComponent('timer', {
    schema: {
      message: {type: 'string', default: 'Hello, World!'}
    },
  
    init: function () {
          let el = this.el; 
      
          
          
      
      this.createTimer = function(e) { 
          let startingMinutes = 10; 
          
        
          function countDownState(time, name) { 
              let state = time
              return function () { 
                  updateCountdown(state, name)
                  state--
              }
          }
        
        
          function updateCountdown(time, name) { 
            const minutes = Math.floor(time / 60); 
            let seconds = time % 60; 
            seconds = seconds < 10 ? '0' + seconds : seconds; 
            if (!pause) { 
                time--; 
            } else { 
                time += 0
            }
  
            if (alerts && time == (startingMinutes * 30) - 2) { 
                alert('Time remaining is ' + `${minutes + 1}:${seconds - 59}0`)
            } else if (alerts && time == (startingMinutes * 15) - 2) { 
                alert('Time remaining isrt ' + `${minutes}:${seconds +1}`)
                let newText = document.querySelector(name)
                newText.setAttribute("color", "red")
            } else if (alerts && time == (startingMinutes * 45) - 2) { 
                alert('Time remaining is ' + `${minutes}:${seconds +1}`)
            } 
  
            if (time == -2) { 
                alert('Time is up!')
                document.getElementById("ResetButton").style.backgroundColor = "#000";
                document.getElementById("ResetButton").style.border = "groove rgb(128, 0, 128)";
            }
  
            // let newText = document.querySelector(name)
            name.setAttribute("value", `${minutes}: ${seconds}`);
            // This is what makes them count in sync
            // countdownEl2.setAttribute("value", `${minutes}: ${seconds}`);
          }
          let pause = false; 
          let alerts = false; 
          let callPlayCounts = 0
          let callResetCounts = 0
          let callPauseCounts = 0
          let callAlertCounts = 0
          let currentTime = 0; 
          let p = e.detail.intersection.point; 
          // let scene = document.querySelector('a-scene'); 
          let scene = document.querySelector('a-scene'); 
          let textEl = document.createElement('a-text'); 
          textEl.setAttribute('position', p); 
          textEl.setAttribute('value', '10:00'); 
          // updateCountdown(textEl, )
          textEl.setAttribute('color', 'orange'); 
          textEl.setAttribute('width', '10px'); 
          textEl.setAttribute('height', '10px');
          textEl.setAttribute('rotation', '0 90 0'); 
          let intervalID = setInterval(countDownState(600, textEl), 1000);
          scene.append(textEl); 
        
    
        
          // let newTimer = document.createElement('a-entity'); 
          // newTimer.setAttribute('geometry' , { 
          //     primitive : 'box'
          // }); 
          // newTimer.setAttribute('text', 'Hi!!'); 
          // newTimer.setAttribute('a-text', 'value: Hi!')
          // // newTimer.setAttribute('text-color', 'white'); 
          // newTimer.setAttribute('material', 'color: red'); 
          // newTimer.setAttribute('position', p); 
          // scene.appendChild(newTimer); 
                               
                               
                               
      }
      
      
        
      this.el.addEventListener('click', this.createTimer); 
      // this.el.addEventListener('click', this.createTimer); 
      
    }, 
      
          // let pause = false; 
          // let alerts = false; 
          // let callPlayCounts = 0
          // let callResetCounts = 0
          // let callPauseCounts = 0
          // let callAlertCounts = 0
          // let currentTime = 0; 
          // console.log("here this: ",this.el.id); 
          // let textEl = document.createElement("a-text"); 
          // this.el.appendChild(textEl);
          // textEl.set
    remove: function() { 
        this.el.removeEventListener('click', this.createTimer); 
    }
                
    
    
  })