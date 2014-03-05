class Stop < ActiveRecord::Base

  # associations
  belongs_to :creator, :class_name => 'User'
  has_one :editor, :class_name => 'User'
  #has_and_belongs_to_many :tours, -> { uniq } 
  has_many :tours, :through => :stop_tours
  has_many :stop_tours
  has_and_belongs_to_many :categories

  has_many :photos, :class_name => 'StopPhoto'

  # validators
  validates :name, :presence => true
  validates :description, :presence => true
  validates :lat, :numericality => { :greater_than => -90.0, :less_than => 90.0 }
  validates :lon, :numericality => { :greater_than => -180.0, :less_than => 180.0 }


  scope :public_within, -> (lat, lon, boundary) do
    boundary ||= 0.005
    where(:visibility => true,
          :deleted =>false,
          :lat => (lat.to_f - boundary.to_f)..(lat.to_f + boundary.to_f),
          :lon => (lon.to_f - boundary.to_f)..(lon.to_f + boundary.to_f))
  end

  default_scope { where :deleted => false }

  def as_json(options = {})
    hash = super(options)

    # merge in the categories 
    categories = self.categories
    stopohotos = self.photos

    hash.merge!(:categories => categories, :photos => stopohotos)
    end

end
