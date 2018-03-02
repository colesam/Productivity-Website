//  GLOBAL VARIABLES
var lightbox;
var closePos;
var img = [];
var lightboxPreview = [];
var featuredImg;
var intervalID;

//  FUNCTIONS

/*  shiftRight()
    within the lightbox, shift the active image one position to the right, wrapping
    around to the beginning of the lightboxPreview array if necessary
*/
function shiftRight() {
    
    //  find the active preview item and it's position in the list
    var activePreviewItem;
    var activePosition;
    for(var i = 0; i < 10; i++) {
        
        if(lightboxPreview[i].classList.contains("active")) { 
            
            activePreviewItem = lightboxPreview[i]; 
            activePosition = i;
            
        }
        
    }
    
    if(activePosition + 1 == 10) {
        
        //  if the active position is at the end, it must reset preview 
        //  images in order to shift forward
        updateLightboxPreview(activePreviewItem.img_id + 1, false);
        setActive(lightboxPreview[0]);
        
    } else {
        
        //  set the next position to be the active image
        setActive(lightboxPreview[activePosition + 1]);
        
    }

}

/*  shiftLeft()
    within the lightbox, shift the active image one position to the right, wrapping
    around to the beginning of the lightboxPreview array if necessary
*/
function shiftLeft() {
    
    //  find the active preview item and it's position in the list
    var activePreviewItem;
    var activePosition;
    for(var i = 0; i < 10; i++) {
        
        if(lightboxPreview[i].classList.contains("active")) { 
            
            activePreviewItem = lightboxPreview[i]; 
            activePosition = i;
            
        }
        
    }
    
    //  check if this is the first item
    if(activePosition + 1 == 1) {
        
        //  must reset preview items to shift backward
        updateLightboxPreview(activePreviewItem.img_id - 1, true);
        setActive(lightboxPreview[9]);
        
    } else {
        
        setActive(lightboxPreview[activePosition - 1]);
        
    }

}

/*  setActive(DomElement lightboxPreviewItem)
    set's the DomElement passed in the parameter as the active image in the lightbox
    lightboxPreviewItem should be an element from the lightboxPreview array
*/
function setActive(lightboxPreviewItem) {
    
    featuredImg.classList.add("opaque");

        setTimeout(function() {
        lightboxPreview.forEach(function(image) {
            
            image.classList.remove("active");
            
        });
        
        lightboxPreviewItem.classList.add("active");
        
        //  get the img_id / img name of the lightboxPreviewItem
        
        featuredImg.src = "assets/img/high-res/" + lightboxPreviewItem.img_id + ".jpg";
        
        setTimeout(function() { featuredImg.classList.remove("opaque"); }, 700); 
    
    }, 300);
    
}

/*  updateLightboxPreview(int id, boolean reverse)
    populate the lightboxPreview array based off of the id parameter
    if reverse is false:
        place the image that corresponds to the id first, and load in
        the next 9 images after it
    if reverse is true:
        place the image that corresponds to the id last, and load in
        the previous 9 images before it
*/
function updateLightboxPreview(id, reverse) {
    
    //  special case for if shiftLeft() is called on the first image
    if(id == 0) { id = 20; }
    
    //  convert id to iterator (image id's are one higher than their offset from the beginning of the img array)
    id--;
    console.log(reverse);
    if(reverse) {
        
        //  put the image specified plus the previous 9 sequential image sources in the lightbox preview image elements
        for(var i = 0; i < 10; i++) {
            
            //  grab the image id from the img array by converting i into the correct
            //  iterator (accounting for negative wrap arounds)
            var imgID = img[(id - i + 20) % 20].img_id;
            
            //  this lightbox item gets the correct imgID and loads the correct preview
            lightboxPreview[9 - i].img_id = imgID;
            lightboxPreview[9 - i].src = "assets/img/preview/" + imgID + ".jpg";  
            
        }
        
    } else {
        
        //  put the image specified plus the next 9 sequential image sources in the lightbox preview image elements
        for(var i = 0; i < 10; i++) {
            
            //  grab the image id from the img array by converting i into the correct
            //  iterator (accounting for negative wrap arounds)
            var imgID = img[(id + i) % 20].img_id;
            
            //  this lightbox item gets the correct imgID and loads the correct preview
            lightboxPreview[i].img_id = imgID;
            lightboxPreview[i].src = "assets/img/preview/" + imgID + ".jpg";    
                                  
        }        
        
    }
    
}

