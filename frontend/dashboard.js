// // // ======================================================
// // // CLOCK
// // // ======================================================
// // function updateTime() {
// //   const el = document.getElementById("time-chip");
// //   if (!el) return;
// //   const now = new Date();
// //   el.textContent = now.toLocaleString("en-IN", {
// //     hour12: true,
// //     hour: "2-digit",
// //     minute: "2-digit",
// //     second: "2-digit",
// //     day: "2-digit",
// //     month: "short"
// //   });
// // }
// // setInterval(updateTime, 1000);
// // updateTime();

// // // ======================================================
// // // NAV ACTIVE STATE
// // // ======================================================
// // document.querySelectorAll(".nav-item").forEach((btn) => {
// //   btn.addEventListener("click", () => {
// //     document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
// //     btn.classList.add("active");
// //   });
// // });

// // // ======================================================
// // // GLOBALS
// // // ======================================================
// // let ws = null;
// // const videoFeed = document.getElementById("video-feed");
// // const overlayText = document.getElementById("video-overlay-text");
// // const streamStatus = document.getElementById("stream-status");
// // const alertList = document.getElementById("alert-list");
// // const kpiAccidents = document.getElementById("kpi-accidents");

// // let accidentCount = 0;

// // // ======================================================
// // // STATUS LABELS
// // // ======================================================
// // function setStatusIdle() {
// //   streamStatus.textContent = "Idle";
// //   streamStatus.className = "badge badge-idle";
// // }

// // function setStatusLive() {
// //   streamStatus.textContent = "LIVE";
// //   streamStatus.className = "badge badge-live";
// // }

// // // ======================================================
// // // ALERT ENTRY
// // // ======================================================
// // function addAlert(data) {
// //   const li = document.createElement("li");
// //   li.className = "alert-item";
// //   li.innerHTML = `
// //     <div class="alert-main">
// //       <span>⚠ ${data.alert}</span>
// //       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
// //     </div>
// //     <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
// //   `;
// //   alertList.prepend(li);
// // }

// // // ======================================================
// // // WEBSOCKET HANDLER
// // // ======================================================
// // function attachWS() {
// //   ws.onopen = () => {
// //     console.log("WS OPENED");
// //     setStatusLive();
// //     overlayText.textContent = "Streaming...";
// //   };

// //   ws.onmessage = (event) => {
// //     const data = JSON.parse(event.data);

// //     // FRAME
// //     if (data.frame) {
// //       videoFeed.src = `data:image/jpeg;base64,${data.frame}`;
// //     }

// //     // ALERT
// //     if (data.alert) {
// //       accidentCount++;
// //       kpiAccidents.textContent = accidentCount;
// //       addAlert(data);
// //     }

// //     // METRICS (REALTIME)
// //     if (data.metrics) {
// //       const m = data.metrics;

// //       document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
// //       document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
// //       document.getElementById("kpi-response").textContent = (m.avg_response_ms ?? 0).toFixed(1) + " ms";
// //       document.getElementById("kpi-risk").textContent = (m.risk_index ?? 0).toFixed(2);

// //       if (window.updateRiskChart) {
// //         updateRiskChart(m.risk_pulse ?? []);
// //       }
// //     }
// //   };

// //   ws.onclose = () => {
// //     setStatusIdle();
// //     overlayText.textContent = "Disconnected.";
// //   };
// // }

// // // ======================================================
// // // BUTTON EVENTS
// // // ======================================================
// // // document.getElementById("btn-connect-live").onclick = () => {
// // //   ws = new WebSocket("ws://127.0.0.1:8000/detect/stream");
// // //   attachWS();
// // // };
// // document.getElementById("btn-play-video").onclick = () => {
// //   stopDemoSimulation();
// //   startDemoSimulation();
// // };

// // // document.getElementById("btn-play-video").onclick = () => {
// // //   ws = new WebSocket("ws://127.0.0.1:8000/detect/video");
// // //   attachWS();
// // // };

// // document.getElementById("btn-disconnect").onclick = () => {
// //   if (ws) ws.close();
// //   videoFeed.src = "";
// //   overlayText.textContent = "Waiting for frames...";
// // };

// // // ======================================================
// // // VIDEO UPLOAD
// // // ======================================================
// // document.getElementById("btn-upload-video").onclick = () => {
// //   document.getElementById("video-input").click();
// // };

// // // document.getElementById("video-input").addEventListener("change", async (e) => {
// // //   const file = e.target.files[0];
// // //   if (!file) return;

// // //   const formData = new FormData();
// // //   formData.append("file", file);

// // //   const res = await fetch("http://127.0.0.1:8000/detect/upload", {
// // //     method: "POST",
// // //     body: formData,
// // //   });

// // //   alert("Video uploaded ✔ Click Play Video to start.");
// // // });
// // document.getElementById("video-input").addEventListener("change", async (e) => {
// //   const file = e.target.files[0];
// //   if (!file) return;

// //   overlayText.textContent = "Extracting frames...";

// //   demoFrames = await extractFrames(file);  
// //   alert("Video Ready ✔ Click 'Play Video' to start simulation.");
// // });

// // // ======================================================
// // // INCIDENT TIMELINE
// // // ======================================================
// // const incidentList = document.getElementById("incident-list");

// // async function loadIncidents() {
// //   try {
// //     const res = await fetch("http://127.0.0.1:8000/api/incidents");
// //     const data = await res.json();
// //     const incidents = data.incidents || [];

// //     incidentList.innerHTML = "";

// //     incidents.reverse().forEach((inc) => {
// //       const li = document.createElement("li");
// //       li.className = "incident-item";
// //       const timeStr = new Date(inc.time * 1000).toLocaleTimeString("en-IN");

// //       li.innerHTML = `
// //         <div class="incident-main">
// //           <span>🚨 Incident #${inc.id}</span>
// //           <span class="incident-meta">
// //             Source: ${inc.source} • Conf: ${(inc.confidence ?? 0).toFixed(2)} • ${timeStr}
// //           </span>
// //         </div>
// //         <a class="incident-link" href="/${inc.path}" target="_blank">Clip</a>
// //       `;

// //       incidentList.appendChild(li);
// //     });
// //   } catch (err) {
// //     console.error("Failed to load incidents", err);
// //   }
// // }

// // setInterval(loadIncidents, 7000);
// // loadIncidents();

// // // ======================================================
// // // RISK PULSE CHART
// // // ======================================================
// // let riskChart = null;

// // function updateRiskChart(pulse) {
// //   if (!pulse || pulse.length === 0) return;

// //   if (!riskChart) {
// //     const ctx = document.getElementById("risk-chart").getContext("2d");
// //     riskChart = new Chart(ctx, {
// //       type: "line",
// //       data: {
// //         labels: pulse.map((_, i) => i),
// //         datasets: [{
// //           label: "Risk Pulse",
// //           data: pulse,
// //           borderColor: "#08f7fe",
// //           borderWidth: 2,
// //           tension: 0.3,
// //         }],
// //       },
// //       options: {
// //         animation: false,
// //         scales: {
// //           y: { min: 0, max: 1 },
// //         },
// //       },
// //     });
// //   } else {
// //     riskChart.data.labels = pulse.map((_, i) => i);
// //     riskChart.data.datasets[0].data = pulse;
// //     riskChart.update();
// //   }
// // }

// // // ======================================================
// // // PERIODIC METRICS FETCH (fallback)
// // // ======================================================
// // async function loadMetrics() {
// //   try {
// //     const res = await fetch("http://127.0.0.1:8000/api/metrics");
// //     const m = await res.json();

// //     document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
// //     document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
// //     document.getElementById("kpi-response").textContent =
// //       (m.avg_response_ms ?? 0).toFixed(1) + " ms";
// //     document.getElementById("kpi-risk").textContent =
// //       (m.risk_index ?? 0).toFixed(2);

// //     updateRiskChart(m.risk_pulse ?? []);
// //   } catch (e) {
// //     console.error("Failed to load metrics", e);
// //   }
// // }

// // setInterval(loadMetrics, 2500);
// // loadMetrics();



// // // Modifiable
// // // ======================================================
// // // DEMO SIMULATION MODE (for your MVP demo video)
// // // ======================================================
// // let demoInterval1 = null;
// // let demoInterval2 = null;
// // let demoInterval3 = null;
// // let demoFrameIndex = 0;
// // let demoVideo = null;
// // let demoFrames = [];

// // // Load frames from the uploaded video
// // async function extractFrames(file) {
// //   return new Promise((resolve) => {
// //     const video = document.createElement("video");
// //     video.src = URL.createObjectURL(file);
// //     const canvas = document.createElement("canvas");
// //     const ctx = canvas.getContext("2d");
// //     let frames = [];

// //     video.onloadedmetadata = () => {
// //       canvas.width = 480;
// //       canvas.height = 260;

// //       const capture = () => {
// //         if (video.ended) {
// //           resolve(frames);
// //           return;
// //         }
// //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// //         frames.push(canvas.toDataURL("image/jpeg"));
// //         video.currentTime += 0.08; // ~12 FPS
// //       };

// //       video.ontimeupdate = capture;
// //       video.play();
// //     };
// //   });
// // }

// // function startDemoSimulation() {
// //   console.log("🔥 DEMO MODE RUNNING");

// //   setStatusLive();
// //   overlayText.textContent = "Simulated Stream";

// //   // 1) FRAME SIMULATION
// //   demoInterval1 = setInterval(() => {
// //     if (demoFrames.length === 0) return;
// //     videoFeed.src = demoFrames[demoFrameIndex];
// //     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// //   }, 80);

// //   // 2) KPI CHANGES
// //   demoInterval2 = setInterval(() => {
// //     document.getElementById("kpi-cameras").textContent = 12;
// //     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
// //     document.getElementById("kpi-response").textContent =
// //       (3 + Math.random() * 2).toFixed(1) + " min";
// //   }, 1200);

// //   // 3) RANDOM ALERTS + INCIDENTS
// //   demoInterval3 = setInterval(() => {
// //     const conf = (0.50 + Math.random() * 0.49).toFixed(2);

// //     const alert = {
// //       alert: "Possible Collision",
// //       confidence: conf
// //     };

// //     addAlert(alert);
// //     accidentCount++;
// //     kpiAccidents.textContent = accidentCount;

// //     // INCIDENT TIMELINE
// //     const li = document.createElement("li");
// //     li.className = "incident-item";
// //     li.innerHTML = `
// //       <div class="incident-main">
// //         <span>🚨 Incident #${accidentCount}</span>
// //         <span class="incident-meta">
// //           Source: Simulated • Conf: ${conf}
// //         </span>
// //       </div>
// //       <span class="incident-link">Clip</span>
// //     `;
// //     incidentList.prepend(li);

// //     // RISK PULSE small updates
// //     if (window.riskChart) {
// //       const arr = window.riskChart.data.datasets[0].data;
// //       arr.push(Math.random());
// //       if (arr.length > 30) arr.shift();
// //       window.riskChart.update();
// //     }
// //   }, 2600);
// // }

// // function stopDemoSimulation() {
// //   clearInterval(demoInterval1);
// //   clearInterval(demoInterval2);
// //   clearInterval(demoInterval3);
// // }




