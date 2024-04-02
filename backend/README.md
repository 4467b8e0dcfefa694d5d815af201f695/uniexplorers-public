<div align="left">
  <img src="assets/logo.png" width=100px>
</div>

# Uniexplorers (Backend)

Exchange, for everyone

IS213 Enterprise Solution Development G1T1

# Contents

1. [Project Overview](#project-overview)
2. [Technical Overview](#technical-overview)
3. [Technologies Utilised](#technologies-utilised)
4. [Getting Started](#getting-started)
5. [Contributors](#contributors)

# Project Overview

### Uniexplorers is
- A one-stop shop for exchange-related information
- A social network connecting incoming, interested and alumni exchangers
- A travel guide and planner for students heading on exchange
- An intelligent university recommender, based on your preferences


# Technical Overview

<div align="center">
  <img src="assets/sad.png">
</div>

# Technologies Utilised

<div align="center">
  <h3>Libraries</h3>
  <p><strong>Web Services and User Interface</strong></p>
  <a href="https://fastapi.tiangolo.com/"><img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" alt="FastAPI" width="88"/></a>
  <a href="https://spring.io/"><img src="https://4.bp.blogspot.com/-ou-a_Aa1t7A/W6IhNc3Q0gI/AAAAAAAAD6Y/pwh44arKiuM_NBqB1H7Pz4-7QhUxAgZkACLcBGAs/s1600/spring-boot-logo.png" alt="SpringBoot" height="40"/></a>
  <a href="https://expressjs.com/"><img src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png" alt="Express" height="40"/></a>
  <a href="https://tokio.rs/"><img src="https://tokio.rs/img/tokio-horizontal.svg" alt="Axum" height="40"/></a>
  <a href="https://gin-gonic.com/"><img src="https://raw.githubusercontent.com/gin-gonic/logo/master/color.png" alt="Gin" height="40"/></a>
  <a href="https://vuejs.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png" alt="Vue" height="40"/></a>

  

  <p><strong>API Gateway</strong></p>
  <a href="https://konghq.com/"><img src="https://konghq.com/wp-content/uploads/2018/08/kong-combination-mark-color-256px.png" alt="Kong API Gateway" width="88"/></a>
  
  <p><strong>Deployment (Development & Production)</strong></p>

  <a href="https://www.docker.com/"><img src="https://www.docker.com/wp-content/uploads/2022/03/horizontal-logo-monochromatic-white.png" alt="Docker" width="88"/></a>
  <a href="https://kubernetes.io/"><img src="https://gcloud.devoteam.com/wp-content/uploads/sites/32/2021/10/kubernetes-logo-1-1.svg" alt="Kubernetes" height="44"/></a>

  <p><strong>Machine Learning</strong></p>
  <a href="https://radimrehurek.com/gensim/"><img src="https://radimrehurek.com/gensim/_static/images/gensim.png" alt="Gensim" height="44"/></a>
  

  <p><strong>AMQP</strong></p>

  <a href="https://www.rabbitmq.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/RabbitMQ_logo.svg/2560px-RabbitMQ_logo.svg.png" alt="RabbitMQ" width="88"/></a>

  <p><strong>Authentication</strong></p>

  <a href="https://www.clerk.com/"><img src="https://workable-application-form.s3.amazonaws.com/advanced/production/5faba140a2e294c4d44b07eb/5a2307b9-37fe-9bd0-b5f4-2666152d200d" alt="Clerk" width="88"/></a>

  <p><strong>Databases</strong></p>

  <a href="https://redis.com/"><img src="https://redis.com/wp-content/themes/wpx/assets/images/logo-redis.svg?auto=webp&quality=85,75&width=120" alt="Redis" width="88"/></a>
  <a href="https://postgresql.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/800px-Postgresql_elephant.svg.png" alt="PostgreSQL" width="40"/></a>
  <a href="https://mongodb.com/"><img src="https://www.ovhcloud.com/sites/default/files/styles/text_media_horizontal/public/2022-03/black.png" alt="MongoDB" height="40"/></a>

  <h3>Languages</h3>
  <a href="https://python.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png" alt="Python" width="40"/></a>
  <a href="https://ecma-international.org/publications-and-standards/standards/ecma-262/"><img src="https://durableprogramming.com/wp-content/uploads/2023/04/JavaScript-logo.png" alt="JavaScript" width="40"/></a>
  <a href="https://rust-lang.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/1200px-Rust_programming_language_black_logo.svg.png" alt="Rust" width="40"/></a>
  <a href="https://go.dev"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/800px-Go_Logo_Blue.svg.png" alt="Go" width="88"/></a>  
</div>

# Getting Started

## `docker-compose` deployment

### Bringing services up

`docker-compose up -d --build` should be sufficient.

### Bringing services down

`docker-compose down` to simply bring services down.

`docker-compose down -v` to purge databases and volumes. Necessary if schemas change.

## `k8s` deployment

Please see [k8s/README.md](./k8s/README.md).

## Deployment Process Overview

1. Databases are brought up
    - `forum_db`, `uni_db`, `user_db` - PostgreSQL databases
    - `mongodb` - MongoDB database
2. Database seeding and migration as necessary. These run independently from each other.
    - For PostgreSQL databases:
      1. `seed_migration` runs, setting up database schema and populating initial seed data
      2. `ingestion` runs, automatically cleaning scraped course mapping data and inserting the data into the DB
    - For MongoDB databases
      1. `mongoseed` runs, inserting the respective `course_mapping` JSON and `nearby`/`geocode` JSONs. JSON files are automatically chunked to not exceed 16MB in size.
3. Simple microservices are brought up.
4. Complex microservices that rely on the simple microservices are brought up.
5. Kong is brought up to enable microservice access via API Gateway.

# API Documentation

[Documentation hosted on `bump.sh`](https://bump.sh/uniexplorers/doc/api)

# Contributors

<div align="center">
  <img src="assets/team.jpg">
  <h4>L-R: TOH Zheng Feng, Darryl POH Cheng Yew, Jared Marc SONG Kye-Jet, LIM Jing Jie, Isabelle SEET Yu Fei, Akeela Darryl FATTHA</h4>
</div>