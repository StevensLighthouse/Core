# GET /users/:user_id
# Get specific user by specifying ID
get '/users/:id' do |id|
  @user = User.find(id)
  
  { :user => @user }.to_json
end

# GET /users
# Get all users that the requester has permission to access
get '/users' do 
  @users = User.all
  { :users => @users }.to_json
end

# POST /users
# Create a new user, if the requester has permission to do so
post '/users' do
  redirect to('/login') unless current_user()
  @current_user = current_user()

  if @current_user.is_group_admin?
    @user = User.create(user_params)
    @user.creator_id = @current_user.id
      
    if @user.permission > @current_user.permission
      @user.permission = @current_user.permission;
    end
      
    if @user.save
      { :status => :created, :user => @user }.to_json
    else
      { :status => :unprocessable_entity, :errors => @user.errors }.to_json
    end
  end
end

# PUT /users/:id
# Update a user, specify it by the ID and list the params you are updating
put '/users/:id' do |id|
  @user = User.find(id)

  # Attempt to update the user
  if @user.update(user_params)
    { :status => :updated, :user => @user}.to_json
  # The stop was not correctly updated, show errors
  else
    { :errors => @user.errors, :status => :unprocessable_entity }.to_json
  end
end

private
def user_params
  params.allow(:email, :permission, :password, :group_id)
end
