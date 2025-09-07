import tensorflow as tf

# --- Path to trained model ---
KERAS_MODEL_PATH = "waste_classifier_chobey.keras"
TFLITE_MODEL_PATH = "waste_classifier_chobey.tflite"

# --- Load model ---
print("Loading Keras model...")
model = tf.keras.models.load_model(KERAS_MODEL_PATH, compile=False)
print("✅ Loaded model successfully!")

# --- Convert to TFLite ---
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Optimization for Raspberry Pi (smaller, faster model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# If you want *float16 quantization* (smaller file, slightly less accurate, but faster on Pi):
# converter.target_spec.supported_types = [tf.float16]

tflite_model = converter.convert()

# --- Save TFLite model ---
with open(TFLITE_MODEL_PATH, "wb") as f:
    f.write(tflite_model)

print(f"✅ TFLite model saved as {TFLITE_MODEL_PATH}")
