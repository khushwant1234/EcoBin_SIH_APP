import os, shutil, random

train_dir = "waste_dataset/train"
val_dir = "waste_dataset/val"
classes = ["organic", "recyclable", "hazardous"]

# Create val folders
for cls in classes:
    os.makedirs(os.path.join(val_dir, cls), exist_ok=True)

# Move 20% from train → val
for cls in classes:
    src = os.path.join(train_dir, cls)
    dst = os.path.join(val_dir, cls)

    files = os.listdir(src)
    random.shuffle(files)

    n_val = int(0.2 * len(files))
    val_files = files[:n_val]

    for f in val_files:
        shutil.move(os.path.join(src, f), os.path.join(dst, f))

print("✅ Validation split created (20% of training moved).")
