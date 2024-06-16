import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const id = params.get("id") || "";
  const name = params.get("name") || "";

  const encodedId = encodeURI(id);
  const encodedName = encodeURI(name.split("(")[0].trim().replace(/ /g, "+"));

  const urlNameId = encodeURIComponent(
    `https://www.suruga-ya.jp/search?category=5&search_word=${encodedName}+${encodedId}&searchbox=1&is_marketplace=0`
  );
  const urlName = encodeURIComponent(
    `https://www.suruga-ya.jp/search?category=5&search_word=${encodedName}&searchbox=1&is_marketplace=0`
  );

  ///ID検索
  const bigwebID: string = `https://www.bigweb.co.jp/ja/products/wix/list?name=${id}&is_box=0&is_supply=0&is_purchase=0`;
  const yuyuteiID: string = `https://yuyu-tei.jp/sell/wx/s/search?search_word=${id}`;
  const surugayaID: string = `${urlNameId}`;
  const mercariID: string = `https://jp.mercari.com/search?keyword=${encodedName}+${encodedId}`;

  ///name検索
  const bigwebName: string = `https://www.bigweb.co.jp/ja/products/wix/list?name=${name
    .split("(")[0]
    .trim()}&is_box=0&is_supply=0&is_purchase=0`;
  const yuyuteiName: string = `https://yuyu-tei.jp/sell/wx/s/search?search_word=${name
    .split("(")[0]
    .trim()}`;
  const surugayaName: string = `${urlName}`;
  const mercariName: string = `https://jp.mercari.com/search?keyword=${encodedName}`;

  const results = {
    bigweb: { id: bigwebID, name: bigwebName },
    yuyutei: { id: yuyuteiID, name: yuyuteiName },
    surugaya: { id: surugayaID, name: surugayaName },
    mercari: { id: mercariID, name: mercariName },
  };

  return NextResponse.json(results);
}
