# Amazon Fresh MCP
import logging
from typing import Dict, List

from mcp.server.fastmcp import FastMCP

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create an MCP server for Amazon Fresh
mcp = FastMCP("AmazonFresh", debug=True)
logger.info("Amazon Fresh MCPサーバーを初期化しました")

# 食品・日用品データベース
CATEGORIES = {
    "fresh": {"name": "生鮮食品", "icon": "🥬"},
    "pantry": {"name": "パントリー", "icon": "🥫"},
    "dairy": {"name": "乳製品・卵", "icon": "🥛"},
    "meat": {"name": "肉・魚", "icon": "🥩"},
    "frozen": {"name": "冷凍食品", "icon": "🧊"},
    "bakery": {"name": "パン・ベーカリー", "icon": "🍞"},
    "snacks": {"name": "お菓子・スナック", "icon": "🍪"},
    "household": {"name": "日用品", "icon": "🧽"},
    "beverages": {"name": "飲料", "icon": "🥤"},
    "baby": {"name": "ベビー用品", "icon": "🍼"},
    "health": {"name": "ヘルス&ビューティー", "icon": "💊"},
    "pet": {"name": "ペット用品", "icon": "🐕"},
}

PRODUCTS = {
    "fresh": [
        {"id": "f1", "name": "有機トマト (500g)", "price": 380, "available": True},
        {"id": "f2", "name": "新鮮レタス (1玉)", "price": 198, "available": True},
        {"id": "f3", "name": "バナナ (房)", "price": 298, "available": True},
        {"id": "f4", "name": "りんご (3個)", "price": 448, "available": False},
        {"id": "f5", "name": "きゅうり (3本)", "price": 158, "available": True},
        {"id": "f6", "name": "にんじん (1袋)", "price": 128, "available": True},
        {"id": "f7", "name": "玉ねぎ (3個)", "price": 168, "available": True},
        {"id": "f8", "name": "じゃがいも (1袋)", "price": 248, "available": True},
        {"id": "f9", "name": "ほうれん草 (1束)", "price": 178, "available": True},
        {"id": "f10", "name": "ブロッコリー (1株)", "price": 198, "available": True},
        {"id": "f11", "name": "いちご (1パック)", "price": 498, "available": True},
        {"id": "f12", "name": "オレンジ (4個)", "price": 398, "available": False},
    ],
    "pantry": [
        {"id": "p1", "name": "パスタ 500g", "price": 158, "available": True},
        {"id": "p2", "name": "オリーブオイル 500ml", "price": 680, "available": True},
        {"id": "p3", "name": "醤油 1L", "price": 298, "available": True},
        {"id": "p4", "name": "米 5kg", "price": 1980, "available": True},
        {"id": "p5", "name": "みりん 500ml", "price": 348, "available": True},
        {"id": "p6", "name": "砂糖 1kg", "price": 198, "available": True},
        {"id": "p7", "name": "塩 1kg", "price": 128, "available": True},
        {"id": "p8", "name": "小麦粉 1kg", "price": 248, "available": True},
        {"id": "p9", "name": "パン粉 200g", "price": 158, "available": True},
        {"id": "p10", "name": "トマト缶 400g", "price": 98, "available": True},
    ],
    "dairy": [
        {"id": "d1", "name": "牛乳 1L", "price": 198, "available": True},
        {"id": "d2", "name": "卵 10個パック", "price": 248, "available": True},
        {"id": "d3", "name": "ヨーグルト 400g", "price": 158, "available": True},
        {"id": "d4", "name": "バター 200g", "price": 328, "available": True},
        {"id": "d5", "name": "チーズ 100g", "price": 298, "available": True},
        {"id": "d6", "name": "生クリーム 200ml", "price": 248, "available": True},
        {"id": "d7", "name": "低脂肪牛乳 1L", "price": 178, "available": True},
        {"id": "d8", "name": "豆乳 1L", "price": 218, "available": True},
    ],
    "meat": [
        {"id": "m1", "name": "鶏胸肉 300g", "price": 398, "available": True},
        {"id": "m2", "name": "サーモン切り身 2切れ", "price": 680, "available": True},
        {"id": "m3", "name": "豚バラ肉 400g", "price": 598, "available": False},
        {"id": "m4", "name": "牛こま切れ 300g", "price": 598, "available": True},
        {"id": "m5", "name": "鶏もも肉 400g", "price": 498, "available": True},
        {"id": "m6", "name": "豚ロース 300g", "price": 798, "available": True},
        {"id": "m7", "name": "マグロ切り身 200g", "price": 898, "available": True},
        {"id": "m8", "name": "エビ 200g", "price": 1280, "available": True},
        {"id": "m9", "name": "ひき肉 300g", "price": 398, "available": False},
    ],
    "frozen": [
        {"id": "fr1", "name": "冷凍チャーハン", "price": 298, "available": True},
        {"id": "fr2", "name": "冷凍餃子 12個", "price": 398, "available": True},
        {"id": "fr3", "name": "冷凍うどん 3食", "price": 198, "available": True},
        {"id": "fr4", "name": "アイスクリーム 500ml", "price": 398, "available": True},
        {"id": "fr5", "name": "冷凍野菜ミックス 300g", "price": 248, "available": True},
        {"id": "fr6", "name": "冷凍から揚げ 300g", "price": 498, "available": True},
    ],
    "bakery": [
        {"id": "bk1", "name": "食パン 6枚切り", "price": 148, "available": True},
        {"id": "bk2", "name": "クロワッサン 4個", "price": 298, "available": True},
        {"id": "bk3", "name": "メロンパン", "price": 128, "available": True},
        {"id": "bk4", "name": "バゲット", "price": 198, "available": True},
        {"id": "bk5", "name": "あんぱん", "price": 118, "available": True},
    ],
    "snacks": [
        {"id": "sn1", "name": "ポテトチップス", "price": 158, "available": True},
        {"id": "sn2", "name": "チョコレート 板", "price": 198, "available": True},
        {"id": "sn3", "name": "クッキー詰め合わせ", "price": 398, "available": True},
        {"id": "sn4", "name": "せんべい", "price": 248, "available": True},
        {"id": "sn5", "name": "ナッツミックス 100g", "price": 498, "available": True},
        {"id": "sn6", "name": "キャンディー", "price": 128, "available": True},
    ],
    "household": [
        {"id": "h1", "name": "洗剤 本体", "price": 298, "available": True},
        {"id": "h2", "name": "トイレットペーパー 12ロール", "price": 898, "available": True},
        {"id": "h3", "name": "キッチンペーパー", "price": 198, "available": True},
        {"id": "h4", "name": "食器用洗剤", "price": 178, "available": True},
        {"id": "h5", "name": "柔軟剤", "price": 398, "available": True},
        {"id": "h6", "name": "ハンドソープ", "price": 248, "available": True},
        {"id": "h7", "name": "ティッシュペーパー 5箱", "price": 498, "available": True},
        {"id": "h8", "name": "ゴミ袋 30枚", "price": 298, "available": True},
    ],
    "beverages": [
        {"id": "b1", "name": "天然水 2L", "price": 98, "available": True},
        {"id": "b2", "name": "コーヒー豆 200g", "price": 1280, "available": True},
        {"id": "b3", "name": "オレンジジュース 1L", "price": 298, "available": True},
        {"id": "b4", "name": "緑茶ペットボトル 500ml", "price": 128, "available": True},
        {"id": "b5", "name": "コーラ 350ml 6本", "price": 498, "available": True},
        {"id": "b6", "name": "ビール 350ml 6缶", "price": 1298, "available": True},
        {"id": "b7", "name": "ワイン 750ml", "price": 1980, "available": True},
        {"id": "b8", "name": "エナジードリンク", "price": 198, "available": True},
        {"id": "b9", "name": "スポーツドリンク 500ml", "price": 148, "available": False},
    ],
    "baby": [
        {"id": "bb1", "name": "おむつ Mサイズ 64枚", "price": 1480, "available": True},
        {"id": "bb2", "name": "おしりふき 80枚×3", "price": 498, "available": True},
        {"id": "bb3", "name": "ベビーフード 野菜", "price": 128, "available": True},
        {"id": "bb4", "name": "粉ミルク 800g", "price": 2680, "available": True},
        {"id": "bb5", "name": "哺乳瓶 240ml", "price": 1280, "available": True},
    ],
    "health": [
        {"id": "he1", "name": "シャンプー 400ml", "price": 598, "available": True},
        {"id": "he2", "name": "歯ブラシ 3本セット", "price": 398, "available": True},
        {"id": "he3", "name": "歯磨き粉", "price": 248, "available": True},
        {"id": "he4", "name": "ボディソープ", "price": 398, "available": True},
        {"id": "he5", "name": "化粧水 200ml", "price": 1280, "available": True},
        {"id": "he6", "name": "サプリメント ビタミンC", "price": 798, "available": True},
    ],
    "pet": [
        {"id": "pt1", "name": "ドッグフード 1kg", "price": 1980, "available": True},
        {"id": "pt2", "name": "キャットフード 500g", "price": 798, "available": True},
        {"id": "pt3", "name": "ペットシーツ 50枚", "price": 898, "available": True},
        {"id": "pt4", "name": "猫砂 7L", "price": 598, "available": True},
        {"id": "pt5", "name": "おやつ ささみ", "price": 398, "available": True},
    ],
}


