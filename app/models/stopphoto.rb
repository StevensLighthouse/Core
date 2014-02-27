class StopPhoto < ActiveRecord::Base
  mount_uploader :photo, PhotoUploader

end
