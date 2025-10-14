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
docker exec -u root -it es-auth-rails-project bash
cd /usr/share/elasticsearch
bin/elasticsearch-reset-password -u kibana-system -i
it will ask you for a new password

4. stripe local listener

stripe login
stripe listen --forward-to localhost:3001/api/v1/stripe/webhook


5. Get exact name table in kibana server GET _cat/indices?v, match it with model

6. console log for debug docker-compose run --service-ports web

7.  Order.__elasticsearch__.create_index!(force: true)
Order.import