// // // DEMO
// // // ======================================================
// // // DEMO SIMULATION MODE (for your MVP demo video)
// // // ======================================================
// // let demoInterval1 = null;
// // let demoInterval2 = null;
// // let demoInterval3 = null;
// // let demoFrameIndex = 0;
// // let demoVideo = null;
// // let demoFrames = [];

// // // Load frames from the uploaded video
// // async function extractFrames(file) {
// //   return new Promise((resolve) => {
// //     const video = document.createElement("video");
// //     video.src = URL.createObjectURL(file);
// //     const canvas = document.createElement("canvas");
// //     const ctx = canvas.getContext("2d");
// //     let frames = [];

// //     video.onloadedmetadata = () => {
// //       canvas.width = 480;
// //       canvas.height = 260;

// //       const capture = () => {
// //         if (video.ended) {
// //           resolve(frames);
// //           return;
// //         }
// //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// //         frames.push(canvas.toDataURL("image/jpeg"));
// //         video.currentTime += 0.08; // ~12 FPS
// //       };

// //       video.ontimeupdate = capture;
// //       video.play();
// //     };
// //   });
// // }

// // function startDemoSimulation() {
// //   console.log("🔥 DEMO MODE RUNNING");

// //   setStatusLive();
// //   overlayText.textContent = "Simulated Stream";

// //   // 1) FRAME SIMULATION
// //   demoInterval1 = setInterval(() => {
// //     if (demoFrames.length === 0) return;
// //     videoFeed.src = demoFrames[demoFrameIndex];
// //     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// //   }, 80);

// //   // 2) KPI CHANGES
// //   demoInterval2 = setInterval(() => {
// //     document.getElementById("kpi-cameras").textContent = 12;
// //     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
// //     document.getElementById("kpi-response").textContent =
// //       (3 + Math.random() * 2).toFixed(1) + " min";
// //   }, 1200);

// //   // 3) RANDOM ALERTS + INCIDENTS
// //   demoInterval3 = setInterval(() => {
// //     const conf = (0.50 + Math.random() * 0.49).toFixed(2);

// //     const alert = {
// //       alert: "Possible Collision",
// //       confidence: conf
// //     };

// //     addAlert(alert);
// //     accidentCount++;
// //     kpiAccidents.textContent = accidentCount;

// //     // INCIDENT TIMELINE
// //     const li = document.createElement("li");
// //     li.className = "incident-item";
// //     li.innerHTML = `
// //       <div class="incident-main">
// //         <span>🚨 Incident #${accidentCount}</span>
// //         <span class="incident-meta">
// //           Source: Simulated • Conf: ${conf}
// //         </span>
// //       </div>
// //       <span class="incident-link">Clip</span>
// //     `;
// //     incidentList.prepend(li);

// //     // RISK PULSE small updates
// //     if (window.riskChart) {
// //       const arr = window.riskChart.data.datasets[0].data;
// //       arr.push(Math.random());
// //       if (arr.length > 30) arr.shift();
// //       window.riskChart.update();
// //     }
// //   }, 2600);
// // }

// // function stopDemoSimulation() {
// //   clearInterval(demoInterval1);
// //   clearInterval(demoInterval2);
// //   clearInterval(demoInterval3);
// // }


// // ======================================================
// // CLOCK
// // ======================================================
// function updateTime() {
//   const el = document.getElementById("time-chip");
//   if (!el) return;
//   const now = new Date();
//   el.textContent = now.toLocaleString("en-IN", {
//     hour12: true,
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     day: "2-digit",
//     month: "short"
//   });
// }
// setInterval(updateTime, 1000);
// updateTime();

// // ======================================================
// // NAV ACTIVE STATE
// // ======================================================
// document.querySelectorAll(".nav-item").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//   });
// });

// // ======================================================
// // GLOBALS
// // ======================================================
// let ws = null;
// const videoFeed = document.getElementById("video-feed");
// const overlayText = document.getElementById("video-overlay-text");
// const streamStatus = document.getElementById("stream-status");
// const alertList = document.getElementById("alert-list");
// const incidentList = document.getElementById("incident-list");
// const kpiAccidents = document.getElementById("kpi-accidents");

// let accidentCount = 0;

// // ======================================================
// // STATUS LABELS
// // ======================================================
// function setStatusIdle() {
//   streamStatus.textContent = "Idle";
//   streamStatus.className = "badge badge-idle";
// }

// function setStatusLive() {
//   streamStatus.textContent = "LIVE";
//   streamStatus.className = "badge badge-live";
// }

// // ======================================================
// // ALERT ENTRY
// // ======================================================
// function addAlert(data) {
//   const li = document.createElement("li");
//   li.className = "alert-item";
//   li.innerHTML = `
//     <div class="alert-main">
//       <span>⚠ ${data.alert}</span>
//       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
//     </div>
//     <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
//   `;
//   alertList.prepend(li);
// }

// // ======================================================
// // WEBSOCKET HANDLER (REAL MODE)
// // ======================================================
// function attachWS() {
//   ws.onopen = () => {
//     setStatusLive();
//     overlayText.textContent = "Streaming...";
//   };

//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     if (data.frame) {
//       videoFeed.src = `data:image/jpeg;base64,${data.frame}`;
//     }

//     if (data.alert) {
//       accidentCount++;
//       kpiAccidents.textContent = accidentCount;
//       addAlert(data);
//     }

//     if (data.metrics) {
//       const m = data.metrics;

//       document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
//       document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
//       document.getElementById("kpi-response").textContent =
//         (m.avg_response_ms ?? 0).toFixed(1) + " ms";
//       document.getElementById("kpi-risk").textContent =
//         (m.risk_index ?? 0).toFixed(2);

//       if (window.updateRiskChart) {
//         updateRiskChart(m.risk_pulse ?? []);
//       }
//     }
//   };

//   ws.onclose = () => {
//     setStatusIdle();
//     overlayText.textContent = "Disconnected.";
//   };
// }

// // ======================================================
// // BUTTON EVENTS
// // ======================================================
// document.getElementById("btn-disconnect").onclick = () => {
//   if (ws) ws.close();
//   stopDemoSimulation();
//   videoFeed.src = "";
//   overlayText.textContent = "Waiting for frames...";
// };

// // SIMULATED PLAY VIDEO MODE
// document.getElementById("btn-play-video").onclick = () => {
//   stopDemoSimulation();
//   startDemoSimulation();
// };

// // UPLOAD VIDEO
// document.getElementById("btn-upload-video").onclick = () => {
//   document.getElementById("video-input").click();
// };

// document.getElementById("video-input").addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   overlayText.textContent = "Extracting frames...";

//   demoFrames = await extractFrames(file);

//   overlayText.textContent = "Frames ready.";
//   alert("Video Ready ✔ Click 'Play Video' to start simulation.");
// });

// // ======================================================
// // INCIDENT TIMELINE (REAL MODE)
// // ======================================================
// async function loadIncidents() {
//   try {
//     const res = await fetch("http://127.0.0.1:8000/api/incidents");
//     const data = await res.json();
//     const incidents = data.incidents || [];

//     incidentList.innerHTML = "";

//     incidents.reverse().forEach((inc) => {
//       const li = document.createElement("li");
//       li.className = "incident-item";
//       const timeStr = new Date(inc.time * 1000).toLocaleTimeString("en-IN");

//       li.innerHTML = `
//         <div class="incident-main">
//           <span>🚨 Incident #${inc.id}</span>
//           <span class="incident-meta">
//             Source: ${inc.source} • Conf: ${(inc.confidence ?? 0).toFixed(2)} • ${timeStr}
//           </span>
//         </div>
//         <a class="incident-link" href="/${inc.path}" target="_blank">Clip</a>
//       `;

//       incidentList.appendChild(li);
//     });
//   } catch (err) {
//     console.error("Failed to load incidents", err);
//   }
// }

// setInterval(loadIncidents, 7000);
// loadIncidents();

// // ======================================================
// // RISK PULSE CHART
// // ======================================================
// let riskChart = null;

// function updateRiskChart(pulse) {
//   if (!pulse || pulse.length === 0) return;

//   if (!riskChart) {
//     const ctx = document.getElementById("risk-chart").getContext("2d");
//     riskChart = new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: pulse.map((_, i) => i),
//         datasets: [{
//           label: "Risk Pulse",
//           data: pulse,
//           borderColor: "#08f7fe",
//           borderWidth: 2,
//           tension: 0.3,
//         }],
//       },
//       options: {
//         animation: false,
//         scales: { y: { min: 0, max: 1 } },
//       },
//     });
//   } else {
//     riskChart.data.labels = pulse.map((_, i) => i);
//     riskChart.data.datasets[0].data = pulse;
//     riskChart.update();
//   }
// }

// // ======================================================
// // DEMO SIMULATION MODE
// // ======================================================
// // ======================================================
// // DEMO SIMULATION MODE (Modified: 1 accident every ~10 seconds)
// // ======================================================
// let demoFrames = [];
// let demoFrameIndex = 0;
// let demoIntervalFrame = null;   // Frame playback
// let demoIntervalKpi   = null;   // Random KPI updates
// let demoIntervalAccident = null; // Accident + Alert every 10s

// // Extract frames from uploaded video (unchanged)
// async function extractFrames(file) {
//   return new Promise((resolve) => {
//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(file);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     let frames = [];

//     video.onloadedmetadata = () => {
//       canvas.width = 480;
//       canvas.height = 260;

//       const capture = () => {
//         if (video.ended || video.currentTime >= video.duration) {
//           resolve(frames);
//           return;
//         }
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         frames.push(canvas.toDataURL("image/jpeg"));
//         video.currentTime += 0.08; // ~12 FPS
//       };

//       video.ontimeupdate = capture;
//       video.play();
//     };
//   });
// }

// // Start the demo / simulation
// function startDemoSimulation() {
//   console.log("DEMO MODE STARTED – 1 accident every ~10 seconds");

//   // Reset everything
//   accidentCount = 0;
//   kpiAccidents.textContent = "0";
//   setStatusLive();
//   overlayText.textContent = "Simulated Stream";

//   // 1. Frame playback (~12 FPS)
//   demoIntervalFrame = setInterval(() => {
//     if (demoFrames.length === 0) return;
//     videoFeed.src = demoFrames[demoFrameIndex];
//     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
//   }, 80); // 80 ms ≈ 12.5 FPS

//   // 2. Random KPI updates (cameras, risk, response time)
//   demoIntervalKpi = setInterval(() => {
//     document.getElementById("kpi-cameras").textContent = 12;
//     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
//     document.getElementById("kpi-response").textContent =
//       (3 + Math.random() * 2).toFixed(1) + " min";
//   }, 1200);

//   // 3. One accident + alert every 10 seconds
//   demoIntervalAccident = setInterval(() => {
//     const confidence = (0.65 + Math.random() * 0.30).toFixed(2); // 0.65–0.95

//     // Add alert to the right-side alert list
//     addAlert({
//       alert: "Possible Collision Detected", 
//       confidence: confidence
//     });

//     // Increment & update accident counter
//     accidentCount++;
//     kpiAccidents.textContent = accidentCount;

