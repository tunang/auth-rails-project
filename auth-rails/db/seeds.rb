# db/seeds.rb
puts "Seeding categories..."

Category.destroy_all

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
