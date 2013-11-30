class Tour < ActiveRecord::Base 

  # associations
  belongs_to :creator, :class_name => 'User' 
  has_one :editor, :class_name => 'User'
  has_and_belongs_to_many :stops, -> { uniq } 

  # validators
  validates :name, :presence => true
  validates :description, :presence => true
  validates :lat, :numericality => { :greater_than => -90.0, :less_than => 90.0 }
  validates :lon, :numericality => { :greater_than => -180.0, :less_than => 180.0 }

  scope :public_within, -> (lat, lon, boundary) do
    boundary ||= 0.005
    where(:visibility => true,
          :deleted => false,
          :lat => (lat.to_f - boundary.to_f)..(lat.to_f + boundary.to_f),
          :lon => (lon.to_f - boundary.to_f)..(lon.to_f + boundary.to_f))
  end

  # override default to_json to include stops association with tour
  def as_json(options = {})
    options[:include] ||= []
    options[:include] << :stops
    super(options)
  end

end
