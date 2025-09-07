import os
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# --- Paths ---
KERAS_MODEL_PATH = "waste_classifier_mobilenetv2_final.keras"
IMAGE_FOLDER = "sample_images"

# --- Class mapping ---
class_indices = {0: "hazardous", 1: "organic", 2: "recyclable"}

# --- Load model (skip compiling since we only need inference) ---
print("Loading model...")
model = load_model(KERAS_MODEL_PATH, compile=False)  # <-- key change
print("✅ Model loaded successfully!")

# --- Input size ---
IMG_HEIGHT, IMG_WIDTH = 224, 224

def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# --- Predict all images ---
for img_file in os.listdir(IMAGE_FOLDER):
    img_path = os.path.join(IMAGE_FOLDER, img_file)
    if not img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
        continue

    img_array = preprocess_image(img_path)
    preds = model.predict(img_array, verbose=0)
    pred_class = class_indices[np.argmax(preds)]
    confidence = float(np.max(preds))
    print(f"{img_file} → Predicted: {pred_class} (Confidence: {confidence:.3f})")



