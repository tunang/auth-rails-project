class Api::V1::BooksController < ApplicationController
  before_action :doorkeeper_authorize!, except: %i[index show]
  before_action :book_job, only: %i[show update destroy]

  def index
    authorize Book, :index?

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    if filter_params.except(:page, :per_page).present?
      # 🔎 Use Elasticsearch for search + filter + sort
      search_results =
        Book
          .search_books(
            query: params[:query] || params[:search],
            category: params[:category],
            author: params[:author],
            min_price: params[:min_price],
            max_price: params[:max_price],
            in_stock: params[:in_stock],
            sort_by: params[:sort_by],
          )
          .page(page)
          .per(per_page)
      binding.pry
      books = search_results.records.includes(:authors, :categories)
    else
      # 📚 Fall back to DB if no filters/search applied
      search_results =
        Book
          .includes(
            :authors,
            :categories,
            cover_image_attachment: :blob,
            sample_pages_attachments: :blob,
          )
          .page(page)
          .per(per_page)

      books = search_results
    end

    render json: {
             status: {
               code: 200,
               message: 'Fetched books successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             pagination: {
               current_page: search_results.current_page,
               next_page: search_results.next_page,
               prev_page: search_results.prev_page,
               total_pages: search_results.total_pages,
               total_count: search_results.total_count,
             },
           },
           status: :ok
  end

  def category
    category = Category.find(params[:category_id] || params[:id])
    books =
      category
        .books
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
               message: 'Fetched books successfully',
             },
             data: books.map { |book| BookSerializer.new(book).as_json },
             pagination: {
               current_page: books.current_page,
               next_page: books.next_page,
               prev_page: books.prev_page,
               total_pages: books.total_pages,
               total_count: books.total_count,
             },
           },
           status: :ok
  end

  def deleted
    authorize Book, :deleted?
    deleted_books =
      Book.only_deleted.page(params[:page]).per(params[:per_page] || 10)

    render json: {
             status: {
               code: 200,
               message: 'Fetched deleted books successfully',
             },
             data:
               deleted_books.map { |book| BookSerializer.new(book).as_json },
             pagination: {
               current_page: deleted_books.current_page,
               next_page: deleted_books.next_page,
               prev_page: deleted_books.prev_page,
               total_pages: deleted_books.total_pages,
               total_count: deleted_books.total_count,
             },
           },
           status: :ok
  end

  def show
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
                 message: 'book_created_successfully',
               },
               data: BookSerializer.new(@book).as_json,
             },
             status: :created
    else
      render json: {
               status: {
                 code: 422,
                 message: 'book_create_failed',
               },
               data: nil,
               errors:
                 @book
                   .errors
                   .full_messages
                   .map do |msg|
                     {
                       code: 'VALIDATION_ERROR',
                       title: 'Unprocessable Entity',
                       detail: msg,
                     }
                   end,
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
                 code: 200,
                 message: 'book_updated_successfully',
               },
               data: BookSerializer.new(@book).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'book_update_failed',
               },
               data: nil,
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
                 message: 'book_deleted_successfully',
               },
               data: BookSerializer.new(@book).as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'book_delete_failed',
               },
               data: nil,
               errors: @book.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def restore
    book = Book.only_deleted.find(params[:id])
    authorize :book, :restore?

    if book.restore(recursive: true)
      book.__elasticsearch__.index_document # reindex ES
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
    @book = Book.friendly.find(params[:id])
  end

  # ✅ Strong params for create/update
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

  # ✅ Strong params for search/filter/sort
  def filter_params
    params.permit(
      :query,
      :search,
      :category,
      :author,
      :min_price,
      :max_price,
      :in_stock,
      :sort_by,
      :page,
      :per_page,
    )
  end
end
