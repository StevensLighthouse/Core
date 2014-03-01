# GET /stops
# Index of all stops the user owns
get '/stops' do
  redirect to('/login') unless current_user
  @current_user = current_user

  if @current_user.is_site_admin? 
    @stops = Stop.all

    respond_to do |format|
      format.json { { :stops => @stops }.to_json }
    end
  elsif @current_user.is_editor?
      @stops = Stop.where "editor_id = :id or creator_id = :id", { :id => @current_user.id } 

    respond_to do |format|
      format.json { { :stops => @stops }.to_json }
    end
  end
end

# GET /stops/global
# Index of all global stops
get '/stops/global' do
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_editor?
    @stops = Stop.where(:visibility => true)

    respond_to do |format|
      format.json { { :stops => @stops }.to_json }
    end
  end
end

# POST /stops
# Create a new stop
post '/stops' do
  redirect to('/login') unless current_user
  @current_user = current_user
  
  if @current_user.is_builder?
    @stop = Stop.create(stop_params)
    @stop.creator_id = @current_user.id
    
    if params[:categories]
      categories = params[:categories].map { |cid| Category.find(cid) }
      @stop.categories = categories
    end

    # Attempt to save the newly created stop
    if @stop.save
      { :status => :created, :stop => @stop }.to_json
    # Stop was not saved, show an error
    else
      { :status => :unprocessable_entity, :errors => @stop.errors }.to_json
    end
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

  if params[:categories]
      categories = params[:categories].map { |cid| Category.find(cid) }
      @stop.categories = categories
  end
    # Attempt to update the stop
  if @stop.update(stop_params)
    { :status => :updated, :stop => @stop }.to_json
  # The stop was not correctly updated, show errors
  else
    { :errors => @stop.errors, :status => :unprocessable_entity }.to_json
  end
end

# POST /stops/global/:id
# Makes a stop into a global stop
post '/stops/global/:id' do |id|
  redirect to('/login') unless current_user
  @current_user = current_user
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
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_builder?
    @stop = Stop.find(id)

    @new_stop = Stop.new(:name => @stop.name, :description => @stop.description, :editor_id => @current_user.id, :creator_id => @stop.creator_id, :visibility => false, :lat => @stop.lat, :lon => @stop.lon, :parent_id => @stop.id)

    if @new_stop.save
      { :status => :created, :stop => @new_stop }.to_json
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

# POST '/stop/:stop_id/category/:category_id
# Add a category to a stop
post '/stop/:stop_id/category/:category_id' do
  redirect to('/login') unless current_user
  stop = Stop.find(params[:stop_id])
  category = Category.find(params[:category_id])

  # Add the category to the stop
  stop.categories << category unless stop.categories.include? category

  # Save the updated stop
  if stop.save
    { :stop => stop }.to_json
    # Stop was not sucessfully saved, show errors
  else
    { :errors => stop.errors, :status => :unprocessable_entity }.to_json
  end
end


private
def stop_params
  params.allow(:name, :description, :visibility, :lat, :lon, :parent_id)
end
