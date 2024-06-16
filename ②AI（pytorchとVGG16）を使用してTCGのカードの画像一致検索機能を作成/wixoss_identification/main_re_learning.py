import os
import my_func
import datetime
from torchvision.models import vgg16
import torch.nn as nn
import torch

###
### すでに作成したモデルを再学習するようです。
###

try:
    # 出力先の設定
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, 'data')

    # モデルの設定
    #model_name = 'resnet18_model.pth'
    model_name = 'VGG16.pth'
    features_name = 'VGG16_features.pth'

    # 全体時間計測開始
    start = datetime.datetime.now()
    print(start)

    # モデルのロード
    model = vgg16(pretrained=False)  # 新しいモデルインスタンスを作成
    model.classifier[6] = nn.Linear(model.classifier[6].in_features, 8988) # カード枚数分の層を作成
    model.load_state_dict(torch.load(os.path.join(data_path, 'model', model_name))) # 重みをロード

    model, features, image_paths = my_func.re_vgg16_train_model(model, os.path.join(data_path, 'image'), 100)

    # モデルの保存
    torch.save(model.state_dict(), os.path.join(data_path, 'model', model_name))

    # 特徴ベクトルと画像パスを辞書として保存
    features_data = {'features': features, 'image_paths': image_paths}
    torch.save(features_data, os.path.join(data_path, 'model', features_name))

    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start
    print(f"{end} / {elapsed_time}")

    my_func.send_slack_mess(f'処理が完了したよ！ 経過:{elapsed_time}')

except Exception as e:
    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start

    print(f"{end} / {elapsed_time}")
    print(f'作業が失敗したよ！{elapsed_time}')
    print(f'{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}')

    my_func.send_slack_mess(f'作業が失敗したよ！ 経過:{elapsed_time}\n{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}')
