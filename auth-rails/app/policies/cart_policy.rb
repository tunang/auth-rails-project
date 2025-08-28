class CartPolicy < ApplicationPolicy
  def initialize(user, _cart)
    @user = user
  end

  def show?
    @user.present?
  end

  def add_item?
    @user.present? 
  end

  def update_item?
    @user.present?
  end

  def remove_item?
    @user.present?
  end

  def clear?
    @user.present?
  end
end
