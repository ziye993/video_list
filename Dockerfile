FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/videolist/home/
COPY nginx.conf /etc/nginx/nginx.conf