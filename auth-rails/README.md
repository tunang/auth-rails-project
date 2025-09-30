# README


1. rails db:migrate



2. Set default WebApp for login
Rails c 

Doorkeeper::Application.create!(
  name: "WebApp",
  redirect_uri: "http://localhost",
  scopes: ""
)

3. Set kibana user 
docker compose up -d elasticsearch
docker exec -it es-auth-rails-project bash
bin/elasticsearch-reset-password -u <USERNAME> -i
it will ask you for a new password
