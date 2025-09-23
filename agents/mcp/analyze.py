# Notification Analytics MCP Server with Conversion Tracking
import logging
from datetime import datetime
from typing import Dict

from mcp.server.fastmcp import FastMCP

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("NotificationAnalytics", debug=True)
logger.info("Notification Analytics MCPサーバーを初期化しました")

# ダミーデータベース
notification_campaigns = [
    {
        "id": "campaign_001",
        "date": "2025-01-15",
        "send_type": "email",
        "total_sent": 1500,
        "successful_sends": 1425,
        "failed_sends": 75,
        "clicks": 342,
        "conversions": 41,
        "subject": "新年キャンペーンのお知らせ"
    },
    {
        "id": "campaign_002", 
        "date": "2025-01-22",
        "send_type": "sms",
        "total_sent": 800,
        "successful_sends": 776,
        "failed_sends": 24,
        "clicks": 310,
        "conversions": 28,
        "subject": "限定セール開始通知"
    },
    {
        "id": "campaign_003",
        "date": "2025-02-05",
        "send_type": "email", 
        "total_sent": 2200,
        "successful_sends": 2090,
        "failed_sends": 110,
        "clicks": 398,
        "conversions": 52,
        "subject": "バレンタイン特別企画"
    },
    {
        "id": "campaign_004",
        "date": "2025-02-14",
        "send_type": "sms",
        "total_sent": 1200,
        "successful_sends": 1140,
        "failed_sends": 60,
        "clicks": 456,
        "conversions": 31,
        "subject": "バレンタインデー緊急告知"
    },
    {
        "id": "campaign_005",
        "date": "2025-03-01",
        "send_type": "email",
        "total_sent": 1800,
        "successful_sends": 1710,
        "failed_sends": 90,
        "clicks": 285,
        "conversions": 38,
        "subject": "春の新商品発表"
    },
    {
        "id": "campaign_006",
        "date": "2025-03-10",
        "send_type": "sms",
        "total_sent": 950,
        "successful_sends": 912,
        "failed_sends": 38,
        "clicks": 365,
        "conversions": 29,
        "subject": "ホワイトデー限定オファー"
    },
    {
        "id": "campaign_007",
        "date": "2025-03-20",
        "send_type": "email",
        "total_sent": 2500,
        "successful_sends": 2375,
        "failed_sends": 125,
        "clicks": 523,
        "conversions": 67,
        "subject": "春分の日セール開催"
    }
]

@mcp.tool()
def analyze(
    start_date: str,
    end_date: str, 
    send_type: str
) -> Dict:
    """
    通知配信結果を分析し、クリック率・CV数・CVRを含む詳細レポートを生成
    
    Args:
        start_date: 開始日 (YYYY-MM-DD)
        end_date: 終了日 (YYYY-MM-DD)
        send_type: 送信種別 ("email" or "sms") 
    """
    logger.info(f"通知効果分析開始: {start_date} - {end_date}, 種別: {send_type}")
    
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")

        filtered_campaigns = []
        for campaign in notification_campaigns:
            campaign_dt = datetime.strptime(campaign["date"], "%Y-%m-%d")
            if (start_dt <= campaign_dt <= end_dt and 
                campaign["send_type"] == send_type):
                filtered_campaigns.append(campaign)
        
        if not filtered_campaigns:
            return {
                "success": False,
                "error": f"指定期間（{start_date}〜{end_date}）と送信種別（{send_type}）に該当するキャンペーンデータが見つかりませんでした"
            }

        total_sent = sum(c["total_sent"] for c in filtered_campaigns)
        successful_sends = sum(c["successful_sends"] for c in filtered_campaigns)
        clicks = sum(c["clicks"] for c in filtered_campaigns)
        conversions = sum(c["conversions"] for c in filtered_campaigns)
        click_rate = (clicks / successful_sends * 100) if successful_sends > 0 else 0
        cvr = (conversions / clicks * 100) if clicks > 0 else 0

        result = {
            "success": True,
            "metrics": {
                "total_sent": total_sent,
                "clicks": clicks,
                "click_rate": round(click_rate, 1),
                "conversions": conversions,
                "cvr": round(cvr, 1),
            }
        }
        
        logger.info(f"通知効果分析完了: CTR {click_rate:.1f}%, CVR {cvr:.1f}%")
        return result
        
    except Exception as e:
        logger.error(f"通知効果分析エラー: {e}")
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    logger.info("Notification Analytics MCPサーバーstdioモード開始")
    mcp.run(transport="stdio")