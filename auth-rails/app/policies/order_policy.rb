class OrderPolicy < ApplicationPolicy
  def index?
    user_is_owner?
  end

  def get_all?
    user.role == 'admin' || user.role == 'staff'
  end


  def get_orders_of_user?
    user.role == 'admin' || user.role == 'staff'
  end

  def show?
    user_is_owner? || user.role == 'admin' || user.role == 'staff'
  end

  def create?
    user.present?
  end

  def update?
    user_is_owner? || user.role == 'admin' || user.role == 'staff'
  end

  def destroy?
    user_is_owner? || user.role == 'admin' || user.role == 'staff'
  end

  private

  def user_is_owner?
    user.present? && record.user_id == user.id
  end
end
