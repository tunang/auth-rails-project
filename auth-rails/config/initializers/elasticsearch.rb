require "elasticsearch"

Elasticsearch::Model.client = Elasticsearch::Client.new(
  url: ENV.fetch("ELASTICSEARCH_URL", "http://localhost:9200"),
  user: ENV.fetch("ELASTICSEARCH_USER", "elastic"),
  password: ENV.fetch("ELASTICSEARCH_PASSWORD", "tuan2004"),
  transport_options: { request: { timeout: 10 } }
)