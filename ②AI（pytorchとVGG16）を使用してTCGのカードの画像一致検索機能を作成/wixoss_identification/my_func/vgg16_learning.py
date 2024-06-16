import torch
import torchvision.transforms as transforms
from torchvision.models import vgg16
from torch.utils.data import DataLoader, Dataset
from PIL import Image
import os
import numpy as np
import torch.nn as nn
import torch.optim as optim
from torch.utils.data.dataset import random_split
import hashlib
import datetime
import time

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
data_path = os.path.join(parent_dir, 'data', 'log')

class WixossDataset(Dataset):
    def __init__(self, directory, transform=None):
        self.root_dir = directory  # 変数名を変更
        self.transform = transform
        self.images = []
        self.labels = []
        self.label_dict = {}
        
        # ディレクトリを再帰的に走査して画像ファイルを見つける
        self._load_images_recursively(directory)  # 変更: root_dir -> directory

    def _load_images_recursively(self, current_dir):
        # 現在のディレクトリの内容を走査
        for entry in os.listdir(current_dir):
            entry_path = os.path.join(current_dir, entry)
            if os.path.isdir(entry_path):
                # ディレクトリの場合は再帰的に探索
                self._load_images_recursively(entry_path)
            elif entry.endswith('.jpg'):
                # 親ディレクトリ名をラベルとして使用
                parent_dir = os.path.basename(current_dir)
                if parent_dir not in self.label_dict:
                    self.label_dict[parent_dir] = len(self.label_dict)
                self.images.append(entry_path)
                self.labels.append(self.label_dict[parent_dir])

    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        image_path = self.images[idx]
        image = Image.open(image_path).convert('RGB')
        if self.transform:
            image = self.transform(image)
        label = self.labels[idx]
        return image, label

