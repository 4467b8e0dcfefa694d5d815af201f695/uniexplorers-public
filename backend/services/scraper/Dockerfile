FROM python:3.9

# Install Chromium (commented out lines illustrate the syntax for getting specific chromium versions)
RUN echo "deb http://deb.debian.org/debian/ sid main" >> /etc/apt/sources.list \
  && apt-get update -qqy \
  # && apt-get -qqy install chromium=89.0.4389.82-1 \
  # && apt-get -qqy install chromium=90.0.4430.212-1 \
  # && apt-get -qqy install chromium=93.0.4577.82-1 \
  # && apt-get -qqy install chromium=97.0.4692.71-0.1 \
  # && apt-get -qqy install chromium=98.0.4758.102-1+b1 \
  && apt-get -qqy install chromium \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# install chromedriver, which will be located at /usr/bin/chromedriver
RUN apt-get update -qqy \
  && apt-get -qqy install chromium-driver \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#... (install dependencies)

# Create the necessary directories for copying the binary
RUN mkdir -p /var/chromedriver/

# copy the chromedriver binary, so that it can be patched by undetected_chromedriver
ENV CHROMEDRIVER_PATH=/var/chromedriver/chromedriver_copy
RUN cp /usr/bin/chromedriver ${CHROMEDRIVER_PATH}

WORKDIR /usr/src/app
COPY . .

RUN pip install -r requirements.txt
