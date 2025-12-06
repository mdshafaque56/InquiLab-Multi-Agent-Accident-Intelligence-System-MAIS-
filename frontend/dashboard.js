// ========== CLOCK ==========
function updateTime() {
  const el = document.getElementById("time-chip");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString("en-IN", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short"
  });
}
setInterval(updateTime, 1000);
updateTime();

// ========== NAV ACTIVE ==========
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ========== STREAM WEBSOCKET ==========
let ws = null;
const videoFeed = document.getElementById("video-feed");
const overlayText = document.getElementById("video-overlay-text");
const streamStatus = document.getElementById("stream-status");
const alertList = document.getElementById("alert-list");
const kpiAccidents = document.getElementById("kpi-accidents");
let accidentCount = 0;

function setStatusIdle() {
  streamStatus.textContent = "Idle";
  streamStatus.className = "badge badge-idle";
}

function setStatusLive() {
  streamStatus.textContent = "LIVE";
  streamStatus.className = "badge badge-live";
}

function addAlert(data) {
  const li = document.createElement("li");
  li.className = "alert-item";
  li.innerHTML = `
    <div class="alert-main">
      <span>⚠ ${data.alert}</span>
      <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
    </div>
    <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
  `;
  alertList.prepend(li);
}

// ========= WebSocket Connector ==========
function attachWS() {
  ws.onopen = () => {
    console.log("WS OPENED");
    setStatusLive();
    overlayText.textContent = "Streaming...";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("FRAME RECEIVED");

    if (data.frame) {
      videoFeed.src = `data:image/jpeg;base64,${data.frame}`;
    }
    if (data.alert) {
      accidentCount++;
      kpiAccidents.textContent = accidentCount;
      addAlert(data);
    }
  };

  ws.onclose = () => {
    setStatusIdle();
    overlayText.textContent = "Disconnected.";
  };
}

// ========= BUTTONS ==========
document.getElementById("btn-connect-live").onclick = () => {
  console.log("LIVE CAMERA STARTED");
  ws = new WebSocket("ws://127.0.0.1:8000/detect/stream");
  attachWS();
};

document.getElementById("btn-play-video").onclick = () => {
  console.log("PLAY VIDEO STREAM STARTED");
  ws = new WebSocket("ws://127.0.0.1:8000/detect/video");
  attachWS();
};

document.getElementById("btn-disconnect").onclick = () => {
  if (ws) ws.close();
  videoFeed.src = "";
  overlayText.textContent = "Waiting for frames...";
};

// ========= UPLOAD VIDEO HANDLER ==========
document.getElementById("btn-upload-video").onclick = () => {
  document.getElementById("video-input").click();
};

document.getElementById("video-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/detect/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  alert("Video uploaded ✔ Click Play Video to start.");
});
