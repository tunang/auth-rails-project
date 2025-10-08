class AuthorPolicy < ApplicationPolicy
  # Người dùng có thể xem danh sách và chi tiết
def index?
    user.role == 'admin' || user.role == 'staff'
  end

  def show?
    user.role == 'admin' || user.role == 'staff'
  end

  def create?
    user.role == 'admin' || user.role == 'staff'
  end

  def update?
    user.role == 'admin' || user.role == 'staff'
  end

  def destroy?
    user.role == 'admin' || user.role == 'staff'
  end

  def deleted?
    user.role == 'admin' || user.role == 'staff'
  end
  
  def restore?
    user.role == 'admin' || user.role == 'staff'
  end
  
end
