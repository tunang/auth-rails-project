class Api::V1::UsersController < ApplicationController
  before_action :doorkeeper_authorize!

    def index
    authorize User, :index?

    # if params[:search].present?
    #   # 🔎 Search với Elasticsearch
    #    =
    #     Book
    #       .search_by_name(params[:search])
    #       .page(params[:page] || 1)
    #       .per(params[:per_page] || 5)
    # else
    # end
      # 📚 Lấy từ DB bình thường
      users =
        User
          .page(params[:page] || 1)
          .per(params[:per_page] || 5)

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
             data:
               UserSerializer.new(current_user).as_json,
           },
           status: :ok
  end
end
