<template>
  <div id="qr-code-container">
    <h1>請掃描QR CODE</h1>
    <div id="scanner">
      <div id="qr-reader"></div>
    </div>
  </div>
</template>

<script>
import { Html5QrcodeScanner } from "html5-qrcode";

function domReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

domReady(() => {
  let myQr = document.getElementById("qr-code-container");
  let lastResult,
    countResults = 0;

  // If found your QR CODE
  function onScanSuccess(decodeText, decodeResult) {
    if (decodeText !== lastResult) {
      ++countResults;
      lastResult = decodeText;

      // Alert your QR CODE here
      alert(`Your QR CODE is: ${decodeText} ${decodeResult}`);

      myQr.innerHTML = `You scan ${countResults}: ${decodeText}`;
    }
  }

  // Render area
  let htmlScanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: 250,
  });

  htmlScanner.render(onScanSuccess);
});
</script>

<style scoped>
#scanner {
  display: flex;
  justify-content: center;
}

#qr-reader {
  width: 500px;
}
</style>