//     // Add entry to incident timeline (bottom)
//     const li = document.createElement("li");
//     li.className = "incident-item";
//     li.innerHTML = `
//       <div class="incident-main">
//         <span>Incident #${accidentCount}</div>
//         <span class="incident-meta">Source: Simulated • Conf: ${confidence}</span>
//       </div>
//       <span class="incident-link">Clip</span>
//     `;
//     incidentList.prepend(li);

//     // Small bump in risk pulse chart
//     if (riskChart) {
//       const data = riskChart.data.datasets[0].data;
//       data.push(parseFloat(confidence));
//       if (data.length > 30) data.shift();
//       riskChart.update();
//     }
//   }, 10000); // ← Exactly 10 seconds
// }

// // Stop everything
// function stopDemoSimulation() {
//   clearInterval(demoIntervalFrame);
//   clearInterval(demoIntervalKpi);
//   clearInterval(demoIntervalAccident);
// }
// // // // // ======================================================
// // // // // CLOCK
// // // // // ======================================================
// // // // function updateTime() {
// // // //   const el = document.getElementById("time-chip");
// // // //   if (!el) return;
// // // //   const now = new Date();
// // // //   el.textContent = now.toLocaleString("en-IN", {
// // // //     hour12: true,
// // // //     hour: "2-digit",
// // // //     minute: "2-digit",
// // // //     second: "2-digit",
// // // //     day: "2-digit",
// // // //     month: "short"
// // // //   });
// // // // }
// // // // setInterval(updateTime, 1000);
// // // // updateTime();

// // // // // ======================================================
// // // // // NAV ACTIVE STATE
// // // // // ======================================================
// // // // document.querySelectorAll(".nav-item").forEach((btn) => {
// // // //   btn.addEventListener("click", () => {
// // // //     document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
// // // //     btn.classList.add("active");
// // // //   });
// // // // });

// // // // // ======================================================
// // // // // GLOBALS
// // // // // ======================================================
// // // // let ws = null;
// // // // const videoFeed = document.getElementById("video-feed");
// // // // const overlayText = document.getElementById("video-overlay-text");
// // // // const streamStatus = document.getElementById("stream-status");
// // // // const alertList = document.getElementById("alert-list");
// // // // const kpiAccidents = document.getElementById("kpi-accidents");

// // // // let accidentCount = 0;

// // // // // ======================================================
// // // // // STATUS LABELS
// // // // // ======================================================
// // // // function setStatusIdle() {
// // // //   streamStatus.textContent = "Idle";
// // // //   streamStatus.className = "badge badge-idle";
// // // // }

// // // // function setStatusLive() {
// // // //   streamStatus.textContent = "LIVE";
// // // //   streamStatus.className = "badge badge-live";
// // // // }

// // // // // ======================================================
// // // // // ALERT ENTRY
// // // // // ======================================================
// // // // function addAlert(data) {
// // // //   const li = document.createElement("li");
// // // //   li.className = "alert-item";
// // // //   li.innerHTML = `
// // // //     <div class="alert-main">
// // // //       <span>⚠ ${data.alert}</span>
// // // //       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
// // // //     </div>
// // // //     <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
// // // //   `;
// // // //   alertList.prepend(li);
// // // // }

// // // // // ======================================================
// // // // // WEBSOCKET HANDLER
// // // // // ======================================================
// // // // function attachWS() {
// // // //   ws.onopen = () => {
// // // //     console.log("WS OPENED");
// // // //     setStatusLive();
// // // //     overlayText.textContent = "Streaming...";
// // // //   };

// // // //   ws.onmessage = (event) => {
// // // //     const data = JSON.parse(event.data);

// // // //     // FRAME
// // // //     if (data.frame) {
// // // //       videoFeed.src = `data:image/jpeg;base64,${data.frame}`;
// // // //     }

// // // //     // ALERT
// // // //     if (data.alert) {
// // // //       accidentCount++;
// // // //       kpiAccidents.textContent = accidentCount;
// // // //       addAlert(data);
// // // //     }

// // // //     // METRICS (REALTIME)
// // // //     if (data.metrics) {
// // // //       const m = data.metrics;

// // // //       document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
// // // //       document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
// // // //       document.getElementById("kpi-response").textContent = (m.avg_response_ms ?? 0).toFixed(1) + " ms";
// // // //       document.getElementById("kpi-risk").textContent = (m.risk_index ?? 0).toFixed(2);

// // // //       if (window.updateRiskChart) {
// // // //         updateRiskChart(m.risk_pulse ?? []);
// // // //       }
// // // //     }
// // // //   };

// // // //   ws.onclose = () => {
// // // //     setStatusIdle();
// // // //     overlayText.textContent = "Disconnected.";
// // // //   };
// // // // }

// // // // // ======================================================
// // // // // BUTTON EVENTS
// // // // // ======================================================
// // // // // document.getElementById("btn-connect-live").onclick = () => {
// // // // //   ws = new WebSocket("ws://127.0.0.1:8000/detect/stream");
// // // // //   attachWS();
// // // // // };
// // // // document.getElementById("btn-play-video").onclick = () => {
// // // //   stopDemoSimulation();
// // // //   startDemoSimulation();
// // // // };

// // // // // document.getElementById("btn-play-video").onclick = () => {
// // // // //   ws = new WebSocket("ws://127.0.0.1:8000/detect/video");
// // // // //   attachWS();
// // // // // };

// // // // document.getElementById("btn-disconnect").onclick = () => {
// // // //   if (ws) ws.close();
// // // //   videoFeed.src = "";
// // // //   overlayText.textContent = "Waiting for frames...";
// // // // };

// // // // // ======================================================
// // // // // VIDEO UPLOAD
// // // // // ======================================================
// // // // document.getElementById("btn-upload-video").onclick = () => {
// // // //   document.getElementById("video-input").click();
// // // // };

// // // // // document.getElementById("video-input").addEventListener("change", async (e) => {
// // // // //   const file = e.target.files[0];
// // // // //   if (!file) return;

// // // // //   const formData = new FormData();
// // // // //   formData.append("file", file);

// // // // //   const res = await fetch("http://127.0.0.1:8000/detect/upload", {
// // // // //     method: "POST",
// // // // //     body: formData,
// // // // //   });

// // // // //   alert("Video uploaded ✔ Click Play Video to start.");
// // // // // });
// // // // document.getElementById("video-input").addEventListener("change", async (e) => {
// // // //   const file = e.target.files[0];
// // // //   if (!file) return;

// // // //   overlayText.textContent = "Extracting frames...";

// // // //   demoFrames = await extractFrames(file);  
// // // //   alert("Video Ready ✔ Click 'Play Video' to start simulation.");
// // // // });

// // // // // ======================================================
// // // // // INCIDENT TIMELINE
// // // // // ======================================================
// // // // const incidentList = document.getElementById("incident-list");

// // // // async function loadIncidents() {
// // // //   try {
// // // //     const res = await fetch("http://127.0.0.1:8000/api/incidents");
// // // //     const data = await res.json();
// // // //     const incidents = data.incidents || [];

// // // //     incidentList.innerHTML = "";

// // // //     incidents.reverse().forEach((inc) => {
// // // //       const li = document.createElement("li");
// // // //       li.className = "incident-item";
// // // //       const timeStr = new Date(inc.time * 1000).toLocaleTimeString("en-IN");

// // // //       li.innerHTML = `
// // // //         <div class="incident-main">
// // // //           <span>🚨 Incident #${inc.id}</span>
// // // //           <span class="incident-meta">
// // // //             Source: ${inc.source} • Conf: ${(inc.confidence ?? 0).toFixed(2)} • ${timeStr}
// // // //           </span>
// // // //         </div>
// // // //         <a class="incident-link" href="/${inc.path}" target="_blank">Clip</a>
// // // //       `;

// // // //       incidentList.appendChild(li);
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Failed to load incidents", err);
// // // //   }
// // // // }

// // // // setInterval(loadIncidents, 7000);
// // // // loadIncidents();

// // // // // ======================================================
// // // // // RISK PULSE CHART
// // // // // ======================================================
// // // // let riskChart = null;

// // // // function updateRiskChart(pulse) {
// // // //   if (!pulse || pulse.length === 0) return;

// // // //   if (!riskChart) {
// // // //     const ctx = document.getElementById("risk-chart").getContext("2d");
// // // //     riskChart = new Chart(ctx, {
// // // //       type: "line",
// // // //       data: {
// // // //         labels: pulse.map((_, i) => i),
// // // //         datasets: [{
// // // //           label: "Risk Pulse",
// // // //           data: pulse,
// // // //           borderColor: "#08f7fe",
// // // //           borderWidth: 2,
// // // //           tension: 0.3,
// // // //         }],
// // // //       },
// // // //       options: {
// // // //         animation: false,
// // // //         scales: {
// // // //           y: { min: 0, max: 1 },
// // // //         },
// // // //       },
// // // //     });
// // // //   } else {
// // // //     riskChart.data.labels = pulse.map((_, i) => i);
// // // //     riskChart.data.datasets[0].data = pulse;
// // // //     riskChart.update();
// // // //   }
// // // // }

// // // // // ======================================================
// // // // // PERIODIC METRICS FETCH (fallback)
// // // // // ======================================================
// // // // async function loadMetrics() {
// // // //   try {
// // // //     const res = await fetch("http://127.0.0.1:8000/api/metrics");
// // // //     const m = await res.json();

// // // //     document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
// // // //     document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
// // // //     document.getElementById("kpi-response").textContent =
// // // //       (m.avg_response_ms ?? 0).toFixed(1) + " ms";
// // // //     document.getElementById("kpi-risk").textContent =
// // // //       (m.risk_index ?? 0).toFixed(2);

// // // //     updateRiskChart(m.risk_pulse ?? []);
// // // //   } catch (e) {
// // // //     console.error("Failed to load metrics", e);
// // // //   }
// // // // }

// // // // setInterval(loadMetrics, 2500);
// // // // loadMetrics();



// // // // // Modifiable
// // // // // ======================================================
// // // // // DEMO SIMULATION MODE (for your MVP demo video)
// // // // // ======================================================
// // // // let demoInterval1 = null;
// // // // let demoInterval2 = null;
// // // // let demoInterval3 = null;
// // // // let demoFrameIndex = 0;
// // // // let demoVideo = null;
// // // // let demoFrames = [];

// // // // // Load frames from the uploaded video
// // // // async function extractFrames(file) {
// // // //   return new Promise((resolve) => {
// // // //     const video = document.createElement("video");
// // // //     video.src = URL.createObjectURL(file);
// // // //     const canvas = document.createElement("canvas");
// // // //     const ctx = canvas.getContext("2d");
// // // //     let frames = [];

// // // //     video.onloadedmetadata = () => {
// // // //       canvas.width = 480;
// // // //       canvas.height = 260;

// // // //       const capture = () => {
// // // //         if (video.ended) {
// // // //           resolve(frames);
// // // //           return;
// // // //         }
// // // //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// // // //         frames.push(canvas.toDataURL("image/jpeg"));
// // // //         video.currentTime += 0.08; // ~12 FPS
// // // //       };

// // // //       video.ontimeupdate = capture;
// // // //       video.play();
// // // //     };
// // // //   });
// // // // }

// // // // function startDemoSimulation() {
// // // //   console.log("🔥 DEMO MODE RUNNING");

