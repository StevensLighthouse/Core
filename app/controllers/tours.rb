# GET /tours
# Index of all tours
# Soon to be deprecated - body will require a location
get '/tours' do
  @tours = Tour.all

  respond_to do |format|
    format.html { erb :'tours/index' }
    format.json { { :tours => @tours }.to_json }
  end
end

# POST /tours
# Create a new tour
post '/tours' do
  @tour = Tour.create(tour_params)

  if @tour.save
    { :status => :created, :tour => @tour }.to_json
  else
    { :status => :unprocessable_entity, :errors => @tour.errors }.to_json
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
# Should probably accept PATCH too
put '/tours/:id' do |id|
  @tour = Tour.find(id)

  if @tour.update(tour_params)
    { :tour => @tour }.to_json
  else
    { :errors => @tour.errors, :status => :unprocessable_entity }.to_json
  end
end

# DELETE /tours/:id
# How do we handle deletions?

private
def tour_params
  params.allow(:name, :description, :visibility, :lat, :lon)
end
