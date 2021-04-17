let n = document.querySelectorAll(".delete-img").length;
function update(){
  let n = document.querySelectorAll(".delete-img").length;
  let deleted =  document.querySelectorAll(".hide").length;
  let checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
  n=n-deleted;
  document.querySelector("#total").innerHTML=n;
  document.querySelector("#completed").innerHTML=checked;
  document.querySelector("#uncomplete").innerHTML=n-checked;
}

for(let i=0;i<n;++i){
  document.querySelectorAll("input[type='checkbox']")[i].addEventListener("click",(event)=>{
      // console.log("CHECKBOX CLICKED");
      update();
  });

    document.querySelectorAll(".delete-img")[i].addEventListener("click",(event)=>{
        // console.log("DELETE CLICKED");
        event.path[1].remove();
        update();
    });
  }

update();
