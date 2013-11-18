class User < ActiveRecord::Base
  # associations
  has_one :creator, :class_name => 'User'
  has_one :editor, :class_name => 'User'
  belongs_to :permissions

  # validators
  validates :email, :presence => true
  # make sure email address is valid
  validates :hashed_password, :presence => true
  validates :password_salt, :presence => true

end
