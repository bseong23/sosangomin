FROM node:22-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

## 추후 여기에 ARG, ENV로 환경변수 들어갈 예정정

RUN npm run build

# stage2
FROM nginx:stable-alpine as production-stage

# 현재 개발 단계라 no-cache 정책책
RUN echo 'server { \
    listen 5173; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    add_header Cache-Control "no-cache, must-revalidate"; \
    add_header Pragma "no-cache"; \
    expires off; \
    } \
    }' > /etc/nginx/conf.d/default.conf


COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
