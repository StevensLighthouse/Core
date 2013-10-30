class Tour < ActiveRecord::Base 
  
  # associations
  has_one :creator, :class_name => 'User' 
  has_one :editor, :class_name => 'User'


  
  # validators
  validates :name, :presence => true
  validates :description, :presence => true

  validates :lat, :format => { :with => /\A\d{3}\.\d{6}\z/ },
                  :numericality => { :greater_than => -90.0, :less_than => 90.0 }

  validates :lon, :format => { :with => /\A\d{3}\.\d{6}\z/ },
                  :numericality => { :greater_than => -180.0, :less_than => 180.0 }

  
end
