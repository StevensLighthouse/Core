# GET /users/:user_id
# Get specific user
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


