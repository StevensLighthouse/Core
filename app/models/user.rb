class User < ActiveRecord::Base
  # associations
  has_one :creator, :class_name => 'User'
  has_one :editor, :class_name => 'User'

  # validators

end
