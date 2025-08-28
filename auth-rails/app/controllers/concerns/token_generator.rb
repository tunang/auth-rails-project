module TokenGenerator
  extend ActiveSupport::Concern
  def generate_token(user, app, scopes: '', expires_in: 2.hours)
    Doorkeeper::AccessToken.create!(
      resource_owner_id: user.id,
      application_id: app.id,
      expires_in: expires_in,
      scopes: scopes,
      use_refresh_token: true,
    )
  end
end
