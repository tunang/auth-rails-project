class Api::V1::SessionsController < ApplicationController
  include TokenGenerator
  respond_to :json

  # POST api/v1/login
  def create
    user = User.find_for_database_authentication(email: params[:email])

    # First, check if the user exists and the password is valid.
    # We do this first as a security measure to not reveal if an account is unconfirmed or valid.
    unless user&.valid_password?(params[:password])
      return(
        render json: {
                 status: {
                   code: 401,
                   message: 'invalid_credentials',
                 },
                 data: nil,
                 errors: ['Invalid email or password'],
               },
               status: :unauthorized
      )
    end

    # `active_for_authentication?` checks if the user is confirmed.
    unless user.active_for_authentication?
      # `inactive_message` will return :unconfirmed in this case.
      return(
        render json: {
                 status: {
                   code: 401,
                   message: 'account_not_activated',
                 },
                 data: nil,
                 errors: [
                   'Your account has not been activated. Please check your email for the confirmation link.',
                 ],
               },
               status: :unauthorized
      )
    end

    # If both password is valid AND the account is active, proceed to generate the token.
    app = Doorkeeper::Application.find_by(name: 'WebApp')
    access_token = generate_token(user, app)

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
  end


  # POST api/v1/login

  def google
    validator = GoogleIDToken::Validator.new
    client_id = ENV['GOOGLE_CLIENT_ID']

    payload = validator.check(params[:token], client_id)
    email = payload['email']

    user = User.find_or_initialize_by(email:)
    user.update!(
      name: payload['name'],
      provider: 'google',
      google_uid: payload['sub']
    )

    # 🔥 Issue Doorkeeper access token
    app = Doorkeeper::Application.find_by(name: 'WebApp') ||
          Doorkeeper::Application.create!(name: 'WebApp', redirect_uri: '', confidential: false)

    access_token = Doorkeeper::AccessToken.find_or_create_for(
      application: app,
      resource_owner: user,
      scopes: '',
      expires_in: Doorkeeper.configuration.access_token_expires_in,
      use_refresh_token: Doorkeeper.configuration.refresh_token_enabled?
    )

    render json: {
      access_token: access_token.token,
      token_type: 'Bearer',
      expires_in: access_token.expires_in,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }
  rescue GoogleIDToken::ValidationError => e
    render json: { error: 'Invalid Google token' }, status: :unauthorized
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
          expires_in: 24.hours,
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
