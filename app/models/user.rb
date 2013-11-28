class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation

  # associations
  has_one :creator, :class_name => 'User'
  has_one :editor, :class_name => 'User'
  belongs_to :permissions

  # validators

  #validates :hashed_password, :presence => true
  #validates :password_salt, :presence => true

  attr_accessor :password, :password_confirmation

  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :email
  validates_uniqueness_of :email

  validates_length_of :password, :minimum => 6

  validates :email, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create }

  before_save :encrypt

  def encrypt
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt()
      self.hashed_password = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  def self.authenticate(email, password)
    user = find_by_email(email)
    if user && user.hashed_password = BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    end
  end



end
