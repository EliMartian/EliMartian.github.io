AFRAME.registerComponent('target-marker', { 
    init: function() { 
            let el = this.el
            
            this.addMarker = function(e) { 
              let p = e.detail.intersection.point; 
              let scene = document.querySelector('a-scene'); 
              
              let newMark = document.createElement('a-entity'); 
              newMark.setAttribute('geometry', { 
                primitive: 'sphere'
              }); 
              newMark.setAttribute('material', 'color: red'); 
              newMark.setAttribute('scale', '0.2 0.2 0.2'); 
              newMark.setAttribute('position', el.object3D.worldToLocal(p)); 
              newMark.setAttribute('target-marker', {}); 
              // add a console log to confirm that it is running
              console.log("Working"); 
              
              el.appendChild(newMark); 
            }
      
            this.el.addEventListener('click', this.addMarker); 
            console.log("Working Event");
            console.log(this.el); 
          }, 
          remove: function() { 
            this.el.removeEventListener('click', this.addMarker);
          }
    }); 