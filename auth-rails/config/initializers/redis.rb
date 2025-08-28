require "redis"

@redis = Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:56379/0"))
