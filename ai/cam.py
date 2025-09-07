import os
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import datetime

# --- Paths ---
TFLITE_MODEL_PATH = "waste_classifier_chobey.tflite"
SAVE_FOLDER = "captured_images"  # Folder to save captured images

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

# --- Ensure save folder exists ---
os.makedirs(SAVE_FOLDER, exist_ok=True)

# --- Helper: Preprocess OpenCV frame ---
def preprocess_frame(frame):
    img = cv2.resize(frame, (IMG_WIDTH, IMG_HEIGHT))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# --- Open webcam ---
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Could not open webcam.")
    exit()

print("📷 Press ENTER to capture an image, or 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame.")
        break

    # Show live video feed
    cv2.imshow("Live Feed - Press ENTER to Capture", frame)

    key = cv2.waitKey(1) & 0xFF

    # Quit if 'q' is pressed
    if key == ord('q'):
        break

    # Capture if ENTER (keycode 13) is pressed
    elif key == 13:
        print("📸 Capturing image...")
        img_array = preprocess_frame(frame)

        # Run inference
        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()
        preds = interpreter.get_tensor(output_details[0]['index'])[0]

        # Get result
        pred_class = class_indices[np.argmax(preds)]
        confidence = float(np.max(preds))

        # Display prediction on image
        label = f"{pred_class} ({confidence:.2f})"
        print(f"✅ Prediction: {label}")

        annotated_frame = frame.copy()
        cv2.putText(annotated_frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 255, 0), 2, cv2.LINE_AA)

        # Save image
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{pred_class}_{timestamp}.jpg"
        filepath = os.path.join(SAVE_FOLDER, filename)
        cv2.imwrite(filepath, annotated_frame)
        print(f"💾 Image saved as: {filepath}")

        # Show captured + labeled image
        cv2.imshow("Captured Image", annotated_frame)
        cv2.waitKey(1000)  # Display for 1 second

# Cleanup
cap.release()
cv2.destroyAllWindows()
