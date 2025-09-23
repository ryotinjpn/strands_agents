# Qiita MCP
import logging
import requests
from typing import Dict

from mcp.server.fastmcp import FastMCP

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("Qiita", debug=True)
logger.info("Qiita MCPサーバーを初期化しました")

BASE_URL = "https://qiita.com/api/v2"


@mcp.tool()
def search_items(
    query: str = "", page: int = 1, per_page: int = 20, user: str = "", tag: str = ""
) -> Dict:
    """記事を検索する"""
    logger.info(f"記事検索: query={query}, page={page}, per_page={per_page}")

    params = {"page": page, "per_page": min(per_page, 100)}

    if query:
        params["query"] = query
    if user:
        params["user"] = user
    if tag:
        params["tag"] = tag

    try:
        response = requests.get(f"{BASE_URL}/items", params=params)
        response.raise_for_status()

        items = response.json()

        result = {
            "success": True,
            "items": [
                {
                    "id": item["id"],
                    "title": item["title"],
                    "url": item["url"],
                    "user": item["user"]["id"],
                    "tags": [tag["name"] for tag in item["tags"]],
                    "likes_count": item["likes_count"],
                    "comments_count": item["comments_count"],
                    "created_at": item["created_at"],
                    "updated_at": item["updated_at"],
                    "body_preview": (
                        item["body"][:200] + "..."
                        if len(item["body"]) > 200
                        else item["body"]
                    ),
                }
                for item in items
            ],
            "count": len(items),
            "page": page,
        }

        logger.info(f"記事検索完了: {len(items)}件の記事が見つかりました")
        return result

    except requests.RequestException as e:
        logger.error(f"記事検索エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_item_details(item_id: str) -> Dict:
    """記事詳細を取得する"""
    logger.info(f"記事詳細取得: item_id={item_id}")

    try:
        response = requests.get(f"{BASE_URL}/items/{item_id}")
        response.raise_for_status()

        item = response.json()

        result = {
            "success": True,
            "item": {
                "id": item["id"],
                "title": item["title"],
                "body": item["body"],
                "rendered_body": item["rendered_body"],
                "url": item["url"],
                "user": {
                    "id": item["user"]["id"],
                    "name": item["user"]["name"],
                    "profile_image_url": item["user"]["profile_image_url"],
                },
                "tags": [
                    {"name": tag["name"], "versions": tag["versions"]}
                    for tag in item["tags"]
                ],
                "likes_count": item["likes_count"],
                "comments_count": item["comments_count"],
                "stocks_count": item["stocks_count"],
                "created_at": item["created_at"],
                "updated_at": item["updated_at"],
                "private": item["private"],
                "coediting": item["coediting"],
            },
        }

        logger.info(f"記事詳細取得完了: {item['title']}")
        return result

    except requests.RequestException as e:
        logger.error(f"記事詳細取得エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_user_info(user_id: str) -> Dict:
    """ユーザー情報を取得する"""
    logger.info(f"ユーザー情報取得: user_id={user_id}")

    try:
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        response.raise_for_status()

        user = response.json()

        result = {
            "success": True,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "description": user["description"],
                "facebook_id": user["facebook_id"],
                "followees_count": user["followees_count"],
                "followers_count": user["followers_count"],
                "github_login_name": user["github_login_name"],
                "items_count": user["items_count"],
                "linkedin_id": user["linkedin_id"],
                "location": user["location"],
                "organization": user["organization"],
                "permanent_id": user["permanent_id"],
                "profile_image_url": user["profile_image_url"],
                "team_only": user["team_only"],
                "twitter_screen_name": user["twitter_screen_name"],
                "website_url": user["website_url"],
            },
        }

        logger.info(f"ユーザー情報取得完了: {user['name']}")
        return result

    except requests.RequestException as e:
        logger.error(f"ユーザー情報取得エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_user_items(user_id: str, page: int = 1, per_page: int = 20) -> Dict:
    """ユーザーの投稿記事一覧を取得する"""
    logger.info(f"ユーザー記事一覧取得: user_id={user_id}, page={page}")

    params = {"page": page, "per_page": min(per_page, 100)}

    try:
        response = requests.get(f"{BASE_URL}/users/{user_id}/items", params=params)
        response.raise_for_status()

        items = response.json()

        result = {
            "success": True,
            "items": [
                {
                    "id": item["id"],
                    "title": item["title"],
                    "url": item["url"],
                    "tags": [tag["name"] for tag in item["tags"]],
                    "likes_count": item["likes_count"],
                    "comments_count": item["comments_count"],
                    "stocks_count": item["stocks_count"],
                    "created_at": item["created_at"],
                    "updated_at": item["updated_at"],
                    "private": item["private"],
                }
                for item in items
            ],
            "user_id": user_id,
            "count": len(items),
            "page": page,
        }

        logger.info(f"ユーザー記事一覧取得完了: {len(items)}件の記事")
        return result

    except requests.RequestException as e:
        logger.error(f"ユーザー記事一覧取得エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_tags(page: int = 1, per_page: int = 20, sort: str = "count") -> Dict:
    """タグ一覧を取得する"""
    logger.info(f"タグ一覧取得: page={page}, per_page={per_page}, sort={sort}")

    params = {"page": page, "per_page": min(per_page, 100), "sort": sort}

    try:
        response = requests.get(f"{BASE_URL}/tags", params=params)
        response.raise_for_status()

        tags = response.json()

        result = {
            "success": True,
            "tags": [
                {
                    "id": tag["id"],
                    "followers_count": tag["followers_count"],
                    "icon_url": tag["icon_url"],
                    "items_count": tag["items_count"],
                }
                for tag in tags
            ],
            "count": len(tags),
            "page": page,
            "sort": sort,
        }

        logger.info(f"タグ一覧取得完了: {len(tags)}件のタグ")
        return result

    except requests.RequestException as e:
        logger.error(f"タグ一覧取得エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_tag_info(tag_id: str) -> Dict:
    """タグの詳細情報を取得する"""
    logger.info(f"タグ詳細取得: tag_id={tag_id}")

    try:
        response = requests.get(f"{BASE_URL}/tags/{tag_id}")
        response.raise_for_status()

        tag = response.json()

        result = {
            "success": True,
            "tag": {
                "id": tag["id"],
                "followers_count": tag["followers_count"],
                "icon_url": tag["icon_url"],
                "items_count": tag["items_count"],
            },
        }

        logger.info(f"タグ詳細取得完了: {tag['id']}")
        return result

    except requests.RequestException as e:
        logger.error(f"タグ詳細取得エラー: {e}")
        return {"success": False, "error": str(e)}


@mcp.tool()
def get_trending_items(page: int = 1, per_page: int = 20) -> Dict:
    """トレンド記事を取得する（人気順で記事を取得）"""
    logger.info(f"トレンド記事取得: page={page}, per_page={per_page}")

    # Qiita APIには直接のトレンドエンドポイントがないため、
    # いいね数順で記事を取得してトレンドとして扱う
    params = {"page": page, "per_page": min(per_page, 100)}

    try:
        response = requests.get(f"{BASE_URL}/items", params=params)
        response.raise_for_status()

        items = response.json()

        # いいね数順でソート
        sorted_items = sorted(items, key=lambda x: x["likes_count"], reverse=True)

        result = {
            "success": True,
            "trending_items": [
                {
                    "id": item["id"],
                    "title": item["title"],
                    "url": item["url"],
                    "user": item["user"]["id"],
                    "tags": [tag["name"] for tag in item["tags"]],
                    "likes_count": item["likes_count"],
                    "comments_count": item["comments_count"],
                    "stocks_count": item["stocks_count"],
                    "created_at": item["created_at"],
                    "body_preview": (
                        item["body"][:150] + "..."
                        if len(item["body"]) > 150
                        else item["body"]
                    ),
                }
                for item in sorted_items
            ],
            "count": len(sorted_items),
            "page": page,
        }

        logger.info(f"トレンド記事取得完了: {len(sorted_items)}件の記事")
        return result

    except requests.RequestException as e:
        logger.error(f"トレンド記事取得エラー: {e}")
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    logger.info("MCPサーバーstdioモード開始")
    mcp.run(transport="stdio")
