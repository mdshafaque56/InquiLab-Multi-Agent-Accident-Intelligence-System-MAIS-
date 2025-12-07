from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import uuid, os, shutil
import time

router = APIRouter(prefix="/api/arvt", tags=["ARVT"])

BASE_DIR = os.path.abspath("data/arvt")
os.makedirs(BASE_DIR, exist_ok=True)

# In-memory job store
JOBS = {}

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())

    # create job folder
    job_dir = os.path.join(BASE_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    # save video
    video_path = os.path.join(job_dir, file.filename)
    with open(video_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # register job
    JOBS[job_id] = {
        "status": "queued",
        "video": video_path,
        "overlay_video": None,
        "csv": None
    }

    # Simulate processing (real pipeline will run later)
    # For now, mark job as finished after 3 seconds
    time.sleep(1)
    JOBS[job_id]["status"] = "processing"

    # Create dummy results
    dummy_csv = os.path.join(job_dir, "trajectories.csv")
    dummy_vid = os.path.join(job_dir, "overlay.mp4")

    # Write a fake CSV
    with open(dummy_csv, "w") as f:
        f.write("Vehicle_ID,Frame_No,Speed_pxps\n1,10,4.2\n1,20,5.1\n2,15,3.8")

    # Create an empty fake overlay video
    open(dummy_vid, "wb").close()

    JOBS[job_id]["status"] = "finished"
    JOBS[job_id]["csv"] = dummy_csv
    JOBS[job_id]["overlay_video"] = dummy_vid

    return {"job_id": job_id, "status": "queued"}

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return {"status": "not_found"}
    return {"status": job["status"]}

@router.get("/results/{job_id}")
async def get_results(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return {"error": "not_found"}

    return {
        "files": {
            "trajectories_csv": job["csv"].replace("\\", "/"),
            "overlay_video": job["overlay_video"].replace("\\", "/")
        }
    }

