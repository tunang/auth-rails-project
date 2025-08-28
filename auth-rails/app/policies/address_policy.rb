class AddressPolicy < ApplicationPolicy
  # Người dùng có thể xem danh sách và chi tiết
  def index?
    user.present?
  end

  def show?
    user.present?
  end

  def create?
    user.present?
  end

  def update?
    user.present?
  end

  def destroy?
    user.present?
  end
  
end
