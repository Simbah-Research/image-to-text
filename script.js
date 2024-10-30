// script.js
const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const generateBtn = document.getElementById("generateBtn");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.querySelector(".loading");
const clearBtn = document.getElementById("clearBtn");
const langSelect = document.getElementById("langSelect");

let images = [];

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

generateBtn.addEventListener("click", async () => {
  if (images.length === 0) return;

  loading.style.display = "block";
  resultText.value = "";

  try {
    let allText = "";
    for (let img of images) {
      const result = await Tesseract.recognize(img, langSelect.value, {
        logger: (m) => console.log(m),
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_'\"\n ",
      });
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
