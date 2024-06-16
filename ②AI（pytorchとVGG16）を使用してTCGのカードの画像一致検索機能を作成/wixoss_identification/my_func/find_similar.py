import torch
import os
from torch.utils.data import DataLoader, Dataset
from torchvision.models import resnet18
import numpy as np
import torchvision.transforms as transforms
from sklearn.metrics.pairwise import cosine_similarity 
from PIL import Image
import hashlib

class WixossDataset(Dataset):
    def __init__(self, directory, transform=None):
        self.directory = directory
        self.transform = transform
        self.images = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.jpg')]
        self.labels = self.generate_labels()
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        image_path = self.images[idx]
        image = Image.open(image_path).convert('RGB')
        if self.transform:
            image = self.transform(image)
        label = self.labels[idx]  # 正しいラベルを使用
        return image, label
    
    def generate_labels(self):
        labels = {}
        unique_label = 0

        for img_path in self.images:
            # ファイル名を取得
            filename = os.path.splitext(os.path.basename(img_path))[0]

            # ハッシュ値を生成
            hash_object = hashlib.md5(filename.encode())
            hash_digest = hash_object.hexdigest()

            # ハッシュ値をキーとしてラベルを割り当て
            if hash_digest not in labels:
                labels[hash_digest] = unique_label
                unique_label += 1
        
        # ラベル辞書を使用して各ファイルに一意なラベルを割り当て
        self.labels = [labels[hashlib.md5(os.path.splitext(os.path.basename(path))[0].encode()).hexdigest()] for path in self.images]
        return self.labels

def find_similar_images(target_directory, model, features, image_paths):
    transform = transforms.Compose([
        transforms.Resize((256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    target_dataset = WixossDataset(directory=target_directory, transform=transform)
    target_dataloader = DataLoader(target_dataset, batch_size=1, shuffle=False)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)

    results = {}

    with torch.no_grad():
        for inputs, paths in target_dataloader:
            inputs = inputs.to(device)
            output = model(inputs)
            sims = cosine_similarity(output.cpu().numpy(), features)

            # 市井のみ
            top_match = np.argmax(sims, axis=1)
            for i, path in enumerate(paths):
                matched_image = image_paths[top_match[i]]
                #matched_image = image_paths[top_match_index]
                results[path] = matched_image

    return results