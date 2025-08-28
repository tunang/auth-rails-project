# app/serializers/category_serializer.rb
class CategorySerializer
  def initialize(category)
    @category = category
  end

  def as_json(*)
    {
      id: category.id,
      description: category.description,
      name: category.name,
      parent_id: category.parent_id
    }
  end

  private
  
  attr_reader :category
end
