FROM python:3.12-alpine as runtime

# Set work directory
WORKDIR /app

# Install runtime dependencies for psycopg2-binary
RUN apk update && apk add --no-cache libpq

# Install Python dependencies directly in runtime image
# This ensures psycopg2-binary and its dependencies are correctly aligned
RUN pip install pandas openpyxl python-dotenv sqlalchemy psycopg2-binary

# Copy application code if necessary
COPY . /app

ENV PYTHONDONTWRITEBYTECODE 1 \ PYTHONBUFFERED 1
