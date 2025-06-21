FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/videolist
COPY nginx.conf /etc/nginx/nginx.conf