/*  showLightbox(int id)
    update the lightbox preview using the id parameter, then set the featured image
    if the lightbox is not open, open it with the animation function
*/
function showLightbox(id) {
    
    //  update the preview items in the lightbox
    updateLightboxPreview(id, false);
    
    //  set the featured image
    featuredImg.src = "assets/img/high-res/" + img[id - 1].img_id + ".jpg";
    
    //  open the lightbox
    if(lightbox.getBoundingClientRect().top !== 0) { animateDown(); }
    
}

/*  hideLightbox()
    if the lightbox is open, use the animation function to close it and reset 
    the featured image
*/
function hideLightbox() {
    
    //  if lightbox is open, close it
    if(lightbox.getBoundingClientRect().top == 0) { animateUp(); }
    
    //  reset featured image
    featuredImg.classList.add("opaque");
    featuredImg.src = "";
    
}

/*  animateDown()
    every 5 ms move the fixed lightbox element 35 pixels lower until it
    covers the entire screen
*/
function animateDown() {
    
    //  get the top property of the lightbox and increment
    var top = Math.ceil(lightbox.getBoundingClientRect().top);
    top += 35;
    
    //  update the lightbox's position
    lightbox.style.top = top + "px";

    if(top < 0) {
        
        //  wait 5ms and then call this function again
        setTimeout(animateDown, 5);
        
    } else {
        
        //  set to 0px so there is no overflow to a postive value
        lightbox.style.top = "0px";
        
    }
    
}

/*  animateUp()
    every 5 ms move the fixed lightbox element 35 pixels higher until it
    is removed from view
*/
function animateUp() {
    
    //  get the top property of the lightbox and decrement
    var top = Math.ceil(lightbox.getBoundingClientRect().top);
    top -= 35;
    
    //  update the lightbox's position
    lightbox.style.top = top + "px";

    if(top > closePos) {
        
        //  wait 5ms and then call this function again
        setTimeout(animateUp, 5);
        
    } else {
        
        //  set to closed position so there is no overflow
        lightbox.style.top = closePos + "px";
        
    }
    
}

/*  load()
    executes when the body of index.html has been loaded
*/
function load() {
    
    //  VARIABLES
    //  get all images and assign them ids corresponding to their jpg name
    img = document.querySelectorAll(".img-row .img-preview");
    for(var i = 0; i < 20; i++) {
        
        img[i]["img_id"] = i + 1;
        
    }
    
    //  initialize global variables with DOM elements
    lightboxPreview = document.querySelectorAll(".lightbox .img-preview");
    lightbox = document.querySelector(".lightbox");
    featuredImg = document.querySelector(".featured-img img");
    closePos = Math.ceil(lightbox.getBoundingClientRect().top);
    

    //  EVENT LISTENERS
    //  open up the lightbox when a photo is clicked
    img.forEach(function(element) {

        element.addEventListener("click", function() { 
            
            showLightbox(element.img_id); 
            setActive(lightboxPreview[0]);
            
        });
        
    });
    
    //  exit out of the lightbox (do not apply to first invisible .fa-times icon)
    document.querySelectorAll(".fa-times")[1].addEventListener("click", function() { hideLightbox(); });
    
    //  shift to the right one image when in lightbox
    document.querySelector(".fa-forward").addEventListener("click", function() { shiftRight(); });
    
    //  shift to the left one image when in lightbox
    document.querySelector(".fa-backward").addEventListener("click", function() { shiftLeft(); });
    
    //  add events to the relevant keys
    document.addEventListener("keydown", function(event) {
        
        //  these events should only fire if the lightbox is open
        if(lightbox.getBoundingClientRect().top == 0) {
            
            switch(event.key) {
                
                case "Escape":
                    //  exit the lightbox
                    hideLightbox();
                    break;
                    
                case "ArrowRight":
                    //  move one image to the right
                    shiftRight();
                    break;
                    
                case "ArrowLeft":
                    //  move one image to the left
                    shiftLeft();
                    break;
                
                default:
                    console.log(event.key);
                
            }
            
        }
        
    });
    
    //  automatically shift one image to the right every 10 seconds
    document.querySelector(".fa-play").addEventListener("click", function() {
        
        shiftRight();
        intervalID = setInterval(shiftRight, 10000);
        this.classList.add("hidden");
        
        document.querySelector(".fa-stop").classList.remove("hidden");
        
    });
    
    //  stop shifting to the right every 10 seconds
    document.querySelector(".fa-stop").addEventListener("click", function() {
        
        clearInterval(intervalID);
        this.classList.add("hidden");
        
        document.querySelector(".fa-play").classList.remove("hidden");
        
    });

    //  if a lightbox preview image is clicked, make it the active image
    lightboxPreview.forEach(function(previewItem) {
        
        previewItem.addEventListener("click", function() { setActive(this); });
        
    });
    
}