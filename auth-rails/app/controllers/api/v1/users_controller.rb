class Api::V1::UsersController < ApplicationController
  before_action :doorkeeper_authorize!
  before_action :set_user, only: %i[show update destroy]

  def index
    authorize User, :index?

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    if filter_params.except(:page, :per_page).present?
      search_results =
        User
          .search_users(query: params[:query] || params[:search])
          .page(page)
          .per(per_page)
      users = search_results.records
    else
      users = User.page(page).per(per_page)
    end

    render json: {
             status: {
               code: 200,
               message: 'Fetched users successfully',
             },
             data: users.map { |user| UserSerializer.new(user).as_json },
             pagination: {
               current_page: users.current_page,
               next_page: users.next_page,
               prev_page: users.prev_page,
               total_pages: users.total_pages,
               total_count: users.total_count,
             },
           },
           status: :ok
  end


  def deleted
    authorize User, :deleted?
    deleted_users =
      User.only_deleted.page(params[:page]).per(params[:per_page] || 10)

    render json: {
             status: {
               code: 200,
               message: 'Fetched deleted users successfully',
             },
             data:
               deleted_users.map { |user| UserSerializer.new(user).as_json },
             pagination: {
               current_page: deleted_users.current_page,
               next_page: deleted_users.next_page,
               prev_page: deleted_users.prev_page,
               total_pages: deleted_users.total_pages,
               total_count: deleted_users.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @user, :show?

    render json: {
             status: {
               code: 200,
               message: 'Fetched user successfully',
             },
             data: UserSerializer.new(@user).as_json,
           },
           status: :ok
  end

  def create
    authorize User, :create?

    user = User.new(user_params)

    # ✅ Instantly confirm user if Devise confirmable is used
    user.skip_confirmation! if user.respond_to?(:skip_confirmation!)

    if user.save
      render json: {
               status: {
                 code: 201,
                 message: 'User created successfully',
               },
               data: UserSerializer.new(user).as_json,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Failed to create user',
               },
               errors: user.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @user, :update?

    if @user.update(user_params)
      render json: {
               status: {
                 code: 200,
                 message: 'User updated successfully',
               },
               data: UserSerializer.new(@user).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Failed to update user',
               },
               errors: @user.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @user, :destroy?

    if @user.destroy
      render json: {
               status: {
                 code: 200,
                 message: 'User deleted (soft)',
               },
               data: {
                 deleted_at: UserSerializer.new(@user).as_json,
               },
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Failed to delete user',
               },
             },
             status: :unprocessable_entity
    end
  end

  def restore
    authorize User, :restore?
    user = User.only_deleted.find(params[:id])
    if user.restore(recursive: true)
      user.__elasticsearch__.index_document
      render json: {
               status: {
                 code: 200,
                 message: 'User restored successfully',
               },
               data: UserSerializer.new(user).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Failed to restore user',
               },
             },
             status: :unprocessable_entity
    end
  end

  def me
    render json: {
             status: {
               code: 200,
               message: 'Get current user successfully.',
             },
             data: UserSerializer.new(current_user).as_json,
           },
           status: :ok
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def filter_params
    params.permit(:query, :search, :page, :per_page)
  end

  def user_params
    params.permit(:email, :name, :password, :role)
  end
end
