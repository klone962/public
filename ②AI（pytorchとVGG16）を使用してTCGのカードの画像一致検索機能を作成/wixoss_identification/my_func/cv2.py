import cv2
import torch
import os
from torch.utils.data import DataLoader, Dataset
from torchvision.models import resnet18
import numpy as np
import torchvision.transforms as transforms
from sklearn.metrics.pairwise import cosine_similarity 
from slack_sdk import WebClient
from PIL import Image
from collections import Counter
import hashlib
import pandas as pd

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



model = resnet18(pretrained=False)  # 新しいモデルインスタンスを作成
model.fc = torch.nn.Linear(model.fc.in_features, 8769)
model.load_state_dict(torch.load('C:\\py_project\\similar_wixoss_card\\card_image\\model\\resnet18_model.pth'))  # 重みをロード
model.eval()  # 推論モードに設定

# カメラの設定
cap = cv2.VideoCapture(0)

# 検出結果を格納する辞書
results = {}

try:
    while True:
        # カメラから映像を取得
        ret, frame = cap.read()

        if not ret:
            break

        


        # カードを検出し、ファイル名を取得（仮の処理）
        # ここで、カードの検出と類似画像検索を行う
        detected_card_filename = "detected_card.jpg"  # 仮のファイル名

        # 検出結果を更新
        if detected_card_filename in results:
            results[detected_card_filename] += 1
        else:
            results[detected_card_filename] = 1

        # 検出結果を映像に表示
        cv2.imshow('frame', frame)

        # 'q'を押して終了
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    cap.release()
    cv2.destroyAllWindows()

    # 結果をCSVに保存
    pd.DataFrame(list(results.items()), columns=['FileName', 'Count']).to_csv('results.csv', index=False)