// // // //   setStatusLive();
// // // //   overlayText.textContent = "Simulated Stream";

// // // //   // 1) FRAME SIMULATION
// // // //   demoInterval1 = setInterval(() => {
// // // //     if (demoFrames.length === 0) return;
// // // //     videoFeed.src = demoFrames[demoFrameIndex];
// // // //     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// // // //   }, 80);

// // // //   // 2) KPI CHANGES
// // // //   demoInterval2 = setInterval(() => {
// // // //     document.getElementById("kpi-cameras").textContent = 12;
// // // //     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
// // // //     document.getElementById("kpi-response").textContent =
// // // //       (3 + Math.random() * 2).toFixed(1) + " min";
// // // //   }, 1200);

// // // //   // 3) RANDOM ALERTS + INCIDENTS
// // // //   demoInterval3 = setInterval(() => {
// // // //     const conf = (0.50 + Math.random() * 0.49).toFixed(2);

// // // //     const alert = {
// // // //       alert: "Possible Collision",
// // // //       confidence: conf
// // // //     };

// // // //     addAlert(alert);
// // // //     accidentCount++;
// // // //     kpiAccidents.textContent = accidentCount;

// // // //     // INCIDENT TIMELINE
// // // //     const li = document.createElement("li");
// // // //     li.className = "incident-item";
// // // //     li.innerHTML = `
// // // //       <div class="incident-main">
// // // //         <span>🚨 Incident #${accidentCount}</span>
// // // //         <span class="incident-meta">
// // // //           Source: Simulated • Conf: ${conf}
// // // //         </span>
// // // //       </div>
// // // //       <span class="incident-link">Clip</span>
// // // //     `;
// // // //     incidentList.prepend(li);

// // // //     // RISK PULSE small updates
// // // //     if (window.riskChart) {
// // // //       const arr = window.riskChart.data.datasets[0].data;
// // // //       arr.push(Math.random());
// // // //       if (arr.length > 30) arr.shift();
// // // //       window.riskChart.update();
// // // //     }
// // // //   }, 2600);
// // // // }

// // // // function stopDemoSimulation() {
// // // //   clearInterval(demoInterval1);
// // // //   clearInterval(demoInterval2);
// // // //   clearInterval(demoInterval3);
// // // // }




// // // // // DEMO
// // // // // ======================================================
// // // // // DEMO SIMULATION MODE (for your MVP demo video)
// // // // // ======================================================
// // // // let demoInterval1 = null;
// // // // let demoInterval2 = null;
// // // // let demoInterval3 = null;
// // // // let demoFrameIndex = 0;
// // // // let demoVideo = null;
// // // // let demoFrames = [];

// // // // // Load frames from the uploaded video
// // // // async function extractFrames(file) {
// // // //   return new Promise((resolve) => {
// // // //     const video = document.createElement("video");
// // // //     video.src = URL.createObjectURL(file);
// // // //     const canvas = document.createElement("canvas");
// // // //     const ctx = canvas.getContext("2d");
// // // //     let frames = [];

// // // //     video.onloadedmetadata = () => {
// // // //       canvas.width = 480;
// // // //       canvas.height = 260;

// // // //       const capture = () => {
// // // //         if (video.ended) {
// // // //           resolve(frames);
// // // //           return;
// // // //         }
// // // //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// // // //         frames.push(canvas.toDataURL("image/jpeg"));
// // // //         video.currentTime += 0.08; // ~12 FPS
// // // //       };

// // // //       video.ontimeupdate = capture;
// // // //       video.play();
// // // //     };
// // // //   });
// // // // }

// // // // function startDemoSimulation() {
// // // //   console.log("🔥 DEMO MODE RUNNING");

// // // //   setStatusLive();
// // // //   overlayText.textContent = "Simulated Stream";

// // // //   // 1) FRAME SIMULATION
// // // //   demoInterval1 = setInterval(() => {
// // // //     if (demoFrames.length === 0) return;
// // // //     videoFeed.src = demoFrames[demoFrameIndex];
// // // //     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// // // //   }, 80);

// // // //   // 2) KPI CHANGES
// // // //   demoInterval2 = setInterval(() => {
// // // //     document.getElementById("kpi-cameras").textContent = 12;
// // // //     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
// // // //     document.getElementById("kpi-response").textContent =
// // // //       (3 + Math.random() * 2).toFixed(1) + " min";
// // // //   }, 1200);

// // // //   // 3) RANDOM ALERTS + INCIDENTS
// // // //   demoInterval3 = setInterval(() => {
// // // //     const conf = (0.50 + Math.random() * 0.49).toFixed(2);

// // // //     const alert = {
// // // //       alert: "Possible Collision",
// // // //       confidence: conf
// // // //     };

// // // //     addAlert(alert);
// // // //     accidentCount++;
// // // //     kpiAccidents.textContent = accidentCount;

// // // //     // INCIDENT TIMELINE
// // // //     const li = document.createElement("li");
// // // //     li.className = "incident-item";
// // // //     li.innerHTML = `
// // // //       <div class="incident-main">
// // // //         <span>🚨 Incident #${accidentCount}</span>
// // // //         <span class="incident-meta">
// // // //           Source: Simulated • Conf: ${conf}
// // // //         </span>
// // // //       </div>
// // // //       <span class="incident-link">Clip</span>
// // // //     `;
// // // //     incidentList.prepend(li);

// // // //     // RISK PULSE small updates
// // // //     if (window.riskChart) {
// // // //       const arr = window.riskChart.data.datasets[0].data;
// // // //       arr.push(Math.random());
// // // //       if (arr.length > 30) arr.shift();
// // // //       window.riskChart.update();
// // // //     }
// // // //   }, 2600);
// // // // }

// // // // function stopDemoSimulation() {
// // // //   clearInterval(demoInterval1);
// // // //   clearInterval(demoInterval2);
// // // //   clearInterval(demoInterval3);
// // // // }


// // // // ======================================================
// // // // CLOCK
// // // // ======================================================
// // // function updateTime() {
// // //   const el = document.getElementById("time-chip");
// // //   if (!el) return;
// // //   const now = new Date();
// // //   el.textContent = now.toLocaleString("en-IN", {
// // //     hour12: true,
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //     second: "2-digit",
// // //     day: "2-digit",
// // //     month: "short"
// // //   });
// // // }
// // // setInterval(updateTime, 1000);
// // // updateTime();

// // // // ======================================================
// // // // NAV ACTIVE STATE
// // // // ======================================================
// // // document.querySelectorAll(".nav-item").forEach((btn) => {
// // //   btn.addEventListener("click", () => {
// // //     document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
// // //     btn.classList.add("active");
// // //   });
// // // });

// // // // ======================================================
// // // // GLOBALS
// // // // ======================================================
// // // let ws = null;
// // // const videoFeed = document.getElementById("video-feed");
// // // const overlayText = document.getElementById("video-overlay-text");
// // // const streamStatus = document.getElementById("stream-status");
// // // const alertList = document.getElementById("alert-list");
// // // const incidentList = document.getElementById("incident-list");
// // // const kpiAccidents = document.getElementById("kpi-accidents");

// // // let accidentCount = 0;

// // // // ======================================================
// // // // STATUS LABELS
// // // // ======================================================
// // // function setStatusIdle() {
// // //   streamStatus.textContent = "Idle";
// // //   streamStatus.className = "badge badge-idle";
// // // }

// // // function setStatusLive() {
// // //   streamStatus.textContent = "LIVE";
// // //   streamStatus.className = "badge badge-live";
// // // }

// // // // ======================================================
// // // // ALERT ENTRY
// // // // ======================================================
// // // function addAlert(data) {
// // //   const li = document.createElement("li");
// // //   li.className = "alert-item";
// // //   li.innerHTML = `
// // //     <div class="alert-main">
// // //       <span>⚠ ${data.alert}</span>
// // //       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
// // //     </div>
// // //     <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
// // //   `;
// // //   alertList.prepend(li);
// // // }

// // // // ======================================================
// // // // WEBSOCKET HANDLER (REAL MODE)
// // // // ======================================================
// // // function attachWS() {
// // //   ws.onopen = () => {
// // //     setStatusLive();
// // //     overlayText.textContent = "Streaming...";
// // //   };

// // //   ws.onmessage = (event) => {
// // //     const data = JSON.parse(event.data);

// // //     if (data.frame) {
// // //       videoFeed.src = `data:image/jpeg;base64,${data.frame}`;
// // //     }

// // //     if (data.alert) {
// // //       accidentCount++;
// // //       kpiAccidents.textContent = accidentCount;
// // //       addAlert(data);
// // //     }

// // //     if (data.metrics) {
// // //       const m = data.metrics;

// // //       document.getElementById("kpi-cameras").textContent = m.active_cameras ?? 0;
// // //       document.getElementById("kpi-accidents").textContent = m.accidents_today ?? 0;
// // //       document.getElementById("kpi-response").textContent =
// // //         (m.avg_response_ms ?? 0).toFixed(1) + " ms";
// // //       document.getElementById("kpi-risk").textContent =
// // //         (m.risk_index ?? 0).toFixed(2);

// // //       if (window.updateRiskChart) {
// // //         updateRiskChart(m.risk_pulse ?? []);
// // //       }
// // //     }
// // //   };

// // //   ws.onclose = () => {
// // //     setStatusIdle();
// // //     overlayText.textContent = "Disconnected.";
// // //   };
// // // }

// // // // ======================================================
// // // // BUTTON EVENTS
// // // // ======================================================
// // // document.getElementById("btn-disconnect").onclick = () => {
// // //   if (ws) ws.close();
// // //   stopDemoSimulation();
// // //   videoFeed.src = "";
// // //   overlayText.textContent = "Waiting for frames...";
// // // };

// // // // SIMULATED PLAY VIDEO MODE
// // // document.getElementById("btn-play-video").onclick = () => {
// // //   stopDemoSimulation();
// // //   startDemoSimulation();
// // // };

// // // // UPLOAD VIDEO
// // // document.getElementById("btn-upload-video").onclick = () => {
// // //   document.getElementById("video-input").click();
// // // };

// // // document.getElementById("video-input").addEventListener("change", async (e) => {
// // //   const file = e.target.files[0];
// // //   if (!file) return;

// // //   overlayText.textContent = "Extracting frames...";

// // //   demoFrames = await extractFrames(file);

// // //   overlayText.textContent = "Frames ready.";
// // //   alert("Video Ready ✔ Click 'Play Video' to start simulation.");
// // // });

// // // // ======================================================
// // // // INCIDENT TIMELINE (REAL MODE)
// // // // ======================================================
// // // async function loadIncidents() {
// // //   try {
// // //     const res = await fetch("http://127.0.0.1:8000/api/incidents");
// // //     const data = await res.json();
// // //     const incidents = data.incidents || [];

// // //     incidentList.innerHTML = "";

// // //     incidents.reverse().forEach((inc) => {
// // //       const li = document.createElement("li");
// // //       li.className = "incident-item";
// // //       const timeStr = new Date(inc.time * 1000).toLocaleTimeString("en-IN");

