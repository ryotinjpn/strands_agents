FROM public.ecr.aws/docker/library/python:3.11-slim
WORKDIR /app

ENV AWS_REGION=us-east-1
ENV AWS_DEFAULT_REGION=us-east-1
ENV DOCKER_CONTAINER=1
ENV IS_CLOUD=true

COPY pyproject.toml .
RUN python -m pip install --no-cache-dir .
RUN python -m pip install aws-opentelemetry-distro>=0.10.0

COPY app.py .

RUN useradd -m -u 1000 bedrock_agentcore

USER bedrock_agentcore

EXPOSE 8080

CMD ["opentelemetry-instrument", "python", "-m", "app"]