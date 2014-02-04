class StopTour < ActiveRecord::Base
  belongs_to :stop
  belongs_to :tour
end
