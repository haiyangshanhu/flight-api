# 使用官方 OpenJDK 基础镜像
FROM eclipse-temurin:17-jre

# 构建代理设置（只在构建过程中有效）
ARG http_proxy
ARG https_proxy
ARG no_proxy

# 设置工作目录
WORKDIR /app

# 复制构建好的 Spring Boot JAR 文件到容器中
COPY target/*.jar app.jar

# 创建日志目录（与 application.yml 中的 logging.path 匹配）
RUN mkdir -p /app/logs

# 设置环境变量（用于覆盖 yml 中的敏感配置）
# ENV SPRING_DATASOURCE_USERNAME=root \
#     SPRING_DATASOURCE_PASSWORD=123456 \
#     JWT_SECRET=yourSecretKeyHereShouldBeAtLeast32CharactersLong
ENV JWT_SECRET=yourSecretKeyHereShouldBeAtLeast32CharactersLong

# 暴露 Spring Boot 默认端口
EXPOSE 8080

# 启动应用（带健康检查）
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]