@mcp.tool()
def search_products(category: str = "", query: str = "") -> List[Dict]:
    """商品を検索する"""
    logger.info(f"商品検索: category={category}, query={query}")

    results = []
    
    if category and category in PRODUCTS:
        results = PRODUCTS[category].copy()
    else:
        for cat_products in PRODUCTS.values():
            results.extend(cat_products)
    
    if query:
        results = [
            p for p in results 
            if query.lower() in p["name"].lower()
        ]
    
    results = [p for p in results if p["available"]]
    
    logger.info(f"検索結果: {len(results)}件の商品が見つかりました")
    return results


@mcp.tool()
def get_categories() -> List[Dict]:
    """カテゴリー一覧を取得する"""
    logger.info("カテゴリー一覧取得")
    
    categories = []
    for cat_id, cat_info in CATEGORIES.items():
        product_count = len([p for p in PRODUCTS.get(cat_id, []) if p["available"]])
        categories.append({
            "id": cat_id,
            "name": cat_info["name"],
            "icon": cat_info["icon"],
            "product_count": product_count
        })
    
    logger.info(f"カテゴリー取得完了: {len(categories)}カテゴリー")
    return categories


@mcp.tool()
def get_product_details(product_id: str) -> Dict:
    """商品詳細を取得する"""
    logger.info(f"商品詳細取得: product_id={product_id}")
    
    for cat_products in PRODUCTS.values():
        for product in cat_products:
            if product["id"] == product_id:
                logger.info(f"商品詳細取得完了: {product['name']}")
                return product
    
    logger.warning(f"商品ID {product_id} が見つかりません")
    return {"error": "商品が見つかりません"}


