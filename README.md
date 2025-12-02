# README

## 1. Start services

Start all containers in detached mode:

```bash
docker compose up -d
```

## 2. Run database migrations

Apply the Rails database migrations inside the web container:

```bash
docker compose exec web rails db:migrate
```

## 3. Create default WebApp for login (Doorkeeper)

**Open Rails console:**

```bash
docker compose exec web rails c
```

**Create Doorkeeper application:**

```ruby
Doorkeeper::Application.create!(
  name: "WebApp",
  redirect_uri: "http://localhost",
  scopes: ""
)
```

## 4. Reset Kibana user password

**Start Elasticsearch service (if not already running):**

```bash
docker compose up -d elasticsearch
```

**Exec into Elasticsearch container as root:**

```bash
docker exec -u root -it es-auth-rails-project bash
```

**Reset password:**

Inside the container, run the following commands:

```bash
cd /usr/share/elasticsearch
