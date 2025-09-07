# balanced_sequence.py
import os, random
import numpy as np
from tensorflow.keras.utils import Sequence
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

class BalancedSequence(Sequence):
    def __init__(self, base_dir, classes, batch_size=32, img_size=(224,224), shuffle=True, max_per_class=None):
        self.base_dir = base_dir
        self.classes = classes
        self.batch_size = batch_size
        self.img_size = img_size
        self.shuffle = shuffle
        self.max_per_class = max_per_class

        # gather files per class
        self.filepaths = {}
        for c in classes:
            p = os.path.join(base_dir, c)
            files = [os.path.join(p, f) for f in os.listdir(p) if f.lower().endswith(('.jpg','.jpeg','.png'))]
            if max_per_class and len(files) > max_per_class:
                random.shuffle(files)
                files = files[:max_per_class]
            self.filepaths[c] = files

        # ensure non-empty
        for c, v in self.filepaths.items():
            if len(v) == 0:
                raise ValueError(f"No files found for class {c} in {base_dir}")

        total = sum(len(v) for v in self.filepaths.values())
        self.steps = max(1, total // batch_size)

    def __len__(self):
        return self.steps

    def on_epoch_end(self):
        if self.shuffle:
            for c in self.classes:
                random.shuffle(self.filepaths[c])

    def __getitem__(self, idx):
        per_class = max(1, self.batch_size // len(self.classes))
        X, y = [], []
        for i, c in enumerate(self.classes):
            files = self.filepaths[c]
            start = (idx * per_class) % len(files)
            picks = [files[(start + j) % len(files)] for j in range(per_class)]
            for p in picks:
                img = load_img(p, target_size=self.img_size)
                arr = img_to_array(img)
                arr = preprocess_input(arr)
                X.append(arr)
                lab = np.zeros(len(self.classes)); lab[i] = 1
                y.append(lab)
        X = np.array(X); y = np.array(y)
        if len(X) > self.batch_size:
            X = X[:self.batch_size]; y = y[:self.batch_size]
        elif len(X) < self.batch_size:
            reps = self.batch_size - len(X)
            X = np.vstack([X, X[:reps]])
            y = np.vstack([y, y[:reps]])
        return X, y
