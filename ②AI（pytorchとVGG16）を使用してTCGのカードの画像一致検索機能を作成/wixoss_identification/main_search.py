import os
import my_func
import datetime
from collections import Counter
from torchvision.models import vgg16
import torch.nn as nn
import torch

try:
    # 出力先の設定
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, 'data')

    # モデルの設定
    # model_name = 'resnet18_model.pth'
    model_name = 'VGG16.pth'
    features_name = 'VGG16_features.pth'

    # 全体時間計測開始
    start = datetime.datetime.now()
    print(start)

    model = vgg16(pretrained=False)  # 新しいモデルインスタンスを作成
    model.classifier[6] = nn.Linear(model.classifier[6].in_features, 8988) # カード枚数分の層を作成
    model.load_state_dict(torch.load(os.path.join(data_path, 'model', model_name))) # 重みをロード
    model.eval()  # 推論モードに設定

    # 特徴ベクトルと画像パスのロード
    features_data = torch.load(os.path.join(data_path, 'model', features_name))
    features = features_data['features']
    image_paths = features_data['image_paths']

    # ロードしたモデルと特徴ベクトルを使用して検索を行い、結果を表示
    results = my_func.find_similar_images(os.path.join(data_path, 'pic'), model, features, image_paths)

    # マッチしたファイル名のみを抽出
    matched_filenames = [os.path.basename(match) for target, match in results.items()]

    # ファイル名の出現回数をカウント
    file_counts = Counter(matched_filenames)

    for filename, count in sorted(file_counts.items()):
        print(f"{filename} * {count}")

    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start

    print(elapsed_time)

    my_func.send_slack_mess(f'処理が完了したよ！ 経過:{elapsed_time}')

except Exception as e:
    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start

    print(f"{end} / {elapsed_time}")
    print(f'作業が失敗したよ！{elapsed_time}')
    print(f'{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}')

    my_func.send_slack_mess(f'作業が失敗したよ！ 経過:{elapsed_time}\n{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}')