def vgg16_train_model(dataset_directory, epochs=10):
    # verの都合で使用できない
    # weights = vgg16_Weights.IMAGENET1K_V1 
    # model = vgg16(weights=weights)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    #device = torch.device('cpu')
    model = vgg16(pretrained=True)

    # 事前学習済みの重みを固定する
    for param in model.parameters():
        param.requires_grad = False

    num_ftrs = model.classifier[6].in_features
    model.classifier[6] = nn.Linear(num_ftrs, 8988) # 出力層を8769クラスに変更

    model = model.to(device)
    
    transform = transforms.Compose([
        #750 1047
        transforms.Resize((256)),    # VGG16に合わせてサイズを変更
        transforms.CenterCrop(224),  # 中央から224x224を切り取る
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(20),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    dataset = WixossDataset(directory=dataset_directory, transform=transform)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=False)

    criterion = nn.CrossEntropyLoss()  # 損失関数の定義
    optimizer = optim.Adam(model.classifier[6].parameters(), lr=0.001)  # オプティマイザの定義

    # データセットを訓練用と検証用に分割
    dataset_size = len(dataset)
    val_size = int(dataset_size * 0.2)  # データセットの20%を検証用に使用
    train_size = dataset_size - val_size

    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    # DataLoaderを作成
    train_dataloader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_dataloader = DataLoader(val_dataset, batch_size=16, shuffle=False)

    #評価
    train(model, dataloader, criterion, optimizer, device, train_dataloader, val_dataloader, epochs)

    # 特徴ベクトルの計算を行うために評価モードに切り替え
    model.eval()
    # データセット全体を通しての特徴ベクトルを計算
    features = []

    with torch.no_grad():
        for inputs, _ in dataloader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            features.append(outputs.cpu().numpy())
            
    features = np.concatenate(features, axis=0)

    return model, features, dataset.images

def re_vgg16_train_model(re_model, dataset_directory, epochs=10):
    # verの都合で使用できない
    # weights = vgg16_Weights.IMAGENET1K_V1 
    # model = vgg16(weights=weights)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = re_model

    model = model.to(device)
    
    transform = transforms.Compose([
        #750 1047
        transforms.Resize((256)),    # VGG16に合わせてサイズを変更
        transforms.CenterCrop(224),  # 中央から224x224を切り取る
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(20),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    dataset = WixossDataset(directory=dataset_directory, transform=transform)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=False)

    criterion = nn.CrossEntropyLoss()  # 損失関数の定義
    optimizer = optim.Adam(model.classifier[6].parameters(), lr=0.001)  # オプティマイザの定義

    # データセットを訓練用と検証用に分割
    dataset_size = len(dataset)
    val_size = int(dataset_size * 0.2)  # データセットの20%を検証用に使用
    train_size = dataset_size - val_size

    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

    # DataLoaderを作成
    train_dataloader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_dataloader = DataLoader(val_dataset, batch_size=16, shuffle=False)

    #評価
    train(model, dataloader, criterion, optimizer, device, train_dataloader, val_dataloader, epochs)

    # 特徴ベクトルの計算を行うために評価モードに切り替え
    model.eval()
    # データセット全体を通しての特徴ベクトルを計算
    features = []

    with torch.no_grad():
        for inputs, _ in dataloader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            features.append(outputs.cpu().numpy())
            
    features = np.concatenate(features, axis=0)

    return model, features, dataset.images

def train(model, dataloader, criterion, optimizer, device, train_dataloader, val_dataloader, epochs=10):
    model.train()  # モデルを訓練モードに設定

    limit_time = datetime.datetime.now()

    for epoch in range(epochs):
        epoch_start = datetime.datetime.now()
        print(f'Epoch:{epoch} / 開始:{epoch_start}')

        running_loss = 0.0
        
        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()  # オプティマイザの勾配をリセット
            # 順伝播 + 誤差逆伝播 + 重み更新
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
        
        epoch_loss = running_loss / len(dataloader.dataset)
        val_loss, val_accuracy = validate_model(model, val_dataloader, criterion, device)
        
        epoch_end = datetime.datetime.now()
        epoch_elapsed_time = epoch_end - epoch_start

        print(f"{epoch_end}:{epoch_elapsed_time}")

        with open(os.path.join(data_path, 'log.txt'), 'a') as f:
            print(f'Epoch {epoch+1}/{epochs}, Loss: {epoch_loss:.4f}')
            print(f'Epoch {epoch+1}, Loss: {running_loss/len(train_dataloader.dataset)}, 'f'Val Loss: {val_loss}, Val Accuracy: {val_accuracy}%')
            print(f'epoch:{epoch+1} 回目 経過:{epoch_elapsed_time}')

        if val_accuracy >= 95:
            print("目標の検証精度に達しました。訓練を停止します。")
            break

        elapsed_time = epoch_end - limit_time

        if elapsed_time.total_seconds() >= 10 * 3600:
            print("12時間経過しました。プログラムを終了します。")
            break

        time.sleep(1)  # 1秒間隔でループを実行

def validate_model(model, dataloader, criterion, device):
    model.eval()  # モデルを評価モードに設定
    val_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():  # 勾配の計算を無効化
        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * inputs.size(0)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    val_loss /= len(dataloader.dataset)
    val_accuracy = 100 * correct / total
    return val_loss, val_accuracy


##ばっくあぷ
# class WixossDataset(Dataset):
#     def __init__(self, directory, transform=None):
#         self.directory = directory
#         self.transform = transform
#         self.images = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.jpg')]
#         self.labels = self.generate_labels()
    
#     def __len__(self):
#         return len(self.images)
    
#     def __getitem__(self, idx):
#         image_path = self.images[idx]
#         image = Image.open(image_path).convert('RGB')
#         if self.transform:
#             image = self.transform(image)
#         label = self.labels[idx]  # 正しいラベルを使用
#         return image, label
    
#     def generate_labels(self):
#         labels = {}
#         unique_label = 0

#         for img_path in self.images:
#             # ファイル名を取得
#             filename = os.path.splitext(os.path.basename(img_path))[0]

#             # ハッシュ値を生成
#             hash_object = hashlib.md5(filename.encode())
#             hash_digest = hash_object.hexdigest()

#             # ハッシュ値をキーとしてラベルを割り当て
#             if hash_digest not in labels:
#                 labels[hash_digest] = unique_label
#                 unique_label += 1

#         # ラベル辞書を使用して各ファイルに一意なラベルを割り当て
#         self.labels = [labels[hashlib.md5(os.path.splitext(os.path.basename(path))[0].encode()).hexdigest()] for path in self.images]
#         return self.labels