class Api::V1::CategoriesController < ApplicationController
  # before_action :doorkeeper_authorize!, except: %i[index show]
  before_action :doorkeeper_authorize!
  before_action :set_category, only: %i[show update destroy]

  def index
  authorize Category, :index?

  if params[:search].present?
    # Use elasticsearch
    categories = Category.search_by_name(params[:search]).page(params[:page] || 1).per(params[:per_page] || 10)
  else
    # Use normal AR
    categories = Category.page(params[:page] || 1).per(params[:per_page] || 10)
  end

  render json: {
           status: {
             code: 200,
             message: 'Fetched categories successfully',
           },
           data: categories.map { |a| CategorySerializer.new(a).as_json },
           pagination: {
             current_page: categories.current_page,
             next_page: categories.next_page,
             prev_page: categories.prev_page,
             total_pages: categories.total_pages,
             total_count: categories.total_count,
           },
         },
         status: :ok
end



  def search
    results = Category.search_by_name(params[:q])
    render json: results.select(:id, :name) # only return what frontend needs
  end

  def show
    authorize @category
    render json: {
             status: {
               code: 200,
               message: 'Fetched category successfully',
             },
             data: CategorySerializer.new(@category).as_json,
           },
           status: :ok
  end


  def get_nested_category
    authorize :category, :get_nested_category?

    categories = Category.all()
    render json: {
             status: {
               code: 200,
               message: 'Fetched categories successfully',
             },
             categories: CategoryTreeSerializer.new(categories).as_json,
           }, status: :ok
  end

def create
  category = Category.new(category_params)
  authorize Category

  if category.save
    render json: {
             status: {
               code: 201,
               message: 'category_created_successfully',
             },
             data: CategorySerializer.new(category).as_json,
           },
           status: :created
  else
    render json: {
             status: {
               code: 422,
               message: 'validation_error',
             },
             data: nil,
             errors: category.errors.full_messages,
           },
           status: :unprocessable_entity
  end
end


  def update
    authorize @category
    if @category.update(category_params)
      render json: {
               status: {
                 code: 200,
                 message: 'category_updated_successfully',
               },
               data: CategorySerializer.new(@category).as_json,
             },
             status: :ok
    else
      render json: {
               status: 'error',
               data: nil,
               errors:
                 category
                   .errors
                   .full_messages
                   .map { |msg|
                     {
                       code: 'VALIDATION_ERROR',
                       title: 'Unprocessable Entity',
                       detail: msg,
                     }
                   },
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @category
    if @category.destroy
      render json: {
               status: {
                 code: 200,
                 message: "category_deleted_successfully",
               },
               data: @category,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: "Failed to delete Category '#{@category.name}'.",
                 errors: @category.errors.full_messages,
               },
             },
             status: :unprocessable_entity
    end
  end


  def restore
    category = Category.only_deleted.find(params[:id])
    if category.restore(recursive: true)
      render json: {
               status: {
                 code: 200,
                 message: 'Category restored successfully',
               },
               data: CategorySerializer.new(category).as_json,
             }
    else
      render json: {
               status: 'error',
               errors: [
                 { code: 'RESTORE_FAILED', detail: 'Could not restore category' },
               ],
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.permit(:name, :description, :parent_id)
  end
end
