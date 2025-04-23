from fastapi import APIRouter, HTTPException, Depends
import joblib
import pandas as pd
from datetime import datetime
from .models import PredictionRequest, PredictionRequest2
from .database import load_db, save_db
from .auth import create_access_token  # Reusing authentication

router = APIRouter()

# Load models
model_site = joblib.load("model/random_forest_site.pkl")
model_habitat = joblib.load("model/random_forest_habitat.pkl")
best_xgb_reg = joblib.load("model/xgboost_fish_shoal.pkl")
label_mappings = joblib.load("model/label_mappings.pkl")

@router.post("/predict")
def predict_fish_population(request: PredictionRequest):
    try:
        day_of_year = datetime.strptime(request.date, "%Y-%m-%d").timetuple().tm_yday
        
        if request.location not in label_mappings['location']:
            raise HTTPException(status_code=400, detail=f"Location '{request.location}' not recognized")
        
        encoded_location = label_mappings['location'][request.location]
        
        # Predict Site
        site_pred = model_site.predict(pd.DataFrame([[encoded_location, day_of_year]], 
                                                    columns=['location', 'day_of_year']))[0]
        site_label = {v: k for k, v in label_mappings['site'].items()}.get(site_pred, "Unknown Site")
        
        # Predict Habitat
        habitat_pred = model_habitat.predict(pd.DataFrame([[encoded_location, day_of_year, site_pred]], 
                                                           columns=['location', 'day_of_year', 'site']))[0]
        habitat_label = {v: k for k, v in label_mappings['habitat'].items()}.get(habitat_pred, "Unknown Habitat")
        
        # Predict Number of Fish Shoals
        fish_shoal_pred = best_xgb_reg.predict(pd.DataFrame([[encoded_location, day_of_year, site_pred, habitat_pred]], 
                                                             columns=['location', 'day_of_year', 'site', 'habitat']))[0]
        
        prediction_result = {
            "location": request.location,
            "date": request.date,
            "predicted_site": site_label,
            "predicted_habitat": habitat_label,
            "predicted_number_of_fish_shoals": round(float(fish_shoal_pred), 2)
        }
        
        # Save prediction in JSON database
        db = load_db()
        db["predictions"].append(prediction_result)
        save_db(db)

        return prediction_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/predict2")
def predict_fish_population_v2(request: PredictionRequest2):
    try:
        day_of_year = datetime.strptime(request.date, "%Y-%m-%d").timetuple().tm_yday

        if request.location not in label_mappings['location']:
            raise HTTPException(status_code=400, detail=f"Location '{request.location}' not recognized")

        if request.site not in label_mappings['site']:
            raise HTTPException(status_code=400, detail=f"Site '{request.site}' not recognized")

        encoded_location = label_mappings['location'][request.location]
        encoded_site = label_mappings['site'][request.site]

        # Predict Habitat
        habitat_pred = model_habitat.predict(pd.DataFrame(
            [[encoded_location, day_of_year, encoded_site]],
            columns=['location', 'day_of_year', 'site']
        ))[0]

        habitat_label = {v: k for k, v in label_mappings['habitat'].items()}.get(habitat_pred, "Unknown Habitat")

        # Predict Number of Fish Shoals
        fish_shoal_pred = best_xgb_reg.predict(pd.DataFrame(
            [[encoded_location, day_of_year, encoded_site, habitat_pred]],
            columns=['location', 'day_of_year', 'site', 'habitat']
        ))[0]

        prediction_result = {
            "location": request.location,
            "date": request.date,
            "input_site": request.site,
            "predicted_habitat": habitat_label,
            "predicted_number_of_fish_shoals": round(float(fish_shoal_pred), 2)
        }

        # Save prediction
        db = load_db()
        db["predictions"].append(prediction_result)
        save_db(db)

        return prediction_result

    except Exception as e:
        import traceback
        traceback.print_exc()  # Log full error in terminal
        raise HTTPException(status_code=500, detail=str(e))