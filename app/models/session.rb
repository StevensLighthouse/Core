class Session < ActiveRecord::Base
  belongs_to :user

  def is_expired?
    self.expiry_time < Time.now()
  end
end
