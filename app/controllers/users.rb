# GET /users/:user_id
# Get specific user by specifying ID
get '/users/:id' do |id|
  @user = User.find(id)
  
  { :user => @user }.to_json
end
