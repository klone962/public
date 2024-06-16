import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

// 接続文字列を設定
const uri = process.env.DB_URI as string;
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
    const key = params.get("id");

    const query = { id: key };

    await client.connect();
    const db = client.db(process.env.DB_DBNAME as string);
    const collection = db.collection(process.env.DB_COLLECTION as string);

    // データベースからのデータ取得
    const results = await collection.find(query).toArray();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(error);
  } finally {
    client.close();
  }
}
