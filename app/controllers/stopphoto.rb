# GET: Upload photo form
#   This is purely used for testing
get '/photos/upload' do

  @stop_photo = StopPhoto.new

  erb :'/photos/upload', :layout => false
end

# POST: Upload a new photo
post '/photos/upload' do
  @sp = StopPhoto.create(photo_params)

  if @sp
    # success
    "Success"
  else
    # failed to create photo
    "Failure"
  end
end

# PUT: Update data for a photo
put '/photos/:id' do

end

# DELETE: Destroy this photo, delete
# associated data
delete '/photos/:id' do

end

private
def photo_params
  params.allow(:description, :photo)
end
