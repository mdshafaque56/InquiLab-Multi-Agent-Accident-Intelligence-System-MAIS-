# **InquiLab – AI Accident Intelligence Platform**

InquiLab is a modular, agent-driven accident detection and emergency automation system built for real-time monitoring of Indian roads.
It integrates computer vision, event prediction, risk analytics, and automatic alert dispatch, offering a complete control-room-grade workflow.

---

## **Table of Contents**

* [Overview](#overview)
* [Key Features](#key-features)
* [System Architecture](#system-architecture)
* [Directory Structure](#directory-structure)
* [Technology Stack](#technology-stack)
* [Backend Services](#backend-services)
* [Frontend (Dashboard)](#frontend-dashboard)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [API & WebSocket Endpoints](#api--websocket-endpoints)
* [Accident Workflow Pipeline](#accident-workflow-pipeline)
* [Demo Mode](#demo-mode)
* [Future Enhancements](#future-enhancements)
* [Author](#author)

---
<img width="1343" height="583" alt="image" src="https://github.com/user-attachments/assets/3e94aced-136c-4374-b51d-948a2d319eb5" />
<img width="1347" height="596" alt="image" src="https://github.com/user-attachments/assets/9ad9cc72-7d95-4303-b8f5-7b685e396d2b" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/54159653-b83f-433d-b16a-d27b957c80be" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/58de2e5d-6189-4ab0-ab37-bcd990d09689" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/178ed55b-0920-4bb4-bdcb-42b7a470eb9a" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/c4801c04-2520-42d6-bdd6-7a4bb31f927d" />

---
# **Overview**

InquiLab is designed to simulate or perform real accident detection using a multi-agent AI system.
It includes:

* A **FastAPI backend** for real-time video inference, accident prediction, and alert dispatch.
* A **control-room dashboard** for real-time event monitoring, alerts, incidents, and KPIs.
* A **multi-agent pipeline** responsible for modular processing similar to AGI task behavior.

The system runs in two modes:

1. **Real Mode** – YOLO + OpenCV inference for actual CCTV/Video input
2. **Demo Mode** – Fully simulated UI without a backend

---

# **Key Features**

### **Accident Detection**

* YOLOv8 vehicle detection
* Collision, anomaly, and sudden motion detection
* Multi-frame velocity and displacement modeling

### **Agent-Based AI Pipeline**

* VisionAgent – Object detection
* AnomalyAgent – Abnormal motion inference
* FusionAgent – Combined confidence score
* CollisionAgent – Accident confirmation
* PredictionAgent – Severity & risk scoring
* CommunicationAgent – Automated alert sending
* OrchestrationAgent – Multi-agent coordinator

### **Real-Time Monitoring**

* WebSocket-based instant video streaming
* Live inference visualization
* Alerts (Alert 1 / Alert 2 / Alert 3)
* Auto-updating KPIs
* Risk pulse animation chart

### **Incident Management**

* Automatic evidence clipping
* Incident timeline record
* Downloadable recorded events

---

# **System Architecture**

```
Camera / Video Stream
      |
      ↓
VisionAgent → AnomalyAgent → FusionAgent → CollisionAgent
                     ↓                    ↓
             PredictionAgent → CommunicationAgent
                     ↓
              Control Room Dashboard
```

---

# **Directory Structure**

```
InquiLab - Copy (2)
├── .vscode/
├── backend/
│   ├── app/
│   │   ├── agents/               # AI processing agents
│   │   ├── database/             # Incident storage
│   │   ├── ml_models/
│   │   │   └── yolo/             # YOLO model weights/configs
│   │   ├── models/               # Pydantic models
│   │   ├── routes/               # REST + WebSocket endpoints
│   │   ├── services/             # Accident, metrics, analytics logic
│   │   ├── static/               # Static assets
│   │   ├── templates/            # Template HTML (optional)
│   │   ├── utils/                # Helper utilities
│   ├── data/
│   │   └── incidents/            # Stored incident clips
│   ├── tests/                    # Unit tests
│
├── data/
│   ├── annotations/              # Training annotation sets
│   ├── arvt/                     # ARVT simulation dataset
│   ├── arvt_jobs/                # Processing logs/jobs
│   ├── datasets/                 # Dataset collection
│   ├── incidents/                # Exported incident library
│   └── sample_videos/            # Demo/Simulation videos
│
├── docker/                       # Deployment configs
├── docs/
│   ├── architecture/             # Diagrams and architecture blueprints
│   ├── reports/                  # Research/Documentation
│   └── workflow-diagrams/        # Accident pipeline diagrams
│
├── frontend/
│   └── assets/                   # CSS, JS, images, UI components
│
└── scripts/                      # Automation & dataset scripts
```

---

# **Technology Stack**

### **Backend**

* Python
* FastAPI
* OpenCV
* Ultralytics YOLOv8
* Pydantic
* WebSockets

### **Frontend**

* HTML + CSS (**Neon Control Room UI**)
* JavaScript
* Chart.js
* WebSocket Client

### **Infrastructure**

* Local / Cloud Deployable
* Docker Support
* Modular Microservice Architecture

---

# **Backend Services**

### **1. Accident Detection Service**

* Frame ingestion
* YOLO model inference
* Impact + anomaly confidence scoring
* Agent voting-based confirmation

### **2. Metrics Service**

* Real-time KPI updates
* Risk assessment calculations
* Camera online/offline tracking

### **3. Incident Service**

* Video snippet saving
* Evidence metadata tracking
* Incident history retrieval

### **4. WebSocket Streaming**

* `/detect/stream` → real-time webcam/CCTV
* `/detect/video` → uploaded video analysis

---

# **Frontend (Dashboard)**

### **Control Room Features**

* Live video monitoring
* Real-time detection alerts
* KPI analytics cards
* Risk movement graph
* Incident timeline
* File upload simulation mode

### **Pages**

```
index.html        → Entry page with animated splash screen
dashboard.html    → Full dashboard real-time monitoring and control
```

---

# **Installation**

### **1. Clone Repository**

```bash
git clone https://github.com/mdshafaque56/InquiLab-Multi-Agent-Accident-Intelligence-System-MAIS-.git
cd InquiLab
```

### **2. Create Virtual Environment**

```bash
python -m venv venv
venv/Scripts/activate   # Windows
source venv/bin/activate  # macOS/Linux
```

### **3. Install dependencies**

```bash
pip install -r backend/requirements.txt
```

---

# **Running the Project**

### **Start Backend**

```bash
uvicorn backend.app.main:app --reload
```

### **Run Frontend**

Open the dashboard:

```
frontend/index.html
```

---

# **API & WebSocket Endpoints**

### **REST**

| Endpoint         | Method | Description   |
| ---------------- | ------ | ------------- |
| `/detect/upload` | POST   | Upload video  |
| `/api/metrics`   | GET    | KPI metrics   |
| `/api/incidents` | GET    | Incident data |

### **WebSocket**

| Endpoint                            | Description         |
| ----------------------------------- | ------------------- |
| `ws://localhost:8000/detect/stream` | Real-time CCTV      |
| `ws://localhost:8000/detect/video`  | Video upload stream |

---

# **Accident Workflow Pipeline**

```
1. VisionAgent detects objects
2. AnomalyAgent evaluates abnormal motion
3. FusionAgent merges signals
4. CollisionAgent confirms accident
5. PredictionAgent determines severity
6. CommunicationAgent sends alerts
     - Alert 1: Ambulance
     - Alert 2: Police
     - Alert 3: Control Room
7. Dashboard updates timeline + KPIs
```

---

# **Demo Mode**

### Runs without backend:

* Sample video streaming
* Accident detection simulation
* Alerts sequence
* KPI animations
* Incident timeline growth

### Best use cases:

* Hackathons
* Investor demos
* Presentations
* Testing without compute

---

# **Future Enhancements**

* Geospatial accident heatmaps
* Drone-integrated monitoring
* LSTM crash sequence prediction
* Vehicle Re-Identification model
* Reinforcement emergency path routing
* WhatsApp Business API alerts
* Multi-camera stitching fusion AI

---

# **Author**

**Md Shafaque**
*NIT Calicut*
AI • Computer Vision • Machine Learning

**Md Shish**
*SaIT Bangalore*
Software Engineering • ML

---

### 🚀 InquiLab – *Revolutionizing Road Safety with AI*