// // //       li.innerHTML = `
// // //         <div class="incident-main">
// // //           <span>🚨 Incident #${inc.id}</span>
// // //           <span class="incident-meta">
// // //             Source: ${inc.source} • Conf: ${(inc.confidence ?? 0).toFixed(2)} • ${timeStr}
// // //           </span>
// // //         </div>
// // //         <a class="incident-link" href="/${inc.path}" target="_blank">Clip</a>
// // //       `;

// // //       incidentList.appendChild(li);
// // //     });
// // //   } catch (err) {
// // //     console.error("Failed to load incidents", err);
// // //   }
// // // }

// // // setInterval(loadIncidents, 7000);
// // // loadIncidents();

// // // // ======================================================
// // // // RISK PULSE CHART
// // // // ======================================================
// // // let riskChart = null;

// // // function updateRiskChart(pulse) {
// // //   if (!pulse || pulse.length === 0) return;

// // //   if (!riskChart) {
// // //     const ctx = document.getElementById("risk-chart").getContext("2d");
// // //     riskChart = new Chart(ctx, {
// // //       type: "line",
// // //       data: {
// // //         labels: pulse.map((_, i) => i),
// // //         datasets: [{
// // //           label: "Risk Pulse",
// // //           data: pulse,
// // //           borderColor: "#08f7fe",
// // //           borderWidth: 2,
// // //           tension: 0.3,
// // //         }],
// // //       },
// // //       options: {
// // //         animation: false,
// // //         scales: { y: { min: 0, max: 1 } },
// // //       },
// // //     });
// // //   } else {
// // //     riskChart.data.labels = pulse.map((_, i) => i);
// // //     riskChart.data.datasets[0].data = pulse;
// // //     riskChart.update();
// // //   }
// // // }

// // // // ======================================================
// // // // DEMO SIMULATION MODE
// // // // ======================================================
// // // // ======================================================
// // // // DEMO SIMULATION MODE (Modified: 1 accident every ~10 seconds)
// // // // ======================================================
// // // let demoFrames = [];
// // // let demoFrameIndex = 0;
// // // let demoIntervalFrame = null;   // Frame playback
// // // let demoIntervalKpi   = null;   // Random KPI updates
// // // let demoIntervalAccident = null; // Accident + Alert every 10s

// // // // Extract frames from uploaded video (unchanged)
// // // async function extractFrames(file) {
// // //   return new Promise((resolve) => {
// // //     const video = document.createElement("video");
// // //     video.src = URL.createObjectURL(file);
// // //     const canvas = document.createElement("canvas");
// // //     const ctx = canvas.getContext("2d");
// // //     let frames = [];

// // //     video.onloadedmetadata = () => {
// // //       canvas.width = 480;
// // //       canvas.height = 260;

// // //       const capture = () => {
// // //         if (video.ended || video.currentTime >= video.duration) {
// // //           resolve(frames);
// // //           return;
// // //         }
// // //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// // //         frames.push(canvas.toDataURL("image/jpeg"));
// // //         video.currentTime += 0.08; // ~12 FPS
// // //       };

// // //       video.ontimeupdate = capture;
// // //       video.play();
// // //     };
// // //   });
// // // }

// // // // Start the demo / simulation
// // // function startDemoSimulation() {
// // //   console.log("DEMO MODE STARTED – 1 accident every ~10 seconds");

// // //   // Reset everything
// // //   accidentCount = 0;
// // //   kpiAccidents.textContent = "0";
// // //   setStatusLive();
// // //   overlayText.textContent = "Simulated Stream";

// // //   // 1. Frame playback (~12 FPS)
// // //   demoIntervalFrame = setInterval(() => {
// // //     if (demoFrames.length === 0) return;
// // //     videoFeed.src = demoFrames[demoFrameIndex];
// // //     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// // //   }, 80); // 80 ms ≈ 12.5 FPS

// // //   // 2. Random KPI updates (cameras, risk, response time)
// // //   demoIntervalKpi = setInterval(() => {
// // //     document.getElementById("kpi-cameras").textContent = 12;
// // //     document.getElementById("kpi-risk").textContent = (Math.random() * 0.6).toFixed(2);
// // //     document.getElementById("kpi-response").textContent =
// // //       (3 + Math.random() * 2).toFixed(1) + " min";
// // //   }, 1200);

// // //   // 3. One accident + alert every 10 seconds
// // //   demoIntervalAccident = setInterval(() => {
// // //     const confidence = (0.65 + Math.random() * 0.30).toFixed(2); // 0.65–0.95

// // //     // Add alert to the right-side alert list
// // //     addAlert({
// // //       alert: "Possible Collision Detected", 
// // //       confidence: confidence
// // //     });

// // //     // Increment & update accident counter
// // //     accidentCount++;
// // //     kpiAccidents.textContent = accidentCount;

// // //     // Add entry to incident timeline (bottom)
// // //     const li = document.createElement("li");
// // //     li.className = "incident-item";
// // //     li.innerHTML = `
// // //       <div class="incident-main">
// // //         <span>Incident #${accidentCount}</div>
// // //         <span class="incident-meta">Source: Simulated • Conf: ${confidence}</span>
// // //       </div>
// // //       <span class="incident-link">Clip</span>
// // //     `;
// // //     incidentList.prepend(li);

// // //     // Small bump in risk pulse chart
// // //     if (riskChart) {
// // //       const data = riskChart.data.datasets[0].data;
// // //       data.push(parseFloat(confidence));
// // //       if (data.length > 30) data.shift();
// // //       riskChart.update();
// // //     }
// // //   }, 10000); // ← Exactly 10 seconds
// // // }

// // // // Stop everything
// // // function stopDemoSimulation() {
// // //   clearInterval(demoIntervalFrame);
// // //   clearInterval(demoIntervalKpi);
// // //   clearInterval(demoIntervalAccident);
// // // }


// // // dashboard.js (Simulation Only MVP)
// // // Paste this entire file replacing the old dashboard.js

// // // -----------------------------
// // // CLOCK
// // // -----------------------------
// // function updateTime() {
// //   const el = document.getElementById("time-chip");
// //   if (!el) return;
// //   const now = new Date();
// //   el.textContent = now.toLocaleString("en-IN", {
// //     hour12: true,
// //     hour: "2-digit",
// //     minute: "2-digit",
// //     second: "2-digit",
// //     day: "2-digit",
// //     month: "short"
// //   });
// // }
// // setInterval(updateTime, 1000);
// // updateTime();

// // // -----------------------------
// // // NAV ACTIVE STATE
// // // -----------------------------
// // document.querySelectorAll(".nav-item").forEach((btn) => {
// //   btn.addEventListener("click", () => {
// //     document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
// //     btn.classList.add("active");
// //   });
// // });

// // // -----------------------------
// // // DOM REFS & GLOBALS
// // // -----------------------------
// // const videoFeed = document.getElementById("video-feed");
// // const overlayText = document.getElementById("video-overlay-text");
// // const streamStatus = document.getElementById("stream-status");
// // const alertList = document.getElementById("alert-list");
// // const incidentList = document.getElementById("incident-list");
// // let accidentCount = 0;

// // // KPI refs
// // const elKpiCameras = document.getElementById("kpi-cameras");
// // const elKpiAccidents = document.getElementById("kpi-accidents");
// // const elKpiResponse = document.getElementById("kpi-response");
// // const elKpiRisk = document.getElementById("kpi-risk");

// // // Agent cards (select by names in DOM)
// // const agentCards = Array.from(document.querySelectorAll(".agent-card"));

// // // Risk chart holder
// // let riskChart = null;

// // // Simulation timers / state
// // let simIntervals = {
// //   server: null,
// //   agents: null,
// //   metrics: null,
// //   frames: null,
// //   accidents: null,
// //   pulse: null
// // };
// // let demoFrames = [];
// // let demoFrameIndex = 0;
// // let fallbackMotionIndex = 0;
// // let simulationRunning = false;

// // // -----------------------------
// // // UTIL: status set
// // // -----------------------------
// // function setStatusIdle() {
// //   streamStatus.textContent = "Idle";
// //   streamStatus.className = "badge badge-idle";
// // }
// // function setStatusConnecting() {
// //   streamStatus.textContent = "Connecting";
// //   streamStatus.className = "badge badge-idle";
// // }
// // function setStatusLive() {
// //   streamStatus.textContent = "LIVE";
// //   streamStatus.className = "badge badge-live";
// // }

// // // -----------------------------
// // // ADD ALERT
// // // -----------------------------
// // function addAlert(data) {
// //   const li = document.createElement("li");
// //   li.className = "alert-item";
// //   li.innerHTML = `
// //     <div class="alert-main">
// //       <span>${data.alert}</span>
// //       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
// //     </div>
// //     <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
// //   `;
// //   alertList.prepend(li);
// //   // limit alerts history visually for demo
// //   while (alertList.children.length > 40) alertList.removeChild(alertList.lastChild);
// // }

// // // -----------------------------
// // // INCIDENT ITEM
// // // -----------------------------
// // function addIncidentEntry(id, conf) {
// //   const li = document.createElement("li");
// //   li.className = "incident-item";
// //   const timeStr = new Date().toLocaleTimeString("en-IN");
// //   li.innerHTML = `
// //     <div class="incident-main">
// //       <span>🚨 Incident #${id}</span>
// //       <span class="incident-meta">Source: Simulated • Conf: ${conf}</span>
// //     </div>
// //     <span class="incident-link">Clip</span>
// //   `;
// //   incidentList.prepend(li);
// //   while (incidentList.children.length > 30) incidentList.removeChild(incidentList.lastChild);
// // }

// // // -----------------------------
// // // RISK CHART INIT / UPDATE
// // // -----------------------------
// // function initRiskChart(initial = []) {
// //   if (riskChart) return;
// //   const ctx = document.getElementById("risk-chart").getContext("2d");
// //   riskChart = new Chart(ctx, {
// //     type: "line",
// //     data: {
// //       labels: initial.map((_, i) => i),
// //       datasets: [{
// //         label: "Risk Pulse",
// //         data: initial,
// //         borderColor: "#08f7fe",
// //         borderWidth: 2,
// //         tension: 0.3,
// //         pointRadius: 0
// //       }]
// //     },
// //     options: {
// //       animation: false,
// //       plugins: { legend: { display: false } },
// //       scales: { y: { min: 0, max: 1 }, x: { display: false } }
// //     }
// //   });
// // }

// // function pushRiskValue(v) {
// //   if (!riskChart) initRiskChart(Array(10).fill(0.12));
// //   const arr = riskChart.data.datasets[0].data;
// //   arr.push(Math.max(0, Math.min(1, v)));
// //   if (arr.length > 40) arr.shift();
// //   riskChart.data.labels = arr.map((_, i) => i);
// //   riskChart.update();
// //   elKpiRisk.textContent = v.toFixed(2);
// // }

