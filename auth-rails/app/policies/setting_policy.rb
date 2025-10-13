class SettingPolicy < ApplicationPolicy
  def show?
    user.role == 'admin'
  end

  def update?
    user.role == 'admin'
  end
end
