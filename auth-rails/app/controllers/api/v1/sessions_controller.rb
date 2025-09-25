class Api::V1::SessionsController < ApplicationController
  include TokenGenerator
  respond_to :json

  # POST api/v1/login
  def create
    user = User.find_for_database_authentication(email: params[:email])

    if user&.valid_password?(params[:password])
      app = Doorkeeper::Application.find_by(name: 'WebApp')

      access_token = generate_token(user, app) # Default expire 2 hours for access token, no scope, check TokenGenerator for details

      render json: {
               status: {
                 code: 200,
                 message: 'login_success',
               },
               data: UserSerializer.new(user).as_json,
               access_token: access_token.token,
               refresh_token: access_token.refresh_token,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 401,
                 message: 'invalid_credentials',
               },
               data: nil,
               errors: ['Invalid email or password'],
             },
             status: :unauthorized
    end
  end

  # POST /api/v1/refresh
  def refresh
    app = Doorkeeper::Application.find_by(name: 'WebApp')
    token = Doorkeeper::AccessToken.by_refresh_token(params[:refresh_token])

    if token && !token.revoked? && !token.refresh_token.nil?
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
               refresh_token: new_token.refresh_token, # optional, if you want rolling refresh tokens
             }
    else
      render json: { error: 'Invalid refresh token' }, status: :unauthorized
    end
  end
  # DELETE /api/v1/logout
  def destroy
    current_token = doorkeeper_token

    if current_token
      user = current_user
      current_token.revoke
      render json: {
               status: {
                 code: 200,
                 message: 'logout_success',
               },
               data: UserSerializer.new(user).as_json,
               access_token: nil,
               refresh_token: nil,
             },
             status: :ok
    else
      render json: {
               status: {
                 code: 401,
                 message: 'logout_failed',
               },
               data: nil,
               errors: ['No active session found'],
             },
             status: :unauthorized
    end
  rescue => e
    render json: {
             status: {
               code: 500,
               message: 'logout_failed',
             },
             data: nil,
             errors: [e.message],
           },
           status: :internal_server_error
  end

  # Option 2: Revoke all tokens for this user (more secure for logout)
  # This will log the user out from all devices/sessions
  # user_tokens = Doorkeeper::AccessToken.where(
  #   resource_owner_id: current_token&.resource_owner_id,
  #   revoked_at: nil
  # )
  # user_tokens.update_all(revoked_at: Time.current)

  # render json: {
  #   status: {
  #     code: 200,
  #     message: 'logout_success'
  #   }
  # }, status: :ok
end
