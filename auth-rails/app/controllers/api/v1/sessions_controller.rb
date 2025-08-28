class Api::V1::SessionsController < ApplicationController
  include TokenGenerator
  respond_to :json

  #POST api/v1/login
  def create
    user = User.find_for_database_authentication(email: params[:email])

    if user&.valid_password?(params[:password])
      app = Doorkeeper::Application.find_by(name: 'WebApp')

      access_token = generate_token(user, app) #Default expire 2 hours for access token, no scope, check TokenGenerator for details
      render json: {
               status: {
                 code: 200,
                 message: 'Log in successfully.',
               },
               data: UserSerializer.new(user).as_json,
               access_token: access_token.token,
               refresh_token: access_token.refresh_token,
             },
             status: :ok
    else
      render json: {
               status: 'error',
               data: nil,
               errors: [
                 {
                   code: 'INVALID_CREDENTIALS',
                   title: 'Unauthorized',
                   detail: 'Invalid email or password',
                 },
               ],
             },
             status: :unauthorized
    end
  end

  # POST /api/v1/refresh
  def refresh
    app = Doorkeeper::Application.find_by(name: 'WebApp')
    token = Doorkeeper::AccessToken.by_refresh_token(params[:refresh_token])
    if token&.accessible?
      new_token =
        Doorkeeper::AccessToken.create!(
          resource_owner_id: token.resource_owner_id,
          application_id: app.id,
          expires_in: 2.hours,
          scopes: token.scopes,
        )

      render json: {
               access_token: new_token.token,
               token_type: 'Bearer',
               expires_in: new_token.expires_in,
             }
    else
      render json: { error: 'Invalid refresh token' }, status: :unauthorized
    end
  end
end
