import os

dataset_dir = "waste_dataset"

# Loop through train, val, test
for split in ["train", "val", "test"]:
    print(f"\n📂 {split.upper()} DATASET")
    split_dir = os.path.join(dataset_dir, split)
    
    # Loop through each class
    for class_name in os.listdir(split_dir):
        class_dir = os.path.join(split_dir, class_name)
        if os.path.isdir(class_dir):
            n_images = len([
                f for f in os.listdir(class_dir) 
                if f.lower().endswith((".jpg", ".jpeg", ".png"))
            ])
            print(f"   {class_name}: {n_images} images")
