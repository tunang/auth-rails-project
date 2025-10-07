class Api::V1::UsersController < ApplicationController
  before_action :doorkeeper_authorize!

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
      # 📚 Fall back to DB if no filters/search applied
      search_results = User.page(page).per(per_page)

      users = search_results
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

  # ✅ Strong params for search/filter/sort
  def filter_params
    params.permit(:query, :search, :page, :per_page)
  end
end
