# Production stage - serve static files with nginx
FROM nginx:alpine

# Copy static HTML file
COPY src/index.html /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]