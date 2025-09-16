namespace :friendly_id do
  desc "Backfill slugs for existing books"
  task backfill_books: :environment do
    Book.find_each do |book|
      if book.slug.blank?
        book.slug = nil
        book.save!
        puts "Generated slug for Book ##{book.id} → #{book.slug}"
      end
    end
  end
end
