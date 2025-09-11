class Api::V1::AddressesController < ApplicationController
  before_action :doorkeeper_authorize!
  before_action :set_address, only: %i[show update destroy]

  def index
    @addresses = current_user.addresses
    authorize Address
    render json: {
             status: {
               code: 200,
               message: 'Fetched addresses successfully',
             },
             data: @addresses.map { |a| AddressSerializer.new(a).as_json },
           },
           status: :ok
  end

  def show
    authorize @address
    render json: {
             status: {
               code: 200,
               message: 'Fetched address successfully',
             },
             data: AddressSerializer.new(@address).as_json,
           },
           status: :ok
  end

  def create
    @address = current_user.addresses.build(address_params)
    authorize @address

    if @address.save
      render json: {
               status: {
                 code: 201,
                 message: 'Created address successfully',
               },
               data: AddressSerializer.new(@address).as_json,
             },
             status: :created
    else
      render_validation_errors(@address)
    end
  end

  def update
    authorize @address
    if @address.update(address_params)
      render json: {
               status: {
                 code: 200,
                 message: 'Updated address successfully',
               },
               data: AddressSerializer.new(@address).as_json,
             },
             status: :ok
    else
      render_validation_errors(@address)
    end
  end

  def destroy
    authorize @address
    if @address.destroy
      render json: {
               status: {
                 code: 200,
                 message: 'Deleted address successfully',
               },
               data: AddressSerializer.new(@address).as_json,
             },
             status: :ok
    else
      render_validation_errors(@address)
    end
  end

  private

  def set_address
    @address = Address.find(params[:id])
  end

  def address_params
    params.permit(
      :first_name,
      :last_name,
      :address_line_1,
      :address_line_2,
      :city,
      :state,
      :postal_code,
      :country,
      :phone,
      :is_default,
    )
  end

  def render_validation_errors(record)
    render json: {
             status: {
               code: 422,
               message: 'validation_failed',
             },
             data: nil,
             errors: record.errors.full_messages,
           },
           status: :unprocessable_entity
  end
end
