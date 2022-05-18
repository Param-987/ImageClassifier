const string = "Can't Process the Image . Image face and Eyes is not recognizable."
window.addEventListener('load',(e)=>{
  document.getElementsByClassName('flask')[0].style.display = 'none'
  document.getElementsByClassName('head')[0].style.display = 'none'
})

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(e.dataTransfer.files) 

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
  function updateThumbnail(dropZoneElement, file) {

    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label =  file.name;

    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  }

document.getElementById('MyButton').addEventListener('click',async (e)=>{
  try {
    if(document.getElementById('image-file').files.length){
      let file = document.getElementById('image-file').files[0];
      let contentBuffer = await readFileAsync(file);
      sendPostReq(contentBuffer)
    }
    // console.log(document.getElementById('image-file').files.length)
  } catch(err) {
    console.log(err);
  }
})




function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  })
}

function sendPostReq(data){
  formdata = new FormData()
  formdata.append("Image_data",data)
  fetch('http://127.0.0.1:5000/classify', {  method: 'POST', body: formdata})
          .then(resp => resp.json())
          .then(data => {
          if (data.errors)alert(data.errors)
          else handleData(data)
        }) 

}

function handleData(data){
  console.log(data)
  document.getElementsByClassName('flask')[0].style.display = 'none'

  var prob = data['Probability'];
  var a = data['status']
  if(a == -1){
    document.getElementsByClassName('head')[0].style.display = 'inline-block'
    var x = document.getElementsByClassName('head')[0]
    x.innerHTML = string
    x.style.display ='inline-block'
  }
  else {

    document.getElementsByClassName('flask')[0].style.display = 'inline-block'
    var a = document.getElementsByTagName('td')
    document.getElementsByClassName('head')[0].innerHTML = `The Uploaded Image is of ${data['Celebrity']}`
    document.getElementsByClassName('head')[0].style.display = 'inline-block'
    for(var i =10;i<15;i++){
      a[i].innerHTML = (data['Probability'][i-10]).toFixed(2);
    }
    // console.log(a);
    // 10
  }

}

