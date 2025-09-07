# train_v2_final_colab.py (Colab cell)
import os, numpy as np, tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint, CSVLogger
from balanced_sequence import BalancedSequence
from focal_loss import focal_loss

# params
IMG_SIZE = (224,224)
BATCH_SIZE = 32
EPOCHS_STAGE1 = 6
EPOCHS_STAGE2 = 4

TRAIN_DIR = "waste_dataset/train"
VAL_DIR = "waste_dataset/val"
TEST_DIR = "waste_dataset/test"

# val/test generators (use preprocess_input)
val_datagen = tf.keras.preprocessing.image.ImageDataGenerator(preprocessing_function=preprocess_input)
val_gen = val_datagen.flow_from_directory(VAL_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE, class_mode="categorical", shuffle=False)
test_gen = val_datagen.flow_from_directory(TEST_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE, class_mode="categorical", shuffle=False)

classes = list(val_gen.class_indices.keys())
print("Classes order:", classes)

# Balanced training sequence (you may set max_per_class to cap any huge class; None uses all files)
train_seq = BalancedSequence(TRAIN_DIR, classes, batch_size=BATCH_SIZE, img_size=IMG_SIZE, shuffle=True, max_per_class=None)

# Model
base = MobileNetV2(input_shape=(224,224,3), include_top=False, weights="imagenet", pooling='avg')
base.trainable = False
inputs = tf.keras.Input(shape=(224,224,3))
x = base(inputs, training=False)
x = layers.Dense(256, activation='relu')(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(len(classes), activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

# callbacks
callbacks = [
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1),
    EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True, verbose=1),
    ModelCheckpoint("best_v2_balanced_colab.keras", monitor='val_loss', save_best_only=True, verbose=1),
    CSVLogger("training_v2_balanced_colab.csv")
]

# Stage 1: head training with focal loss
model.compile(optimizer=tf.keras.optimizers.Adam(1e-4),
              loss=focal_loss(gamma=2.0, alpha=0.25),
              metrics=['accuracy'])

print("Stage 1: training head...")
model.fit(train_seq, validation_data=val_gen, epochs=EPOCHS_STAGE1, callbacks=callbacks)

# Stage 2: unfreeze last layers
print("Stage 2: fine-tuning last layers...")
base.trainable = True
for layer in base.layers[:-30]:
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
              loss=focal_loss(gamma=2.0, alpha=0.25),
              metrics=['accuracy'])

model.fit(train_seq, validation_data=val_gen, epochs=EPOCHS_STAGE2, callbacks=callbacks)

# Evaluate
loss, acc = model.evaluate(test_gen, verbose=1)
print("Test loss, acc:", loss, acc)

# save final
model.save("waste_classifier_mobilenetv2_final.keras")
print("Saved final model: waste_classifier_mobilenetv2_final.keras")
