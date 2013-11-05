class Stop < ActiveRecord::Base

  # associations
  belongs_to :creator, :classname => 'User'
  has_one :editor, :classname => 'User'

  # validators
  validates :name, :presence => true
  validates :category, :presence => true
  validates :description, :presence =>true
  validates :lat, :numericality => { :greater_than => -90.0, :less_than => 90.0 }
  validates :lon, :numericality => { :greater_than => -180.0, :less_than => 180.0 }

end
