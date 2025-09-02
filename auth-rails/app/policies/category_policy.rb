class CategoryPolicy < ApplicationPolicy
  def index?
    user.role == "admin"
  end
  def get_nested_category?
    true
  end
  def show?
    user.role == "admin"
  end
  def create?
    user.role == "admin"
  end

  def update?
    user.role == "admin"
  end

  def destroy?
    user.role == "admin"
  end
  
end
