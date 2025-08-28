# app/serializers/address_serializer.rb
class AddressSerializer
  def initialize(address)
    @address = address
  end

  def as_json(*)
    {
      id: address.id,
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country
    }
  end

  private

  attr_reader :address
end
  