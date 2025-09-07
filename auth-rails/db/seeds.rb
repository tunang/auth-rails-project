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
  parent = Category.create!(
    name: main,
    description: "All books related to #{main}"
  )

  subcategories[main].each do |child|
    Category.create!(
      name: child,
      description: "#{child} books under #{main}",
      parent: parent
    )
  end
end

puts "✅ Seeded #{Category.count} categories."

puts "🌱 Seeding authors..."

# Một số tác giả thật
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

# 45 tác giả giả → tổng khoảng 50
45.times do
  Author.create!(
    name: Faker::Book.author,
    nationality: Faker::Nation.nationality,
    birth_date: Faker::Date.birthday(min_age: 25, max_age: 90),
    biography: Faker::Lorem.paragraph(sentence_count: 3)
  )
end

puts "✅ Seeded #{Author.count} authors."

puts "🔄 Rebuilding Elasticsearch indexes..."

# Rebuild index cho Category
Category.__elasticsearch__.create_index!(force: true)
Category.import

# Rebuild index cho Author
Author.__elasticsearch__.create_index!(force: true)
Author.import

puts "✅ Elasticsearch reindexed for Category & Author."
