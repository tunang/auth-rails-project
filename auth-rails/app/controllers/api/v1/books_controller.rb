class Api::V1::BooksController < ApplicationController
  # before_action :doorkeeper_authorize!, except: %i[index show]
  before_action :doorkeeper_authorize!
  before_action :book_job, only: %i[show update destroy]

  def index
    authorize Book
    books =
      Book
        .includes(
          :authors,
          :categories,
          cover_image_attachment: :blob,
          sample_pages_attachments: :blob,
        )
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    render json: {
             status: {
               code: 200,
               message: 'Books loaded successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             meta: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end


  def featured
  
  end

  def search
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    # search_result = Book.search(params[:q], page: page, per_page: per_page)
    search_result = Book.search(params[:search])

    books =
      search_result
        .records
        .includes(
          :authors,
          :categories,
          cover_image_attachment: :blob,
          sample_pages_attachments: :blob,
        )
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    render json: {
             status: {
               code: 200,
               message: 'Books search successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             meta: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @book
    render json: {
             status: {
               code: 200,
               message: 'Fetched book successfully',
             },
             data: BookSerializer.new(@book).as_json,
           },
           status: :ok
  end

  def create
    authorize Book
    @book = Book.new(book_params)
    if @book.save
      CreateStripeProductJob.perform_later(@book.id)
      render json: {
               status: {
                 code: 201,
                 message: 'Book created, syncing with stripe',
               },
               data: @book,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Book creation failed',
               },
               errors: @book.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @book
    if @book.update(book_params)
      UpdateStripeProductJob.perform_later(@book.id)
      render json: {
               status: {
                 code: 201,
                 message: 'Book updated, syncing with stripe',
               },
               data: @book,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'Book creation failed',
               },
               errors: @book.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @book
    if @book.destroy
      render json: {
               status: {
                 code: 200,
                 message: "Book '#{@book.title}' has been deleted.",
               },
               data: BookSerializer.new(@book).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: "Failed to delete Book '#{@book.title}'.",
                 errors: @book.errors.full_messages,
               },
             },
             status: :unprocessable_entity
    end
  end

  def restore
    book = Book.only_deleted.find(params[:id])
    if book.restore(recursive: true)
      # đồng bộ lại Elasticsearch
      book.__elasticsearch__.index_document
      render json: {
               status: {
                 code: 200,
                 message: 'Book restored successfully',
               },
               data: BookSerializer.new(book).as_json,
             }
    else
      render json: {
               status: 'error',
               errors: [
                 { code: 'RESTORE_FAILED', detail: 'Could not restore book' },
               ],
             },
             status: :unprocessable_entity
    end
  end

  private

  def book_job
    @book = Book.find(params[:id])
  end

  def book_params
    params.permit(
      :title,
      :description,
      :price,
      :stock_quantity,
      :featured,
      :sold_count,
      :cost_price,
      :discount_percentage,
      :cover_image,
      sample_pages: [],
      author_ids: [],
      category_ids: [],
    )
  end
end
