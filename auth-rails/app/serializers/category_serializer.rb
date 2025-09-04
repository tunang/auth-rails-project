# app/serializers/category_serializer.rb
class CategorySerializer
  def initialize(category)
    @category = category
  end

  def as_json(*)
    {
      id: category.id,
      name: category.name,
      description: category.description,
      parent: parent_data,
      children: children_data
    }
  end

  private

  attr_reader :category

  def parent_data
    return nil unless category.parent

    {
      id: category.parent.id,
      name: category.parent.name
    }
  end

  def children_data
    category.children.map do |child|
      {
        id: child.id,
        name: child.name
      }
    end
  end
end
