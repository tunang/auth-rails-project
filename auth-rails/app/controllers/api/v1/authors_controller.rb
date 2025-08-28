class Api::V1::AuthorsController < ApplicationController
  # before_action :doorkeeper_authorize!, except: %i[index show]
  before_action :doorkeeper_authorize!
  before_action :set_author, only: %i[show update destroy]

  def index
    authorize Author, :index?
    authors =
      Author
        .includes(photo_attachment: :blob)
        .page(params[:page] || 1)
        .per(params[:per_page] || 10)

    render json: {
             status: {
               code: 200,
               message: 'Fetched authors successfully',
             },
             data: authors.map { |a| AuthorSerializer.new(a).as_json },
             pagination: {
               current_page: authors.current_page,
               next_page: authors.next_page,
               prev_page: authors.prev_page,
               total_pages: authors.total_pages,
               total_count: authors.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @author
    render json: {
             status: {
               code: 200,
               message: 'Fetched author successfully',
             },
             data: AuthorSerializer.new(@author).as_json,
           },
           status: :ok
  end

  def create
    author = Author.new(author_params.except(:image))
    authorize author
    author.photo.attach(params[:photo]) if params[:photo]
    if author.save
      render json: {
               status: {
                 code: 201,
                 message: 'Author created successfully',
               },
               data: AuthorSerializer.new(author).as_json,
             },
             status: :created
    else
      render json: {
               status: 'error',
               data: nil,
               errors:
                 author
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

  def update
    authorize @author
    binding.pry
    @author.photo.attach(params[:photo]) if params[:photo]
    if @author.update(author_params)
      render json: {
               status: {
                 code: 200,
                 message: 'Author updated successfully',
               }, 
               data: AuthorSerializer.new(@author).as_json,
             },
             status: :ok
    else
      render json: {
               status: 'error',
               data: nil,
               errors:
                 author
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
    authorize @author
    if @author.destroy
      render json: {
               status: {
                 code: 200,
                 message: "Author '#{@author.name}' has been deleted.",
               },
               data: @author,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: "Failed to delete Author '#{@author.name}'.",
                 errors: @author.errors.full_messages,
               },
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_author
    @author = Author.find(params[:id])
  end

  def author_params
    params.permit(:name, :biography, :nationality, :birth_date, :photo)
  end
end
