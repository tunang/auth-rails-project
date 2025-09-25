# app/controllers/stripe_webhooks_controller.rb
class Api::V1::StripeWebhooksController < ApplicationController
  # Stripe sends webhooks without cookies, so skip auth & CSRF
  # skip_before_action :verify_authenticity_token

  def receive
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET'] # from Stripe dashboard

    begin
      event =
        Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
    rescue JSON::ParserError => e
      render json: { error: 'Invalid payload' }, status: 400 and return
    rescue Stripe::SignatureVerificationError => e
      render json: { error: 'Signature verification failed' }, status: 400 and
        return
    end

    # Handle events you care about
    case event.type
    when 'checkout.session.completed'
      handle_checkout_completed(event.data.object)
    # when 'payment_intent.succeeded'
    #   handle_payment_succeeded(event.data.object)
    else
      Rails.logger.info "Unhandled event type: #{event.type}"
    end

    render json: { message: 'success' }
  end

  private

  def handle_checkout_completed(session)
    order = Order.find_by(stripe_session_id: session.id)
    return unless order

    order.update!(status: 1)
    ActionCable.server.broadcast("admin_orders", { type: "ORDER_UPDATED", payload: OrderSerializer.new(order).as_json })

  end

  def handle_payment_succeeded(payment_intent)
    # Example: log payment
    Payment.create!(
      stripe_payment_intent_id: payment_intent.id,
      amount: payment_intent.amount_received,
      currency: payment_intent.currency,
    )
  end
end
