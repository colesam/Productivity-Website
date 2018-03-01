//  GLOBAL VARIABLES
var lightbox;
var closePos;
var img = [];
var lightboxPreview = [];
var featuredImg;
var intervalID;

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
        
        //  must reset preview items to shift forward
        updateLightboxPreview(activePreviewItem.img_id + 1, false);
        setActive(lightboxPreview[0]);
        
    } else {
        
        setActive(lightboxPreview[activePosition + 1]);
        
    }

}

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

function updateLightboxPreview(id, reverse) {
    
    //  special case for if shiftLeft() is called on the first image
    if(id == 0) { id = 20; }
    
    //  convert id to iterator (image id's are one higher than their offset from the beginning of the img array)
    id--;
    console.log(reverse);
    if(reverse) {
        
        for(var i = 0; i < 10; i++) {
            
            var imgID = img[(id - i + 20) % 20].img_id;
            lightboxPreview[9 - i].img_id = imgID;
            
            lightboxPreview[9 - i].src = "assets/img/preview/" + imgID + ".jpg";  
            
        }
        
    } else {
        
        //  put the image specified plus the next 9 sequential image sources in the lightbox preview image elements,
        //  wrapping around when necessary
        for(var i = 0; i < 10; i++) {
    
            var imgID = img[(id + i) % 20].img_id;
            lightboxPreview[i].img_id = imgID;
            
            lightboxPreview[i].src = "assets/img/preview/" + imgID + ".jpg";    
                                  
        }        
        
    }
    
}

function showLightbox(id) {
    
    //  update the preview items in the lightbox
    updateLightboxPreview(id, false);
    
    //  set the featured image
    featuredImg.src = "assets/img/high-res/" + img[id - 1].img_id + ".jpg";
    
    //  open the lightbox
    if(lightbox.getBoundingClientRect().top !== 0) { animateDown(); }
    
}

function hideLightbox() {
    
    //  if lightbox is open, close it
    if(lightbox.getBoundingClientRect().top == 0) { animateUp(); }
    
    //  reset featured image
    document.querySelector(".featured-img img").src = "";
    
}

function animateDown() {
    
    //  get the top property of the lightbox and increment by 15 pixels
    var top = Math.ceil(lightbox.getBoundingClientRect().top);
    top += 15;
    
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

function animateUp() {
    
    //  get the top property of the lightbox and decrement by 15 pixels
    var top = Math.ceil(lightbox.getBoundingClientRect().top);
    top -= 15;
    
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

function load() {
    
    //  DOM DEPENDENT VARIABLES
    //  get all images and assign them ids corresponding to their jpg name
    img = document.querySelectorAll(".img-row .img-preview");
    
    for(var i = 0; i < 20; i++) {
        
        img[i]["img_id"] = i + 1;
        
    }
    
    lightboxPreview = document.querySelectorAll(".lightbox .img-preview");

    lightbox = document.querySelector(".lightbox");
    featuredImg = document.querySelector(".featured-img img");
    closePos = Math.ceil(lightbox.getBoundingClientRect().top);


    //  EVENT LISTENERS
    //  open up the lightbox when a photo is clicked
    img.forEach(function(element) {

        element.addEventListener("click", function() { showLightbox(element.img_id); });
        
    });
    
    //  exit out of the lightbox (do not apply to first invisible .fa-times icon)
    document.querySelectorAll(".fa-times")[1].addEventListener("click", function() { hideLightbox(); });
    
    //  shift to the right one image when in lightbox
    document.querySelector(".fa-forward").addEventListener("click", function() { shiftRight(); });
    
    //  shift to the left one image when in lightbox
    document.querySelector(".fa-backward").addEventListener("click", function() { shiftLeft(); });
    
    //  add events to the relevant keys
    document.addEventListener("keydown", function(event) {
        
        if(lightbox.getBoundingClientRect().top == 0) {
            
            switch(event.key) {
                
                case "Escape":
                    hideLightbox();
                    break;
                    
                case "ArrowRight":
                    shiftRight();
                    break;
                    
                case "ArrowLeft":
                    shiftLeft();
                    break;
                
                default:
                    console.log(event.key);
                
            }
            
        }
        
    });
    
    document.querySelector(".fa-play").addEventListener("click", function() {
        
        shiftRight();
        intervalID = setInterval(shiftRight, 10000);
        this.classList.add("hidden");
        
        document.querySelector(".fa-stop").classList.remove("hidden");
        
    });
    
    document.querySelector(".fa-stop").addEventListener("click", function() {
        
        clearInterval(intervalID);
        this.classList.add("hidden");
        
        document.querySelector(".fa-play").classList.remove("hidden");
        
    });

    
    lightboxPreview.forEach(function(previewItem) {
        
        previewItem.addEventListener("click", function() { setActive(this); });
        
    });
    
}