# GET /users/:user_id
# Get specific user
get '/users/:id' do |id|
  @user = User.find(id)
  
  { :user => @user }.to_json
end
