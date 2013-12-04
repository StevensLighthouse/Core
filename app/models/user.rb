class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation, :permission

  # associations
  has_one :creator, :class_name => 'User'
  has_one :editor, :class_name => 'User'

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
    if user && user.hashed_password == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    end
  end

  def is_site_admin?
    return true if self.permission == 4
    false
  end

  def is_group_admin?
    return true if self.permission >= 3
    false
  end

  def is_builder?
    return true if self.permission >= 2
    false
  end

  def is_editor?
    return true if self.permission >= 1
    false
  end

  def is_deactivated_account?
    return true if self.permission == 0
    false
  end

end
