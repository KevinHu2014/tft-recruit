"use strict";var storySets=document.querySelectorAll(".story-set"),mask=document.querySelector(".md-overlay"),closeBtn=document.querySelector(".md-close");storySets.forEach(function(e){e.addEventListener("click",function(){mask.classList.add("is-active")})});