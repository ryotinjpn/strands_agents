import json
import logging
import os
from contextlib import ExitStack

import boto3
from bedrock_agentcore import RequestContext
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from mcp import StdioServerParameters, stdio_client
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp import MCPClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
あなたはユーザーの健康に献身的に寄り添う高度なAIエージェントです
口調は親しみやすくカジュアルで、語尾は「っぽ」をつけて
"""

boto3_session = boto3.Session(profile_name="aws-sandbox-ryotinjpn")

# Claude 4モデルを使用してエージェントを設定
model = BedrockModel(
    model_id="apac.anthropic.claude-sonnet-4-20250514-v1:0", boto_session=boto3_session
)

# JSONファイルからmcpServers設定を読み込み
with open(os.path.join(os.path.dirname(__file__), "mcp.json"), "r") as f:
    config = json.load(f)
    mcp_servers = config["mcpServers"]


def create_mcp_client(server_config):
    """MCPクライアントを作成"""
    if server_config.get("disabled", False):
        return None

    return MCPClient(
        lambda: stdio_client(
            StdioServerParameters(
                command=server_config["command"], args=server_config["args"]
            )
        )
    )


with ExitStack() as stack:
    # 各クライアントをコンテキストマネージャとして登録しつつ生成
    mcp_clients = []
    for server_name, server_config in mcp_servers.items():
        logger.info(f"MCPクライアント '{server_name}' 作成中...")
        client = create_mcp_client(server_config)
        if client:
            logger.info(f"'{server_name}' のコンテキスト設定中...")
            mcp_clients.append(stack.enter_context(client))

    logger.info(f"{len(mcp_clients)}個 MCPクライアント作成")
    all_tools = []
    for mcp_name, mcp_client in enumerate(mcp_clients):
        logger.info(f"{mcp_name} からツールを取得中...")
        tools = mcp_client.list_tools_sync()
        logger.info(f"{mcp_name} から {len(tools)}個 ツール取得")
        all_tools.extend(tools)

    agent = Agent(
        model=model, system_prompt=SYSTEM_PROMPT, tools=all_tools, callback_handler=None
    )

    app = BedrockAgentCoreApp()

    @app.entrypoint
    async def invoke(payload: dict, context: RequestContext):
        user_message = payload.get("prompt", "Hello")
        agent_stream = agent.stream_async(user_message)
        async for event in agent_stream:
            if "event" in event:
                yield event
        logger.info("回答完了")

    if __name__ == "__main__":
        app.run()
