require "elasticsearch"

Elasticsearch::Model.client = Elasticsearch::Client.new(
  url: ENV.fetch("ELASTICSEARCH_URL"),
  transport_options: { request: { timeout: 10 } }
)