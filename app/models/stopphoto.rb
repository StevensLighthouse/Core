class StopPhoto < ActiveRecord::Base
  mount_uploader :photo, PhotoUploader

  belongs_to :stop

end
