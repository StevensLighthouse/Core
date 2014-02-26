# GET /stops
# Index of all global stops
get '/stops' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_editor?
    @stops = Stop.all

    respond_to do |format|
      format.json { { :stops => @stops }.to_json }
    end
  end
end

# POST /stops
# Create a new stop
post '/stops' do
  @stop = Stop.create(listing_params)

  # Attempt to save the newly created stop
  if @stop.save
    { :status => :created, :stop => @stop }.to_json
  # Stop was not saved, show an error
  else
    { :status => :unprocessable_entity, :errors => @stop.errors }.to_json
  end
end

# Get /stop/:id
# Show a stop and its information, chosen by ID
get '/stops/:id' do |id|
  @stop = Stop.find(id)

  { :stop => @stop }.to_json
end

# PUT /stops/:id
# Update a stop, specify it by the ID and list the params you are updating
put '/stops/:id' do |id|
  @stop = Stop.find(id)

  # Attempt to update the stop
  if @stop.update(listing_params)
    { :stop => @stop }.to_json
  # The stop was not correctly updated, show errors
  else
    { :errors => @stop.errors, :status => :unprocessable_entity }.to_json
  end
end

# POST /stops/global/:id
# Makes a stop into a global stop
post '/stops/global/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_editor?
    @stop = Stop.find(id)
  
    if @stop.update_column(:visibility, true)
      { :stop => @stop }.to_json
    else
      { :errors => @stop.errors, :status => :unprocessable_entity }.to_json
    end
  end
end

# POST /stops/clone/:id
# Clones the stop specified
post '/stops/clone/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_builder?
    @stop = Stop.find(id)

    @new_stop = Stop.new(:name => @stop.name, :description => @stop.description, :editor_id => @current_user.id, :creator_id => @stop.creator_id, :visibility => false, :lat => @stop.lat, :lon => @stop.lon, :parent_id => @stop.id)

    if @new_stop.save
      { :stop => @new_stop }.to_json
    else
      { :errors => @stop.errors, :status => :unprocessable_entity }.to_json
    end
  end
end
  
# DELETE /stops/:id
# Delete a specific stop by specifying an ID
delete '/stops/:id' do |id|
  @stop = Stop.find(id)

  # Update the column of the stop
  if @stop.update_column(:deleted, true)
    { :stop => @stop }.to_json
  # Stop was not correctly updated, show errors
  else
    { :errors => @stop.errors, :status => :unprocessable_entity }.to_json
  end
end

private
def listing_params
  params.allow(:name, :category, :description, :visibility, :lat, :lon, :parent_id)
end
