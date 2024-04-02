FROM mongo:7.0.5-jammy

WORKDIR /seed
COPY . ./

# Strip Windows line endings WTF
RUN sed -i -e 's/\r$//' insert.sh
RUN chmod +x insert.sh

CMD ./insert.sh



