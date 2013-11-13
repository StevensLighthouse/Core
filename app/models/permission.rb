class Permission < ActiveRecord::Base

  # associations
  has_many :users

  # validators
  validates :name, :presence => true
  validates :description, :presence => true
  validates :level, :presence => true

end
