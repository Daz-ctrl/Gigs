"""
Synthetic Indian Urban Cooperative Gig Demand Dataset Generator.
Captures seasonal patterns (e.g. Diwali electrical spikes, monsoon drainage, summer AC servicing).
"""
import numpy as np

ZONES = ["Zone 1 - South Delhi", "Zone 2 - West Delhi", "Zone 3 - Central Delhi"]
SERVICES = ["Electrician", "Plumber", "Caregiver", "AC Technician", "Carpenter"]
WEATHER_CONDITIONS = ["Clear", "Heavy Rain", "High Heatwave", "Mild"]

def generate_synthetic_training_data(n_samples=2500, random_seed=42):
    np.random.seed(random_seed)
    
    # Features:
    # 0: zone_idx (0, 1, 2)
    # 1: service_idx (0 to 4)
    # 2: hour_of_day (0 to 23)
    # 3: day_of_week (0 to 6, 5/6 = weekend)
    # 4: is_festival_season (0 or 1)
    # 5: weather_idx (0: Clear, 1: Rain, 2: Heatwave, 3: Mild)
    # 6: past_week_avg_bookings
    
    X = []
    y = []
    
    for _ in range(n_samples):
        zone_idx = np.random.randint(0, len(ZONES))
        service_idx = np.random.randint(0, len(SERVICES))
        hour = np.random.randint(7, 22) # active gig booking hours 7am - 10pm
        day = np.random.randint(0, 7)
        is_festive = np.random.choice([0, 1], p=[0.8, 0.2])
        weather_idx = np.random.choice([0, 1, 2, 3], p=[0.5, 0.2, 0.2, 0.1])
        past_week_avg = np.random.uniform(5.0, 30.0)
        
        # Base demand calculation
        base = past_week_avg * 0.6
        
        # Service & Season multipliers
        # Electrician (idx 0) surges during festivals & evenings
        if service_idx == 0:
            if is_festive:
                base *= 1.8
            if 17 <= hour <= 21:
                base *= 1.4
        
        # Plumber (idx 1) surges drastically during heavy rain (idx 1)
        elif service_idx == 1:
            if weather_idx == 1: # Heavy Rain
                base *= 2.2
            if 8 <= hour <= 12:
                base *= 1.3
                
        # Caregiver (idx 2) steady, slightly higher on weekends
        elif service_idx == 2:
            if day in [5, 6]:
                base *= 1.25
                
        # AC Technician (idx 3) surges in Heatwave (idx 2)
        elif service_idx == 3:
            if weather_idx == 2: # High Heatwave
                base *= 2.5
                
        # Weekend bump across all services
        if day in [5, 6]:
            base *= 1.15
            
        noise = np.random.normal(0, 1.5)
        demand = max(1, int(round(base + noise)))
        
        X.append([zone_idx, service_idx, hour, day, is_festive, weather_idx, past_week_avg])
        y.append(demand)
        
    return np.array(X), np.array(y)
