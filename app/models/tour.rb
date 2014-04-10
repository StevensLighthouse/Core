class Tour < ActiveRecord::Base 

  # associations
  belongs_to :creator, :class_name => 'User' 
  has_one :editor, :class_name => 'User'
  #has_and_belongs_to_many :stops, -> { uniq } 
  has_many :stop_tours
  has_many :stops, :through => :stop_tours

  # validators
  validates :name, :presence => true
  validates :description, :presence => true
  validates :lat, :numericality => { :greater_than => -90.0, :less_than => 90.0 }
  validates :lon, :numericality => { :greater_than => -180.0, :less_than => 180.0 }


  default_scope where(:deleted => false)

  scope :public_within, -> (lat, lon, boundary) do
    boundary ||= 0.005
    where(:visibility => true,
          :deleted => false,
          :lat => (lat.to_f - boundary.to_f)..(lat.to_f + boundary.to_f),
          :lon => (lon.to_f - boundary.to_f)..(lon.to_f + boundary.to_f))
  end

  # override default to_json to include stops association with tour
  def as_json(options = {})
    hash = super(options)
    
    # merge in the stops in the proper order
    stops = self.stop_tours.order(:position).select{ |st| st.stop != nil }.map { |st| st.stop.attributes.merge(:position => st.position, :categories => st.stop.categories, :photos => st.stop.photos) }
    hash.merge!(:stops => stops)
  end

end
