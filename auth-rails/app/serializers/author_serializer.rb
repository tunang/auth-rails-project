# app/serializers/author_serializer.rb
class AuthorSerializer
  def initialize(author)
    @author = author
  end

  def as_json(*)
    {
      id: author.id,
      name: author.name,
      nationality: author.nationality,
      birth_date: author.birth_date,
      biography: author.biography,
      photo: photo_url
    }
  end

  private

  attr_reader :author

  def photo_url
    return unless author.photo.attached?
    Rails.application.routes.url_helpers.rails_blob_url(author.photo, only_path: true)
  end
end
