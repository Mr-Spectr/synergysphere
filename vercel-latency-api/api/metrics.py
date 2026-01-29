from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import json
import statistics
import numpy as np

app = FastAPI()

# Enable CORS for POST from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Load telemetry data
with open("q-vercel-latency.json", "r") as f:
    telemetry = json.load(f)

@app.post("/")
async def metrics(payload: dict):
    regions = payload["regions"]
    threshold = payload["threshold_ms"]

    response = {}

    for region in regions:
        rows = [r for r in telemetry if r["region"] == region]

        latencies = [r["latency_ms"] for r in rows]
        uptimes = [r["uptime_pct"] for r in rows]

        response[region] = {
            "avg_latency": statistics.mean(latencies),
            "p95_latency": float(np.percentile(latencies, 95)),
            "avg_uptime": statistics.mean(uptimes),
            "breaches": sum(1 for l in latencies if l > threshold),
        }

    return response

# 👇 THIS is what Vercel calls
handler = Mangum(app)
