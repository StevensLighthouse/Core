# GET /categories
# Get a list of all the categories
get '/categories' do
  @categories = Category.all
  { :categories => @categories }.to_json
end


# POST /categories
# Create a new category
post '/categories' do
  redirect to('/login') unless current_user
  @current_user = current_user
  
  if @current_user.is_site_admin?
    @category = Category.create(category_params)

    # Attempt to save the newly created category
    if @category.save
      { :status => :created, :category => @category }.to_json
    # Category was not saved, show an error
    else
      { :status => :unprocessable_entity, :errors => @category.errors }.to_json
    end
  end
end


# PUT /categories/:id
# Update a category
put '/categories/:id' do |id|
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_site_admin?
    @category = Category.find(id)

    if @category.save and @category.update(category_params)
      { :status => :updated, :category => @category }.to_json
    else
      { :errors => @category.errors, :status => :unprocessable_entity }.to_json
    end
  end
end

# DELETE /categories/:id
# Delete a specific category by specifying an ID
delete '/categories/:id' do |id|
  redirect to('/login') unless current_user
  @current_user = current_user

  if @current_user.is_site_admin?
    @category = Category.find(id)

    # Attempt to delete the user
    if @category.destroy
      { :status => :deleted }.to_json
    # The user was not deleted updated, show errors
    else
      { :status => :unprocessable_entity }.to_json
    end
  end
end

# Set the allowed parameters, for security
private
def category_params
  params.allow(:name, :description, :icon_base64)
end
