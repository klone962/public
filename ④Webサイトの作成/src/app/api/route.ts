import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

interface CardData {
  id: string;
  series: string;
  no: string;
  name: string;
  sp?: string;
  rarity: string;
  effect: string[];
  flavor: string;
  category: string[];
  type: string[];
  color: string[];
  lv: number;
  grow_cost: string;
  cost: string;
  limit: string;
  power: number;
  variable1?: string;
  variable2?: string[];
  format?: string;
  story?: string;
}

// 接続文字列を設定
const uri: string = process.env.DB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  try {
    const key = params.get("keyword") || "";
    const page = parseInt(params.get("page") || "1", 10);
    const limit = parseInt(params.get("limit") || "30", 10);
    const skip = (page - 1) * limit;

    // keywordを含むnameを前方後方一致で検索
    let query: Record<string, any> = {
      name: { $regex: key, $options: "i" },
    };

    await client.connect();
    const db = client.db(process.env.DB_DBNAME as string);
    const collection = db.collection(process.env.DB_COLLECTION as string);

    // 他のクエリパラメータ
    const additionalQueries: (keyof CardData)[] = [
      "color",
      "rarity",
      "category",
      "type",
      "variable1",
      "variable2",
      "series",
    ];

    additionalQueries.forEach((param) => {
      const value = params.get(param);
      if (value) {
        // 正規表現を使用して前後一致を検索する設定
        query[param] = {
          $in: value.split(";").map((v) => new RegExp(`${v.trim()}`, "i")),
        };
      }
    });

    const totalItems = await collection.countDocuments(query); // 全ドキュメントの数を取得
    const totalPages = Math.ceil(totalItems / limit); // 総ページ数

    // データベースからのデータ取得
    const results = {
      items: await collection.find(query).skip(skip).limit(limit).toArray(),
      currentPage: page,
      totalItems,
      totalPages,
    };

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: error });
  } finally {
    client.close();
  }
}