// // // -----------------------------
// // // AGENT PULSE (visual small status)
// // // -----------------------------
// // function pulseAgent(index, text) {
// //   const card = agentCards[index];
// //   if (!card) return;
// //   const name = card.querySelector(".agent-name")?.textContent || `Agent${index}`;
// //   const descEl = card.querySelector(".agent-desc");
// //   const dot = card.querySelector(".agent-dot");
// //   // animate text
// //   const originalDesc = descEl ? descEl.textContent : "";
// //   if (descEl) descEl.textContent = text;
// //   // glow dot
// //   if (dot) {
// //     dot.style.boxShadow = "0 0 14px #08f7fe";
// //     dot.style.background = "#08f7fe";
// //   }
// //   setTimeout(() => {
// //     if (descEl) descEl.textContent = originalDesc;
// //     if (dot) {
// //       dot.style.boxShadow = "";
// //       dot.style.background = "";
// //     }
// //   }, 1200);
// // }

// // // -----------------------------
// // // SERVER STATUS SIMULATION
// // // -----------------------------
// // function startServerSimulation() {
// //   let phase = 0;
// //   setStatusIdle();
// //   clearInterval(simIntervals.server);
// //   simIntervals.server = setInterval(() => {
// //     phase = (phase + 1) % 6;
// //     if (phase === 1) {
// //       setStatusConnecting();
// //       overlayText.textContent = "Connecting to simulated server...";
// //     } else if (phase === 2) {
// //       setStatusLive();
// //       overlayText.textContent = "Simulated Stream";
// //     } else if (phase === 4) {
// //       setStatusConnecting();
// //       overlayText.textContent = "Reconnecting...";
// //     } else {
// //       setStatusLive();
// //       overlayText.textContent = "Simulated Stream";
// //     }
// //   }, 5000);
// // }

// // function stopServerSimulation() {
// //   clearInterval(simIntervals.server);
// //   setStatusIdle();
// //   overlayText.textContent = "Waiting for frames...";
// // }

// // // -----------------------------
// // // METRICS SIMULATION (KPI smoothing)
// // // -----------------------------
// // let metricsState = {
// //   cameras: 12,
// //   accidents_today: 0,
// //   avg_response_min: 4.3,
// //   risk_index: 0.32
// // };

// // function startMetricsSimulation() {
// //   clearInterval(simIntervals.metrics);
// //   simIntervals.metrics = setInterval(() => {
// //     // small smooth fluctuations
// //     metricsState.cameras = 10 + Math.round(2 * (0.6 + Math.random()));
// //     metricsState.avg_response_min = Math.max(1.5, (3 + Math.random() * 3).toFixed(1));
// //     // risk index random walk
// //     metricsState.risk_index = Math.max(0, Math.min(0.95, (metricsState.risk_index + (Math.random() - 0.45) * 0.05)));
// //     elKpiCameras.textContent = metricsState.cameras;
// //     elKpiResponse.textContent = `${parseFloat(metricsState.avg_response_min).toFixed(1)} min`;
// //     // accidents today is driven by accident simulation - keep sync
// //     elKpiAccidents.textContent = metricsState.accidents_today;
// //     // push gentle values to chart
// //     pushRiskValue(metricsState.risk_index);
// //   }, 1800);
// // }

// // function stopMetricsSimulation() {
// //   clearInterval(simIntervals.metrics);
// // }

// // // -----------------------------
// // // FRAME PLAYBACK: extractFrames + fallback
// // // -----------------------------
// // async function extractFrames(file) {
// //   return new Promise((resolve) => {
// //     const video = document.createElement("video");
// //     video.muted = true;
// //     video.src = URL.createObjectURL(file);
// //     const canvas = document.createElement("canvas");
// //     const ctx = canvas.getContext("2d");
// //     const frames = [];

// //     video.addEventListener("loadedmetadata", () => {
// //       // match dashboard video frame box aspect roughly
// //       canvas.width = 480;
// //       canvas.height = 260;
// //       video.currentTime = 0;
// //     });

// //     // capture frames on timeupdate
// //     video.addEventListener("timeupdate", () => {
// //       try {
// //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// //         frames.push(canvas.toDataURL("image/jpeg"));
// //       } catch (e) {
// //         // ignore drawing errors on some browsers
// //       }
// //       // step forward
// //       video.currentTime += 0.08; // ~12 FPS
// //       if (video.currentTime >= video.duration) {
// //         // finished: stop and resolve
// //         video.pause();
// //         resolve(frames.length ? frames : null);
// //       }
// //     });

// //     // fallback if browser doesn't step correctly
// //     video.addEventListener("ended", () => {
// //       resolve(frames.length ? frames : null);
// //     });

// //     video.play().catch(() => {
// //       // If autoplay blocked, try to play silently
// //       video.play().catch(() => {
// //         resolve(null);
// //       });
// //     });
// //   });
// // }

// // function startFramePlayback() {
// //   clearInterval(simIntervals.frames);
// //   if (demoFrames && demoFrames.length > 0) {
// //     simIntervals.frames = setInterval(() => {
// //       videoFeed.src = demoFrames[demoFrameIndex];
// //       demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
// //     }, 80);
// //   } else {
// //     // Fallback: synthetic motion (pulse gradient canvas)
// //     simIntervals.frames = setInterval(() => {
// //       // create quick generated frame via canvas
// //       const c = document.createElement("canvas");
// //       c.width = 480; c.height = 260;
// //       const ctx = c.getContext("2d");
// //       // background
// //       ctx.fillStyle = "#0b1b2b";
// //       ctx.fillRect(0, 0, c.width, c.height);
// //       // moving rectangle as road motion simulation
// //       fallbackMotionIndex = (fallbackMotionIndex + 5) % (c.width + 200);
// //       const x = fallbackMotionIndex - 100;
// //       // draw some cars
// //       for (let i = 0; i < 6; i++) {
// //         const carX = (x + i * 120) % (c.width + 200) - 60;
// //         ctx.fillStyle = `rgba(8,247,254,${0.08 + Math.abs(Math.sin((carX/200)+i))*0.7})`;
// //         ctx.fillRect((carX + c.width) % c.width, 80 + (i % 2) * 40, 40, 20);
// //       }
// //       videoFeed.src = c.toDataURL("image/jpeg");
// //     }, 90);
// //   }
// // }

// // function stopFramePlayback() {
// //   clearInterval(simIntervals.frames);
// //   demoFrameIndex = 0;
// // }

// // // -----------------------------
// // // ACCIDENT ORCHESTRATOR (multi-alert)
// // // -----------------------------
// // function triggerSimulatedAccident() {
// //   accidentCount++;
// //   metricsState.accidents_today = accidentCount;
// //   const id = accidentCount;
// //   const baseConf = (0.48 + Math.random() * 0.45).toFixed(2);

// //   // Step 1: Accident detected
// //   addAlert({ alert: `🚨 Accident #${id} detected`, confidence: parseFloat(baseConf) });
// //   addIncidentEntry(id, baseConf);
// //   elKpiAccidents.textContent = metricsState.accidents_today;

// //   // small temporary spike to risk
// //   const spike = Math.min(1, 0.6 + Math.random() * 0.35);
// //   pushRiskValue(spike);

// //   // Alert 1 (Ambulance)
// //   setTimeout(() => {
// //     addAlert({ alert: `⚡ Alert 1 sent (Ambulance) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.03).toFixed(2) });
// //     pulseAgent(2, "Dispatching Ambulance...");
// //   }, 900);

// //   // Alert 2 (Traffic Police)
// //   setTimeout(() => {
// //     addAlert({ alert: `⚡ Alert 2 sent (Traffic Police) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.05).toFixed(2) });
// //     pulseAgent(1, "Notifying Traffic Police...");
// //   }, 1800);

// //   // Alert 3 (Control Room)
// //   setTimeout(() => {
// //     addAlert({ alert: `⚡ Alert 3 sent (Control Room) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.07).toFixed(2) });
// //     pulseAgent(3, "Logging Incident...");
// //   }, 2600);
// // }

// // // Periodic accident generator (configurable frequency)
// // function startAccidentSimulation(freqMs = 9000) {
// //   clearInterval(simIntervals.accidents);
// //   // initial small delay then regular triggers
// //   setTimeout(() => {
// //     triggerSimulatedAccident();
// //     simIntervals.accidents = setInterval(() => {
// //       // occasionally skip a cycle for realism
// //       if (Math.random() < 0.75) triggerSimulatedAccident();
// //     }, freqMs);
// //   }, 1400);
// // }

// // function stopAccidentSimulation() {
// //   clearInterval(simIntervals.accidents);
// // }

// // // -----------------------------
// // // AGENT ACTIVITY SIMULATION
// // // -----------------------------
// // function startAgentSimulation() {
// //   clearInterval(simIntervals.agents);
// //   simIntervals.agents = setInterval(() => {
// //     // randomly pulse agents with context text
// //     const idx = Math.floor(Math.random() * agentCards.length);
// //     const texts = [
// //       "Running inference...",
// //       "Updating risk models...",
// //       "Dispatching alerts...",
// //       "Coordinating agents...",
// //       "Analyzing frames..."
// //     ];
// //     const t = texts[Math.floor(Math.random() * texts.length)];
// //     pulseAgent(idx, t);
// //   }, 2200);
// // }
// // function stopAgentSimulation() {
// //   clearInterval(simIntervals.agents);
// // }

// // // -----------------------------
// // // RISK PULSE (micro updates)
// // // -----------------------------
// // function startPulseSimulation() {
// //   clearInterval(simIntervals.pulse);
// //   simIntervals.pulse = setInterval(() => {
// //     const v = Math.max(0, Math.min(1, (parseFloat(elKpiRisk.textContent || "0.3") + (Math.random() - 0.45) * 0.05)));
// //     pushRiskValue(v);
// //   }, 1200);
// // }
// // function stopPulseSimulation() {
// //   clearInterval(simIntervals.pulse);
// // }

// // // -----------------------------
// // // MASTER START / STOP SIM
// // // -----------------------------
// // function startSimulation() {
// //   if (simulationRunning) return;
// //   simulationRunning = true;
// //   // init chart with baseline
// //   initRiskChart(Array.from({length: 12}, () => 0.12 + Math.random() * 0.05));
// //   // server, metrics, agents, frames, accidents, pulse
// //   startServerSimulation();
// //   startMetricsSimulation();
// //   startAgentSimulation();
// //   startPulseSimulation();
// //   startFramePlayback();
// //   startAccidentSimulation(8000); // accidents every ~8s
// //   // set server label to online shortly
// //   setTimeout(() => {
// //     setStatusLive();
// //     overlayText.textContent = "Simulated Stream";
// //   }, 800);
// // }

// // function stopSimulation() {
// //   simulationRunning = false;
// //   stopServerSimulation();
// //   stopMetricsSimulation();
// //   stopAgentSimulation();
// //   stopPulseSimulation();
// //   stopFramePlayback();
// //   stopAccidentSimulation();
// //   // clear some UI
// //   overlayText.textContent = "Simulation stopped";
// // }

// // // -----------------------------
// // // UI Wiring: Upload / Play / Disconnect
// // // -----------------------------
// // document.getElementById("btn-upload-video").onclick = () => {
// //   document.getElementById("video-input").click();
// // };

// // document.getElementById("video-input").addEventListener("change", async (e) => {
// //   const file = e.target.files[0];
// //   if (!file) return;
// //   overlayText.textContent = "Extracting frames...";
// //   const frames = await extractFrames(file);
// //   if (frames && frames.length) {
// //     demoFrames = frames;
// //     demoFrameIndex = 0;
// //     overlayText.textContent = "Frames ready. Click Play Video.";
// //     alert("Video Ready ✔ Click 'Play Video' to start simulation.");
// //   } else {
// //     demoFrames = [];
// //     overlayText.textContent = "Could not extract frames. Using synthetic fallback.";
// //     alert("Could not extract frames. Simulation will use fallback animation.");
// //   }
// // });

