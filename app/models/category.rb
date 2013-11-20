class Category < ActiveRecord::Base

  # associations
  has_and_belongs_to_many :tours
  has_and_belongs_to_many :stops


end