@mcp.tool()
def add_to_cart(product_ids: List[str], quantities: List[int] = None) -> Dict:
    """カートに商品を追加する"""
    if quantities is None:
        quantities = [1] * len(product_ids)
    
    if len(product_ids) != len(quantities):
        return {"success": False, "message": "商品IDと数量の数が一致しません"}
    
    logger.info(f"カート追加: product_ids={product_ids}, quantities={quantities}")
    
    cart_items = []
    total_price = 0
    
    for product_id, quantity in zip(product_ids, quantities):
        product = None
        for cat_products in PRODUCTS.values():
            for p in cat_products:
                if p["id"] == product_id and p["available"]:
                    product = p
                    break
            if product:
                break
        
        if product:
            item_total = product["price"] * quantity
            cart_items.append({
                "product_id": product_id,
                "name": product["name"],
                "price": product["price"],
                "quantity": quantity,
                "total": item_total
            })
            total_price += item_total
        else:
            return {"success": False, "message": f"商品ID {product_id} が見つからないか在庫切れです"}
    
    result = {
        "success": True,
        "cart_items": cart_items,
        "total_price": total_price,
        "message": f"{len(cart_items)}点の商品をカートに追加しました"
    }
    
    logger.info(f"カート追加完了: 合計金額 ¥{total_price}")
    return result


@mcp.tool()
def place_order(cart_items: List[Dict], delivery_address: str, delivery_time: str = "最短") -> Dict:
    """注文を確定する"""
    logger.info(f"注文確定: cart_items={len(cart_items)}点, address={delivery_address}")
    
    if not cart_items:
        return {"success": False, "message": "カートが空です"}
    
    order_id = f"AF_{len(cart_items)}_{hash(delivery_address) % 10000}"
    total_price = sum(item.get("total", 0) for item in cart_items)
    
    delivery_fee = 350 if total_price < 2000 else 0
    final_total = total_price + delivery_fee
    
    estimated_delivery = "2-4時間" if delivery_time == "最短" else delivery_time
    
    result = {
        "success": True,
        "order_id": order_id,
        "items": [{"name": item["name"], "quantity": item["quantity"]} for item in cart_items],
        "subtotal": total_price,
        "delivery_fee": delivery_fee,
        "total_price": final_total,
        "delivery_address": delivery_address,
        "estimated_delivery": estimated_delivery,
        "message": f"ご注文ありがとうございます。合計金額: ¥{final_total}"
    }
    
    logger.info(f"注文確定完了: {order_id}, 合計金額: ¥{final_total}")
    return result


# Add this part to run the server
if __name__ == "__main__":
    # stdioトランスポートを使用
    logger.info("MCPサーバーstdioモード開始")
    mcp.run(transport="stdio")
