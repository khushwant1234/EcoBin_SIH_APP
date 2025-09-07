import os
import numpy as np
from PIL import Image
import tensorflow as tf

# --- Paths ---
TFLITE_MODEL_PATH = "waste_classifier_chobey.tflite"
IMAGE_FOLDER = "sample_images"

# --- Class mapping (same order as training) ---
class_indices = {1: "hazardous", 2: "organic", 3: "recyclable"}

# --- Load TFLite model ---
print("Loading TFLite model...")
interpreter = tf.lite.Interpreter(model_path=TFLITE_MODEL_PATH)
interpreter.allocate_tensors()
print("✅ TFLite model loaded successfully!")

# --- Get input & output details ---
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
IMG_HEIGHT, IMG_WIDTH = input_details[0]['shape'][1], input_details[0]['shape'][2]

# --- Helper: Preprocess image ---
def preprocess_image(image_path):
    img = Image.open(image_path).convert('RGB')
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# --- Predict all images ---
for img_file in os.listdir(IMAGE_FOLDER):
    if not img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
        continue

    img_path = os.path.join(IMAGE_FOLDER, img_file)
    img_array = preprocess_image(img_path)

    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], img_array)

    # Run inference
    interpreter.invoke()

    # Get prediction
    preds = interpreter.get_tensor(output_details[0]['index'])[0]
    pred_class = class_indices[np.argmax(preds)]
    confidence = float(np.max(preds))

    print(f"{img_file} → Predicted: {pred_class} (Confidence: {confidence:.3f})")
