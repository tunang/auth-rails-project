class Api::V1::SettingsController < ApplicationController
  before_action :doorkeeper_authorize!, except: %i[show]
  before_action :set_settings
  def show
    render json: {
             status: {
               code: 200,
               message: 'settings_fetched_successfully',
             },
             data: @settings,
           },
           status: :ok
  end

  def update
    # Giả sử bạn dùng Pundit để phân quyền, tương tự như `authorize @book`
    authorize @settings, :update?

    if @settings.update(settings_params)
      render json: {
               status: {
                 code: 200,
                 message: 'settings_updated_successfully',
               },
               # Bạn có thể tạo SettingSerializer để định dạng dữ liệu trả về một cách nhất quán
               data: @settings.as_json,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 422,
                 message: 'settings_update_failed',
               },
               data: nil,
               errors: @settings.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  private

  def set_settings
    @settings = Setting.current
  end

  def settings_params
    params.permit(:tax_rate, :shipping_cost)
  end
end
