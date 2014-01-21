# GET /users/:user_id
# Get specific user by specifying ID
get '/users/:id' do |id|
  @user = User.find(id)
  
  { :user => @user }.to_json
end

# PUT /users/:id
# Update a user
put '/users/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()

  # If the user is a site admin, no additional checks are needed
  if @current_user.is_site_admin?
    @user = User.find(id)
    if @user.update(user_params)
      { :user => @user }.to_json
    else
      { :errors => @user.errors, :status => :unprocessable_entity }.to_json
    end

  # Else if the user is a group admin, still need to check that the groups match
  elsif @current_user.is_group_admin?
    @user = User.find(id)

    # Need to check that the user is in your current group
    if @current_user.group_id == @user.group_id
      if @user.update(user_params)
        { :user => @user }.to_json
      else
        { :errors => @user.errors, :status => :unprocessable_entity }.to_json
      end
    end
  end
end
