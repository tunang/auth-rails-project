# db/seeds.rb
require "faker"

puts "🌱 Seeding categories..."

main_categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "Arts",
  "History",
  "Business",
  "Health",
  "Sports",
  "Travel"
]

subcategories = {
  "Fiction" => ["Fantasy", "Mystery", "Romance", "Thriller", "Young Adult"],
  "Non-Fiction" => ["Biography", "Self-Help", "Philosophy", "Politics", "Religion"],
  "Science" => ["Physics", "Chemistry", "Biology", "Astronomy", "Mathematics"],
  "Technology" => ["Programming", "AI & Machine Learning", "Networking", "Cybersecurity", "Databases"],
  "Arts" => ["Painting", "Music", "Photography", "Theatre", "Dance"],
  "History" => ["Ancient", "Medieval", "Modern", "Military", "Cultural"],
  "Business" => ["Finance", "Marketing", "Management", "Entrepreneurship", "Economics"],
  "Health" => ["Nutrition", "Fitness", "Mental Health", "Medicine", "Wellness"],
  "Sports" => ["Football", "Basketball", "Tennis", "Cricket", "Olympics"],
  "Travel" => ["Adventure", "Cultural", "Luxury", "Backpacking", "Nature"]
}

main_categories.each do |main|
  parent = Category.find_or_create_by!(
    name: main,
    description: "All books related to #{main}"
  )

  subcategories[main].each do |child|
    Category.find_or_create_by!(
      name: child,
      description: "#{child} books under #{main}",
      parent: parent
    )
  end
end

puts "✅ Seeded #{Category.count} categories."


puts "🌱 Seeding authors..."

# Some famous real authors
authors = [
  { name: "J.K. Rowling", nationality: "British", birth_date: Date.new(1965,7,31), biography: "Author of Harry Potter series." },
  { name: "George R.R. Martin", nationality: "American", birth_date: Date.new(1948,9,20), biography: "Author of A Song of Ice and Fire." },
  { name: "Haruki Murakami", nationality: "Japanese", birth_date: Date.new(1949,1,12), biography: "Known for Norwegian Wood and Kafka on the Shore." },
  { name: "Nguyễn Nhật Ánh", nationality: "Vietnamese", birth_date: Date.new(1955,5,7), biography: "Famous Vietnamese children's and YA author." },
  { name: "Gabriel García Márquez", nationality: "Colombian", birth_date: Date.new(1927,3,6), biography: "Known for One Hundred Years of Solitude." }
]

authors.each do |data|
  Author.find_or_create_by!(name: data[:name]) do |a|
    a.nationality = data[:nationality]
    a.birth_date  = data[:birth_date]
    a.biography   = data[:biography]
  end
end

# Add random authors up to 1000 total
existing_authors = Author.count
if existing_authors < 100
  (100 - existing_authors).times do
    Author.create!(
      name: Faker::Book.author,
      nationality: Faker::Nation.nationality,
      birth_date: Faker::Date.birthday(min_age: 25, max_age: 90),
      biography: Faker::Lorem.paragraph(sentence_count: 3)
    )
  end
end

puts "✅ Seeded #{Author.count} authors total."


puts "🌱 Seeding 100 books (this may take a few minutes)..."

author_ids = Author.pluck(:id)
category_ids = Category.pluck(:id)

book_data = []
now = Time.now

100.times do |i|
  title = "#{Faker::Book.title} #{i}" # ensure uniqueness
  price = Faker::Commerce.price(range: 5.0..100.0)
  discount = [0, 5, 10, 15, 20].sample
  cost_price = (price * rand(0.4..0.8)).round(2)

  book_data << {
    title: title,
    description: Faker::Lorem.paragraph(sentence_count: 5),
    price: price,
    stock_quantity: rand(10..500),
    featured: [true, false].sample,
    sold_count: rand(0..1000),
    cost_price: cost_price,
    discount_percentage: discount,
    created_at: now,
    updated_at: now
  }
end

Book.insert_all!(book_data)
puts "✅ Inserted 10,000 books."


puts "🔗 Linking books with authors and categories..."

book_authors = []
book_categories = []

Book.find_in_batches(batch_size: 500) do |batch|
  batch.each do |book|
    chosen_authors = author_ids.sample(rand(1..3))
    chosen_categories = category_ids.sample(rand(1..3))

    chosen_authors.each do |aid|
      book_authors << { book_id: book.id, author_id: aid, created_at: now, updated_at: now }
    end

    chosen_categories.each do |cid|
      book_categories << { book_id: book.id, category_id: cid, created_at: now, updated_at: now }
    end
  end
end

BookAuthor.insert_all!(book_authors)
BookCategory.insert_all!(book_categories)

puts "✅ Linked books with authors & categories."


puts "🔄 Rebuilding Elasticsearch indexes..."

Category.__elasticsearch__.create_index!(force: true)
Category.import

Author.__elasticsearch__.create_index!(force: true)
Author.import

Book.__elasticsearch__.create_index!(force: true)
Book.import

puts "🎉 Done seeding 1,000 authors and 10,000 books with categories and Elasticsearch!"
