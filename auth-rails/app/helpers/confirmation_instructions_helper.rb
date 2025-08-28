module ConfirmationInstructionsHelper
  def confirmation_link(token)
    url = "#{ENV.fetch('FRONTEND_URL', 'https://localhost:5173')}/confirm?token=#{token}"

    # Return a styled HTML link
    view_context.link_to(
      "Confirm my account",
      url,
      style: "display:inline-block;
              background-color:#4CAF50;
              color:#fff;
              padding:10px 20px;
              text-decoration:none;
              border-radius:5px;"
    )
  end
end
