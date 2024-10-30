// script.js
const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const generateBtn = document.getElementById("generateBtn");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.querySelector(".loading");
const clearBtn = document.getElementById("clearBtn");
const cameraBtn = document.getElementById("cameraBtn");
const videoElement = document.getElementById("videoElement");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

let images = [];
let stream;

imageInput.addEventListener("change", (e) => {
  const files = e.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-img");
      previewContainer.appendChild(img);
      images.push(img.src);
    };
    reader.readAsDataURL(file);
  }
});

cameraBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.style.display = "block";
    captureBtn.style.display = "block";
    await videoElement.play();
  } catch (err) {
    console.error(err);
    alert("Cannot access camera");
  }
});

captureBtn.addEventListener("click", () => {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext("2d").drawImage(videoElement, 0, 0);

  const img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");
  img.classList.add("preview-img");
  previewContainer.appendChild(img);
  images.push(img.src);

  stream.getTracks().forEach((track) => track.stop());
  videoElement.style.display = "none";
  captureBtn.style.display = "none";
});

generateBtn.addEventListener("click", async () => {
  if (images.length === 0) return;

  loading.style.display = "block";
  resultText.value = "";

  try {
    let allText = "";
    for (let img of images) {
      const result = await Tesseract.recognize(img);
      allText += result.data.text + "\n\n---\n\n";
    }
    resultText.value = allText;
  } catch (error) {
    console.error(error);
    alert("Error processing images");
  }

  loading.style.display = "none";
});

copyBtn.addEventListener("click", () => {
  resultText.select();
  document.execCommand("copy");
  alert("Text copied to clipboard!");
});

downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(resultText.value, 10, 10);
  doc.save("extracted-text.pdf");
});

clearBtn.addEventListener("click", () => {
  images = [];
  previewContainer.innerHTML = "";
  resultText.value = "";
});
