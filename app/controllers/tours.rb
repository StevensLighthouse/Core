# GET /tours
# Index of all tours
# Params: [lat, lon, distance]
get '/tours' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_editor?
    @tours = Tour.all

    respond_to do |format|
      format.html { erb :'tours/index' }
      format.json { { :tours => @tours }.to_json }
    end
  end
end

# POST /tours
# Create a new tour
post '/tours' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_builder?
    @tour = Tour.create(tour_params)
    @tour.stops = Stop.find_all_by_id(params[:stops])
    if @tour.save
      { :status => :created, :tour => @tour }.to_json
    else
      { :status => :unprocessable_entity, :errors => @tour.errors }.to_json
    end
  end
end

# GET /tours/:id
# Show a tour
get '/tours/:id' do |id|
  @tour = Tour.find(id)

  # Maybe just @tour.to_json
  # Your choice
  { :tour => @tour }.to_json
end

# PUT /tours/:id
# Update a tour
put '/tours/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_editor?
    @tour = Tour.find(id)
    @tour.stops = Stop.find_all_by_id(params[:stops])
    if @tour.update(tour_params)
      { :tour => @tour }.to_json
    else
      { :errors => @tour.errors, :status => :unprocessable_entity }.to_json
    end
  end
end

# DELETE  /tours/:id
delete '/tours/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_builder?
    @tour = Tour.find(id)

    # Update the deleted column of the tour so it is "deleted" to the user
    if @tour.update_column(:deleted, true)
      { :tour => @tour }.to_json
      #  Tour was not sucessfully "deleted", show errors
    else
      { :errors => @tour.errors, :status => :unprocessable_entity }.to_json
    end
  end
end

# Add a stop to a tour
# Params := [position]
post '/tour/:tour_id/stop/:stop_id' do 
  redirect to('/login') unless current_user()
  tour = Tour.find(params[:tour_id]) 
  stop = Stop.find(params[:stop_id])

  # Add the stop to the tour
  tour.stops << stop unless tour.stops.include? stop

  # Save the updated tour
  if tour.save 
    { :tour => tour }.to_json
    # Tour was not sucessfully saved, show errors
  else
    { :errors => tour.errors, :status => :unprocessable_entity }.to_json
  end

end

# Disassociate a stop from a tour
delete '/tour/:tour_id/stop/:stop_id' do
  redirect to('/login') unless current_user()
  tour = Tour.find(params[:tour_id])
  stop = Stop.find(params[:stop_id])
  # Delete the stop from the tour
  if tour.stops.delete(stop)
    { :tour => tour }.to_json
    # Stop was not successfully deleted from the tour, show errors
  else
    # stop was not successfully deleted, show errors
    { :error => tour.errors, :status => :unprocessable_entity }.to_json
  end

end

# Set the allowed parameters, for security
private
def tour_params
  params.allow(:name, :description, :visibility, :lat, :lon)
end