// // // Play button triggers simulation-run (single simulation-only mode)
// // document.getElementById("btn-play-video").onclick = () => {
// //   // if already running, do nothing; otherwise start
// //   if (!simulationRunning) startSimulation();
// // };

// // // Disconnect stops simulation
// // document.getElementById("btn-disconnect").onclick = () => {
// //   stopSimulation();
// //   // clear video
// //   videoFeed.src = "";
// //   overlayText.textContent = "Waiting for frames...";
// // };

// // // Also allow manual simulation toggles from console
// // window.startInquiSim = startSimulation;
// // window.stopInquiSim = stopSimulation;

// // // -----------------------------
// // // Start automatically for demo
// // // -----------------------------
// // setTimeout(() => {
// //   // auto-start for demo recordings; comment out if you prefer manual start
// //   startSimulation();
// // }, 600);


// /* ============================================================
//    INQUILAB • SIMULATION DASHBOARD (NO BACKEND)
//    Fixed Bounding Box Demo + KPI + Alerts + Timeline + Risk Chart
//    ============================================================ */

// /* ------------------ CLOCK ------------------ */
// function updateTime() {
//   const el = document.getElementById("time-chip");
//   const now = new Date();
//   el.textContent = now.toLocaleString("en-IN", {
//     hour12: true,
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     day: "2-digit",
//     month: "short"
//   });
// }
// setInterval(updateTime, 1000);
// updateTime();

// /* ------------------ DOM REFS ------------------ */
// const videoFeed       = document.getElementById("video-feed");
// const overlayText     = document.getElementById("video-overlay-text");
// const alertList       = document.getElementById("alert-list");
// const incidentList    = document.getElementById("incident-list");
// const streamStatus    = document.getElementById("stream-status");

// const kpiCameras  = document.getElementById("kpi-cameras");
// const kpiAcc      = document.getElementById("kpi-accidents");
// const kpiResp     = document.getElementById("kpi-response");
// const kpiRisk     = document.getElementById("kpi-risk");

// let accidentCount = 0;
// let demoFrames = [];
// let demoFrameIndex = 0;
// let simIntervals = {};
// let riskChart = null;

// /* ------------------ STATUS ------------------ */
// function setStatusIdle() { streamStatus.textContent = "Idle"; streamStatus.className = "badge badge-idle"; }
// function setStatusLive() { streamStatus.textContent = "LIVE"; streamStatus.className = "badge badge-live"; }

// /* ------------------ ALERT CARD ------------------ */
// function addAlert(conf) {
//   const li = document.createElement("li");
//   li.className = "alert-item";
//   li.innerHTML = `
//     <div class="alert-main">
//       <span>⚠ Accident Detected</span>
//       <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
//     </div>
//     <div class="alert-tag">Conf: ${conf}</div>
//   `;
//   alertList.prepend(li);
// }

// /* ------------------ INCIDENT TIMELINE ------------------ */
// function addIncident(conf) {
//   const id = accidentCount;
//   const li = document.createElement("li");
//   li.className = "incident-item";

//   li.innerHTML = `
//     <div class="incident-main">
//       <span>🚨 Incident #${id}</span>
//       <span class="incident-meta">Source: Simulated • Conf: ${conf}</span>
//     </div>
//     <span class="incident-link">Clip</span>
//   `;

//   incidentList.prepend(li);
// }

// /* ------------------ RISK CHART ------------------ */
// function initRiskChart() {
//   const ctx = document.getElementById("risk-chart").getContext("2d");
//   riskChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: Array(20).fill(0).map((_, i) => i),
//       datasets: [{
//         data: Array(20).fill(0.2),
//         borderColor: "#08f7fe",
//         borderWidth: 2,
//         tension: 0.3,
//         pointRadius: 0
//       }]
//     },
//     options: {
//       animation: false,
//       plugins: { legend: { display: false } },
//       scales: { y: { min: 0, max: 1 }, x: { display: false } }
//     }
//   });
// }

// function pushRisk(v) {
//   const arr = riskChart.data.datasets[0].data;
//   arr.push(v);
//   if (arr.length > 40) arr.shift();
//   riskChart.update();
//   kpiRisk.textContent = v.toFixed(2);
// }

// /* ------------------ VIDEO FRAME EXTRACTION ------------------ */
// async function extractFrames(file) {
//   return new Promise((resolve) => {
//     const video = document.createElement("video");
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = 480;
//     canvas.height = 260;
//     video.src = URL.createObjectURL(file);
//     const frames = [];

//     video.onloadedmetadata = () => {
//       video.currentTime = 0;
//     };

//     video.ontimeupdate = () => {
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // ------ ADD FIXED YOLO-STYLE BOX ------
//       ctx.strokeStyle = "#00ff00";
//       ctx.lineWidth = 3;
//       ctx.strokeRect(120, 60, 190, 120);

//       frames.push(canvas.toDataURL("image/jpeg"));
//       video.currentTime += 0.08;

//       if (video.currentTime >= video.duration) resolve(frames);
//     };

//     video.play();
//   });
// }

// /* ------------------ SIMULATION ENGINE ------------------ */
// function startFramePlayback() {
//   clearInterval(simIntervals.frames);
//   simIntervals.frames = setInterval(() => {
//     videoFeed.src = demoFrames[demoFrameIndex];
//     demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
//   }, 80);
// }

// function startMetrics() {
//   clearInterval(simIntervals.metrics);
//   simIntervals.metrics = setInterval(() => {
//     kpiCameras.textContent = 12;
//     kpiResp.textContent = `${(3 + Math.random()).toFixed(1)} min`;
//     pushRisk(Math.min(1, Math.max(0, 0.3 + (Math.random() - 0.5) * 0.1)));
//   }, 1200);
// }

// function startAccidentLoop() {
//   clearInterval(simIntervals.accidents);
//   simIntervals.accidents = setInterval(() => {
//     const conf = (0.65 + Math.random() * 0.25).toFixed(2);
//     accidentCount++;
//     kpiAcc.textContent = accidentCount;

//     addAlert(conf);
//     addIncident(conf);
//   }, 9000); 
// }

// /* ------------------ MASTER START ------------------ */
// function startSimulation() {
//   setStatusLive();
//   overlayText.textContent = "Simulated Stream";

//   if (!riskChart) initRiskChart();

//   startFramePlayback();
//   startMetrics();
//   startAccidentLoop();
// }

// /* ------------------ STOP ------------------ */
// function stopSimulation() {
//   Object.values(simIntervals).forEach(clearInterval);
//   setStatusIdle();
//   overlayText.textContent = "Waiting for frames...";
//   videoFeed.src = "";
// }

// /* ------------------ UI BUTTONS ------------------ */
// document.getElementById("btn-upload-video").onclick = () =>
//   document.getElementById("video-input").click();

// document.getElementById("video-input").addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   overlayText.textContent = "Extracting frames...";

//   demoFrames = await extractFrames(file);
//   demoFrameIndex = 0;

//   overlayText.textContent = "Frames Ready ✔ Click Play Video";
// });

// document.getElementById("btn-play-video").onclick = () => startSimulation();
// document.getElementById("btn-disconnect").onclick = () => stopSimulation();

// /* Auto start demo if needed */
// // setTimeout(startSimulation, 600);

// dashboard.js — Simulation-only replacement (No bounding boxes)
// Paste this entire file replacing the old dashboard.js

// -----------------------------
// CLOCK
// -----------------------------
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

// -----------------------------
// NAV ACTIVE STATE
// -----------------------------
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// -----------------------------
// DOM REFS & GLOBALS
// -----------------------------
const videoFeed = document.getElementById("video-feed");
const overlayText = document.getElementById("video-overlay-text");
const streamStatus = document.getElementById("stream-status");
const alertList = document.getElementById("alert-list");
const incidentList = document.getElementById("incident-list");
let accidentCount = 0;

// KPI refs
const elKpiCameras = document.getElementById("kpi-cameras");
const elKpiAccidents = document.getElementById("kpi-accidents");
const elKpiResponse = document.getElementById("kpi-response");
const elKpiRisk = document.getElementById("kpi-risk");

// Agent cards (select by names in DOM)
const agentCards = Array.from(document.querySelectorAll(".agent-card"));

// Risk chart holder
let riskChart = null;

// Simulation timers / state
let simIntervals = {
  server: null,
  agents: null,
  metrics: null,
  frames: null,
  accidents: null,
  pulse: null
};
let demoFrames = [];
let demoFrameIndex = 0;
let fallbackMotionIndex = 0;
let simulationRunning = false;

// -----------------------------
// UTIL: status set
// -----------------------------
function setStatusIdle() {
  if (streamStatus) {
    streamStatus.textContent = "Idle";
    streamStatus.className = "badge badge-idle";
  }
}
function setStatusConnecting() {
  if (streamStatus) {
    streamStatus.textContent = "Connecting";
    streamStatus.className = "badge badge-idle";
  }
}
function setStatusLive() {
  if (streamStatus) {
    streamStatus.textContent = "LIVE";
    streamStatus.className = "badge badge-live";
  }
}

// -----------------------------
// ADD ALERT
// -----------------------------
function addAlert(data) {
  if (!alertList) return;
  const li = document.createElement("li");
  li.className = "alert-item";
  li.innerHTML = `
    <div class="alert-main">
      <span>${data.alert}</span>
      <span class="alert-meta">${new Date().toLocaleTimeString()}</span>
    </div>
    <div class="alert-tag">Conf: ${(data.confidence ?? 0).toFixed(2)}</div>
  `;
  alertList.prepend(li);
  // keep list bounded for demo
  while (alertList.children.length > 40) alertList.removeChild(alertList.lastChild);
}

// -----------------------------
// INCIDENT ITEM
// -----------------------------
function addIncidentEntry(id, conf) {
  if (!incidentList) return;
  const li = document.createElement("li");
  li.className = "incident-item";
  const timeStr = new Date().toLocaleTimeString("en-IN");
  li.innerHTML = `
    <div class="incident-main">
      <span>🚨 Incident #${id}</span>
      <span class="incident-meta">Source: Simulated • Conf: ${conf}</span>
    </div>
    <span class="incident-link">Clip</span>
  `;
  incidentList.prepend(li);
  while (incidentList.children.length > 30) incidentList.removeChild(incidentList.lastChild);
}

// -----------------------------
// RISK CHART INIT / UPDATE
// -----------------------------
function initRiskChart(initial = []) {
  if (riskChart) return;
  const ctxEl = document.getElementById("risk-chart");
  if (!ctxEl) return;
  const ctx = ctxEl.getContext("2d");
  riskChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: initial.map((_, i) => i),
      datasets: [{
        label: "Risk Pulse",
        data: initial,
        borderColor: "#08f7fe",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 1 }, x: { display: false } }
    }
  });
}

