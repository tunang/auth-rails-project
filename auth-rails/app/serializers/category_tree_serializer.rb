# app/serializers/category_tree_serializer.rb
class CategoryTreeSerializer
  def initialize(categories)
    @categories = categories
  end

  def as_json
    id_to_node = {}

    # Initialize all nodes
    @categories.each do |category|
      id_to_node[category.id] = {
        id: category.id,
        name: category.name,
        description: category.description,
        parent_id: category.parent_id,
        children: []
      }
    end

    root_nodes = []

    # Attach children to parents
    id_to_node.each do |id, node|
      if node[:parent_id]
        parent_node = id_to_node[node[:parent_id]]
        parent_node[:children] << node if parent_node
      else
        root_nodes << node
      end
    end

    root_nodes
  end
end
