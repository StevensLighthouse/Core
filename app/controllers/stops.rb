# GET /stops
# Index of all global stops
get '/stops' do

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
