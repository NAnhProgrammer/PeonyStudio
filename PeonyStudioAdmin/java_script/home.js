const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

const li_manage = document.getElementById('li_manage')
const list_manage = document.getElementById('list_manage')
list_manage.classList.add('hide')

li_manage.onclick = () =>{
    list_manage.classList.toggle('show')
}

const li_booking = document.getElementById('li_booking')
const list_booking = document.getElementById('list_booking')
list_booking.classList.add('hide')
li_booking.onclick = () =>{
    list_booking.classList.toggle('show')
}
