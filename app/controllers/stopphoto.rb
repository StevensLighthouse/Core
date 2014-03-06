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
     { :status => :success, :image => @sp }.to_json 
  else
    # failed to create photo
      { :status => :unprocessable_entity, :errors => @sp.errors }.to_json
  end
end

# PUT: Update data for a photo
put '/photos/:id' do
  @sp = StopPhoto.find(params[:id])

  if @sp.update_attributes(:description => params[:description])
    { :status => :updated, :image => @sp }.to_json
  else
    { :status => :unprocessable_entity }.to_json
  end

end

# DELETE: Destroy this photo, delete
# associated data
delete '/photos/:id' do
  @sp = StopPhoto.find(params[:id])

  if @sp.destroy
    { :status => :deleted }.to_json
  else
    { :status => :unprocessable_entity }.to_json
  end
end

private
def photo_params
  params.allow(:description, :photo, :stop_id)
end
