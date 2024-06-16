import csv
import unicodedata
import json

def normalize_dict_strings(d):
    for key, value in d.items():
        if isinstance(value, str):
            # 値が文字列の場合、NFKC正規化を行う
            d[key] = unicodedata.normalize('NFKC', value)

        elif isinstance(value, list):
            # 値がリストの場合、リスト内の各文字列に対して正規化を行う
            d[key] = [unicodedata.normalize('NFKC', item) if isinstance(item, str) else item for item in value]

        elif isinstance(value, dict):
            # 値が辞書の場合、再帰的にこの関数を呼び出す
            d[key] = normalize_dict_strings(value)
            
    return d

def write_to_json(data: list, output_dir: str) -> None:
    # 正規化された辞書データのリストを準備
    #normalized_data = [normalize_dict_strings(dic) for dic in data]
    
    # JSON形式の文字列にシリアライズ
    json_data = json.dumps(data, ensure_ascii=False, indent=4)
    
    # JSONデータをファイルに書き込む
    with open(output_dir, 'w', encoding='utf-8') as jsonfile:
        jsonfile.write(json_data)

# CSVファイルにチェックデータを書き込む
def write_to_check(value: int, output_dir: str) -> None:
    with open(output_dir, 'w', newline='', encoding='utf-8') as f:
        f.write(str(value))

# CSVファイルにデータを書き込む
def write_to_csv(data: list, output_dir: str) -> None:
    with open(output_dir, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)

# CSVファイルにチェックデータを読み込む
def read_to_check(output_dir: str):
    with open(output_dir, 'r', newline='', encoding='utf-8') as f:
        return f.read()
    
# CSVファイルにチェックデータを読み込む
def read_to_csv(output_dir: str):
    with open(output_dir, 'r', newline='', encoding='utf-8',) as csvfile:
        datas = csv.reader(csvfile)
        
        out_data = []

        for data in datas:
            out_data.extend(data)

        return out_data

# CSVファイルに辞書データを書き込む
def dict_to_csv(data: dict, output_dir: str) -> None:
    with open(output_dir, 'a', newline='', encoding='utf-8') as f:  # 'a'モードでファイルを開く
        write_dic = normalize_dict_strings(data)
        json_str = json.dumps(write_dic, ensure_ascii=False)  # 辞書をJSON文字列に変換
        f.write(json_str + '\n')  # JSON文字列をファイルに追記

# CSVファイルに辞書データを書き込む
def csv_to_dict(input_dir: str) -> dict:
    data_dicts = []

    with open(input_dir, 'r', encoding='utf-8') as f:
        for line in f:
            data_dict = json.loads(line.strip())  # 各行をJSON文字列から辞書に変換
            data_dicts.append(data_dict)

    return data_dicts