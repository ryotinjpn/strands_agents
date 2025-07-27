# server.py - 食品配達MCP
import logging
from typing import Dict, List

from mcp.server.fastmcp import FastMCP

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create an MCP server for food delivery
mcp = FastMCP("FoodDelivery", debug=True)
logger.info("食品配達MCPサーバーを初期化しました")

# 食品データベース
RESTAURANTS = {
    "1": {"name": "寿司太郎", "cuisine": "日本料理", "rating": 4.5},
    "2": {"name": "ピザハウス", "cuisine": "イタリアン", "rating": 4.2},
    "3": {"name": "ラーメン王", "cuisine": "ラーメン", "rating": 4.7},
    "4": {"name": "カレーの達人", "cuisine": "インド料理", "rating": 4.3},
}

MENU_ITEMS = {
    "1": [
        {"id": "s1", "name": "にぎり寿司セット", "price": 1500},
        {"id": "s2", "name": "ちらし寿司", "price": 1200},
    ],
    "2": [
        {"id": "p1", "name": "マルゲリータピザ", "price": 1800},
        {"id": "p2", "name": "ペパロニピザ", "price": 2000},
    ],
    "3": [
        {"id": "r1", "name": "醤油ラーメン", "price": 800},
        {"id": "r2", "name": "味噌ラーメン", "price": 850},
    ],
    "4": [
        {"id": "c1", "name": "チキンカレー", "price": 1000},
        {"id": "c2", "name": "野菜カレー", "price": 900},
    ],
}


@mcp.tool()
def search_restaurants(cuisine: str = "") -> List[Dict]:
    """レストランを検索する"""
    logger.info(f"レストラン検索: cuisine={cuisine}")

    if not cuisine:
        results = list(RESTAURANTS.values())
    else:
        results = [
            r for r in RESTAURANTS.values() if cuisine.lower() in r["cuisine"].lower()
        ]

    logger.info(f"検索結果: {len(results)}件のレストランが見つかりました")
    return results


@mcp.tool()
def get_menu(restaurant_id: str) -> List[Dict]:
    """指定されたレストランのメニューを取得する"""
    logger.info(f"メニュー取得: restaurant_id={restaurant_id}")

    if restaurant_id not in RESTAURANTS:
        logger.warning(f"レストランID {restaurant_id} が見つかりません")
        return []

    menu = MENU_ITEMS.get(restaurant_id, [])
    logger.info(f"メニュー取得完了: {len(menu)}品目")
    return menu


@mcp.tool()
def place_order(restaurant_id: str, items: List[str], delivery_address: str) -> Dict:
    """注文を行う"""
    logger.info(
        f"注文処理: restaurant_id={restaurant_id}, items={items}, address={delivery_address}"
    )

    if restaurant_id not in RESTAURANTS:
        return {"success": False, "message": "レストランが見つかりません"}

    restaurant = RESTAURANTS[restaurant_id]
    total_price = 0
    ordered_items = []

    for item_id in items:
        for menu_item in MENU_ITEMS.get(restaurant_id, []):
            if menu_item["id"] == item_id:
                total_price += menu_item["price"]
                ordered_items.append(menu_item["name"])
                break

    if not ordered_items:
        return {"success": False, "message": "注文商品が見つかりません"}

    order_id = f"ORDER_{restaurant_id}_{len(ordered_items)}"

    result = {
        "success": True,
        "order_id": order_id,
        "restaurant": restaurant["name"],
        "items": ordered_items,
        "total_price": total_price,
        "delivery_address": delivery_address,
        "estimated_delivery": "30-45分",
        "message": f"注文が完了しました。合計金額: ¥{total_price}",
    }

    logger.info(f"注文完了: {order_id}, 合計金額: ¥{total_price}")
    return result


# Add this part to run the server
if __name__ == "__main__":
    # stdioトランスポートを使用
    logger.info("MCPサーバーstdioモード開始")
    mcp.run(transport="stdio")
