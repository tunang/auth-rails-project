class Api::V1::AuthorsController < ApplicationController
  # before_action :doorkeeper_authorize!, except: %i[index show]
  before_action :doorkeeper_authorize!
  before_action :set_author, only: %i[show update destroy]

  def index
    if params[:search].present?
      authors =
        Author
          .search_by_name(params[:search])
          .page(params[:page] || 1)
          .per(params[:per_page] || 10)
    else
      authors = Author.all
    end

    authors = authors.includes(photo_attachment: :blob).page(params[:page] || 1).per(params[:per_page] || 10)

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

  def deleted
    authorize Author, :deleted?

    deleted_authors =
      Author.only_deleted.page(params[:page]).per(params[:per_page] || 10)

    render json: {
             status: {
               code: 200,
               message: 'Fetched deleted authors successfully',
             },
             data:
               deleted_authors.map { |author|
                 AuthorSerializer.new(author).as_json
               },
             pagination: {
               current_page: deleted_authors.current_page,
               next_page: deleted_authors.next_page,
               prev_page: deleted_authors.prev_page,
               total_pages: deleted_authors.total_pages,
               total_count: deleted_authors.total_count,
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

  def featured
    books = Book.find
  end

  def create
    author = Author.new(author_params.except(:image))
    authorize author
    author.photo.attach(params[:photo]) if params[:photo]

    if author.save
      render json: {
               status: {
                 code: 201,
                 message: 'author_created_successfully',
               },
               data: AuthorSerializer.new(author).as_json,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'author_create_failed',
               },
               data: nil,
               errors: author.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @author
    @author.photo.attach(params[:photo]) if params[:photo]

    if @author.update(author_params)
      render json: {
               status: {
                 code: 200,
                 message: 'author_updated_successfully',
               },
               data: AuthorSerializer.new(@author).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'author_update_failed',
               },
               data: nil,
               errors: @author.errors.full_messages,
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
                 message: 'author_deleted_successfully',
               },
               data: AuthorSerializer.new(@author).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'author_delete_failed',
               },
               data: nil,
               errors: @author.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def restore
    author = Author.only_deleted.find(params[:id])
    authorize :author, :deleted?

    if author.restore(recursive: true)
      # đồng bộ lại Elasticsearch
      author.__elasticsearch__.index_document
      render json: {
               status: {
                 code: 200,
                 message: 'Author restored successfully',
               },
               data: AuthorSerializer.new(author).as_json,
             }
    else
      render json: {
               status: 'error',
               errors: [
                 { code: 'RESTORE_FAILED', detail: 'Could not restore author' },
               ],
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
