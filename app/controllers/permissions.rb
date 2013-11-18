# GET /permissions
# Index of all permissions
get '/permissions' do
  @permissions = Permission.all

  { :permissions => @permissions }.to_json
end

# Add permission to a user
# POST 
post '/user/:user_id/permissions/:permission_id' do
  user = User.find(params[:user_id])
  #new_permission = Permission.find(params[:permission_id])

  if Permission.find(params[:permission_id])
    if user.update_column(:permission, params[:permission_id])
      { :user => user }.to_json
    else
      { :errors => permission.errors, :status => :unprocessable_entity }.to_json
    end
  else
    { :errors => permission.errors, :status => :unprocessable_entity }.to_json
  end
end

