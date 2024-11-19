window.addEventListener("load", function () {
    const themeToggle = document.getElementById("dark_btn");
    const themeStylesheet = document.getElementById("lightcss");

    const currentTheme = localStorage.getItem("theme");

    //if the theme is 'dark-theme', remove the moon icon and replace it with a sun icon
    if (currentTheme === "dark-theme") {
        themeStylesheet.setAttribute("href", "/css/maindark.css");
        themeToggle.classList.remove("icon-Clear-nightColorOff");
        themeToggle.classList.add("icon-Sunny");
    }

    function toggle_style() {
        //if the current theme is light-theme, change it to dark-theme, 
        if (themeStylesheet.getAttribute("href") === "/css/main.css") {
            themeStylesheet.setAttribute("href", "/css/maindark.css");
            localStorage.setItem("theme", "dark-theme");
            //Remove the moon icon and replace it with a sun icon
            themeToggle.classList.remove("icon-Clear-nightColorOff");
            themeToggle.classList.add("icon-Sunny");
        } else {
            themeStylesheet.setAttribute("href", "/css/main.css");
            localStorage.setItem("theme", "light-theme");
            //Remove the sun icon and replace it with a moon icon
            themeToggle.classList.remove("icon-Sunny");
            themeToggle.classList.add("icon-Clear-nightColorOff");
           
        }
    }

    themeToggle.addEventListener("click", toggle_style);
});

// window.addEventListener("load", function () {

    
//     const themeToggle = document.getElementById("dark_btn");
//     const themeStylesheet = document.getElementById("lightcss");
  
    
//     const currentTheme = localStorage.getItem("theme");
  
  
//     if (currentTheme === "dark-theme") {
      
//         themeStylesheet.setAttribute("href", "/css/maindark.css");
//     }
  
//     function toggle_style() {
        
//       if (themeStylesheet.getAttribute("href") === "/css/main.css") {
//           themeStylesheet.setAttribute("href", "/css/maindark.css");
//           localStorage.setItem("theme", "dark-theme");
//       } else {
//           themeStylesheet.setAttribute("href", "/css/main.css");
//           localStorage.setItem("theme", "light-theme");
//       }
//   }
  
//     themeToggle.addEventListener("click", toggle_style);
  
//   });