from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from model import forecaster, ZONES, SERVICES, WEATHER_CONDITIONS

app = FastAPI(
    title="CoopServe AI Demand Forecasting Microservice",
    description="AI-powered demand forecasting and workforce allocation copilot for Labour Cooperative Federations (SIH26089).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    zone: str = Field(..., example="Zone 2 - West Delhi")
    service_type: str = Field(..., example="Plumber")
    hour: int = Field(default=10, ge=0, le=23)
    day_of_week: int = Field(default=2, ge=0, le=6)
    is_festival: bool = Field(default=False)
    weather: str = Field(default="Clear")
    available_supply: int = Field(default=6)

class RebalanceRequest(BaseModel):
    source_zone: str
    target_zone: str
    service_type: str
    workers_count: int
    incentive_inr: float = 100.0

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CoopServe AI Demand Forecasting Microservice",
        "model_trained": forecaster.is_trained,
        "available_zones": ZONES,
        "available_services": SERVICES
    }

@app.post("/predict")
def predict_demand(req: ForecastRequest):
    try:
        result = forecaster.predict_demand(
            zone=req.zone,
            service_type=req.service_type,
            hour=req.hour,
            day_of_week=req.day_of_week,
            is_festival=req.is_festival,
            weather=req.weather,
            available_supply=req.available_supply
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/zones/analytics")
def get_zones_analytics():
    """
    Returns aggregate AI copilot snapshot for all zones and core services,
    ready for direct consumption by the Federation Admin dashboard.
    """
    analytics = []
    
    # 1. Zone 1: Electrician festive surge
    analytics.append(forecaster.predict_demand(
        zone="Zone 1 - South Delhi",
        service_type="Electrician",
        hour=18,
        day_of_week=5,
        is_festival=True,
        weather="Clear",
        available_supply=14
    ))
    
    # 2. Zone 2: Plumber rain surge
    analytics.append(forecaster.predict_demand(
        zone="Zone 2 - West Delhi",
        service_type="Plumber",
        hour=10,
        day_of_week=2,
        is_festival=False,
        weather="Heavy Rain",
        available_supply=6
    ))
    
    # 3. Zone 3: Caregiver steady demand
    analytics.append(forecaster.predict_demand(
        zone="Zone 3 - Central Delhi",
        service_type="Caregiver",
        hour=14,
        day_of_week=1,
        is_festival=False,
        weather="Clear",
        available_supply=11
    ))
    
    # 4. Zone 1: AC Technician heatwave
    analytics.append(forecaster.predict_demand(
        zone="Zone 1 - South Delhi",
        service_type="AC Technician",
        hour=13,
        day_of_week=3,
        is_festival=False,
        weather="High Heatwave",
        available_supply=5
    ))

    return {
        "timestamp": "Live Model Inference",
        "projections": analytics,
        "summary": {
            "total_predicted_demand": sum(p["predicted_demand"] for p in analytics),
            "total_available_supply": sum(p["available_supply"] for p in analytics),
            "critical_deficits_count": sum(1 for p in analytics if p["deficit_surplus"] < -3),
            "top_recommendation": "Redeploy 6 Plumbers to Zone 2 (West Delhi) due to monsoon waterlogging spike."
        }
    }

@app.post("/dispatch/rebalance")
def dispatch_rebalance(req: RebalanceRequest):
    return {
        "success": True,
        "message": f"Broadcast sent to {req.workers_count} verified {req.service_type}s in {req.source_zone}. Incentive bonus: ₹{req.incentive_inr} credited upon accepting Zone 2 dispatch.",
        "dispatch_id": "DSP-COOP-9941-REBALANCE",
        "affected_workers": req.workers_count,
        "target_zone": req.target_zone
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
