# GET /stops
# Index of all global stops
get '/stops' do
#how to get only public ones?
end

# POST /stops
# Create a new stop
post '/stops' do
  @stop = Stop.create(listing_params)

  if @stop.save
    { :status => :created, :stop => @stop }.to_json
  else
    { :status => :unprocessable_entity, :errors => @stop.errors }.to_json
  end
end

# Get /stop/:id
# Show a stop
get '/stops/:id' do |id|
	@stop = Stop.find(id)

	{ :stop => @stop }.to_json
end

# PUT /stops/:id
# Update a stop
# Should we include patch?
put '/stops/:id' do |id|
	@stop = Stop.find(id)

	if @stop.update(stop_params)
		{ :stop => @stop }.to_json
	else
		{ :errors => @stop.errors, :status => :unprocessable_entity }.to_json
	end
end

#Later on add delete

private
def listing_params
  params.allow(:name, :category, :description, :visibility, :lat, :lon, :parent_id)
end