function pushRiskValue(v) {
  if (!riskChart) initRiskChart(Array(10).fill(0.12));
  const arr = riskChart.data.datasets[0].data;
  arr.push(Math.max(0, Math.min(1, v)));
  if (arr.length > 40) arr.shift();
  riskChart.data.labels = arr.map((_, i) => i);
  if (typeof riskChart.update === "function") riskChart.update();
  if (elKpiRisk) elKpiRisk.textContent = v.toFixed(2);
}

// -----------------------------
// AGENT PULSE (visual small status)
// -----------------------------
function pulseAgent(index, text) {
  const card = agentCards[index];
  if (!card) return;
  const descEl = card.querySelector(".agent-desc");
  const dot = card.querySelector(".agent-dot");
  const originalDesc = descEl ? descEl.textContent : "";
  if (descEl) descEl.textContent = text;
  if (dot) {
    dot.style.boxShadow = "0 0 14px #08f7fe";
    dot.style.background = "#08f7fe";
  }
  setTimeout(() => {
    if (descEl) descEl.textContent = originalDesc;
    if (dot) {
      dot.style.boxShadow = "";
      dot.style.background = "";
    }
  }, 1200);
}

// -----------------------------
// SERVER STATUS SIMULATION
// -----------------------------
function startServerSimulation() {
  let phase = 0;
  setStatusIdle();
  clearInterval(simIntervals.server);
  simIntervals.server = setInterval(() => {
    phase = (phase + 1) % 6;
    if (phase === 1) {
      setStatusConnecting();
      overlayText.textContent = "Connecting to simulated server...";
    } else if (phase === 2) {
      setStatusLive();
      overlayText.textContent = "Simulated Stream";
    } else if (phase === 4) {
      setStatusConnecting();
      overlayText.textContent = "Reconnecting...";
    } else {
      setStatusLive();
      overlayText.textContent = "Simulated Stream";
    }
  }, 5000);
}

function stopServerSimulation() {
  clearInterval(simIntervals.server);
  setStatusIdle();
  overlayText.textContent = "Waiting for frames...";
}

// -----------------------------
// METRICS SIMULATION (KPI smoothing)
// -----------------------------
let metricsState = {
  cameras: 12,
  accidents_today: 0,
  avg_response_min: 4.3,
  risk_index: 0.32
};

function startMetricsSimulation() {
  clearInterval(simIntervals.metrics);
  simIntervals.metrics = setInterval(() => {
    metricsState.cameras = 10 + Math.round(2 * (0.6 + Math.random()));
    metricsState.avg_response_min = Math.max(1.5, (3 + Math.random() * 3).toFixed(1));
    metricsState.risk_index = Math.max(0, Math.min(0.95, (metricsState.risk_index + (Math.random() - 0.45) * 0.05)));
    if (elKpiCameras) elKpiCameras.textContent = metricsState.cameras;
    if (elKpiResponse) elKpiResponse.textContent = `${parseFloat(metricsState.avg_response_min).toFixed(1)} min`;
    metricsState.accidents_today = accidentCount;
    if (elKpiAccidents) elKpiAccidents.textContent = metricsState.accidents_today;
    pushRiskValue(metricsState.risk_index);
  }, 1800);
}

function stopMetricsSimulation() {
  clearInterval(simIntervals.metrics);
}

// -----------------------------
// FRAME PLAYBACK: extractFrames + fallback
// -----------------------------
async function extractFrames(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.src = URL.createObjectURL(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frames = [];

    video.addEventListener("loadedmetadata", () => {
      canvas.width = 480;
      canvas.height = 260;
      video.currentTime = 0;
    });

    // capture frames on timeupdate
    let lastTime = -1;
    video.addEventListener("timeupdate", () => {
      try {
        // avoid duplicates
        if (video.currentTime === lastTime) return;
        lastTime = video.currentTime;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));
      } catch (e) {}
      video.currentTime += 0.08; // ~12 FPS
      if (video.currentTime >= video.duration) {
        video.pause();
        resolve(frames.length ? frames : null);
      }
    });

    video.addEventListener("ended", () => {
      resolve(frames.length ? frames : null);
    });

    // try autoplay; if blocked we still attempt timeupdate captures
    video.play().catch(() => {
      // fallback: wait a bit then resolve (browser might not allow stepping)
      setTimeout(() => resolve(frames.length ? frames : null), 1500);
    });
  });
}

function startFramePlayback() {
  clearInterval(simIntervals.frames);
  if (demoFrames && demoFrames.length > 0) {
    simIntervals.frames = setInterval(() => {
      videoFeed.src = demoFrames[demoFrameIndex];
      demoFrameIndex = (demoFrameIndex + 1) % demoFrames.length;
    }, 80);
  } else {
    // Fallback synthetic motion (canvas)
    simIntervals.frames = setInterval(() => {
      const c = document.createElement("canvas");
      c.width = 480; c.height = 260;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#0b1b2b";
      ctx.fillRect(0, 0, c.width, c.height);
      fallbackMotionIndex = (fallbackMotionIndex + 6) % (c.width + 200);
      const x = fallbackMotionIndex - 100;
      for (let i = 0; i < 6; i++) {
        const carX = (x + i * 120) % (c.width + 200) - 60;
        ctx.fillStyle = `rgba(8,247,254,${0.08 + Math.abs(Math.sin((carX/200)+i))*0.7})`;
        ctx.fillRect((carX + c.width) % c.width, 80 + (i % 2) * 40, 40, 20);
      }
      videoFeed.src = c.toDataURL("image/jpeg");
    }, 90);
  }
}

function stopFramePlayback() {
  clearInterval(simIntervals.frames);
  demoFrameIndex = 0;
}

// -----------------------------
// ACCIDENT ORCHESTRATOR (multi-alert)
// -----------------------------
function triggerSimulatedAccident() {
  accidentCount++;
  metricsState.accidents_today = accidentCount;
  const id = accidentCount;
  const baseConf = (0.48 + Math.random() * 0.45).toFixed(2);

  addAlert({ alert: `🚨 Accident #${id} detected`, confidence: parseFloat(baseConf) });
  addIncidentEntry(id, baseConf);
  if (elKpiAccidents) elKpiAccidents.textContent = metricsState.accidents_today;

  const spike = Math.min(1, 0.6 + Math.random() * 0.35);
  pushRiskValue(spike);

  setTimeout(() => {
    addAlert({ alert: `⚡ Alert 1 sent (Ambulance) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.03).toFixed(2) });
    pulseAgent(2, "Dispatching Ambulance...");
  }, 900);

  setTimeout(() => {
    addAlert({ alert: `⚡ Alert 2 sent (Traffic Police) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.05).toFixed(2) });
    pulseAgent(1, "Notifying Traffic Police...");
  }, 1800);

  setTimeout(() => {
    addAlert({ alert: `⚡ Alert 3 sent (Control Room) for Accident #${id}`, confidence: (parseFloat(baseConf) + 0.07).toFixed(2) });
    pulseAgent(3, "Logging Incident...");
  }, 2600);
}

function startAccidentSimulation(freqMs = 9000) {
  clearInterval(simIntervals.accidents);
  setTimeout(() => {
    triggerSimulatedAccident();
    simIntervals.accidents = setInterval(() => {
      if (Math.random() < 0.75) triggerSimulatedAccident();
    }, freqMs);
  }, 1400);
}

function stopAccidentSimulation() {
  clearInterval(simIntervals.accidents);
}

// -----------------------------
// AGENT ACTIVITY SIMULATION
// -----------------------------
function startAgentSimulation() {
  clearInterval(simIntervals.agents);
  simIntervals.agents = setInterval(() => {
    const idx = Math.floor(Math.random() * Math.max(1, agentCards.length));
    const texts = [
      "Running inference...",
      "Updating risk models...",
      "Dispatching alerts...",
      "Coordinating agents...",
      "Analyzing frames..."
    ];
    const t = texts[Math.floor(Math.random() * texts.length)];
    pulseAgent(idx, t);
  }, 2200);
}
function stopAgentSimulation() {
  clearInterval(simIntervals.agents);
}

// -----------------------------
// RISK PULSE (micro updates)
// -----------------------------
function startPulseSimulation() {
  clearInterval(simIntervals.pulse);
  simIntervals.pulse = setInterval(() => {
    const current = parseFloat(elKpiRisk.textContent || "0.3") || 0.3;
    const v = Math.max(0, Math.min(1, (current + (Math.random() - 0.45) * 0.05)));
    pushRiskValue(v);
  }, 1200);
}
function stopPulseSimulation() {
  clearInterval(simIntervals.pulse);
}

// -----------------------------
// MASTER START / STOP SIM
// -----------------------------
function startSimulation() {
  if (simulationRunning) return;
  simulationRunning = true;

  // init chart baseline
  initRiskChart(Array.from({ length: 12 }, () => 0.12 + Math.random() * 0.05));

  startServerSimulation();
  startMetricsSimulation();
  startAgentSimulation();
  startPulseSimulation();
  startFramePlayback();
  startAccidentSimulation(8000); // accidents ~8s
  setTimeout(() => {
    setStatusLive();
    overlayText.textContent = "Simulated Stream";
  }, 800);
}

function stopSimulation() {
  simulationRunning = false;
  stopServerSimulation();
  stopMetricsSimulation();
  stopAgentSimulation();
  stopPulseSimulation();
  stopFramePlayback();
  stopAccidentSimulation();
  overlayText.textContent = "Simulation stopped";
}

// -----------------------------
// UI Wiring: Upload / Play / Disconnect / Live
// -----------------------------
const btnUpload = document.getElementById("btn-upload-video");
const btnPlay = document.getElementById("btn-play-video");
const btnDisconnect = document.getElementById("btn-disconnect");
const btnLive = document.getElementById("btn-connect-live");
const fileInput = document.getElementById("video-input");

if (btnUpload) {
  btnUpload.onclick = () => {
    if (fileInput) fileInput.click();
  };
}

if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    overlayText.textContent = "Extracting frames...";
    const frames = await extractFrames(file);
    if (frames && frames.length) {
      demoFrames = frames;
      demoFrameIndex = 0;
      overlayText.textContent = "Frames ready. Click Play Video or Live Camera.";
      alert("Video Ready ✔ Click 'Play Video' or 'Live Camera' to start simulation.");
    } else {
      demoFrames = [];
      overlayText.textContent = "Could not extract frames. Using synthetic fallback.";
      alert("Could not extract frames. Simulation will use fallback animation.");
    }
  });
}

if (btnPlay) {
  btnPlay.onclick = () => {
    if (!simulationRunning) startSimulation();
  };
}

// Live camera button will also start simulation (option 1 behavior)
if (btnLive) {
  btnLive.onclick = () => {
    if (!simulationRunning) startSimulation();
  };
}

if (btnDisconnect) {
  btnDisconnect.onclick = () => {
    stopSimulation();
    videoFeed.src = "";
    overlayText.textContent = "Waiting for frames...";
  };
}

// allow manual start/stop from console
window.startInquiSim = startSimulation;
window.stopInquiSim = stopSimulation;

// -----------------------------
// Auto-start for quick demo recordings (comment out if you don't want it)
// -----------------------------
setTimeout(() => {
  // auto-start demo; comment this block out if you prefer manual start
  if (!simulationRunning) startSimulation();
}, 600);
